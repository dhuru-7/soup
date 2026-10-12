import React, { useState, useEffect } from 'react';
import Icon from './Icon';

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

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-white/80 backdrop-blur-md px-6 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200/80 relative select-none">
      {/* Brand area: 20% larger text, NO yellow dot, NO 'Step X:' prefix */}
      <div className="h-8 flex items-center overflow-hidden">
        {isWiping ? (
          <div key={`title-${currentStep}`} className="animate-header-wipe flex items-center">
            <span className="font-heading text-[18px] sm:text-[19px] font-bold text-slate-900 tracking-tight">
              {stepTitle}
            </span>
          </div>
        ) : (
          <div key="soup-brand" className="animate-header-wipe flex items-center">
            <span className="font-heading text-[19px] sm:text-[20px] font-bold text-slate-900 tracking-tight">
              Soup
            </span>
          </div>
        )}
      </div>

      {/* Hairline Progress Track along bottom edge of card header */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/50 overflow-hidden">
        <div 
          className="h-full bg-[#FEEC98] transition-all duration-700 ease-out" 
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
  const [initStageText, setInitStageText] = useState('Vectorizing founder persona & origins...');
  const [initComplete, setInitComplete] = useState(false);

  // Other hobby input state
  const [showOtherHobby, setShowOtherHobby] = useState(false);
  const [otherHobbyText, setOtherHobbyText] = useState('');

  // Add Link state (smooth expandable like hobbies 'Other...')
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLinkType, setNewLinkType] = useState('Website');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Mouse ambient spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Clean titles without 'Step X:'
  const stepTitles = {
    1: 'Your Role, Strengths & Hobbies',
    2: 'Company, Links & Why You Started',
    3: 'Unpopular Opinions & Brand Style',
    4: 'Who You’re Building For & Pet Peeves',
    5: 'Real Assets & Publishing Platforms'
  };

  // Form State with normalized default values matching pill literals
  const [state, setState] = useState({
    // Step 1: You, Role & Hobbies
    fullName: initialProfile?.identity?.name || 'Arjun Vance',
    role: 'Technical Architect / CTO',
    expertise: ['Engineering / AI', 'Product Architecture'],
    hobbies: ['Chess & Strategy', 'Specialty Coffee'],

    // Step 2: Company, Links & Why You Started
    entityName: initialProfile?.identity?.company_name || 'AgentScale',
    mission: initialProfile?.identity?.mission || 'Distributed observability and trace debugger for multi-agent LLM systems in production.',
    whyStarted: initialProfile?.identity?.origin_scar || 'Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans that cost $400/hr in cloud overruns; realized existing APMs are completely blind to autonomous agent loops.',
    links: [
      { id: 1, type: 'Website', url: 'https://agentscale.dev' },
      { id: 2, type: 'X / Twitter', url: 'https://x.com/arjun_scale' },
      { id: 3, type: 'LinkedIn', url: 'https://linkedin.com/in/arjunvance' }
    ],

    // Step 3: Unpopular Opinions & Brand Style
    unpopularOpinion: initialProfile?.voiceprint?.spicy_take || 'Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency, cost, and maintainability.',
    brandStyle: 'The Builder (Share the Work)',

    // Step 4: Audience & Pet Peeves
    audiences: ['Staff Backend Engineers & AI Leads', 'Enterprise Buyers & CTOs'],
    customAudience: '',
    annoyances: [
      'Hollow AI wrapper marketing',
      'Unverified latency benchmarks'
    ],

    // Step 5: Words to Avoid & Real Assets
    bannedPhrases: [
      'delve into',
      'game-changer',
      'thrilled to announce',
      'humbled and honored',
      'revolutionary',
      'synergy'
    ],
    realAssets: [
      'Terminal screenshots & logs',
      'Whiteboard architecture sketches'
    ],
    platforms: ['LinkedIn', 'X / Twitter']
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

  // Universal rock-solid multiselect toggle
  const toggleArrayItem = (key, item) => {
    setState(prev => {
      const currentList = Array.isArray(prev[key]) ? [...prev[key]] : [];
      const index = currentList.indexOf(item);
      if (index > -1) {
        currentList.splice(index, 1);
      } else {
        currentList.push(item);
      }
      return { ...prev, [key]: currentList };
    });
  };

  // Dynamic links handlers (expandable like hobbies 'Other...')
  const handleSaveNewLink = () => {
    let url = newLinkUrl.trim();
    if (!url) {
      setShowAddLink(false);
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    setState(prev => ({
      ...prev,
      links: [...prev.links, { id: Date.now(), type: newLinkType, url }]
    }));
    setNewLinkUrl('');
    setShowAddLink(false);
  };

  const removeLink = (id) => {
    setState(prev => ({
      ...prev,
      links: prev.links.filter(lnk => lnk.id !== id)
    }));
  };

  // Custom hobby handler
  const handleSaveOtherHobby = () => {
    if (!otherHobbyText.trim()) {
      setShowOtherHobby(false);
      return;
    }
    const val = otherHobbyText.trim();
    if (!state.hobbies.includes(val)) {
      setState(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, val]
      }));
    }
    setOtherHobbyText('');
    setShowOtherHobby(false);
  };

  const startInitialization = () => {
    setIsInitializing(true);
    const stages = [
      { p: 25, label: "Vectorizing founder persona & origins..." },
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
    <div className="onboarding-root relative min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-8 overflow-x-hidden selection:bg-[#FEEC98] selection:text-slate-900">
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
            {/* Stable Header with 3s title wipe, 20% bigger font, no yellow dot, no 'Step X:' */}
            <CardHeader 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
              stepTitle={stepTitles[currentStep]}
            />

            {/* Inner Step Content (Zero subheadings, zero icons before labels, clean pill options) */}
            <div className="px-6 sm:px-9 py-6 sm:py-7">
              <div key={currentStep} className="animate-step-content flex flex-col gap-5 sm:gap-6">

                {/* STEP 1: You, Your Role & Hobbies */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-5 sm:gap-6">
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
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
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
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
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
                          Your core strengths
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Multi-select</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
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
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              {exp}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hobbies & Passions with 'Other' expanding pill */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          What do you nerd out on outside of work?
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Personal Analogies</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
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
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              {h}
                            </button>
                          );
                        })}

                        {/* Custom Hobbies rendered as active pills */}
                        {state.hobbies
                          .filter(h => ![
                            'Chess & Strategy',
                            'Marathon running',
                            'Specialty Coffee',
                            'Sci-Fi & Cyberpunk',
                            'Mechanical Keyboards',
                            'Electronic Music',
                            'Photography',
                            'Philosophy / Books'
                          ].includes(h))
                          .map(customH => (
                            <span
                              key={customH}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#FEEC98] border border-[#F4D05F] text-slate-950 shadow-xs"
                            >
                              <span>{customH}</span>
                              <button
                                type="button"
                                onClick={() => toggleArrayItem('hobbies', customH)}
                                className="text-slate-950/70 hover:text-slate-950 flex items-center"
                              >
                                <Icon name="close" size={13} />
                              </button>
                            </span>
                          ))}

                        {/* 'Other' Pill */}
                        <button
                          type="button"
                          onClick={() => setShowOtherHobby(!showOtherHobby)}
                          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                            showOtherHobby 
                              ? 'bg-amber-100 border-amber-300 text-slate-950 font-semibold' 
                              : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                          }`}
                        >
                          Other...
                        </button>
                      </div>

                      {/* Smooth expanding input for 'Other' */}
                      {showOtherHobby && (
                        <div className="animate-fade-in flex items-center gap-2 pt-1 transition-all">
                          <input
                            type="text"
                            autoFocus
                            value={otherHobbyText}
                            onChange={e => setOtherHobbyText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSaveOtherHobby())}
                            placeholder="Type your hobby (e.g. Sailing, Cycling, Gaming)..."
                            className="flex-1 h-10 px-4 rounded-full frosted-input text-slate-900 text-xs sm:text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSaveOtherHobby}
                            className="h-10 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs active:scale-95 transition-all"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Company, Links & Why You Started */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-5 sm:gap-6">
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

                    {/* Public Links */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Public Links
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Profiles & Docs</span>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-2.5 items-center">
                        {state.links.map(lnk => {
                          const displayUrl = (lnk.url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
                          return (
                            <span
                              key={lnk.id}
                              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-white border border-slate-200/90 text-slate-800 shadow-2xs hover:border-slate-300 transition-all"
                            >
                              <span className="text-amber-600 font-bold">{lnk.type}:</span>
                              <span className="text-slate-600 truncate max-w-[140px] sm:max-w-[200px] font-medium" title={lnk.url}>
                                {displayUrl}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeLink(lnk.id)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Remove link"
                              >
                                <Icon name="close" size={13} />
                              </button>
                            </span>
                          );
                        })}

                        {/* '+ Add link' Pill (matching 'Other...' in hobbies) */}
                        <button
                          type="button"
                          onClick={() => setShowAddLink(!showAddLink)}
                          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] flex items-center gap-1.5 ${
                            showAddLink
                              ? 'bg-amber-100 border-amber-300 text-slate-950 font-semibold'
                              : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                          }`}
                        >
                          <Icon name="add" size={14} />
                          <span>Add link...</span>
                        </button>
                      </div>

                      {/* Smooth expanding drawer for adding a link */}
                      {showAddLink && (
                        <div className="animate-fade-in flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 transition-all">
                          {/* Fixed platform selection dropdown with custom chevron icon */}
                          <div className="relative shrink-0">
                            <select
                              value={newLinkType}
                              onChange={e => setNewLinkType(e.target.value)}
                              className="w-full sm:w-auto h-10 pl-4 pr-9 rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold outline-none appearance-none cursor-pointer hover:border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 shadow-2xs transition-all"
                            >
                              <option value="Website">Website</option>
                              <option value="X / Twitter">X / Twitter</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="GitHub">GitHub</option>
                              <option value="Substack">Substack</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Other">Other</option>
                            </select>
                            <Icon name="expand_more" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          </div>

                          {/* URL Input */}
                          <input
                            type="text"
                            autoFocus
                            value={newLinkUrl}
                            onChange={e => setNewLinkUrl(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSaveNewLink())}
                            placeholder={`e.g. ${
                              newLinkType === 'X / Twitter' ? 'x.com/username' :
                              newLinkType === 'LinkedIn' ? 'linkedin.com/in/username' :
                              newLinkType === 'GitHub' ? 'github.com/username' :
                              'https://yoursite.com'
                            }`}
                            className="flex-1 h-10 px-4 rounded-full frosted-input text-slate-900 text-xs sm:text-sm outline-none"
                          />

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleSaveNewLink}
                              className="h-10 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs active:scale-95 transition-all shadow-xs"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowAddLink(false); setNewLinkUrl(''); }}
                              className="h-10 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs active:scale-95 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="text-mission">
                        What does your company do? <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-mission"
                        rows={2}
                        value={state.mission}
                        onChange={e => setState({ ...state, mission: e.target.value })}
                        className="w-full p-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs sm:text-sm leading-relaxed"
                        placeholder="e.g. Distributed observability and trace debugger for multi-agent LLM systems in production."
                      />
                    </div>

                    {/* Crystal Clear: Why did you start this? */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="text-why-started">
                        Why did you start this company? <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-why-started"
                        rows={3}
                        value={state.whyStarted}
                        onChange={e => setState({ ...state, whyStarted: e.target.value })}
                        className="w-full p-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs sm:text-sm leading-relaxed"
                        placeholder="e.g. Existing tools were slow, lacked real-time traces, and cost $400/hr in cloud overruns. We wanted a 10x simpler debugger built specifically for multi-agent loops."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Unpopular Opinions & Brand Style */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="text-unpopular">
                        Your Unpopular Opinion <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-unpopular"
                        rows={2}
                        value={state.unpopularOpinion}
                        onChange={e => setState({ ...state, unpopularOpinion: e.target.value })}
                        className="w-full p-3.5 rounded-xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-xs sm:text-sm leading-relaxed"
                        placeholder="e.g. Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency, cost, and maintainability."
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        How do you want your content to feel? <span className="text-amber-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          'The Builder (Share the Work)',
                          'The Visionary (Challenge Dogma)',
                          'The Practical Guide (Actionable Teardowns)'
                        ].map(arch => {
                          const isSelected = state.brandStyle === arch;
                          return (
                            <button
                              key={arch}
                              type="button"
                              onClick={() => setState({ ...state, brandStyle: arch })}
                              className={`px-5 py-3 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              {arch}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Who You’re Building For & Pet Peeves */}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Who are you building for? <span className="text-amber-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Multi-select</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {[
                          'Staff Backend Engineers & AI Leads',
                          'Seed & Series A Venture Investors',
                          'Enterprise Buyers & CTOs',
                          'Independent Developers & Builders',
                          'Direct Consumers & Enthusiasts'
                        ].map(aud => {
                          const isSelected = state.audiences.includes(aud);
                          return (
                            <button
                              key={aud}
                              type="button"
                              onClick={() => toggleArrayItem('audiences', aud)}
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              {aud}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          What annoys your audience about existing tools or posts?
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Multi-select</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
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
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
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

                {/* STEP 5: Real Assets & Publishing Platforms */}
                {currentStep === 5 && (
                  <div className="flex flex-col gap-5 sm:gap-6">
                    {/* Real Things to Share */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Real things you can share from your camera roll or laptop
                        </label>
                        <span className="text-[11px] text-slate-400 font-normal">Multi-select</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {[
                          'Terminal screenshots & logs',
                          'Whiteboard architecture sketches',
                          'Raw voice notes & brain dumps',
                          'Candid workstation / lab photos',
                          'Redacted Slack wins & receipts',
                          'Loom / informal selfie video clips'
                        ].map(asset => {
                          const isSelected = state.realAssets.includes(asset);
                          return (
                            <button
                              key={asset}
                              type="button"
                              onClick={() => toggleArrayItem('realAssets', asset)}
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              {asset}
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
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {['LinkedIn', 'X / Twitter', 'Substack / Newsletter', 'YouTube'].map(plat => {
                          const isSelected = state.platforms.includes(plat);
                          return (
                            <button
                              key={plat}
                              type="button"
                              onClick={() => toggleArrayItem('platforms', plat)}
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
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

            {/* Stable Footer: Zero ugly labels, clean Back on left (if step > 1) and Continue on right */}
            <div className="px-6 sm:px-9 py-4 border-t border-slate-200/70 bg-white/70 backdrop-blur-md flex items-center justify-between select-none">
              <div>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(currentStep - 1)}
                    className="h-10 px-5 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-all border border-slate-200 shadow-2xs text-xs font-semibold active:scale-95"
                  >
                    <Icon name="arrow_back" size={16} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="w-1" />
                )}
              </div>

              <div>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => goToStep(currentStep + 1)}
                    className="h-10 px-6 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider shadow-apple-btn active:scale-95 transition-all"
                  >
                    <span>Continue</span>
                    <Icon name="arrow_forward" size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startInitialization}
                    className="h-10 px-6 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider shadow-apple-btn active:scale-95 transition-all"
                  >
                    <span>Complete Intake</span>
                    <Icon name="check_circle" size={16} />
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
                <div className="absolute inset-0 rounded-full bg-[#FFCC00]/30 blur-xl animate-ping" />
                <div className="w-16 h-16 rounded-full bg-white border border-slate-200/80 shadow-apple-card flex items-center justify-center relative">
                  <Icon name="smart_toy" size={28} className="text-amber-500" />
                </div>
              </div>

              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FEEC98]" />
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
                    className="h-full bg-[#FEEC98] transition-all duration-500 ease-out" 
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
