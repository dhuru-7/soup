import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

function CardHeader({ currentStep, totalSteps = 6 }) {
  const circumference = 56.548;
  const strokeOffset = circumference - (currentStep / totalSteps) * circumference;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-white/70 backdrop-blur-md px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200/80 relative select-none">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="font-heading text-[15px] font-bold text-slate-900 tracking-tight">
          Soup
        </span>
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

      {/* Hairline Progress Track along the bottom edge of the card header */}
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
  const totalSteps = 6;
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initStageText, setInitStageText] = useState('Indexing vocabulary...');
  const [initComplete, setInitComplete] = useState(false);

  // Mouse ambient spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Form State
  const [state, setState] = useState({
    fullName: initialProfile?.identity?.name || 'Elena Rostova',
    role: 'founder',
    entityName: initialProfile?.identity?.company_name || 'Prism Dynamics',
    url: 'https://prismdynamics.io',
    mission: initialProfile?.identity?.mission || 'We build high-throughput telemetry pipelines for edge robotics and autonomous systems.',
    stage: 'mvp',
    personalRole: initialProfile?.identity?.role || 'CEO & System Architect leading product engineering.',
    expertise: ['product', 'ai'],
    audience: initialProfile?.domain_radar?.target_audience?.join(', ') || 'Technical founders and VP Engineering teams in robotics.',
    problems: 'Eliminating latency bottlenecks and synchronization drops under peak loads.',
    segment: 'Industrial automation and warehouse robotics',
    clarity: 'sharp',
    goal: 'Build a reputation as a builder',
    horizon: '3 months',
    commitment: '3–5 hours',
    platforms: ['X / Twitter', 'LinkedIn'],
    topics: ['My founder journey', 'Technology and innovation'],
    stories: ['How I started', 'Lessons from experience', 'Behind the scenes'],
    outcomes: ['Build in public', 'Industry insights'],
    formats: ['Text posts', 'Carousels'],
    tones: ['Analytical', 'Direct']
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

  // Enter key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (e.target.tagName.toLowerCase() === 'textarea') return;
        e.preventDefault();
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        } else if (currentStep === totalSteps && !isInitializing) {
          startInitialization();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isInitializing]);

  const toggleArrayItem = (key, item, max = null) => {
    setState(prev => {
      const list = [...prev[key]];
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

  const startInitialization = () => {
    setIsInitializing(true);
    const stages = [
      { p: 25, label: "Vectorizing founder profile & presence..." },
      { p: 55, label: "Synthesizing audience positioning..." },
      { p: 85, label: "Calibrating tone signature & platform rules..." },
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
    <div className="onboarding-root relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-x-hidden selection:bg-[#FAD02C] selection:text-slate-900">
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

      <div className="relative z-10 w-full max-w-[1080px] mx-auto flex flex-col justify-center my-auto">
        {/* Dynamic Content Viewport Keyed by currentStep for smooth fade-in */}
        <div key={currentStep} className="animate-fade-in relative w-full flex-1 flex flex-col justify-center">
          {/* STEP 1: Let's start with you */}
          {currentStep === 1 && !isInitializing && (
            <section className="step-panel w-full">
              <div className="max-w-2xl mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80">
                <CardHeader currentStep={1} totalSteps={totalSteps} />
                
                <div className="p-7 sm:p-9 md:p-10">
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Let’s start with you</h1>
                  <p className="text-slate-600 text-sm mb-6 sm:mb-8 leading-relaxed">Tell us who is behind the helm to calibrate voice and tone parameters.</p>
                  
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800" htmlFor="input-fullname">
                        Full Name <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        id="input-fullname"
                        type="text"
                        value={state.fullName}
                        onChange={e => setState({ ...state, fullName: e.target.value })}
                        className="w-full h-13 px-4 py-3 rounded-2xl frosted-input text-slate-900 font-medium placeholder:text-slate-400 outline-none text-base"
                        placeholder="e.g. Elena Rostova"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-800">What best describes your role? <span className="text-amber-500">*</span></label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'founder', label: 'Founder / Co-founder' },
                          { id: 'builder', label: 'Independent builder' },
                          { id: 'consultant', label: 'Consultant / Advisor' },
                          { id: 'creator', label: 'Creator / Author' },
                          { id: 'operator', label: 'Executive / Other' },
                        ].map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setState({ ...state, role: r.id })}
                            className={`selection-card p-4 rounded-2xl bg-white/70 border border-slate-200/80 flex flex-col gap-1.5 text-left transition-colors ${
                              state.role === r.id ? 'active' : ''
                            }`}
                          >
                            <span className="text-sm font-bold text-slate-900">{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono shadow-xs">↵ Enter</span>
                        <span>to advance</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => goToStep(2)}
                        className="w-12 h-12 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors shadow-apple-btn active:scale-95"
                      >
                        <ArrowRight size={20} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 2: Entity & Online Presence */}
          {currentStep === 2 && !isInitializing && (
            <section className="step-panel w-full">
              <div className="max-w-2xl mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80">
                <CardHeader currentStep={2} totalSteps={totalSteps} />

                <div className="p-7 sm:p-9 md:p-10">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Entity & Online Presence</h2>
                  <p className="text-slate-600 text-[15px] mb-6 sm:mb-8 leading-relaxed">Anchor your AI assistant to your public ecosystem or venture footprint.</p>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800" htmlFor="input-entity-name">
                        Company, product, or project name <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        id="input-entity-name"
                        type="text"
                        value={state.entityName}
                        onChange={e => setState({ ...state, entityName: e.target.value })}
                        className="w-full h-13 px-4 py-3 rounded-2xl frosted-input text-slate-900 font-medium placeholder:text-slate-400 outline-none text-base"
                        placeholder="e.g. Prism Dynamics"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-800" htmlFor="input-url">Website or public profile URL</label>
                        <span className="text-xs font-semibold text-slate-400">Optional</span>
                      </div>
                      <input 
                        id="input-url"
                        type="url"
                        value={state.url}
                        onChange={e => setState({ ...state, url: e.target.value })}
                        className="w-full h-13 px-4 py-3 rounded-2xl frosted-input text-slate-900 font-medium placeholder:text-slate-400 outline-none text-base"
                        placeholder="https://prismdynamics.io or linkedin.com/in/elena"
                      />
                      <p className="text-slate-500 text-xs mt-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/50 leading-relaxed">
                        A company website, LinkedIn profile, or another public page helps the agent research your existing positioning. You can skip this.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                      <button 
                        type="button" 
                        onClick={() => goToStep(1)}
                        className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors border border-slate-200/80 shadow-xs"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => goToStep(3)}
                        className="w-12 h-12 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors shadow-apple-btn active:scale-95"
                      >
                        <ArrowRight size={20} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3: Understand your work */}
          {currentStep === 3 && !isInitializing && (
            <section className="step-panel w-full">
              <div className="max-w-3xl mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80">
                <CardHeader currentStep={3} totalSteps={totalSteps} />

                <div className="p-7 sm:p-9 md:p-10 max-h-[780px] overflow-y-auto">
                  <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-1">Understand your work</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">Tell us enough to identify your domain, experience, and useful areas of expertise.</p>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800" htmlFor="text-work-mission">
                        What does your company or project do? <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-work-mission"
                        rows={2}
                        value={state.mission}
                        onChange={e => setState({ ...state, mission: e.target.value })}
                        className="w-full p-3.5 rounded-2xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-sm leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-800">What stage are you at? <span className="text-amber-500">*</span></label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {[
                          { id: 'idea', label: 'Idea / validating' },
                          { id: 'mvp', label: 'MVP / first version' },
                          { id: 'early', label: 'Early traction' },
                          { id: 'scaling', label: 'Growing / scaling' },
                          { id: 'established', label: 'Established' }
                        ].map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setState({ ...state, stage: s.id })}
                            className={`selection-card p-3 rounded-2xl bg-white/70 border border-slate-200/80 text-center transition-colors ${
                              state.stage === s.id ? 'active' : ''
                            }`}
                          >
                            <span className="text-xs font-semibold text-slate-900">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800" htmlFor="text-personal-role">
                        What is your personal role in the business? <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-personal-role"
                        rows={2}
                        value={state.personalRole}
                        onChange={e => setState({ ...state, personalRole: e.target.value })}
                        className="w-full p-3.5 rounded-2xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-sm leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-800">Where do you have useful expertise?</label>
                        <span className="text-xs font-semibold text-slate-400">Multi-select</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'product', label: 'Product building' },
                          { id: 'ai', label: 'Engineering / AI' },
                          { id: 'growth', label: 'Sales & growth' },
                          { id: 'brand', label: 'Marketing / brand' },
                          { id: 'fundraising', label: 'Fundraising' },
                          { id: 'hiring', label: 'Leadership / hiring' },
                          { id: 'industry', label: 'Industry expertise' },
                          { id: 'operations', label: 'Operations' }
                        ].map(exp => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => toggleArrayItem('expertise', exp.id)}
                            className={`selection-card px-3.5 py-2.5 rounded-2xl bg-white/70 border border-slate-200/80 flex items-center justify-center text-center transition-colors ${
                              state.expertise.includes(exp.id) ? 'active' : ''
                            }`}
                          >
                            <span className="text-xs font-semibold text-slate-800">{exp.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                      <button 
                        type="button" 
                        onClick={() => goToStep(2)}
                        className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors border border-slate-200/80 shadow-xs"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => goToStep(4)}
                        className="w-12 h-12 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors shadow-apple-btn active:scale-95"
                      >
                        <ArrowRight size={20} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 4: Your positioning starts with your audience */}
          {currentStep === 4 && !isInitializing && (
            <section className="step-panel w-full">
              <div className="max-w-3xl mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80">
                <CardHeader currentStep={4} totalSteps={totalSteps} />

                <div className="p-7 sm:p-9 md:p-10 max-h-[780px] overflow-y-auto">
                  <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-1">Your positioning starts with your audience</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">Be specific about the people you want to help, not just the industry you work in.</p>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800" htmlFor="text-audience">
                        1. Who is your target audience? <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-audience"
                        rows={2}
                        value={state.audience}
                        onChange={e => setState({ ...state, audience: e.target.value })}
                        className="w-full p-3.5 rounded-2xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-sm leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800" htmlFor="text-problems">
                        2. What problems can you help them solve? <span className="text-amber-500">*</span>
                      </label>
                      <textarea 
                        id="text-problems"
                        rows={2}
                        value={state.problems}
                        onChange={e => setState({ ...state, problems: e.target.value })}
                        className="w-full p-3.5 rounded-2xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-sm leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-800" htmlFor="input-segment">3. Which specific segment should you prioritize?</label>
                        <span className="text-xs font-semibold text-slate-400">Optional</span>
                      </div>
                      <input 
                        id="input-segment"
                        type="text"
                        value={state.segment}
                        onChange={e => setState({ ...state, segment: e.target.value })}
                        className="w-full h-12 px-4 rounded-2xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-800">4. How clearly defined is your audience today?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'sharp', label: 'I know exactly who I want to reach' },
                          { id: 'hypothesis', label: 'I have a hypothesis to test' },
                          { id: 'exploring', label: "I'm still figuring it out" }
                        ].map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setState({ ...state, clarity: c.id })}
                            className={`selection-card p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 text-left transition-colors ${
                              state.clarity === c.id ? 'active' : ''
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900 block">{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                      <button 
                        type="button" 
                        onClick={() => goToStep(3)}
                        className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors border border-slate-200/80 shadow-xs"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => goToStep(5)}
                        className="w-12 h-12 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors shadow-apple-btn active:scale-95"
                      >
                        <ArrowRight size={20} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 5: What do you want to achieve? */}
          {currentStep === 5 && !isInitializing && (
            <section className="step-panel w-full">
              <div className="max-w-5xl mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80">
                <CardHeader currentStep={5} totalSteps={totalSteps} />

                <div className="p-6 sm:p-8 md:p-10 max-h-[780px] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      <div>
                        <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-1">What do you want to achieve?</h2>
                        <p className="text-slate-600 text-sm mb-6">Choose one primary goal. One clear priority makes the initial strategy more focused.</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-800">1. Primary goal? <span className="text-amber-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { id: 'Build personal authority', desc: 'Earn recognized industry weight' },
                            { id: 'Generate inbound leads', desc: 'Attract qualified buyers' },
                            { id: 'Attract investors or partners', desc: 'Signal shipping velocity' },
                            { id: 'Get speaking opportunities', desc: 'Keynotes & podcast invites' },
                            { id: 'Grow a relevant community', desc: 'Nurture advocates and peers' },
                            { id: 'Increase company/product visibility', desc: 'Amplify overall market awareness' },
                            { id: 'Build a reputation as a builder', desc: 'Show ship speed & architecture' }
                          ].map(g => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setState({ ...state, goal: g.id })}
                              className={`selection-card p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 text-left transition-colors ${
                                state.goal === g.id ? 'active' : ''
                              }`}
                            >
                              <div className="text-xs font-bold text-slate-900">{g.id}</div>
                              <div className="text-[11px] text-slate-500">{g.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-800">2. Planning horizon? <span className="text-amber-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {['3 months', '6 months'].map(h => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setState({ ...state, horizon: h })}
                              className={`selection-card p-3 rounded-2xl bg-white/70 border border-slate-200/80 text-left transition-colors ${
                                state.horizon === h ? 'active' : ''
                              }`}
                            >
                              <span className="text-xs font-bold text-slate-900">{h}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-800">3. Platforms to use? <span className="text-amber-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {['X / Twitter', 'LinkedIn', 'YouTube', 'Substack / Newsletter', 'Instagram / TikTok', 'Podcasts'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => toggleArrayItem('platforms', p)}
                              className={`selection-card px-3.5 py-2 rounded-2xl bg-white/70 border border-slate-200/80 text-xs font-bold transition-colors ${
                                state.platforms.includes(p) ? 'active' : 'text-slate-700'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-800">4. Weekly time commitment? <span className="text-amber-500">*</span></label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['1–2 hours', '3–5 hours', '6–10 hours', '10+ hours'].map(hrs => (
                            <button
                              key={hrs}
                              type="button"
                              onClick={() => setState({ ...state, commitment: hrs })}
                              className={`selection-card py-2.5 px-3 rounded-2xl bg-white/70 border border-slate-200/80 text-center text-xs font-bold transition-colors ${
                                state.commitment === hrs ? 'active' : 'text-slate-800'
                              }`}
                            >
                              {hrs}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                        <button 
                          type="button" 
                          onClick={() => goToStep(4)}
                          className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors border border-slate-200/80 shadow-xs"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => goToStep(6)}
                          className="w-12 h-12 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors shadow-apple-btn active:scale-95"
                        >
                          <ArrowRight size={20} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Right Summary Live Box */}
                    <div className="lg:col-span-4 bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                      <div className="flex flex-col gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                          Target Blueprint
                        </span>
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Core Goal</span>
                            <span className="text-xs font-bold text-slate-900">{state.goal}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Horizon</span>
                            <span className="text-xs font-bold text-slate-900">{state.horizon}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Weekly Time</span>
                            <span className="text-xs font-bold text-slate-900">{state.commitment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 6: Discover your content identity */}
          {currentStep === 6 && !isInitializing && (
            <section className="step-panel w-full">
              <div className="max-w-5xl mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80">
                <CardHeader currentStep={6} totalSteps={totalSteps} />

                <div className="p-6 sm:p-8 md:p-10 max-h-[780px] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      <div>
                        <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-1">Discover your content identity</h2>
                        <p className="text-slate-600 text-sm mb-6">Short phrases are enough to start; the agent will organically calibrate.</p>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-800">1. What do you enjoy talking about?</label>
                          <span className="text-xs font-semibold text-slate-400">Multi-select</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'My founder journey', 'Teaching & explaining', 'Technology & innovation',
                            'Helping people solve problems', 'Business & entrepreneurship', 'Personal development',
                            'Industry debates', 'Experiments & learning'
                          ].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleArrayItem('topics', t)}
                              className={`selection-card px-3.5 py-1.5 rounded-2xl bg-white/70 border border-slate-200/80 text-xs font-bold transition-colors ${
                                state.topics.includes(t) ? 'active' : 'text-slate-800'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stories */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-800">2. Stories you are comfortable sharing?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['How I started', 'Failures & setbacks', 'Lessons from experience', 'Turning points', 'Behind the scenes', 'Beliefs & values'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleArrayItem('stories', s)}
                              className={`selection-card p-2.5 rounded-2xl bg-white/70 border border-slate-200/80 text-left text-xs font-bold transition-colors ${
                                state.stories.includes(s) ? 'active' : 'text-slate-800'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Formats */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-800">3. Preferred Formats</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['Text posts', 'Carousels', 'Short videos', 'Long-form videos', 'Newsletters', 'Audio'].map(f => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => toggleArrayItem('formats', f)}
                              className={`selection-card p-2.5 rounded-2xl bg-white/70 border border-slate-200/80 text-left text-xs font-bold transition-colors ${
                                state.formats.includes(f) ? 'active' : 'text-slate-800'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tone Traits */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-800">4. Tone traits (up to 3)</label>
                          <span className="text-xs font-semibold text-slate-400">{state.tones.length} / max 3</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Conversational', 'Analytical', 'Practical', 'Opinionated', 'Storytelling', 'Educational', 'Direct', 'Reflective'].map(tone => (
                            <button
                              key={tone}
                              type="button"
                              onClick={() => toggleArrayItem('tones', tone, 3)}
                              className={`selection-card px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 text-xs font-bold transition-colors ${
                                state.tones.includes(tone) ? 'active' : 'text-slate-800'
                              }`}
                            >
                              {tone}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                        <button 
                          type="button" 
                          onClick={() => goToStep(5)}
                          className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors border border-slate-200/80 shadow-xs"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <button 
                          type="button"
                          onClick={startInitialization}
                          className="px-7 h-12 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 flex items-center gap-2 text-sm font-bold shadow-apple-btn active:scale-95 transition-colors"
                        >
                          <span>Complete Onboarding</span>
                          <Check size={18} className="stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    {/* Right Live Emerging Profile Card */}
                    <div className="lg:col-span-4 bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Emerging Creator Profile
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FAD02C] animate-ping" />
                        </div>

                        {/* Vector resonance graphic */}
                        <div className="w-full h-28 rounded-2xl bg-white border border-slate-200/70 flex items-center justify-center p-3 relative overflow-hidden">
                          <svg className="w-full h-full opacity-80" fill="none" stroke="currentColor" viewBox="0 0 200 90">
                            <circle cx="35" cy="45" r="24" stroke="#94A3B8" strokeDasharray="2 2" strokeWidth="1" />
                            <circle cx="100" cy="45" r="32" stroke="#FAD02C" strokeWidth="2.5" />
                            <circle cx="165" cy="45" r="24" stroke="#0F172A" strokeDasharray="3 3" strokeWidth="1" />
                            <path d="M35 45 Q100 15 165 45" fill="none" stroke="#FAD02C" strokeWidth="2.5" />
                            <path d="M35 45 Q100 75 165 45" fill="none" stroke="#0F172A" strokeWidth="1" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[9px] uppercase tracking-widest text-slate-700 font-mono font-bold bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
                              Identity Resonance
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tone Signature</span>
                            <div className="flex flex-wrap gap-1">
                              {state.tones.map(t => (
                                <span key={t} className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-800">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Pillar Topics</span>
                            <div className="flex flex-wrap gap-1">
                              {state.topics.map(top => (
                                <span key={top} className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-slate-900">
                                  {top}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Selected Formats</span>
                            <div className="flex flex-wrap gap-1">
                              {state.formats.map(fmt => (
                                <span key={fmt} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-800">
                                  {fmt}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-500 text-xs leading-relaxed pt-4 border-t border-slate-200/50">
                        Adaptive weights automatically fine-tune with each reviewed draft in your Soup command station.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* INITIALIZATION MODAL */}
          {isInitializing && (
            <section className="step-panel w-full flex items-center justify-center">
              <div className="max-w-md mx-auto w-full frosted-glass rounded-3xl shadow-apple-card relative overflow-hidden border border-slate-200/80 text-center flex flex-col items-center">
                <CardHeader currentStep={6} totalSteps={totalSteps} />
                <div className="p-8 md:p-10 w-full flex flex-col items-center">
                  <div className="w-24 h-24 relative mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#FAD02C]/30 blur-xl animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-white border border-slate-200/80 shadow-apple-card flex items-center justify-center relative">
                      <Sparkles className="w-8 h-8 text-[#FAD02C] animate-pulse" />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FAD02C]" />
                    System Live
                  </span>

                  <h2 className="font-heading text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Initializing your Soup agent...
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Synthesizing personal domain experience, tone resonance, and strategic distribution vectors into your dedicated runtime.
                  </p>

                  {/* Progress bar */}
                  <div className="w-full flex flex-col gap-2 mb-6">
                    <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                      <div 
                        className="h-full bg-[#FAD02C] transition-all duration-500 ease-out" 
                        style={{ width: `${initProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>{initStageText}</span>
                      <span>{initProgress}%</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    disabled={!initComplete}
                    onClick={() => onComplete && onComplete(state)}
                    className={`w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-apple-subtle flex items-center justify-center gap-2 ${
                      initComplete ? 'active:scale-[0.98]' : 'opacity-40 pointer-events-none'
                    }`}
                  >
                    <span>Enter Soup Terminal</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
