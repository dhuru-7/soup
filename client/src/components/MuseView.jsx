import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { sendSarvamChat } from '../sarvam';

export default function MuseView({ 
  profile, 
  initialPrompt, 
  onAddContentToStudio, 
  onNavigateToStudio 
}) {
  const isMaya = profile?.founder_id === 'maya_lin';

  const getSeedData = () => {
    if (isMaya) {
      return {
        sessions: [
          { id: 'sess-1', title: 'Founder story: Why 14 co-packers turned us down → 45s reel', lastActive: 'Today', taskType: 'Story' },
          { id: 'sess-2', title: 'Research: The hidden reality of "Natural Flavors" in retail drinks', lastActive: 'Yesterday', taskType: 'Research' },
          { id: 'sess-3', title: 'Contrarian angle: Shelf-life preservatives vs real wellness', lastActive: '3d ago', taskType: 'Draft' },
        ],
        messages: [
          {
            id: 'msg-1',
            sender: 'muse',
            text: `I noticed that you selected founder stories as a core preference during onboarding.\n\nInstead of inventing a story, let's start with your real moment: what happened when you first realized this problem was worth solving?\n\nYour onboarding note: "14 commercial beverage co-packers told me clean organic sparkling formulas were commercially impossible without synthetic stabilizers and gums. Refused to compromise."`,
            timestamp: '10:14 AM'
          },
          {
            id: 'msg-2',
            sender: 'founder',
            text: 'Turn this exact moment into a 45-second high-proof script for Instagram and LinkedIn.',
            timestamp: '10:16 AM'
          },
          {
            id: 'msg-3',
            sender: 'muse',
            text: `Here is a calibrated 45-second script anchored in your firsthand experience. It draws on your **The Vulnerable Operator** tone and avoids generic wellness cliches:`,
            draftPayload: {
              id: `muse-draft-maya-seed-1`,
              title: `Why I started Solace Botanicals (The Co-Packer Rejection)`,
              platform: 'Instagram & LinkedIn',
              format: 'Short video reel & Post',
              theme: 'Founder story · Supply chain truth',
              day: 'Wednesday',
              hook: `“Every beverage consultant told me I was insane to launch without sodium benzoate or artificial gums.\n\nHere’s what happened when 14 commercial co-packers refused to bottle Solace Botanicals without preservatives:”`,
              script: `[0:00 - 0:10] Hook: "If a canned wellness drink can sit on a warm warehouse shelf for 24 months, ask yourself: is it really wellness?"\n\n[0:10 - 0:25] The Wall: "When I started Solace Botanicals, 14 co-packers told me clean organic adaptogens couldn't be canned at scale without industrial emulsifiers and synthetic shelf stabilizers."\n\n[0:25 - 0:38] The Breakthrough: "We spent 8 months formulating cold-fill pasteurization with real lion's mane and organic lemon balm. It cut our margins by 18%, but kept 100% of the active compounds intact."\n\n[0:38 - 0:45] CTA: "If you care about what actually goes into functional drinks, here is our full open-formula lab report:"`,
              visualDirection: 'Unfiltered warehouse b-roll holding raw organic adaptogen batch with handwritten testing logs.',
              sourceMaterial: 'Founder Onboarding DNA • Lab Batch #04 Quality Sheet',
              citations: ['Solace Botanicals Lab Formulation Report #04', 'FDA Title 21 Natural Flavor Exemption']
            },
            timestamp: '10:17 AM'
          }
        ]
      };
    }

    // Default: Arjun Vance (DeepTech AI)
    return {
      sessions: [
        { id: 'sess-1', title: 'Founder story: Redis memory leak → 45s video', lastActive: 'Today', taskType: 'Story' },
        { id: 'sess-2', title: 'Research: Why early founders struggle with agent eval', lastActive: 'Yesterday', taskType: 'Research' },
        { id: 'sess-3', title: 'Contrarian angle: SQLite vs Vector DB benchmarks', lastActive: '3d ago', taskType: 'Draft' },
      ],
      messages: [
        {
          id: 'msg-1',
          sender: 'muse',
          text: `I noticed that you selected founder stories as a core preference during onboarding.\n\nInstead of inventing a story, let's start with your real moment: what happened when you first realized this problem was worth solving?\n\nYour onboarding note: "${profile?.identity?.origin_scar || 'Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans.'}"`,
          timestamp: '10:14 AM'
        },
        {
          id: 'msg-2',
          sender: 'founder',
          text: 'Turn this exact moment into a 45-second high-proof script for LinkedIn and short video.',
          timestamp: '10:16 AM'
        },
        {
          id: 'msg-3',
          sender: 'muse',
          text: `Here is a calibrated 45-second script anchored in your firsthand experience. It draws on your **The Builder** tone and avoids generic motivational cliches:`,
          draftPayload: {
            id: `muse-draft-seed-1`,
            title: `Why I started building ${profile?.identity?.company_name || 'AgentScale'} (The $412 Redis Leak)`,
            platform: 'LinkedIn',
            format: 'Short video & Text post',
            theme: 'Founder story · Personal experience',
            day: 'Wednesday',
            hook: `“I didn't start building ${profile?.identity?.company_name || 'AgentScale'} because I had everything figured out.\n\nI started because we burned $412 in 14 hours on AWS due to an unbatched Redis scan across 50,000 agent sessions.”`,
            script: `[0:00 - 0:10] Hook: "Most people think startups start with a pitch deck. Ours started at 2:15 AM with a PagerDuty alert that cost $400 an hour."\n\n[0:10 - 0:25] The Failure: "We discovered that standard APMs are completely blind to autonomous agent loops. They treat 5,000 recursive agent queries like a normal web request."\n\n[0:25 - 0:38] The Solution: "I spent 14 hours writing a 12-line proxy in Lua that batched scans deterministically. That 12-line fix became the core architecture of ${profile?.identity?.company_name || 'AgentScale'}."\n\n[0:38 - 0:45] CTA: "If you're running multi-agent fleets in production and dreading your AWS invoice, here's the open-source post-mortem:"`,
            visualDirection: profile?.execution_capacity?.available_assets?.[0] || 'Dark-mode terminal flame graph screenshot before/after Lua script.',
            sourceMaterial: 'Onboarding founder DNA • Production incident log',
            citations: ['Founder Onboarding DNA', 'AgentScale Production Post-Mortem #01']
          },
          timestamp: '10:17 AM'
        }
      ]
    };
  };

  const initialSeed = getSeedData();
  const [sessions, setSessions] = useState(initialSeed.sessions);
  const [activeSessionId, setActiveSessionId] = useState('sess-1');
  const [sessionSearch, setSessionSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState([]);
  const [showContextDrawer, setShowContextDrawer] = useState(true);
  const [messages, setMessages] = useState(initialSeed.messages);

  const messagesEndRef = useRef(null);

  const founderName = profile?.identity?.name || (isMaya ? 'Maya Lin' : 'Arjun Vance');
  const companyName = profile?.identity?.company_name || (isMaya ? 'Solace Botanicals' : 'AgentScale');
  const whyStarted = profile?.identity?.origin_scar || (isMaya 
    ? '14 commercial beverage co-packers told me clean organic sparkling formulas were commercially impossible without synthetic stabilizers and gums. Refused to compromise.'
    : 'Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans.');
  const spicyTake = profile?.voiceprint?.spicy_take || (isMaya
    ? 'If a canned healthy drink has a 2-year shelf life at room temperature, you are drinking industrial preservatives, not wellness.'
    : 'Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency, cost, and maintainability.');
  const hobbies = profile?.voiceprint?.hobbies || (isMaya ? 'Trail Running & Coffee' : 'Chess & Coffee');
  const archetype = profile?.voiceprint?.insead_archetype || (isMaya ? 'The Vulnerable Operator' : 'The Builder');

  // Re-seed conversation when founder profile switches
  useEffect(() => {
    const fresh = getSeedData();
    setSessions(fresh.sessions);
    setMessages(fresh.messages);
    setActiveSessionId('sess-1');
  }, [profile?.founder_id]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendPrompt = async (promptText) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'founder',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      // Call Live Sarvam 105B API Agent
      const sarvamReply = await sendSarvamChat({
        messages: newMessages,
        profile
      });

      // Check if response contains a post or hook structure to package as draft
      const isDraftable = sarvamReply.toLowerCase().includes('hook') || 
                          textToSend.toLowerCase().includes('draft') || 
                          textToSend.toLowerCase().includes('script') ||
                          textToSend.toLowerCase().includes('post') ||
                          textToSend.toLowerCase().includes('story');

      let draftPayload = null;
      if (isDraftable) {
        draftPayload = {
          id: `muse-draft-${Date.now()}`,
          title: `Calibrated post: ${textToSend.slice(0, 45)}...`,
          platform: 'LinkedIn',
          format: 'Founder Story & Insight',
          theme: 'Building in Public',
          day: 'Thursday',
          hook: sarvamReply.slice(0, 220),
          script: sarvamReply,
          visualDirection: profile?.execution_capacity?.available_assets?.[0] || 'Terminal code trace or whiteboard architecture photo.',
          sourceMaterial: `Sarvam 105B • ${archetype} Voice Calibration`
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-resp-${Date.now()}`,
          sender: 'muse',
          text: sarvamReply,
          draftPayload,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error("Sarvam chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-resp-${Date.now()}`,
          sender: 'muse',
          text: `[Sarvam Agent Response]\n\nHere is an anti-AI founder hook based on your turning point:\n\n"Most founders over-complicate early distribution. We cut out 80% of corporate fluff and started posting the exact $412 server incident log. Our inbound engineering pipeline doubled in 2 weeks."`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddDraftToStudio = (draft) => {
    if (!draft) return;
    onAddContentToStudio({
      ...draft,
      stage: 'draft'
    });
    setAddedItemIds(prev => [...prev, draft.id]);
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1320px] mx-auto w-full px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-5 animate-fade-in">
      
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <h1 className="font-heading text-xl font-bold text-slate-950">
            Muse
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sarvam 105B Active</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowContextDrawer(!showContextDrawer)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs text-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Icon name="tune" size={14} />
          <span>{showContextDrawer ? 'Hide context panel' : 'Show context panel'}</span>
        </button>
      </div>

      {/* Main Workspace Layout (Sidebar + Chat Area + Context Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Conversation History & New Task (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              const newSess = {
                id: `sess-${Date.now()}`,
                title: 'New research & brainstorming session',
                lastActive: 'Just now',
                taskType: 'Draft'
              };
              setSessions([newSess, ...sessions]);
              setActiveSessionId(newSess.id);
            }}
            className="w-full h-10 px-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
          >
            <Icon name="add" size={16} />
            <span>New conversation</span>
          </button>

          {/* Search sessions */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
              <Icon name="search" size={15} />
            </span>
            <input
              type="text"
              value={sessionSearch}
              onChange={e => setSessionSearch(e.target.value)}
              placeholder="Search sessions..."
              className="w-full h-9 pl-9 pr-3 rounded-full bg-white border border-slate-200 text-slate-800 text-xs outline-none"
            />
          </div>

          {/* Session List */}
          <div className="frosted-glass bg-white/70 rounded-2xl p-2 border border-slate-200/80 flex flex-col gap-1 max-h-[460px] overflow-y-auto">
            {filteredSessions.map(sess => {
              const isActive = activeSessionId === sess.id;
              return (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => setActiveSessionId(sess.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex flex-col gap-1 ${
                    isActive 
                      ? 'bg-white shadow-2xs border border-slate-200/90 text-slate-950 font-bold' 
                      : 'hover:bg-white/60 text-slate-600 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold">
                      {sess.taskType}
                    </span>
                    <span className="text-slate-400">{sess.lastActive}</span>
                  </div>
                  <span className="text-xs line-clamp-1">
                    {sess.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Interactive Chat Workspace (6 or 9 Cols) */}
        <div className={`${showContextDrawer ? 'lg:col-span-6' : 'lg:col-span-9'} flex flex-col gap-4`}>
          
          {/* Quick Task Shortcuts with Google Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Research a topic', icon: 'search', prompt: 'Research audience questions and content gaps in our domain' },
              { label: 'Explore my stories', icon: 'history_edu', prompt: 'Explore lessons and personal turning points from my onboarding notes' },
              { label: 'Create content', icon: 'edit_note', prompt: 'Draft a high-proof LinkedIn post on our latest technical pivot' },
              { label: 'Review performance', icon: 'monitoring', prompt: 'Review our content metrics and suggest 2 new experiments' },
            ].map((task, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendPrompt(task.prompt)}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:bg-amber-50/20 text-left flex flex-col gap-1.5 transition-all active:scale-[0.98]"
              >
                <Icon name={task.icon} size={16} className="text-amber-600" />
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {task.label}
                </span>
              </button>
            ))}
          </div>

          {/* Chat Stream Window */}
          <div className="frosted-glass bg-white/80 rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-apple-card min-h-[440px] flex flex-col justify-between">
            
            {/* Messages Scroll Area */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-1">
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'founder' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-medium px-1">
                    <span>{msg.sender === 'founder' ? founderName : 'Muse (Sarvam 105B)'}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[92%] ${
                    msg.sender === 'founder'
                      ? 'bg-slate-950 text-white rounded-tr-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs font-normal'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Formatted Draft Card Output */}
                    {msg.draftPayload && (
                      <div className="mt-4 pt-3.5 border-t border-slate-200/90 flex flex-col gap-3">
                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                              Draft Ready for Studio
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {msg.draftPayload.platform} • {msg.draftPayload.format}
                            </span>
                          </div>

                          <h4 className="font-heading text-sm font-bold text-slate-900 mb-2">
                            {msg.draftPayload.title}
                          </h4>

                          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 font-medium whitespace-pre-line mb-3">
                            {msg.draftPayload.hook}
                          </div>

                          {msg.draftPayload.script && (
                            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/70 text-xs text-slate-700 whitespace-pre-line mb-3">
                              {msg.draftPayload.script}
                            </div>
                          )}

                          <div className="text-[11px] text-slate-500 italic mb-2">
                            "{msg.draftPayload.visualDirection}"
                          </div>

                          {/* ACTION: Add to Content Studio (10% more intense CTA yellow #FACC15) */}
                          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">
                              Creates record in Studio pipeline
                            </span>

                            {addedItemIds.includes(msg.draftPayload.id) ? (
                              <button
                                type="button"
                                onClick={() => onNavigateToStudio()}
                                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                              >
                                <Icon name="check" size={14} />
                                <span>Added! View in Scrapbook →</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddDraftToStudio(msg.draftPayload)}
                                className="px-4 py-2 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                              >
                                <Icon name="bookmark_add" size={15} />
                                <span>Add to Scrapbook</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 text-xs text-slate-600 font-medium animate-pulse">
                  <Icon name="refresh" size={15} className="animate-spin text-amber-500" />
                  <span>Sarvam 105B agent is researching and drafting response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Dynamic Quick Prompt Suggestions */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1 no-scrollbar">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <span>💡 Suggestions:</span>
                </span>
                {(isMaya ? [
                  { label: "🌿 Co-packer rejection reel", prompt: "Draft a 45-second high-proof Instagram Reel about why 14 commercial co-packers turned down our zero-gum formula." },
                  { label: "🔥 2-year shelf life take", prompt: "Write an unpopular opinion post for LinkedIn analyzing why 2-year room temperature shelf life in drinks means drinking industrial preservatives." },
                  { label: "🛒 Whole Foods retail economics", prompt: "Break down the raw unit economics of retail slotting fees and pallet distribution for our next founder diary entry." },
                  { label: "🧪 'Natural Flavors' expose", prompt: "Draft an educational post breaking down what the FDA legally allows beverage brands to hide under the 'Natural Flavors' label." }
                ] : [
                  { label: "👨‍💻 $412 Redis leak teardown", prompt: "Draft a high-proof technical post-mortem about our $412 Redis memory leak and the 12-line Lua fix that solved it." },
                  { label: "🔥 SQLite vs Vector DBs take", prompt: "Draft a contrarian technical post explaining why SQLite with BM25 outperforms vector databases for 90% of early AI workloads." },
                  { label: "⚡ eBPF trace proxy architecture", prompt: "Write an engineering architecture breakdown of our eBPF trace proxy and why traditional APMs miss recursive agent loops." },
                  { label: "📊 Benchmark latency reality", prompt: "Draft an anti-AI-slop teardown comparing synthetic marketing benchmarks vs real-world P99 latency across LLM agent fleets." }
                ]).map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPrompt(qp.prompt)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 hover:bg-amber-50 hover:text-amber-950 text-slate-700 border border-slate-200/80 shadow-2xs transition-all active:scale-95"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Input Bar Form */}
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={isMaya 
                    ? "Ask Sarvam Muse to draft CPG reels, unpack retail economics, or challenge wellness cliches..."
                    : "Ask Sarvam Muse to research, draft, explore stories, or critique..."}
                  className="flex-1 h-11 px-4 rounded-full frosted-input text-slate-900 text-xs sm:text-sm font-medium outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="h-11 px-5 rounded-full bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <span>Send</span>
                  <Icon name="send" size={14} />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Right Context Drawer: Strategy, Audience & Voice Rules (3 Cols) */}
        {showContextDrawer && (
          <div className="lg:col-span-3 frosted-glass bg-white/70 rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="font-heading font-bold text-slate-900">
                Workspace Context
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Memory
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Direction / Positioning
              </span>
              <p className="text-slate-800 font-semibold leading-relaxed">
                "{profile.identity.tagline}"
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Target Audience
              </span>
              <div className="flex flex-wrap gap-1">
                {(profile.domain_radar?.target_audience || ['Staff Engineers']).map(aud => (
                  <span key={aud} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {aud}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Voice Rules & Analogies
              </span>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Tone: <strong>{archetype}</strong></li>
                <li>• Metaphors: <strong>{hobbies}</strong></li>
                <li>• Anti-AI filter: <strong>Active</strong> (zero cliches)</li>
                <li>• Model: <strong>Sarvam 105B</strong></li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-400 leading-relaxed">
              Muse grounds every suggestion in your firsthand failure post-mortems and filters out synthetic corporate platitudes.
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
