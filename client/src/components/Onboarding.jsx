import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, X, Plus, ShieldAlert, Camera, Terminal, FileText, Zap, Globe, Link2, Heart } from 'lucide-react';

function CardHeader({ currentStep, totalSteps = 5, stepTitle }) {
  const [isWiping, setIsWiping] = useState(true);

  // When step changes, wipe header to step title for 3 seconds, then transition back to 'Soup'
  useEffect(() => {
    setIsWiping(true);
    const timer = setTimeout(() => {
      setIsWiping(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const circumference = 56.548;
  const strokeOffset = circumference - (currentStep / totalSteps) * circumference;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-white/75 backdrop-blur-md px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200/80 relative select-none">
      {/* Brand area that wipes to Step Title for 3 seconds, then wipes back to Soup */}
      <div className="h-7 flex items-center overflow-hidden">
        {isWiping ? (
          <div key={`title-${currentStep}`} className="animate-header-wipe flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FAD02C] animate-pulse" />
            <span className="font-heading text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              {stepTitle}
            </span>
          </div>
        ) : (
          <div key="soup-brand" className="animate-header-wipe flex items-center gap-2">
            <span className="font-heading text-[16px] font-bold text-slate-900 tracking-tight">
              Soup
            </span>
          </div>
        )}
      </div>

      {/* Step Counter & Circular Ring */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200/90 shadow-2xs">
          <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 24 24">
            <circle 
              className="text-slate-200" 
              cx="12" cy="12" fill="none" r="9" 
              stroke="currentColor" strokeWidth="2.5" 
            />
            <circle 
              className="text-[#FAD02C] transition-all duration-700 ease-out" 
              cx="12" cy="12" fill="none" r="9" 
              stroke="currentColor" strokeWidth="2.5" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeOffset} 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </div>

      {/* Hairline Progress Track along bottom edge of card header */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/50 overflow-hidden">
        <div 
          className="h-full bg-[#FAD02C] transition-all duration-700 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default function Onboarding({ onComplete, initialProfile, currentStep = 1, onStepChange }) {
  const totalSteps = 5;
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initStageText, setInitStageText] = useState('Vectorizing founder persona & turning point...');
  const [initComplete, setInitComplete] = useState(false);
  const [customBannedInput, setCustomBannedInput] = useState('');
  const [customHobbyInput, setCustomHobbyInput] = useState('');

  // Mouse ambient spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const stepTitles = {
    1: 'Step 1: Your Role, Background & Hobbies',
    2: 'Step 2: Company, Links & The Turning Point',
    3: 'Step 3: Unpopular Opinions & Brand Style',
    4: 'Step 4: Who You’re Building For & Pet Peeves',
    5: 'Step 5: Words You Hate & Real Things to Share'
  };

  // Form State
  const [state, setState] = useState({
    // Step 1: You, Your Role & Hobbies
    fullName: initialProfile?.identity?.name || 'Arjun Vance',
    role: initialProfile?.identity?.role || 'Technical Architect / CTO',
    expertise: initialProfile?.identity?.expertise || ['Engineering / AI', 'Product Architecture'],
    hobbies: ['Chess & Strategy', 'Marathon running', 'Specialty Coffee'],

    // Step 2: Company, Links & Turning Point
    entityName: initialProfile?.identity?.company_name || 'AgentScale',
    mission: initialProfile?.identity?.mission || 'Distributed observability and trace debugger for multi-agent LLM systems in production.',
    turningPoint: initialProfile?.identity?.origin_scar || 'Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans that cost $400/hr in cloud overruns; realized existing APMs are blind to agent loops.',
    links: [
      { id: 1, type: 'Website', url: 'https://agentscale.dev' },
      { id: 2, type: 'X / Twitter', url: 'https://x.com/arjun_scale' },
      { id: 3, type: 'LinkedIn', url: 'https://linkedin.com/in/arjunvance' }
    ],

    // Step 3: Unpopular Opinions & Brand Persona
    unpopularOpinion: initialProfile?.voiceprint?.spicy_take || 'Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency, cost, and maintainability.',
    brandStyle: initialProfile?.voiceprint?.insead_archetype || 'The Builder (Share the Work)',

    // Step 4: Who You’re Building For & Pet Peeves
    audience: Array.isArray(initialProfile?.domain_radar?.target_audience) 
      ? initialProfile.domain_radar.target_audience[0] 
      : 'Staff Backend Engineers & AI Platform Leads',
    annoyances: initialProfile?.domain_radar?.audience_taboos || [
      'Hollow AI wrapper marketing',
      'Unverified latency benchmarks',
      'Over-engineered bloatware'
    ],

    // Step 5: Words You Hate & Real Things to Share
    bannedPhrases: initialProfile?.voiceprint?.banned_phrases || [
      'delve into',
      'game-changer',
      'thrilled to announce',
      'humbled and honored',
      'revolutionary',
      'synergy'
    ],
    realAssets: initialProfile?.execution_capacity?.available_assets || [
      'Terminal screenshots & trace logs',
      'Whiteboard architecture sketches',
      'Raw voice notes & unscripted brain dumps'
    ],
    platforms: initialProfile?.execution_capacity?.channels || ['LinkedIn', 'X / Twitter']
  });

  const goToStep = (step) => {
    if (onStepChange) {
      onStepChange(step);
    }
  };

  // Cursor following ambient glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * 0.4,
        y: (e.clientY - window.innerHeight / 2) * 0.4
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleArrayItem = (key, item, max = null) => {
    setState(prev => {
      const list = [...(prev[key] || [])];
      const index = list.indexOf(item);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        if (max && list.length >= max) {
          list.shift();
        }
        list.push(item);
      }
      return { ...prev, [key]: list };
    });
  };

  // Dynamic link handlers
  const handleLinkChange = (id, field, value) => {
    setState(prev => ({
      ...prev,
      links: prev.links.map(lnk => lnk.id === id ? { ...lnk, [field]: value } : lnk)
    }));
  };

  const addLinkRow = () => {
    setState(prev => ({
      ...prev,
      links: [...prev.links, { id: Date.now(), type: 'Website', url: '' }]
    }));
  };

  const removeLinkRow = (id) => {
    if (state.links.length <= 1) return;
    setState(prev => ({
      ...prev,
      links: prev.links.filter(lnk => lnk.id !== id)
    }));
  };

  const addCustomBanned = () => {
    if (!customBannedInput.trim()) return;
    const token = customBannedInput.trim().toLowerCase();
    if (!state.bannedPhrases.includes(token)) {
      setState(prev => ({
        ...prev,
        bannedPhrases: [...prev.bannedPhrases, token]
      }));
    }
    setCustomBannedInput('');
  };

  const addCustomHobby = () => {
    if (!customHobbyInput.trim()) return;
    const val = customHobbyInput.trim();
    if (!state.hobbies.includes(val)) {
      setState(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, val]
      }));
    }
    setCustomHobbyInput('');
  };

  const startInitialization = () => {
    setIsInitializing(true);
    const stages = [
      { p: 25, label: "Vectorizing founder persona & turning point..." },
      { p: 55, label: "Weaving personal hobbies & analogies into tone..." },
      { p: 85, label: "Calibrating 3 content pillars & anti-AI filters..." },
      { p: 100, label: "Ready. Soup agent online." }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < stages.length) {
        setInitProgress(stages[i].p);
        setInitStageText(stages[i].label);
        i++;
      } else {
        clearInterval(interval);
        setInitComplete(true);
      }
    }, 550);
  };

  return (
    <div className="onboarding-root relative min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-8 overflow-x-hidden selection:bg-[#FAD02C] selection:text-slate-900">
      {/* Ambient Canary & Daylight Blurs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden flex items-center justify-center">
        <div 
          className="ambient-orb absolute -top-40 -left-32 w-[650px] h-[650px] bg-amber-100/40 rounded-full blur-[140px] transition-transform duration-700 ease-out" 
          style={{ transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0)` }}
        />
        <div 
          className="ambient-orb absolute -bottom-48 -right-32 w-[600px] h-[600px] bg-yellow-200/30 rounded-full blur-[160px] transition-transform duration-700 ease-out" 
          style={{ transform: `translate3d(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px, 0)` }}
        />
        <div 
          className="cursor-ambient-spotlight absolute w-[520px] h-[520px] rounded-full blur-[120px] opacity-75 transition-transform duration-300 ease-out" 
          style={{ 
            background: 'radial-gradient(circle, rgba(250, 208, 44, 0.42) 0%, rgba(254, 240, 138, 0.22) 45%, transparent 75%)',
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[820px] mx-auto flex flex-col justify-center my-auto">
        {!isInitializing ? (
          <div className="w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80 flex flex-col">
            {/* Stable Header with 3s title wipe */}
            <CardHeader 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
              stepTitle={stepTitles[currentStep]}
            />

            {/* Inner Step Content (No headings or subheadings inside, starts straight with fields) */}
            <div className="px-6 sm:px-9 py-6 sm:py-7">
              <div key={currentStep} className="animate-step-content flex flex-col gap-6">

                {/* STEP 1: You, Your Role & Hobbies */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="input-fullname">
                        Your Full Name <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        id="input-fullname"
                        type="text"
                        value={state.fullName}
                        onChange={e => setState({ ...state, fullName: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl frosted-input text-slate-900 font-medium placeholder:text-slate-400 outline-none text-sm"
                        placeholder="e.g. Arjun Vance"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        What best describes your role? <span className="text-amber-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'Founder / Co-founder',
                          'Technical Architect / CTO',
                          'Independent Builder',
                          'Consultant / Advisor',
                          'Executive / Operator'
                        ].map(r => {
                          const isSelected = state.role === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setState({ ...state, role: r })}
                              className={`selection-chip p-3 rounded-xl text-left border text-xs sm:text-xs font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Your core background & strengths
                        </label>
                        <span className="text-[11px] text-slate-400">Multi-select</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Engineering / AI',
                          'Product Architecture',
                          'Supply Chain / Ops',
                          'Growth & Marketing',
                          'Fundraising & Capital',
                          'Design & Polish',
                          'Culture & Hiring'
                        ].map(exp => {
                          const isSelected = state.expertise.includes(exp);
                          return (
                            <button
                              key={exp}
                              type="button"
                              onClick={() => toggleArrayItem('expertise', exp)}
                              className={`selection-chip px-3 py-2 rounded-xl text-xs border font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              {exp}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hobbies & Passions (Powers the Human Metaphor Engine) */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Heart size={13} className="text-amber-500 fill-amber-500" />
                          <span>What do you nerd out on outside of work?</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Personal Analogies</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Pick a few hobbies. Soup weaves these real-life analogies into your posts so you sound human, relatable, and authentic.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {[
                          'Chess & Strategy',
                          'Marathon running',
                          'Specialty Coffee',
                          'Sci-Fi & Cyberpunk',
                          'Mechanical Keyboards',
                          'Electronic Music',
                          'Photography',
                          'Philosophy / Books'
                        ].map(h => {
                          const isSelected = state.hobbies.includes(h);
                          return (
                            <button
                              key={h}
                              type="button"
                              onClick={() => toggleArrayItem('hobbies', h)}
                              className={`selection-chip px-3 py-1.5 rounded-xl text-xs border font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              {h}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={customHobbyInput}
                          onChange={e => setCustomHobbyInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomHobby())}
                          className="flex-1 h-9 px-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs"
                          placeholder="Add another hobby or obsession (e.g. Sailing, Cycling, Gaming)..."
                        />
                        <button
                          type="button"
                          onClick={addCustomHobby}
                          className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <Plus size={13} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Company, Links & Turning Point */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="input-entity-name">
                        Company or Project Name <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        id="input-entity-name"
                        type="text"
                        value={state.entityName}
                        onChange={e => setState({ ...state, entityName: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl frosted-input text-slate-900 font-medium placeholder:text-slate-400 outline-none text-sm"
                        placeholder="e.g. AgentScale"
                      />
                    </div>

                    {/* Dynamic Multiple Links */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Link2 size={13} className="text-slate-500" />
                          <span>Public Links & Social Footprint</span>
                        </label>
                        <button 
                          type="button"
                          onClick={addLinkRow}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
                        >
                          <Plus size={13} />
                          <span>Add another link</span>
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        {state.links.map(lnk => (
                          <div key={lnk.id} className="flex items-center gap-2">
                            <select
                              value={lnk.type}
                              onChange={e => handleLinkChange(lnk.id, 'type', e.target.value)}
                              className="h-10 px-3 rounded-xl bg-white/90 border border-slate-200 text-slate-700 text-xs font-semibold outline-none shrink-0"
                            >
                              <option value="Website">Website</option>
                              <option value="X / Twitter">X / Twitter</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="GitHub">GitHub</option>
                              <option value="Substack">Substack</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Other">Other</option>
                            </select>
                            <input 
                              type="url"
                              value={lnk.url}
                              onChange={e => handleLinkChange(lnk.id, 'url', e.target.value)}
                              className="flex-1 h-10 px-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs"
                              placeholder={`URL for ${lnk.type}...`}
                            />
                            {state.links.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkRow(lnk.id)}
                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition-colors shrink-0"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="text-mission">
                        What does your company do? (In 1 simple sentence) <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-mission"
                        rows={2}
                        value={state.mission}
                        onChange={e => setState({ ...state, mission: e.target.value })}
                        className="w-full p-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs leading-relaxed"
                        placeholder="e.g. Distributed observability and trace debugger for multi-agent LLM systems in production."
                      />
                    </div>

                    {/* The Turning Point */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="text-turning-point">
                          The Turning Point <span className="text-amber-500">*</span>
                        </label>
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Story Anchor
                        </span>
                      </div>
                      <textarea 
                        id="text-turning-point"
                        rows={3}
                        value={state.turningPoint}
                        onChange={e => setState({ ...state, turningPoint: e.target.value })}
                        className="w-full p-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs leading-relaxed"
                        placeholder="What frustrating breakdown, painful failure, or broken tool made you say 'I have to build this myself'?"
                      />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Audiences bond over the struggle that started your company. Soup uses this turning point to build emotional tension in your stories.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3: Unpopular Opinions & Brand Persona */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="text-unpopular">
                        Your Unpopular Opinion <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-unpopular"
                        rows={2}
                        value={state.unpopularOpinion}
                        onChange={e => setState({ ...state, unpopularOpinion: e.target.value })}
                        className="w-full p-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs leading-relaxed"
                        placeholder="What is one belief or 'best practice' in your space that you think is completely wrong?"
                      />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        This sparks your weekly contrarian teardown posts.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        How do you want your content to feel? <span className="text-amber-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: 'The Builder (Share the Work)',
                            tag: 'Transparent',
                            desc: 'Shares real numbers, metrics, bugs, and behind-the-scenes engineering.'
                          },
                          {
                            id: 'The Visionary (Challenge Dogma)',
                            tag: 'Big Picture',
                            desc: 'Challenges legacy players, introduces new philosophies, and thinks in paradigm shifts.'
                          },
                          {
                            id: 'The Practical Guide (Actionable)',
                            tag: 'Tactical',
                            desc: 'Step-by-step systems, architecture diagrams, zero fluff, how-to teardowns.'
                          }
                        ].map(arch => {
                          const isSelected = state.brandStyle === arch.id;
                          return (
                            <button
                              key={arch.id}
                              type="button"
                              onClick={() => setState({ ...state, brandStyle: arch.id })}
                              className={`selection-card p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                                isSelected ? 'active' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-2">
                                  {arch.tag}
                                </span>
                                <h3 className="text-xs font-bold text-slate-900 mb-1">{arch.id}</h3>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{arch.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Who You’re Building For & Pet Peeves */}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Who are you building for? <span className="text-amber-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {[
                          'Staff Backend Engineers & AI Leads',
                          'Seed & Series A Venture Investors',
                          'Enterprise Buyers & CTOs',
                          'Independent Developers & Builders',
                          'Direct Consumers & Enthusiasts'
                        ].map(aud => {
                          const isSelected = state.audience === aud;
                          return (
                            <button
                              key={aud}
                              type="button"
                              onClick={() => setState({ ...state, audience: aud })}
                              className={`selection-chip px-3 py-2 rounded-xl text-xs border font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              {aud}
                            </button>
                          );
                        })}
                      </div>
                      <input 
                        type="text"
                        value={state.audience}
                        onChange={e => setState({ ...state, audience: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl frosted-input text-slate-900 font-medium placeholder:text-slate-400 outline-none text-xs"
                        placeholder="Or type custom audience profile..."
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          What annoys your audience about existing tools or posts?
                        </label>
                        <span className="text-[11px] text-slate-400">Multi-select</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Communities bond over shared pet peeves. Soup will frame your solutions around these pain points.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Hollow AI wrapper marketing',
                          'Vendor lock-in & punitive licensing',
                          'Unverified latency benchmarks',
                          'Corporate greenwashing & fluff',
                          'Over-engineered bloatware',
                          'Synthetic LinkedIn platitudes',
                          'Gatekept open-source features'
                        ].map(annoyance => {
                          const isSelected = state.annoyances.includes(annoyance);
                          return (
                            <button
                              key={annoyance}
                              type="button"
                              onClick={() => toggleArrayItem('annoyances', annoyance)}
                              className={`selection-chip px-3 py-2 rounded-xl text-xs border font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              {annoyance}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Words You Hate & Real Things to Share */}
                {currentStep === 5 && (
                  <div className="flex flex-col gap-5">
                    {/* Banned Words */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <ShieldAlert size={13} className="text-rose-500" />
                          <span>Words you hate (AI Cliches to Avoid)</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Auto-Reject Filter</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Any post containing these words will be rejected by our automated filter before you see it.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {state.bannedPhrases.map(phrase => (
                          <span 
                            key={phrase}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
                          >
                            <span>"{phrase}"</span>
                            <button 
                              type="button"
                              onClick={() => toggleArrayItem('bannedPhrases', phrase)}
                              className="hover:text-rose-950 text-rose-500"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={customBannedInput}
                          onChange={e => setCustomBannedInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomBanned())}
                          className="flex-1 h-9 px-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs"
                          placeholder="Add phrase to ban (e.g. 'game-changer', 'synergy')..."
                        />
                        <button
                          type="button"
                          onClick={addCustomBanned}
                          className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <Plus size={13} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Real Things to Share */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Real things you can share from your camera roll or laptop
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Visual Prompts</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Soup pairs every weekly post with one of these real assets instead of generic stock images.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { label: 'Terminal screenshots & trace logs', icon: Terminal },
                          { label: 'Whiteboard architecture sketches', icon: FileText },
                          { label: 'Raw voice notes & unscripted brain dumps', icon: Zap },
                          { label: 'Candid workstation / lab photos', icon: Camera },
                          { label: 'Redacted Slack wins & customer receipts', icon: FileText },
                          { label: 'Loom / informal selfie video clips', icon: Camera }
                        ].map(asset => {
                          const isSelected = state.realAssets.includes(asset.label);
                          const IconComp = asset.icon;
                          return (
                            <button
                              key={asset.label}
                              type="button"
                              onClick={() => toggleArrayItem('realAssets', asset.label)}
                              className={`selection-chip p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              <IconComp size={14} className={isSelected ? 'text-slate-950' : 'text-slate-400'} />
                              <span className="flex-1">{asset.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Channels */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Where do you want to publish?
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {['LinkedIn', 'X / Twitter', 'Substack / Newsletter', 'YouTube'].map(plat => {
                          const isSelected = state.platforms.includes(plat);
                          return (
                            <button
                              key={plat}
                              type="button"
                              onClick={() => toggleArrayItem('platforms', plat)}
                              className={`selection-chip px-3 py-2 rounded-xl text-xs border font-medium ${
                                isSelected ? 'active font-bold text-slate-950' : 'bg-white/80 border-slate-200/90 text-slate-600'
                              }`}
                            >
                              {plat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Stable Footer: Clean, balanced alignment, no weird cuts or floating badges */}
            <div className="px-6 sm:px-9 py-4 border-t border-slate-200/70 bg-white/70 backdrop-blur-md flex items-center justify-between select-none">
              <div>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(currentStep - 1)}
                    className="h-10 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-all border border-slate-200 shadow-2xs text-xs font-semibold active:scale-95"
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    2-minute founder intake
                  </span>
                )}
              </div>

              <div>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => goToStep(currentStep + 1)}
                    className="h-10 px-6 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider shadow-apple-btn active:scale-95 transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight size={15} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startInitialization}
                    className="h-10 px-6 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider shadow-apple-btn active:scale-95 transition-all"
                  >
                    <span>Complete Intake</span>
                    <Sparkles size={15} className="stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* INITIALIZATION REVEAL MODAL */
          <div className="w-full max-w-md mx-auto frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80 text-center flex flex-col items-center">
            <CardHeader currentStep={5} totalSteps={totalSteps} stepTitle="Calibrating Soup Intelligence..." />
            <div className="p-8 md:p-10 w-full flex flex-col items-center">
              <div className="w-20 h-20 relative mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#FAD02C]/30 blur-xl animate-ping" />
                <div className="w-16 h-16 rounded-full bg-white border border-slate-200/80 shadow-apple-card flex items-center justify-center relative">
                  <Sparkles className="w-7 h-7 text-[#FAD02C] animate-pulse" />
                </div>
              </div>

              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FAD02C]" />
                Intelligence Calibrated
              </span>

              <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight mb-2">
                Setting up your Command Center...
              </h2>
              <p className="text-slate-500 font-normal text-xs mb-6 leading-relaxed">
                Weaving your turning point, unpopular takes, and personal analogies into a sustainable weekly content calendar.
              </p>

              {/* Progress bar */}
              <div className="w-full flex flex-col gap-2 mb-6">
                <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                  <div 
                    className="h-full bg-[#FAD02C] transition-all duration-500 ease-out" 
                    style={{ width: `${initProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="truncate pr-2">{initStageText}</span>
                  <span>{initProgress}%</span>
                </div>
              </div>

              <button 
                type="button"
                disabled={!initComplete}
                onClick={() => onComplete && onComplete(state)}
                className={`w-full h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-apple-subtle flex items-center justify-center gap-2 ${
                  initComplete ? 'active:scale-[0.98]' : 'opacity-40 pointer-events-none'
                }`}
              >
                <span>Enter Command Center</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
