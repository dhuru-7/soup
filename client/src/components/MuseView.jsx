import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { sendSarvamChat, TOOL_SKILLS } from '../sarvam';
import { applyAgentUpdate, fetchStrategy } from '../api';

/**
 * MuseView - Founder Brand Strategist AI Chat
 * Clean, Apple-minimal, distraction-free:
 * - Empty state: type box squarely in the center of the screen with "What are we building today?".
 * - Top header: Clean, un-distorted "New chat" button on top right.
 * - '+' button on type box with 'Add files' and 'Tools' (hover reveals: New update, Brainstorm, Research, Plan) that opens UPWARDS.
 * - Zero inner border/box inside the textarea.
 * - No white cards for AI responses (direct canvas text).
 * - Spinning star SVG during Sarvam 105B thinking and typing animation, hidden once generation finishes.
 */
export default function MuseView({ 
  profile, 
  initialPrompt, 
  onAddContentToStudio, 
  onNavigateToStudio 
}) {
  const isMaya = profile?.founder_id === 'maya_lin';
  const founderId = profile?.founder_id || (isMaya ? 'maya_lin' : 'arjun_vance');
  const companyName = profile?.identity?.company_name || (isMaya ? 'Solace Botanicals' : 'AgentScale');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingMeta, setStreamingMeta] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  
  // Menu states for '+' button
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isToolsSubmenuOpen, setIsToolsSubmenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const plusMenuRef = useRef(null);
  const streamingIntervalRef = useRef(null);

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
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    setMessages([]);
    setInputText('');
    setStreamingText('');
    setStreamingMeta(null);
    setIsTyping(false);
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
      // 1. If strategy update command, modify disk files
      let diskUpdateResult = null;
      if (isStrategyUpdateCommand(textToSend)) {
        try {
          diskUpdateResult = await applyAgentUpdate(founderId, textToSend);
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

      // 3. Draft payload extraction if applicable
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

      // 4. Start typing animation with spinning star icon
      setIsTyping(false);
      setStreamingMeta({
        diskUpdate: diskUpdateResult,
        draftPayload,
        tool: currentTool ? TOOL_SKILLS[currentTool]?.name : null
      });

      let charIdx = 0;
      const fullText = agentReply;
      const step = Math.max(2, Math.floor(fullText.length / 55));

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
              diskUpdate: diskUpdateResult,
              draftPayload,
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
      
      {/* Top Header: Clean, only New Chat on right */}
      <header className="h-14 shrink-0 px-6 sm:px-8 bg-transparent flex items-center justify-end z-20 sticky top-0">
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
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-2xl mx-auto w-full -mt-12">
            
            {/* Clean heading without star or subtitle */}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center mb-6">
              What are we building today?
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

                        {/* Clean response text without card wrapper */}
                        <div className="w-full text-slate-800 text-[14.5px] leading-relaxed whitespace-pre-wrap font-sans py-1">
                          {msg.text}
                        </div>

                        {/* Post Draft Action Card if generated */}
                        {msg.draftPayload && (
                          <div className="mt-2 w-full pt-2 flex items-center justify-between gap-2 border-t border-slate-200/50">
                            <div className="text-[11px] text-slate-400 font-medium">
                              Ready for calendar scheduling
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onAddContentToStudio(msg.draftPayload);
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

                {/* Thinking Indicator: bare spinning star, text "Sarvam 105B is thinking..." */}
                {isTyping && !streamingText && (
                  <div className="flex items-center gap-2.5 text-slate-600 text-xs py-2 animate-fade-in">
                    <Icon name="muse_star" size={16} className="text-slate-800 animate-spin" />
                    <span className="font-medium text-slate-700">Sarvam 105B is thinking...</span>
                  </div>
                )}

                {/* Streaming/Typing Animation: bare spinning star while typing */}
                {streamingText && (
                  <div className="flex flex-col items-start w-full py-1 animate-fade-in">
                    
                    {/* Header with bare spinning star */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                      <Icon name="muse_star" size={16} className="text-slate-800 animate-spin" />
                      <span className="font-semibold text-slate-800">Sarvam 105B</span>
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

                    {/* Streamed text directly on canvas with pulse cursor */}
                    <div className="w-full text-slate-800 text-[14.5px] leading-relaxed whitespace-pre-wrap font-sans">
                      {streamingText}
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-slate-700 animate-pulse align-middle" />
                    </div>

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
          
          {/* '+' Button with Popover Menu (Opens UPWARDS) */}
          <div className="relative" ref={plusMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsPlusMenuOpen(prev => !prev);
                setIsToolsSubmenuOpen(false);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isPlusMenuOpen 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Add files or tools"
            >
              <Icon name="add" size={20} />
            </button>

            {/* Floating Popover: Opens UPWARDS (bottom-full mb-2) */}
            {isPlusMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-48 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-1.5 z-50 animate-fade-in font-sans">
                
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

                  {/* Tools Submenu Flyout (opens to right and anchors to bottom-0 so it goes UP) */}
                  {isToolsSubmenuOpen && (
                    <div 
                      className="absolute left-full bottom-0 ml-1.5 w-52 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-1.5 z-50 animate-fade-in"
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

          {/* Textarea: Strictly ZERO inner box/rectangle outline */}
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
            className="flex-1 max-h-44 min-h-[36px] py-1.5 px-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed resize-none border-0 ring-0 outline-none focus:outline-none focus:ring-0 focus:border-0"
            style={{ 
              outline: 'none', 
              border: 'none', 
              boxShadow: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
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
}
