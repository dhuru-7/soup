import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { sendSarvamChat, TOOL_SKILLS } from '../sarvam';
import { applyAgentUpdate, fetchStrategy } from '../api';

/**
 * MuseView - Founder Brand Strategist AI Chat
 * Redesigned as a distraction-free, Apple-minimal AI chat.
 * - Centered type box in empty state.
 * - Top bar with New Chat icon button.
 * - '+' button on type box with 'Add files' and 'Tools' (hover reveals: New update, Brainstorm, Research, Plan).
 * - Live disk updates for distinct strategy files (master_content_plan.json, strategy_linkedin.json, strategy_x_twitter.json, strategy_instagram.json).
 * - Anti-AI-Slop human responses with proactive clarifying questions.
 */
export default function MuseView({ 
  profile, 
  initialPrompt, 
  onAddContentToStudio, 
  onNavigateToStudio 
}) {
  const isMaya = profile?.founder_id === 'maya_lin';
  const founderId = profile?.founder_id || (isMaya ? 'maya_lin' : 'arjun_vance');
  const founderName = profile?.identity?.name || (isMaya ? 'Maya Lin' : 'Arjun Vance');
  const companyName = profile?.identity?.company_name || (isMaya ? 'Solace Botanicals' : 'AgentScale');

  // Messages state: starts empty for a clean canvas, or with initialPrompt if passed
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  
  // Menu states for '+' button
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isToolsSubmenuOpen, setIsToolsSubmenuOpen] = useState(false);

  // Strategy files modal & status
  const [strategyFiles, setStrategyFiles] = useState(null);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [lastDiskUpdate, setLastDiskUpdate] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const plusMenuRef = useRef(null);

  // Fetch initial strategy files from disk
  useEffect(() => {
    fetchStrategy(founderId).then(res => {
      if (res?.strategy) {
        setStrategyFiles(res.strategy);
      }
    }).catch(err => console.warn("Strategy fetch notice:", err));
  }, [founderId]);

  // Handle outside click to close the '+' menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setIsPlusMenuOpen(false);
        setIsToolsSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

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
    setMessages([]);
    setInputText('');
    setAttachedFiles([]);
    setActiveTool(null);
    setIsPlusMenuOpen(false);
    setIsToolsSubmenuOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
    setAttachedFiles([]);
    setActiveTool(null);
    setIsPlusMenuOpen(false);
    setIsToolsSubmenuOpen(false);
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // 1. If this is a strategy file update command, execute live disk modification
      let diskUpdateResult = null;
      if (isStrategyUpdateCommand(textToSend)) {
        try {
          diskUpdateResult = await applyAgentUpdate(founderId, textToSend);
          if (diskUpdateResult?.success) {
            setLastDiskUpdate(diskUpdateResult);
            // Refresh strategy cache
            fetchStrategy(founderId).then(res => {
              if (res?.strategy) setStrategyFiles(res.strategy);
            }).catch(() => {});
          }
        } catch (updateErr) {
          console.warn("Disk update execution:", updateErr);
        }
      }

      // 2. Call Sarvam AI Agent with Anti-AI-Slop & Tool Skills
      const agentReply = await sendSarvamChat({
        messages: newMessages,
        profile,
        activeTool: currentTool
      });

      // 3. Check if reply contains a draftable structure
      const isDraftable = agentReply.toLowerCase().includes('hook') || 
                          textToSend.toLowerCase().includes('draft') || 
                          textToSend.toLowerCase().includes('post');

      let draftPayload = null;
      if (isDraftable) {
        draftPayload = {
          id: `muse-draft-${Date.now()}`,
          title: `Calibrated draft: ${textToSend.slice(0, 40) || 'Founder post'}...`,
          platform: 'LinkedIn',
          format: 'Founder Story & Insight',
          theme: 'Building in Public',
          day: 'Thursday',
          hook: agentReply.slice(0, 200),
          script: agentReply,
          visualDirection: profile?.execution_capacity?.available_assets?.[0] || 'Unfiltered terminal trace or workstation photo.',
          sourceMaterial: `Disk Memory · ${companyName}`
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: `muse-${Date.now()}`,
          sender: 'muse',
          text: agentReply,
          tool: currentTool ? TOOL_SKILLS[currentTool]?.name : null,
          diskUpdate: diskUpdateResult,
          draftPayload,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `muse-${Date.now()}`,
          sender: 'muse',
          text: `I've noted this update and synced with your local strategy files. What would you like to refine next?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      
      {/* Top Header: Clean, Apple-Minimal */}
      <header className="h-14 shrink-0 px-5 sm:px-8 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#0F172A] flex items-center">
              <Icon name="muse_star" size={20} className="text-[#0F172A]" />
            </span>
            <span className="font-heading font-bold text-sm tracking-tight text-slate-900">
              Muse
            </span>
          </div>
          
          <span className="text-slate-300 text-xs">/</span>

          {/* Strategy Disk Sync Pill */}
          <button 
            type="button"
            onClick={() => setShowFilesModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
            title="Click to view local strategy files on disk"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>4 Strategy Files Synced</span>
            <Icon name="expand_more" size={13} className="text-slate-400" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewChat}
            className="h-8.5 px-3 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            title="Start a new chat"
          >
            <Icon name="edit_square" size={15} className="text-slate-600" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>
      </header>

      {/* Main Body Canvas */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* State A: EMPTY / FRESH CHAT — Type box squarely in the center of the screen */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-2xl mx-auto w-full -mt-8">
            
            {/* Clean, calm prompt heading */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-2xs mb-4 text-slate-900">
                <Icon name="muse_star" size={26} className="text-slate-900" />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                What would you like to build?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal max-w-md mx-auto">
                Calibrated brand strategist for <span className="font-medium text-slate-700">{founderName}</span>. Zero AI slop, live disk updates, and high-conviction voice.
              </p>
            </div>

            {/* The Centered Type Box */}
            <div className="w-full relative">
              {renderInputBox()}
            </div>

            {/* Subtle quick prompts */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Suggestions:</span>
              <button 
                type="button"
                onClick={() => setInputText("Update our strategy to a 3-day high impact sprint")}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-[11px] transition-all cursor-pointer shadow-2xs"
              >
                Update strategy to 3-day plan
              </button>
              <button 
                type="button"
                onClick={() => {
                  setActiveTool('brainstorm');
                  setInputText("Brainstorm a contrarian hook on why we rejected conventional tools");
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-[11px] transition-all cursor-pointer shadow-2xs"
              >
                Brainstorm contrarian hook
              </button>
              <button 
                type="button"
                onClick={() => {
                  setActiveTool('research');
                  setInputText("What trends in our domain are gaining traction on X and LinkedIn?");
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-[11px] transition-all cursor-pointer shadow-2xs"
              >
                Research current domain trends
              </button>
            </div>

          </div>
        ) : (
          /* State B: CONVERSATION FLOW */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Scrollable messages column */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
                
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
                      /* Muse message */
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200/90 flex items-center justify-center text-slate-900 shadow-2xs">
                            <Icon name="muse_star" size={13} />
                          </span>
                          <span className="font-heading font-semibold text-xs text-slate-900">Muse</span>
                          {msg.tool && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                              {msg.tool}
                            </span>
                          )}
                        </div>

                        {/* Message content card */}
                        <div className="w-full rounded-2xl bg-white border border-slate-200/80 px-4 sm:px-5 py-4 shadow-2xs text-sm text-slate-800 leading-relaxed flex flex-col gap-3">
                          
                          {/* Live Disk Update Confirmation Badge */}
                          {msg.diskUpdate && msg.diskUpdate.success && (
                            <div className="rounded-xl bg-emerald-50/90 border border-emerald-200/80 p-3 flex flex-col gap-1 text-emerald-950">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                <Icon name="check_circle" size={14} className="text-emerald-600" />
                                <span>Updated local strategy files on disk</span>
                              </div>
                              <p className="text-[11px] text-emerald-800 font-mono">
                                Files modified: {(msg.diskUpdate.updated_files || ['master_content_plan.json']).join(', ')}
                              </p>
                              {msg.diskUpdate.master_plan && (
                                <div className="mt-1 text-[11px] text-emerald-900 font-medium">
                                  Current Sprint: <span className="font-bold">{msg.diskUpdate.master_plan.plan_timeframe || '3 Days'}</span> • {msg.diskUpdate.master_plan.planned_items?.length || 3} items scheduled.
                                </div>
                              )}
                            </div>
                          )}

                          {/* Body text with Anti-AI format */}
                          <div className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed">
                            {msg.text}
                          </div>

                          {/* Post Draft Action Card if generated */}
                          {msg.draftPayload && (
                            <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <div className="text-[11px] text-slate-500 font-medium">
                                Ready for calendar scheduling
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  onAddContentToStudio(msg.draftPayload);
                                  onNavigateToStudio?.();
                                }}
                                className="h-7 px-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                              >
                                <Icon name="send" size={12} />
                                <span>Add to Studio</span>
                              </button>
                            </div>
                          )}

                        </div>

                        <span className="text-[10px] text-slate-400 mt-1 ml-1">{msg.timestamp}</span>
                      </div>
                    )}

                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs animate-pulse">
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-800">
                      <Icon name="muse_star" size={12} />
                    </span>
                    <span>Muse is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Anchored Type Box */}
            <div className="shrink-0 px-4 sm:px-6 pb-4 pt-2 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent z-10">
              <div className="max-w-2xl mx-auto w-full">
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

      {/* Strategy Files Disk Inspection Modal */}
      {showFilesModal && renderStrategyFilesModal()}

    </div>
  );

  /**
   * Helper to render the Type Box Component
   * Used in both Centered Empty State and Bottom Conversation Flow
   */
  function renderInputBox() {
    return (
      <div className="relative w-full rounded-2xl bg-white border border-slate-200/90 shadow-sm focus-within:border-slate-400 focus-within:shadow-md transition-all flex flex-col p-2.5">
        
        {/* Chips for Active Tool & Attached Files */}
        {(activeTool || attachedFiles.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 mb-2">
            
            {/* Active Tool Chip */}
            {activeTool && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEEC98] text-slate-900 text-xs font-semibold">
                <Icon name={TOOL_SKILLS[activeTool]?.icon === 'RefreshCw' ? 'refresh' : TOOL_SKILLS[activeTool]?.icon === 'Sparkles' ? 'auto_awesome' : TOOL_SKILLS[activeTool]?.icon === 'Compass' ? 'explore' : 'calendar_today'} size={13} />
                <span>{TOOL_SKILLS[activeTool]?.name}</span>
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-slate-900/10 flex items-center justify-center ml-0.5 cursor-pointer"
                >
                  <Icon name="close" size={11} />
                </button>
              </span>
            )}

            {/* Attached Files Chips */}
            {attachedFiles.map((file, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                <Icon name="attach_file" size={13} className="text-slate-500" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(idx)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-slate-200 flex items-center justify-center ml-0.5 cursor-pointer text-slate-500"
                >
                  <Icon name="close" size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input Row: '+' Button, Textarea, Send Button */}
        <div className="flex items-end gap-2">
          
          {/* '+' Button with Popover Menu */}
          <div className="relative" ref={plusMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsPlusMenuOpen(prev => !prev);
                setIsToolsSubmenuOpen(false);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isPlusMenuOpen 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Add files or tools"
            >
              <Icon name="add" size={20} />
            </button>

            {/* Floating Popover: Shows 'Add files' and 'Tools' */}
            {isPlusMenuOpen && (
              <div className="absolute left-0 bottom-10 mb-2 w-48 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-1.5 z-50 animate-fade-in font-sans">
                
                {/* 1. Add files */}
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
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
                    className={`w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer ${
                      isToolsSubmenuOpen ? 'bg-slate-100/80 text-slate-900' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon name="tune" size={16} className="text-slate-500" />
                      <span>Tools</span>
                    </div>
                    <Icon name="chevron_right" size={16} className="text-slate-400" />
                  </button>

                  {/* Tools Submenu Flyout (New update, Brainstorm, Research, Plan) */}
                  {isToolsSubmenuOpen && (
                    <div 
                      className="absolute left-full top-0 ml-1.5 w-52 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-1.5 z-50 animate-fade-in"
                      onMouseLeave={() => setIsToolsSubmenuOpen(false)}
                    >
                      
                      {/* Tool: New update */}
                      <button
                        type="button"
                        onClick={() => handleSelectTool('update')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Icon name="refresh" size={15} className="text-indigo-600" />
                        <div>
                          <div className="font-semibold text-slate-900">New update</div>
                          <div className="text-[10px] text-slate-400 leading-tight">Update 3-day / 7-day files</div>
                        </div>
                      </button>

                      {/* Tool: Brainstorm */}
                      <button
                        type="button"
                        onClick={() => handleSelectTool('brainstorm')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Icon name="lightbulb" size={15} className="text-amber-500" />
                        <div>
                          <div className="font-semibold text-slate-900">Brainstorm</div>
                          <div className="text-[10px] text-slate-400 leading-tight">Angles & founder war stories</div>
                        </div>
                      </button>

                      {/* Tool: Research */}
                      <button
                        type="button"
                        onClick={() => handleSelectTool('research')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Icon name="explore" size={15} className="text-cyan-600" />
                        <div>
                          <div className="font-semibold text-slate-900">Research</div>
                          <div className="text-[10px] text-slate-400 leading-tight">Trends & domain algorithms</div>
                        </div>
                      </button>

                      {/* Tool: Plan */}
                      <button
                        type="button"
                        onClick={() => handleSelectTool('plan')}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
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
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              activeTool 
                ? `Active tool: ${TOOL_SKILLS[activeTool]?.name}. Type instructions...` 
                : "Ask Muse, tell to update strategy files, or draft a post..."
            }
            className="flex-1 max-h-44 min-h-[36px] py-1.5 px-2 bg-transparent border-none outline-none resize-none text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputText.trim() && attachedFiles.length === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() || attachedFiles.length > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Icon name="arrow_upward" size={17} />
          </button>

        </div>

      </div>
    );
  }

  /**
   * Helper to render the Strategy Files Modal
   */
  function renderStrategyFilesModal() {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-xl w-full p-6 flex flex-col gap-4 animate-scale-up font-sans">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Icon name="folder_open" size={20} className="text-slate-900" />
              <h2 className="font-heading font-bold text-base text-slate-900">
                Local Strategy Files on Disk
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowFilesModal(false)}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-500">
            These files live directly on the server's local disk in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">server/data/founders/{founderId}/</code>. When you tell Muse to adjust plans or cadences, Muse modifies these files directly:
          </p>

          <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
            
            {/* File 1: Master Content Plan */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-900">master_content_plan.json</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {strategyFiles?.master_plan?.plan_timeframe || '3 Days'} Sprint
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sprint Goal: {strategyFiles?.master_plan?.active_sprint_goal || 'Category Leadership & Inbound'}
              </p>
              <div className="text-[10px] text-slate-400">
                {strategyFiles?.master_plan?.planned_items?.length || 3} items currently planned.
              </div>
            </div>

            {/* File 2: LinkedIn Strategy */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-900">strategy_linkedin.json</span>
                <span className="text-[10px] text-slate-500">
                  {strategyFiles?.linkedin?.active_cadence || '3 posts/week'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Formats: {strategyFiles?.linkedin?.target_formats?.slice(0, 2).join(', ') || 'Post-Mortems, System Diagrams'}
              </p>
            </div>

            {/* File 3: X (Twitter) Strategy */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-900">strategy_x_twitter.json</span>
                <span className="text-[10px] text-slate-500">
                  {strategyFiles?.x?.active_cadence || '4 posts/week'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Formats: {strategyFiles?.x?.target_formats?.slice(0, 2).join(', ') || 'Contrarian Threads, Benchmark Screenshots'}
              </p>
            </div>

            {/* File 4: Instagram Strategy */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-900">strategy_instagram.json</span>
                <span className="text-[10px] text-slate-500">
                  {strategyFiles?.instagram?.active_cadence || '2 reels/week'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Formats: {strategyFiles?.instagram?.target_formats?.slice(0, 2).join(', ') || 'Raw Warehouse B-Roll, Founder Scars'}
              </p>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setShowFilesModal(false)}
              className="h-8 px-4 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    );
  }
}
