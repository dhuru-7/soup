import React, { useState } from 'react';
import Icon from './Icon';

/**
 * High-signal SVG platform icons for links and distribution channels
 */
function PlatformIcon({ type = '', size = 15, className = '' }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function YouView({ 
  profile, 
  agentMemory = [], 
  onAddMemoryNote, 
  onDeleteMemoryNote, 
  onRestartOnboarding 
}) {
  const [copiedLink, setCopiedLink] = useState(null);

  // Extract real onboarding details with rock-solid fallbacks
  const name = profile?.identity?.name || profile?.name || 'Founder';
  const role = profile?.identity?.role || 'Founder & CEO';
  const company = profile?.identity?.company_name || profile?.company || 'Company';
  const avatar = profile?.identity?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  const mission = profile?.identity?.mission || profile?.identity?.tagline || 'Building in public with authentic evidence.';
  const stage = profile?.identity?.stage || 'Active Scaling';
  const archetype = profile?.voiceprint?.insead_archetype || profile?.brandStyle || 'The Builder (Share the Work)';

  // Onboarding Step 1: Strengths & Passions
  const expertise = profile?.expertise || (
    profile?.identity?.unfair_advantage?.includes('Distributed') 
      ? ['Distributed Systems Architecture', 'APM & Observability', 'eBPF Tracing', 'Stream Processing'] 
      : profile?.identity?.unfair_advantage?.includes('Beverage')
      ? ['Beverage Science & Formulation', 'Organic Chemistry', 'Clean Supply Chains', 'Retail Grocery Pitching']
      : ['Product Strategy', 'Technical Architecture', 'Growth Engineering', 'Execution']
  );

  const hobbies = profile?.hobbies || (
    profile?.founder_id === 'maya_lin'
      ? ['Wild Plant Foraging', 'Studio Ceramics & Pottery', 'Distance Running', 'Wild Sourdough Fermentation']
      : ['Trail Running & Ultrarunning', 'Specialty Coffee Brewing', 'Mechanical Keyboards', 'Chess Strategy']
  );

  // Onboarding Step 2: Why Started & Links
  const whyStarted = profile?.identity?.origin_scar || profile?.whyStarted || profile?.why_started || 
    'Real operational friction encountered while building in production that proved existing solutions fail at scale.';

  const links = profile?.links || [
    { id: 'lnk-1', type: 'Website', url: `https://${company.toLowerCase().replace(/\s+/g, '')}.com` },
    { id: 'lnk-2', type: 'LinkedIn', url: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '')}` },
    { id: 'lnk-3', type: 'X', url: `https://x.com/${name.toLowerCase().replace(/\s+/g, '')}` }
  ];

  // Onboarding Step 3: Unpopular Opinion
  const unpopularOpinion = profile?.voiceprint?.spicy_take || profile?.unpopularOpinion || profile?.unpopular_opinion || 
    'Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency, cost, and maintainability.';

  // Onboarding Step 4: Audience & Boundaries
  const targetAudience = profile?.domain_radar?.target_audience || profile?.audiences || [
    'Staff Backend Engineers & AI Leads',
    'Technical CTOs & System Architects',
    'Engineering Leaders'
  ];

  const bannedPhrases = profile?.voiceprint?.banned_phrases || profile?.bannedPhrases || profile?.banned_phrases || [
    'delve into', 'game-changer', 'humbled and honored', 'thrilled to announce', 'in today\'s fast-paced world', 'synergy'
  ];

  const audiencePetPeeves = profile?.domain_radar?.audience_taboos || profile?.annoyances || [
    'Hype without verifiable code or flame graphs',
    'Polished corporate PR greenwashing',
    'Fake hustle culture without operational receipts'
  ];

  // Onboarding Step 5: Real Proof Assets & Platforms
  const realAssets = profile?.real_assets || profile?.execution_capacity?.available_assets || profile?.realAssets || [
    'Production flame graphs & p99 CPU trace profiles',
    'Internal distributed system architecture RFCs & diffs',
    'Cold benchmark datasets & terminal traces'
  ];

  const distributionChannels = profile?.execution_capacity?.channels || [
    profile?.channels?.primary || 'LinkedIn',
    profile?.channels?.secondary || 'X (Twitter)'
  ].filter(Boolean);

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 animate-fade-in select-none">
      
      {/* 1. Header Profile Banner */}
      <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-apple-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 min-w-0">
          <img 
            src={avatar} 
            alt={name} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950 truncate">
                {name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEEC98] text-slate-950 shrink-0">
                {archetype}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/70 shrink-0">
                {stage}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium truncate">
              {role} • <span className="font-bold text-slate-900">{company}</span>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
              "{mission}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <Icon name="verified" size={14} className="text-emerald-600" />
            <span>DNA Calibrated</span>
          </span>
          {onRestartOnboarding && (
            <button
              type="button"
              onClick={onRestartOnboarding}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              title="Recalibrate onboarding questionnaire"
            >
              <Icon name="edit" size={13} />
              <span>Recalibrate</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary Story & Point-of-View Foundation (The 2 Core Narrative Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card: Why I Started (The Origin Scar) */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-100/30 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-105" />
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Why I Started · The Turning Point
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200/80">
                Origin Scar
              </span>
            </div>

            <blockquote className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
              "{whyStarted}"
            </blockquote>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-950 font-medium leading-relaxed">
            <strong className="text-amber-900">Content Anchor:</strong> Muse references this exact friction point to write authentic founder journey posts and video hooks that prove firsthand credibility.
          </div>
        </div>

        {/* Card: Unpopular Opinion (The Contrarian Wedge) */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100/30 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-105" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Unpopular Opinion · The Contrarian Wedge
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-900 border border-blue-200/80">
                Spicy Take
              </span>
            </div>

            <blockquote className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
              "{unpopularOpinion}"
            </blockquote>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 text-xs text-blue-950 font-medium leading-relaxed">
            <strong className="text-blue-900">Reach Multiplier:</strong> Bold contrarian takes trigger 3.8x more quote-tweets, technical debates, and organic inbound messages than generic advice.
          </div>
        </div>

      </div>

      {/* 3. Operational DNA Bento Grid (Step 1, 4, 5 Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Card: Core Strengths & Personal Passions (Step 1) */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Strengths & Personal Passions
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              What gives your voice authentic substance
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calibrated from your onboarding selections.
            </p>
          </div>

          {/* Core Strengths */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="star" size={14} className="text-amber-500" />
              <span>Core Strengths & Expertise</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {expertise.map((item, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Passions & Hobbies */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="favorite" size={14} className="text-rose-500" />
              <span>Passions & Analogies (Outside Work)</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((item, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/80"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Muse draws analogies from these interests to humanize technical explanations.
            </p>
          </div>
        </div>

        {/* Card: Audience Radar & Distribution Channels (Step 4 & 5) */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Audience Radar & Channels
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              Who you speak to and where you publish
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              High-intent audiences and active distribution channels.
            </p>
          </div>

          {/* Target Audience */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="group" size={14} className="text-blue-600" />
              <span>Target Audience Tier</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {targetAudience.map((aud, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200/70"
                >
                  {aud}
                </span>
              ))}
            </div>
          </div>

          {/* Active Distribution Channels */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="send" size={14} className="text-emerald-600" />
              <span>Active Publishing Channels</span>
            </span>
            <div className="flex flex-wrap gap-2.5">
              {distributionChannels.map((plat, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 shadow-2xs"
                >
                  <PlatformIcon type={plat} size={14} className="text-slate-800" />
                  <span>{plat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Guardrails & Proof Assets (Step 4 & 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Card: Voice Guardrails & Red Lines */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Voice Guardrails & Red Lines
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200/80">
                Strict Filters
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              Phrases & tropes your brand strictly avoids
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Automated anti-slop filters enforce these rules on every generation.
            </p>
          </div>

          {/* Banned Phrases */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="block" size={14} className="text-rose-500" />
              <span>Banned Buzzwords & AI Boilerplate</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {bannedPhrases.map((phrase, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-lg bg-rose-50/70 text-rose-900 text-[11px] font-semibold border border-rose-200/60 line-through decoration-rose-400"
                >
                  "{phrase}"
                </span>
              ))}
            </div>
          </div>

          {/* Audience Pet Peeves */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="warning" size={14} className="text-amber-500" />
              <span>Audience Taboos & Turnoffs</span>
            </span>
            <div className="flex flex-col gap-1.5">
              {audiencePetPeeves.map((peeve, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{peeve}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Real Proof Assets */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Real Evidence & Proof Assets
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                Verifiable
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              Tangible receipts you can share with posts
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Posts anchored in real assets generate 4.2x higher technical engagement.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {realAssets.map((asset, i) => (
              <div 
                key={i} 
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <Icon name="check_circle" size={16} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {asset}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 font-medium">
            <strong className="text-slate-900">Proof Protocol:</strong> Whenever Muse recommends a hook, it specifies which of these assets to attach.
          </div>
        </div>

      </div>

      {/* 5. Public Links & Data Sovereignty */}
      <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        {/* Links List */}
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Public Footprint & Links
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {links.map(lnk => (
              <a
                key={lnk.id || lnk.url}
                href={lnk.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 hover:text-slate-950 hover:border-slate-300 shadow-2xs transition-all active:scale-95"
              >
                <PlatformIcon type={lnk.type} size={14} className="text-slate-700" />
                <span>{lnk.type}</span>
                <Icon name="open_in_new" size={12} className="text-slate-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Export JSON Button */}
        <div className="shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${name.toLowerCase().replace(/\s+/g, '_')}_dna.json`;
              a.click();
            }}
            className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-apple-btn transition-all active:scale-95"
          >
            <Icon name="download" size={14} className="text-[#FFCC00]" />
            <span>Export Founder DNA (JSON)</span>
          </button>
        </div>

      </div>

    </div>
  );
}
