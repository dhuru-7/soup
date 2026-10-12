import React, { useState, useEffect } from 'react';
import Icon from './Icon';

/**
 * High-signal SVG platform icons for public links & channels
 */
function PlatformIcon({ type = '', size = 14, className = '' }) {
  const norm = (type || '').toLowerCase();

  if (norm.includes('linkedin')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
      </svg>
    );
  }

  if (norm === 'x' || norm.includes('twitter')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }

  if (norm.includes('instagram')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );
  }

  if (norm.includes('website') || norm.includes('globe') || norm.includes('web') || norm.includes('site')) {
    return (
      <svg className={`shrink-0 stroke-current fill-none ${className}`} width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }

  if (norm.includes('youtube')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }

  if (norm.includes('github')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    );
  }

  if (norm.includes('substack') || norm.includes('newsletter')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    );
  }

  return (
    <svg className={`shrink-0 stroke-current fill-none ${className}`} width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

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

      {/* Hairline Progress Track matching continue button color (#FFCC00) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/50 overflow-hidden">
        <div 
          className="h-full bg-[#FFCC00] transition-all duration-700 ease-out" 
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

  // Clean Form State: strictly ensure NO option is pre-filled
  const [state, setState] = useState(() => ({
    fullName: '',
    role: '',
    expertise: [],
    hobbies: [],
    entityName: '',
    mission: '',
    whyStarted: '',
    links: [],
    unpopularOpinion: '',
    brandStyle: '',
    audiences: [],
    customAudience: '',
    annoyances: [],
    bannedPhrases: [],
    realAssets: [],
    platforms: []
  }));

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
    setInitProgress(0);

    const totalDuration = 1200; // 1.2s smooth fill from one end to another
    const startTime = performance.now();

    const animateProgress = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
      setInitProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        // When it fills, directly transition to homepage
        setTimeout(() => {
          if (onComplete) {
            onComplete(state);
          }
        }, 120);
      }
    };

    requestAnimationFrame(animateProgress);
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
          <>
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
                              <PlatformIcon type={lnk.type} size={14} className="text-slate-700 shrink-0" />
                              <span className="text-slate-900 font-bold">{lnk.type}:</span>
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
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="X">X</option>
                              <option value="Instagram">Instagram</option>
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
                              newLinkType === 'X' ? 'x.com/username' :
                              newLinkType === 'LinkedIn' ? 'linkedin.com/in/username' :
                              newLinkType === 'Instagram' ? 'instagram.com/username' :
                              newLinkType === 'GitHub' ? 'github.com/username' :
                              newLinkType === 'Substack' ? 'yourpublication.substack.com' :
                              newLinkType === 'YouTube' ? 'youtube.com/@channel' :
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
                          { label: 'Terminal screenshots & logs', icon: 'terminal' },
                          { label: 'Whiteboard architecture sketches', icon: 'draw' },
                          { label: 'Raw voice notes & brain dumps', icon: 'mic' },
                          { label: 'Candid workstation / lab photos', icon: 'photo_camera' },
                          { label: 'Redacted Slack wins & receipts', icon: 'chat' },
                          { label: 'Loom / informal selfie video clips', icon: 'videocam' }
                        ].map(({ label, icon }) => {
                          const isSelected = state.realAssets.includes(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => toggleArrayItem('realAssets', label)}
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] flex items-center gap-2 ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              <Icon name={icon} size={15} className={isSelected ? 'text-slate-950' : 'text-slate-500'} />
                              <span>{label}</span>
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
                        {['LinkedIn', 'X', 'Instagram', 'Substack / Newsletter', 'YouTube'].map(plat => {
                          const isSelected = state.platforms.includes(plat);
                          return (
                            <button
                              key={plat}
                              type="button"
                              onClick={() => toggleArrayItem('platforms', plat)}
                              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 select-none active:scale-[0.96] flex items-center gap-2 ${
                                isSelected 
                                  ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-semibold shadow-xs' 
                                  : 'bg-white/85 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              <PlatformIcon type={plat} size={14} className={isSelected ? 'text-slate-950' : 'text-slate-600'} />
                              <span>{plat}</span>
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
                    className="h-10 px-6 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-apple-btn active:scale-95 transition-all"
                  >
                    <span>Complete Intake</span>
                  </button>
                )}
              </div>
            </div>
            </div>
          </>
        ) : (
          /* Sleek Minimalist Transition: heading + smooth loading line */
          <div className="w-full max-w-[500px] mx-auto frosted-glass rounded-3xl shadow-apple-card border border-slate-200/80 p-8 sm:p-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2">
              Getting everything ready for you...
            </h3>
            <p className="text-xs text-slate-500 font-normal mb-6">
              Calibrating your brand voiceprint and weekly content engine.
            </p>

            <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 shadow-inner">
              <div 
                className="h-full bg-[#FFCC00] rounded-full transition-all duration-75 ease-linear shadow-xs" 
                style={{ width: `${initProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
