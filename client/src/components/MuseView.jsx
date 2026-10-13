import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { sendAiChat, TOOL_SKILLS } from '../sarvam';
import { applyAgentUpdate } from '../api';
import MarkdownContent from './MarkdownContent';

// Robust schedule parser that extracts Day 1...Day 7 drops from text
function parseScheduleFromContent(text, fallbackPlatform = 'LinkedIn') {
  if (!text) return [];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayPattern = /(?:^|\n)[*\s#-]*\*{0,2}Day\s*(\d+)[:\s–—-]+([^\n*]+)\*{0,2}/gi;
  const matches = [];
  let m;
  while ((m = dayPattern.exec(text)) !== null) {
    matches.push({
      dayNum: parseInt(m[1], 10),
      title: m[2].replace(/\*\*/g, '').trim(),
      start: m.index + m[0].length
    });
  }
  if (matches.length === 0) return [];

  const lower = text.toLowerCase();
  let plat = fallbackPlatform;
  if (lower.includes('instagram') || lower.includes('insta')) plat = 'Instagram';
  else if (lower.includes('linkedin')) plat = 'LinkedIn';
  else if (lower.includes('twitter') || lower.includes(' x ') || lower.includes(' x/')) plat = 'X';
  else if (lower.includes('youtube')) plat = 'YouTube';
  else if (lower.includes('substack')) plat = 'Substack';

  const items = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = matches[i + 1] ? matches[i + 1].start : text.length;
    const body = text.slice(cur.start, nextStart).trim();

    // Hook / focus extraction
    const focusMatch = /(?:Focus|Hook|Angle)[:\s*]+([^\n]+)/i.exec(body);
    let hook = focusMatch ? focusMatch[1].replace(/[*_"]/g, '').trim() : '';
    if (!hook) {
      const firstLine = body.split('\n')[0] || '';
      hook = firstLine.replace(/^[*\s#-]+/, '').replace(/[*_"]/g, '').trim();
    }
    if (!hook) hook = cur.title;

    const dayName = daysOfWeek[(cur.dayNum - 1) % daysOfWeek.length] || 'Monday';

    items.push({
      id: `muse-drop-${Date.now()}-${cur.dayNum}-${Math.random().toString(36).slice(2, 6)}`,
      title: cur.title,
      platform: plat,
      format: plat === 'Instagram' ? 'Instagram Reel & Carousel' : 'Founder Story & Insight',
      theme: 'Building in Public',
      stage: 'draft',
      day: dayName,
      hook,
      script: body || cur.title,
      visualDirection: plat === 'Instagram' ? 'High-contrast 4-slide carousel breakdown or terminal screenshot.' : 'Unfiltered production metric chart or terminal logs.',
      sourceMaterial: `Muse AI Sprint · ${plat}`
    });
  }
  return items;
}

/**
 * MuseView - Founder Brand Strategist AI Chat
 * Clean, Apple-minimal, distraction-free:
 * - Model switcher on top left: Gemini 3.5 Flash Lite <-> Sarvam 105B
 * - Pinned board note context: Muse knows which note is being edited, updates it on the board, and can transfer it to the calendar
 * - Empty state: type box squarely in the center with "What are we building today?"
 * - Top header right: clean, undistorted "New chat" button
 * - '+' button on type box with 'Add files' and 'Tools' that opens UPWARDS
 * - Zero inner border/box inside textarea
 * - Responses rendered directly on canvas without card boxes
 * - Spinning star SVG during thinking/streaming, hidden once generated
 */
export default function MuseView({ 
  profile, 
  contentItems = [],
  onClearAllContentItems,
  _onBatchDeleteContentItems,
  initialPrompt, 
  activeNote,
  onClearActiveNote,
  onUpdateContentItem,
  onDeleteContentItem,
  onTransferToCalendar,
  onAddContentToStudio, 
  onNavigateToStudio,
  showToast 
}) {
  const isMaya = profile?.founder_id === 'maya_lin';
  const founderId = profile?.founder_id || (isMaya ? 'maya_lin' : 'arjun_vance');
  const companyName = profile?.identity?.company_name || (isMaya ? 'Solace Botanicals' : 'AgentScale');

  // Multi-Model Switcher: 'gemini-flash' | 'sarvam-105b'
  const [activeModel, setActiveModel] = useState('gemini-flash');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const modelMenuRef = useRef(null);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingMeta, setStreamingMeta] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [scheduledMessageIds, setScheduledMessageIds] = useState(new Set());

  const handleScheduleAllToCalendar = (scheduleItems, msgId) => {
    if (!scheduleItems || scheduleItems.length === 0) return;
    if (onAddContentToStudio) {
      onAddContentToStudio(scheduleItems);
    }
    applyAgentUpdate(founderId, `Schedule ${scheduleItems.length} drops to weekly calendar`, {
      new_items: scheduleItems
    }).catch(console.warn);
    if (showToast) {
      showToast(`✓ Added ${scheduleItems.length} drops to Calendar (${scheduleItems[0].day} – ${scheduleItems[scheduleItems.length - 1].day})`);
    }
    setScheduledMessageIds(prev => new Set([...prev, msgId]));
  };
  
  // Tool icon mapper helper
  const getToolIcon = (toolKey) => {
    switch (toolKey) {
      case 'update': return 'refresh';
      case 'brainstorm': return 'auto_awesome';
      case 'research': return 'explore';
      case 'plan': return 'calendar_today';
      default: return 'tune';
    }
  };
  
  // Menu states for '+' button
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isToolsSubmenuOpen, setIsToolsSubmenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const plusMenuRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setIsPlusMenuOpen(false);
        setIsToolsSubmenuOpen(false);
      }
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input text if initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.max(90, Math.min(textareaRef.current.scrollHeight, 260))}px`;
        }
      }, 50);
    }
  }, [initialPrompt]);

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  // Scroll to bottom on new messages or streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingText]);

  // Auto-resize textarea dynamically and synchronously without layout jitter
  const adjustTextareaHeight = (el) => {
    const target = el || textareaRef.current;
    if (target) {
      target.style.height = 'auto';
      const scrollH = target.scrollHeight;
      const targetH = Math.min(Math.max(scrollH, 26), 180);
      target.style.height = `${targetH}px`;
    }
  };

  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, activeNote, attachedFiles, activeTool]);

  // Handle file uploads
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const fileSummaries = files.map(f => ({
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
        type: f.type || 'text/plain'
      }));
      setAttachedFiles(prev => [...prev, ...fileSummaries]);
    }
    setIsPlusMenuOpen(false);
    setIsToolsSubmenuOpen(false);
  };

  const removeAttachedFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Reset to brand new chat
  const handleNewChat = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    setMessages([]);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '26px';
    }
    setStreamingText('');
    setStreamingMeta(null);
    setIsTyping(false);
    setAttachedFiles([]);
    setActiveTool(null);
    setIsPlusMenuOpen(false);
    setIsToolsSubmenuOpen(false);
  };

  // Check if user's prompt is a strategy file update command (e.g. "change 7 days to 3 days")
  const isStrategyUpdateCommand = (text) => {
    const t = text.toLowerCase();
    return (
      activeTool === 'update' ||
      t.includes('update plan') ||
      t.includes('change plan') ||
      t.includes('7 day') ||
      t.includes('3 day') ||
      t.includes('5 day') ||
      t.includes('calendar') ||
      t.includes('calender') ||
      t.includes('keep it for 3') ||
      t.includes('keep it 3') ||
      t.includes('update strategy') ||
      t.includes('change strategy') ||
      t.includes('update cadence')
    );
  };

  // Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend && attachedFiles.length === 0) return;

    const currentTool = activeTool;
    const currentFiles = [...attachedFiles];
    const currentModel = activeModel;

    // Build user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      files: currentFiles,
      tool: currentTool ? TOOL_SKILLS[currentTool]?.name : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '26px';
    }
    setAttachedFiles([]);
    setActiveTool(null);
    setIsPlusMenuOpen(false);
    setIsToolsSubmenuOpen(false);
    setIsTyping(true);

    // 1. Intercept bulk deletion commands (e.g. "delete all posts", "clear calendar", "clear board")
    const textLower = textToSend.toLowerCase().trim();
    const isDeleteAll = (
      textLower.includes('delete all') ||
      textLower.includes('clear all') ||
      textLower.includes('remove all') ||
      textLower.includes('delete everything') ||
      textLower.includes('clear everything') ||
      textLower.includes('delete all of them') ||
      textLower.includes('delete of them') ||
      textLower.includes('clear calendar') ||
      textLower.includes('clear the calendar') ||
      textLower.includes('clear calender') ||
      textLower.includes('clear the calender') ||
      textLower.includes('clear board') ||
      textLower.includes('clear the board') ||
      textLower.includes('clear scrapbook') ||
      textLower.includes('clear scrapboard') ||
      (textLower.includes('delete') && (textLower.includes('calendar') || textLower.includes('calender')) && (textLower.includes('board') || textLower.includes('all'))) ||
      (textLower.includes('delete') && textLower.includes('posts') && (textLower.includes('all') || textLower.includes('every')))
    );

    if (isDeleteAll) {
      const count = contentItems?.length || 0;
      if (onClearAllContentItems) {
        onClearAllContentItems();
      }
      if (onClearActiveNote) {
        onClearActiveNote();
      }
      if (showToast) {
        showToast(`✓ Removed all ${count} posts from Board & Calendar`);
      }

      // Sync disk update to clear strategy files
      applyAgentUpdate(founderId, textToSend, { delete_all: true }).catch(console.warn);

      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          id: `muse-${Date.now()}`,
          sender: 'muse',
          text: `Understood. All post schedules on your Board and in your Calendar have been deleted (${count} items cleared). Your Scrapbook is now completely clear.\n\nI have also synchronized and cleared your strategy files on disk (\`master_content_plan.json\`, \`strategy_linkedin.json\`, \`strategy_x_twitter.json\`, and \`strategy_instagram.json\`).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    // 2. Intercept single note deletion (active note or matched title/keyword)
    const isDeleteActiveNote = Boolean(
      activeNote && (
        textLower === 'delete this' ||
        textLower === 'delete' ||
        textLower === 'delete it' ||
        textLower === 'delete note' ||
        textLower === 'remove this' ||
        textLower === 'remove note' ||
        textLower.startsWith('delete') ||
        textLower.startsWith('remove') ||
        textLower.includes('delete this note') ||
        textLower.includes('remove this note') ||
        textLower.includes('delete note')
      )
    );

    const specificItemToDelete = (!activeNote && (textLower.includes('delete') || textLower.includes('remove')))
      ? contentItems?.find(it => {
          const title = (it.title || '').toLowerCase();
          const id = (it.id || '').toLowerCase();
          return (
            (id && textLower.includes(id)) ||
            (title && textLower.includes(title)) ||
            (title.includes('redis') && textLower.includes('redis')) ||
            (title.includes('sqlite') && textLower.includes('sqlite')) ||
            (title.includes('leetcode') && textLower.includes('leetcode')) ||
            (title.includes('agentscale') && textLower.includes('agentscale')) ||
            (title.includes('whole foods') && textLower.includes('whole foods')) ||
            (title.includes('co-packers') && textLower.includes('co-packers')) ||
            (title.includes('general mills') && textLower.includes('general mills'))
          );
        })
      : null;

    if (isDeleteActiveNote || specificItemToDelete) {
      const itemToDelete = activeNote || specificItemToDelete;
      const deletedTitle = itemToDelete.title;
      const deletedId = itemToDelete.id;
      if (onDeleteContentItem) {
        onDeleteContentItem(deletedId);
      }
      if (onClearActiveNote && activeNote) {
        onClearActiveNote();
      }
      if (showToast) {
        showToast(`✓ Removed "${deletedTitle}" from Board & Calendar`);
      }

      // Sync disk update to master_content_plan.json
      applyAgentUpdate(founderId, textToSend, { item_id: deletedId }).catch(console.warn);

      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          id: `muse-${Date.now()}`,
          sender: 'muse',
          text: `Understood. The post "${deletedTitle}" (ID: \`${deletedId}\`) has been permanently deleted from your Board and Calendar.\n\nI have also synchronized your local strategy files on disk to reflect this deletion.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    try {
      // 1. If strategy update command, modify disk files
      let diskUpdateResult = null;
      if (isStrategyUpdateCommand(textToSend)) {
        try {
          diskUpdateResult = await applyAgentUpdate(founderId, textToSend);
        } catch (updateErr) {
          console.warn("Disk update execution:", updateErr);
        }
      }

      // 2. Call Multi-Model AI Agent (Gemini 3.5 Flash Lite or Sarvam 105B) with live contentItems
      let agentReply = await sendAiChat({
        messages: newMessages,
        profile,
        activeTool: currentTool,
        activeNote,
        contentItems,
        model: currentModel
      });

      // Guardrail against generic AI disclaimer hallucinations on check queries
      const isCheckOrStatusQuery = (
        textLower.includes('check again') ||
        textLower.includes('check if') ||
        textLower.includes('are delete') ||
        textLower.includes('are deleted') ||
        textLower.includes('is it deleted') ||
        textLower.includes('did you delete') ||
        textLower.includes('is the board empty')
      );

      if (isCheckOrStatusQuery && contentItems?.length === 0) {
        if (
          agentReply.includes("As an AI") ||
          agentReply.includes("persistent memory") ||
          agentReply.includes("external files") ||
          agentReply.includes("working memory") ||
          agentReply.includes("from my perspective")
        ) {
          agentReply = `I just checked your live Scrapbook: your Board and Calendar are completely empty (0 posts scheduled). All strategy files on disk (\`master_content_plan.json\`, \`strategy_linkedin.json\`, \`strategy_x_twitter.json\`, \`strategy_instagram.json\`) have been cleared as requested.`;
        }
      }

      // 3. Calendar schedule command detection & sync
      const isCalendarOrScheduleIntent = (
        textLower.includes('calender') ||
        textLower.includes('calendar') ||
        textLower.includes('add it in') ||
        textLower.includes('add to calendar') ||
        textLower.includes('add to calender') ||
        textLower.includes('add in calendar') ||
        textLower.includes('add in the calender') ||
        textLower.includes('add in the calendar') ||
        textLower.includes('schedule it') ||
        textLower.includes('schedule them') ||
        textLower.includes('put in calendar') ||
        textLower.includes('put it in') ||
        textLower.includes('add to scrapbook') ||
        textLower.includes('add these to') ||
        textLower.includes('schedule these')
      );

      let scheduledItems = null;
      let proposedSchedule = null;

      if (isCalendarOrScheduleIntent) {
        // Try parsing from current reply first
        let drops = parseScheduleFromContent(agentReply, profile?.channels?.primary || 'Instagram');
        // If current reply did not repeat full schedule, look at previous Muse message in history
        if (drops.length === 0) {
          const lastMuse = [...newMessages].reverse().find(m => m.sender === 'muse' && m.text);
          if (lastMuse) {
            drops = parseScheduleFromContent(lastMuse.text, profile?.channels?.primary || 'Instagram');
          }
        }
        if (drops.length > 0) {
          scheduledItems = drops;
          if (onAddContentToStudio) {
            onAddContentToStudio(drops);
          }
          applyAgentUpdate(founderId, textToSend, { new_items: drops }).catch(console.warn);
          if (showToast) {
            showToast(`✓ Added ${drops.length} drops to Calendar (${drops[0].day} – ${drops[drops.length - 1].day})`);
          }
        }
      } else {
        const potentialSchedule = parseScheduleFromContent(agentReply, profile?.channels?.primary || 'Instagram');
        if (potentialSchedule.length >= 2) {
          proposedSchedule = potentialSchedule;
        }
      }

      // 4. Single Draft payload extraction (strictly guarded: never trigger on deletions, queries, or checks)
      const isNegativeOrQuery = 
        textLower.includes('delete') || 
        textLower.includes('remove') || 
        textLower.includes('clear') || 
        textLower.includes('check') || 
        textLower.includes('verify') || 
        textLower.includes('are they') || 
        textLower.includes('is it') ||
        textLower.includes('did you') ||
        textLower.includes('how many') ||
        agentReply.toLowerCase().includes('deleted') ||
        agentReply.toLowerCase().includes('cleared') ||
        (agentReply.toLowerCase().includes('empty') && !isCalendarOrScheduleIntent);

      const isExplicitDraft = 
        textLower.includes('draft a') || 
        textLower.includes('write a post') || 
        textLower.includes('create a post') || 
        textLower.includes('generate a post') ||
        textLower.includes('new post for');

      const hasStructuredDraft = 
        (agentReply.includes('**Hook:**') || agentReply.includes('Hook:')) && 
        (agentReply.includes('**Core Story:**') || agentReply.includes('Core Story:') || agentReply.includes('Visual Direction:'));

      const isDraftable = !isNegativeOrQuery && (isExplicitDraft || hasStructuredDraft) && (!scheduledItems && !proposedSchedule);

      let draftPayload = null;
      if (isDraftable) {
        draftPayload = {
          id: `muse-draft-${Date.now()}`,
          title: activeNote ? `Refined: ${activeNote.title}` : `Draft: ${textToSend.slice(0, 36)}...`,
          platform: activeNote?.platform || profile?.channels?.primary || 'LinkedIn',
          format: activeNote?.format || 'Founder Story & Insight',
          theme: 'Building in Public',
          day: activeNote?.day || 'Wednesday',
          hook: agentReply.slice(0, 200),
          script: agentReply,
          visualDirection: profile?.execution_capacity?.available_assets?.[0] || 'Unfiltered terminal trace or workstation photo.',
          sourceMaterial: activeNote ? `Linked Board Note: ${activeNote.title}` : `Disk Memory · ${companyName}`
        };
      }

      // 4. Start typing animation with spinning star icon
      setIsTyping(false);
      setStreamingMeta({
        diskUpdate: diskUpdateResult,
        draftPayload,
        scheduledItems,
        proposedSchedule,
        tool: currentTool ? TOOL_SKILLS[currentTool]?.name : null,
        model: currentModel
      });

      let charIdx = 0;
      const fullText = agentReply;
      const step = Math.max(2, Math.floor(fullText.length / 50));

      streamingIntervalRef.current = setInterval(() => {
        charIdx += step;
        if (charIdx >= fullText.length) {
          clearInterval(streamingIntervalRef.current);
          setStreamingText('');
          setStreamingMeta(null);
          // Commit finalized message (no star icon in final message)
          setMessages(prev => [
            ...prev,
            {
              id: `muse-${Date.now()}`,
              sender: 'muse',
              text: fullText,
              tool: currentTool ? TOOL_SKILLS[currentTool]?.name : null,
              model: currentModel,
              diskUpdate: diskUpdateResult,
              draftPayload,
              scheduledItems,
              proposedSchedule,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } else {
          setStreamingText(fullText.slice(0, charIdx));
        }
      }, 16);

    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `muse-${Date.now()}`,
          sender: 'muse',
          text: `I've noted this update and synced with your local strategy files. What would you like to refine next?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);
    setIsPlusMenuOpen(false);
    setIsToolsSubmenuOpen(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] relative overflow-hidden select-none animate-fade-in font-sans">
      
      {/* Top Header: Model Switcher on Left · New Chat on Right */}
      <header className="h-14 shrink-0 px-6 sm:px-8 bg-transparent flex items-center justify-between z-20 sticky top-0">
        
        {/* Model Switcher on Top Left Corner */}
        <div className="relative" ref={modelMenuRef}>
          <button
            type="button"
            onClick={() => setIsModelMenuOpen(prev => !prev)}
            className="h-9 px-3.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
            title="Switch AI model"
          >
            <span className={`w-2 h-2 rounded-full ${activeModel === 'gemini-flash' ? 'bg-blue-500' : 'bg-amber-500'} animate-pulse`} />
            <span>{activeModel === 'gemini-flash' ? 'Gemini 3.5 Flash Lite' : 'Sarvam 105B'}</span>
            <Icon name="expand_more" size={14} className="text-slate-400" />
          </button>

          {/* Model Switcher Dropdown */}
          {isModelMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.16),0_4px_12px_-2px_rgba(15,23,42,0.08)] py-1.5 z-50 animate-fade-in font-sans">
              <button
                type="button"
                onClick={() => {
                  setActiveModel('gemini-flash');
                  setIsModelMenuOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-100/80 transition-colors cursor-pointer ${
                  activeModel === 'gemini-flash' ? 'bg-slate-50 text-slate-950 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-semibold text-slate-900">Gemini 3.5 Flash Lite</div>
                    <div className="text-[10px] text-slate-400">Google Ultra-Fast</div>
                  </div>
                </div>
                {activeModel === 'gemini-flash' && <Icon name="check" size={14} className="text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModel('sarvam-105b');
                  setIsModelMenuOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-100/80 transition-colors cursor-pointer ${
                  activeModel === 'sarvam-105b' ? 'bg-slate-50 text-slate-950 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <div>
                    <div className="font-semibold text-slate-900">Sarvam 105B</div>
                    <div className="text-[10px] text-slate-400">Indian Sovereign LLM</div>
                  </div>
                </div>
                {activeModel === 'sarvam-105b' && <Icon name="check" size={14} className="text-amber-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Top Right: Clean New Chat button */}
        <button
          type="button"
          onClick={handleNewChat}
          className="h-9 px-4 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:border-slate-300 transition-all cursor-pointer active:scale-95"
          title="Start a new chat"
        >
          <Icon name="edit_square" size={15} className="text-slate-600" />
          <span>New chat</span>
        </button>
      </header>

      {/* Main Body Canvas */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* State A: EMPTY / FRESH CHAT — Type box squarely in the center of the screen */}
        {messages.length === 0 && !streamingText && !isTyping ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-3xl mx-auto w-full -mt-10">
            
            {/* Clean heading: What's on the agenda today? */}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center mb-6">
              What’s on the agenda today?
            </h1>

            {/* The Centered Type Box */}
            <div className="w-full relative">
              {renderInputBox()}
            </div>

          </div>
        ) : (
          /* State B: CONVERSATION FLOW */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Scrollable messages column */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
                
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-1.5 animate-fade-in">
                    
                    {/* User message */}
                    {msg.sender === 'user' ? (
                      <div className="flex flex-col items-end">
                        <div className="max-w-[85%] rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-xs text-sm leading-relaxed">
                          
                          {/* Active tool tag if any */}
                          {msg.tool && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[#FEEC98] text-[10px] font-semibold mb-1.5">
                              <Icon name="tune" size={11} />
                              <span>{msg.tool}</span>
                            </div>
                          )}

                          {/* Attached files preview */}
                          {msg.files && msg.files.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {msg.files.map((f, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px]">
                                  <Icon name="attach_file" size={12} />
                                  <span>{f.name}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 mr-1">{msg.timestamp}</span>
                      </div>
                    ) : (
                      /* Agent response: Clean direct text on canvas, NO card, NO square star */
                      <div className="flex flex-col items-start w-full">
                        
                        {/* Live Disk Update Confirmation Badge if applicable */}
                        {msg.diskUpdate && msg.diskUpdate.success && (
                          <div className="w-full mb-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 p-3 flex flex-col gap-1 text-emerald-950">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                              <Icon name="check_circle" size={14} className="text-emerald-600" />
                              <span>Updated local strategy files on disk</span>
                            </div>
                            <p className="text-[11px] text-emerald-800 font-mono">
                              Files modified: {(msg.diskUpdate.updated_files || ['master_content_plan.json']).join(', ')}
                            </p>
                            {msg.diskUpdate.master_plan && (
                              <div className="mt-0.5 text-[11px] text-emerald-900 font-medium">
                                Current Sprint: <span className="font-bold">{msg.diskUpdate.master_plan.plan_timeframe || '3 Days'}</span> • {msg.diskUpdate.master_plan.planned_items?.length || 3} items scheduled.
                              </div>
                            )}
                          </div>
                        )}

                        {/* Clean response text directly on canvas with rich Markdown parsing */}
                        <div className="w-full text-slate-800 py-1 font-sans">
                          <MarkdownContent content={msg.text} />
                        </div>

                        {/* Calendar Sync Confirmation Card (if scheduled) */}
                        {msg.scheduledItems && msg.scheduledItems.length > 0 && (
                          <div className="w-full mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-slate-700/50 animate-fade-in">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                <Icon name="calendar_month" size={18} />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>✓ {msg.scheduledItems.length} {msg.scheduledItems[0]?.platform || 'Social'} Posts Synced to Scrapbook Calendar</span>
                                </div>
                                <div className="text-[11px] text-slate-300">
                                  Scheduled for {msg.scheduledItems[0]?.day} through {msg.scheduledItems[msg.scheduledItems.length - 1]?.day} • Synchronized with local strategy on disk
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onNavigateToStudio?.('calendar')}
                              className="h-8 px-3.5 rounded-full bg-[#FEEC98] hover:bg-[#ffe77a] text-slate-950 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <span>Open Calendar</span>
                              <Icon name="arrow_forward" size={13} />
                            </button>
                          </div>
                        )}

                        {/* Proposed Multi-Day Schedule 1-Click Action Bar */}
                        {msg.proposedSchedule && msg.proposedSchedule.length >= 2 && (!msg.scheduledItems || msg.scheduledItems.length === 0) && (
                          <div className="w-full mt-3 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2.5 animate-fade-in">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span>{msg.proposedSchedule.length} {msg.proposedSchedule[0]?.platform || 'Social'} drops ready ({msg.proposedSchedule[0]?.day} – {msg.proposedSchedule[msg.proposedSchedule.length - 1]?.day})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleScheduleAllToCalendar(msg.proposedSchedule, msg.id)}
                                disabled={scheduledMessageIds.has(msg.id)}
                                className={`h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  scheduledMessageIds.has(msg.id)
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs active:scale-95'
                                }`}
                              >
                                <Icon name={scheduledMessageIds.has(msg.id) ? "check" : "calendar_month"} size={13} className={scheduledMessageIds.has(msg.id) ? "text-emerald-700" : "text-[#FEEC98]"} />
                                <span>{scheduledMessageIds.has(msg.id) ? 'Added to Calendar' : `Schedule All ${msg.proposedSchedule.length} to Calendar`}</span>
                              </button>
                              {scheduledMessageIds.has(msg.id) && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToStudio?.('calendar')}
                                  className="h-8 px-3.5 rounded-full bg-[#FEEC98] hover:bg-[#ffe77a] text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                                >
                                  <span>View in Calendar</span>
                                  <Icon name="arrow_forward" size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Connected Board Note Actions (if linked) */}
                        {activeNote && (
                          <div className="mt-2.5 w-full pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60">
                            <div className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                              Linked note: <span className="font-semibold text-slate-800">"{activeNote.title}"</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onUpdateContentItem) {
                                    onUpdateContentItem({
                                      ...activeNote,
                                      hook: msg.text.slice(0, 200),
                                      script: msg.text,
                                      stage: 'draft'
                                    });
                                    if (showToast) {
                                      showToast(`✓ Saved "${activeNote.title}" to Board`);
                                    }
                                  }
                                }}
                                className="h-7 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
                              >
                                <Icon name="check" size={12} />
                                <span>Update on Board</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (onTransferToCalendar) {
                                    onTransferToCalendar(activeNote, activeNote.day || 'Wednesday');
                                    if (showToast) {
                                      showToast(`✓ Scheduled for ${activeNote.day || 'Wednesday'} on Calendar`);
                                    }
                                  }
                                }}
                                className="h-7 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                              >
                                <Icon name="calendar_month" size={12} className="text-amber-800" />
                                <span>Transfer to Calendar</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Post Draft Action Card if generated (and not linked to a note) */}
                        {!activeNote && msg.draftPayload && (
                          <div className="mt-2 w-full pt-2 flex items-center justify-between gap-2 border-t border-slate-200/50">
                            <div className="text-[11px] text-slate-400 font-medium">
                              Ready for calendar scheduling
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onAddContentToStudio(msg.draftPayload);
                                if (showToast) {
                                  showToast(`✓ Added draft to Board & Calendar`);
                                }
                                onNavigateToStudio?.();
                              }}
                              className="h-7 px-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              <Icon name="send" size={12} />
                              <span>Add to Studio</span>
                            </button>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-400 mt-1 ml-0.5">{msg.timestamp}</span>
                      </div>
                    )}

                  </div>
                ))}

                {/* Thinking Indicator: bare spinning star, text reflecting active model */}
                {isTyping && !streamingText && (
                  <div className="flex items-center gap-2.5 text-slate-600 text-xs py-2 animate-fade-in">
                    <Icon name="muse_star" size={16} className="text-slate-800 animate-spin" />
                    <span className="font-medium text-slate-700">
                      {activeModel === 'gemini-flash' ? 'Gemini 3.5 Flash Lite is thinking...' : 'Sarvam 105B is thinking...'}
                    </span>
                  </div>
                )}

                {/* Streaming/Typing Animation: bare spinning star while typing */}
                {streamingText && (
                  <div className="flex flex-col items-start w-full py-1 animate-fade-in">
                    
                    {/* Header with bare spinning star */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                      <Icon name="muse_star" size={16} className="text-slate-800 animate-spin" />
                      <span className="font-semibold text-slate-800">
                        {activeModel === 'gemini-flash' ? 'Gemini 3.5 Flash Lite' : 'Sarvam 105B'}
                      </span>
                    </div>

                    {/* Live disk update preview if available during stream */}
                    {streamingMeta?.diskUpdate && streamingMeta.diskUpdate.success && (
                      <div className="w-full mb-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 p-3 flex flex-col gap-1 text-emerald-950">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <Icon name="check_circle" size={14} className="text-emerald-600" />
                          <span>Updated local strategy files on disk</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-mono">
                          Files modified: {(streamingMeta.diskUpdate.updated_files || ['master_content_plan.json']).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Streamed text directly on canvas with rich Markdown parsing */}
                    <div className="w-full text-slate-800 py-1 font-sans">
                      <MarkdownContent content={streamingText} isStreaming={true} />
                    </div>

                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Anchored Type Box */}
            <div className="shrink-0 px-4 sm:px-6 pb-4 pt-2 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent z-10">
              <div className="max-w-3xl mx-auto w-full">
                {renderInputBox()}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Hidden File Input for "Add files" */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />

    </div>
  );

  /**
   * Helper to render the upward Popover for '+' button
   */
  function renderPlusPopover() {
    return (
      <div className="absolute left-0 bottom-full mb-2.5 w-52 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.16),0_4px_12px_-2px_rgba(15,23,42,0.08)] py-1.5 z-50 animate-fade-in font-sans">
        {/* 1. Add files */}
        <button
          type="button"
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Icon name="attach_file" size={16} className="text-slate-500" />
          <span>Add files</span>
        </button>

        {/* 2. Tools (hover or click reveals submenu) */}
        <div 
          className="relative"
          onMouseEnter={() => setIsToolsSubmenuOpen(true)}
        >
          <button
            type="button"
            onClick={() => setIsToolsSubmenuOpen(prev => !prev)}
            className={`w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer ${
              isToolsSubmenuOpen ? 'bg-slate-100/80 text-slate-900' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon name="tune" size={16} className="text-slate-500" />
              <span>Tools</span>
            </div>
            <Icon name="chevron_right" size={16} className="text-slate-400" />
          </button>

          {/* Tools Submenu Flyout (anchored bottom-0 so it opens UPWARDS) */}
          {isToolsSubmenuOpen && (
            <div 
              className="absolute left-full bottom-0 ml-1.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.16),0_4px_12px_-2px_rgba(15,23,42,0.08)] py-1.5 z-50 animate-fade-in"
              onMouseLeave={() => setIsToolsSubmenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => handleSelectTool('update')}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Icon name="refresh" size={15} className="text-indigo-600" />
                <div>
                  <div className="font-semibold text-slate-900">New update</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Update 3-day / 7-day files</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTool('brainstorm')}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Icon name="auto_awesome" size={15} className="text-amber-500" />
                <div>
                  <div className="font-semibold text-slate-900">Brainstorm</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Angles & founder war stories</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTool('research')}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Icon name="explore" size={15} className="text-cyan-600" />
                <div>
                  <div className="font-semibold text-slate-900">Research</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Trends & domain algorithms</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTool('plan')}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Icon name="calendar_today" size={15} className="text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900">Plan</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Multi-day sprint schedules</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * Helper to render the Type Box Component (Apple-minimal unified input, jitter-free dynamic auto-expand)
   */
  function renderInputBox() {
    return (
      <div 
        className="relative w-full bg-white border border-slate-200/90 shadow-sm focus-within:border-slate-400 focus-within:shadow-md transition-[border-color,box-shadow] duration-150 rounded-[24px] p-2.5 sm:p-3 flex flex-col gap-2 font-sans"
      >
        {/* Linked Active Board Note Banner if present */}
        {activeNote && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <Icon name="description" size={14} className="text-amber-700 shrink-0" />
              <span className="font-semibold text-amber-950 truncate">Editing note: "{activeNote.title}"</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onTransferToCalendar) {
                    onTransferToCalendar(activeNote, activeNote.day || 'Wednesday');
                  }
                  if (showToast) {
                    showToast(`✓ Scheduled for ${activeNote.day || 'Wednesday'} on Calendar`);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-semibold hover:bg-amber-100/70 cursor-pointer shadow-2xs flex items-center gap-1 transition-colors"
                title="Transfer directly to calendar"
              >
                <Icon name="calendar_month" size={11} className="text-amber-800" />
                <span>{activeNote.day ? activeNote.day.slice(0, 3) : 'To Calendar'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const noteTitle = activeNote.title;
                  const noteId = activeNote.id;
                  if (onDeleteContentItem) {
                    onDeleteContentItem(noteId);
                  }
                  if (onClearActiveNote) {
                    onClearActiveNote();
                  }
                  if (showToast) {
                    showToast(`✓ Removed "${noteTitle}" from Board & Calendar`);
                  }
                  setMessages(prev => [
                    ...prev,
                    {
                      id: `muse-del-${Date.now()}`,
                      sender: 'muse',
                      text: `Understood. The note "${noteTitle}" has been permanently deleted from your Board and Calendar.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 text-[11px] font-semibold hover:bg-rose-50 cursor-pointer shadow-2xs flex items-center gap-1 transition-colors"
                title="Delete this note permanently from Board & Calendar"
              >
                <Icon name="delete" size={11} className="text-rose-600" />
                <span>Delete</span>
              </button>

              {onClearActiveNote && (
                <button
                  type="button"
                  onClick={onClearActiveNote}
                  className="w-5 h-5 rounded-full hover:bg-amber-200/70 flex items-center justify-center text-amber-800 cursor-pointer ml-0.5"
                  title="Detach note without deleting"
                >
                  <Icon name="close" size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Chips for Active Tool & Attached Files */}
        {(activeTool || attachedFiles.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 px-1 pt-0.5 animate-fade-in">
            {activeTool && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300/80 text-xs font-semibold shadow-2xs">
                <Icon name={getToolIcon(activeTool)} size={13} className="text-amber-800" />
                <span>{TOOL_SKILLS[activeTool]?.name}</span>
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="w-4 h-4 rounded-full hover:bg-amber-900/10 flex items-center justify-center cursor-pointer ml-0.5 text-amber-800 transition-colors"
                  title="Remove tool"
                >
                  <Icon name="close" size={11} />
                </button>
              </span>
            )}

            {attachedFiles.map((file, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-medium shadow-2xs">
                <Icon name="attach_file" size={13} className="text-slate-500" />
                <span className="max-w-[130px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(idx)}
                  className="w-4 h-4 rounded-full hover:bg-slate-200 flex items-center justify-center cursor-pointer text-slate-500 transition-colors"
                  title="Remove file"
                >
                  <Icon name="close" size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* The Unified Input Row (Plus Button + Auto-growing Textarea + Send Button) */}
        <div className="w-full flex items-end gap-2 px-1">
          {/* '+' button with upward popover */}
          <div className="relative shrink-0 mb-0.5" ref={plusMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsPlusMenuOpen(prev => !prev);
                setIsToolsSubmenuOpen(false);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 ${
                isPlusMenuOpen 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90'
              }`}
              title="Add files or tools"
            >
              <Icon name="add" size={18} />
            </button>

            {/* Upward popover */}
            {isPlusMenuOpen && renderPlusPopover()}
          </div>

          {/* Auto-growing Textarea: stays mounted uninterrupted, zero jitter */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              activeNote
                ? `Ask Muse to refine "${activeNote.title}"...`
                : activeTool 
                  ? `Type instructions for ${TOOL_SKILLS[activeTool]?.name}...` 
                  : "Ask Muse, or type instructions..."
            }
            className="flex-1 min-w-0 bg-transparent text-[14.5px] text-slate-900 placeholder:text-slate-400 font-sans resize-none border-0 ring-0 outline-none focus:outline-none focus:ring-0 focus:border-0 py-1.5 px-1.5 leading-relaxed overflow-y-auto max-h-48"
            style={{ 
              outline: 'none', 
              border: 'none', 
              boxShadow: 'none',
              height: '26px',
              boxSizing: 'border-box',
              WebkitTapHighlightColor: 'transparent'
            }}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputText.trim() && attachedFiles.length === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 mb-0.5 ${
              inputText.trim() || attachedFiles.length > 0
                ? 'bg-slate-950 hover:bg-slate-900 text-white shadow-xs active:scale-95 cursor-pointer border border-slate-800'
                : 'bg-slate-100 text-slate-300 border border-slate-200/50 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Icon name="arrow_upward" size={15} />
          </button>
        </div>
      </div>
    );
  }
}
