import React, { useState } from 'react';
import { 
  Calendar, Sparkles, Send, BarChart2, CheckCircle2, 
  Terminal, ArrowUpRight, Share2, UploadCloud, RefreshCw, 
  Sliders, ShieldAlert, Layers, Target, Clock, MessageSquare, 
  FileText, ExternalLink, ChevronRight, Hash, Compass
} from 'lucide-react';

export default function Dashboard({ profile, onSwitchProfile, onRestartOnboarding, currentProfileId }) {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'voiceprint' | 'dropzone' | 'goals'
  const [rawInput, setRawInput] = useState('');
  const [isProcessingAsset, setIsProcessingAsset] = useState(false);
  const [generatedAngles, setGeneratedAngles] = useState(null);

  const handleProcessAsset = () => {
    if (!rawInput.trim()) return;
    setIsProcessingAsset(true);
    setTimeout(() => {
      setGeneratedAngles([
        {
          angle_name: "The High-Proof Teardown",
          platform: profile.channels.primary,
          hook: `Most founders hide what goes wrong behind closed doors. Here is the exact friction we hit today:\n\n"${rawInput.slice(0, 95)}..."`,
          body: "Here is the raw breakdown:\n1. The unexpected breakdown.\n2. The immediate operational / architectural pivot.\n3. The exact lesson that saved our milestone.",
          visual_direction: profile.founder_id === 'arjun_vance' 
            ? "Attach dark-mode screenshot of terminal CPU flame graph or memory trace before/after fix." 
            : "Attach candid smartphone photo of the warehouse packaging floor with handwritten lab test notes.",
          follow_up_action: "Engage in comments for 45 mins; share the technical repository or lab paperwork with qualified respondents."
        },
        {
          angle_name: "The Contrarian Take",
          platform: "X (Twitter)",
          hook: `Unpopular opinion: Conventional wisdom told us to optimize the other way, but real data proved otherwise.\n\n${rawInput.slice(0, 110)}`,
          body: "Why 90% of people get this wrong: They optimize for short-term vanity over first-principles execution. Here is our benchmark.",
          visual_direction: "High-contrast 2-column comparison card (The Old Myth vs What Actually Works).",
          follow_up_action: "Quote-retweet any domain leaders who challenge the conclusion."
        },
        {
          angle_name: "The Vulnerable Founder Story",
          platform: "LinkedIn & Substack",
          hook: `This is what building a company actually looks like at 6 AM when nobody is watching.\n\n${rawInput.slice(0, 85)}`,
          body: "Building in public isn't about bragging about wins. It's about taking full accountability for the hard trade-offs that build compounding trust.",
          visual_direction: "Unfiltered photo taken in the office/production line—no corporate staging.",
          follow_up_action: "Directly message candidate applicants or prospective investors who engage."
        }
      ]);
      setIsProcessingAsset(false);
    }, 600);
  };

  return (
    <div className="dashboard-root max-w-[1240px] mx-auto w-full px-4 py-6">
      {/* Top Founder Switcher & Header Bar */}
      <div className="frosted-glass rounded-3xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-apple-subtle">
        <div className="flex items-center gap-4">
          <img 
            src={profile.identity.avatar} 
            alt={profile.identity.name} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-slate-900">{profile.identity.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAD02C] text-slate-950">
                {profile.voiceprint.insead_archetype}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {profile.identity.role} • <span className="font-bold text-slate-800">{profile.identity.company_name}</span> ({profile.identity.stage})
            </p>
          </div>
        </div>

        {/* Profile Toggle Buttons */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => onSwitchProfile('arjun_vance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentProfileId === 'arjun_vance'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arjun (AI SaaS)
          </button>
          <button
            type="button"
            onClick={() => onSwitchProfile('maya_lin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentProfileId === 'maya_lin'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maya (D2C Wellness)
          </button>
          <button
            type="button"
            onClick={onRestartOnboarding}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 hover:bg-amber-100/50 transition-all flex items-center gap-1"
          >
            <RefreshCw size={12} />
            <span>Re-Onboard</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3 overflow-x-auto">
        {[
          { id: 'calendar', label: 'Weekly Execution Calendar', icon: Calendar },
          { id: 'dropzone', label: 'Raw Brain Dump Dropzone', icon: UploadCloud },
          { id: 'voiceprint', label: 'Anti-AI Voiceprint & Pillars', icon: Sliders },
          { id: 'goals', label: 'Goal & Authority Scorecard', icon: Target },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WEEKLY CONTENT CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">7-Day Execution Calendar</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Structured with platform-native line breaks, visual briefs, and immediate post-publish playbooks.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Primary: {profile.channels.primary} • Secondary: {profile.channels.secondary}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.weekly_calendar.map((item, idx) => (
              <div 
                key={idx} 
                className="frosted-glass rounded-3xl p-6 shadow-apple-card flex flex-col justify-between border border-slate-200/80 hover:border-amber-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {item.day}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      {item.platform}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-slate-900 mb-2">
                    {item.format}
                  </h3>

                  {/* Hook Box */}
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 mb-4">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Platform Hook (Above Fold)
                    </span>
                    <p className="text-xs text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                      {item.hook}
                    </p>
                  </div>

                  {/* Visual Brief */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 flex items-center gap-1">
                      <CameraIcon size={12} />
                      Visual Direction Brief
                    </span>
                    <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      "{item.visual_direction}"
                    </p>
                  </div>
                </div>

                {/* Follow up action */}
                <div className="pt-3 border-t border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    First 60-Min Follow-up
                  </span>
                  <p className="text-[11px] text-slate-700 font-medium">
                    {item.follow_up_action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RAW ASSET DROPZONE */}
      {activeTab === 'dropzone' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Raw Brain Dump & Asset Ingestion</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Paste a messy thought, voice memo transcript, or warehouse / terminal observation. The engine turns it into 3 authentic angles.
            </p>
          </div>

          <div className="frosted-glass rounded-3xl p-6 md:p-8 shadow-apple-card border border-slate-200/80">
            <label className="text-sm font-bold text-slate-900 block mb-2" htmlFor="raw-input-textarea">
              Messy Thought / Voice Note / Sprint Win:
            </label>
            <textarea 
              id="raw-input-textarea"
              rows={4}
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              placeholder={profile.founder_id === 'arjun_vance' 
                ? "e.g. Spent 14 hours debugging a redis memory leak caused by unbatched key scans, cost us $412 in AWS bill, fixed with 12 line lua script..."
                : "e.g. Rejected 14 beverage co-packers today because they kept wanting to sneak maltodextrin into our formula to boost margins. Finally found a lab in Oregon..."
              }
              className="w-full p-4 rounded-2xl frosted-input text-slate-900 placeholder:text-slate-400 outline-none text-sm leading-relaxed mb-4"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">Voice note</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">Screenshot log</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">Customer receipt</span>
              </div>
              <button
                type="button"
                onClick={handleProcessAsset}
                disabled={isProcessingAsset}
                className="px-6 py-3 rounded-full bg-[#FAD02C] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-apple-btn flex items-center gap-2 active:scale-95 transition-all"
              >
                {isProcessingAsset ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>Transform to 3 Content Angles</span>
              </button>
            </div>
          </div>

          {/* Generated Angles */}
          {generatedAngles && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 animate-fade-in">
              {generatedAngles.map((angle, idx) => (
                <div key={idx} className="frosted-glass rounded-3xl p-6 shadow-apple-card border border-amber-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        {angle.angle_name}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{angle.platform}</span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 mb-3 text-xs text-slate-800 whitespace-pre-line font-medium">
                      {angle.hook}
                    </div>

                    <div className="text-xs text-slate-600 mb-3 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                      {angle.body}
                    </div>

                    <p className="text-[11px] text-slate-600 italic mb-2">
                      <strong>Visual:</strong> {angle.visual_direction}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Ready to schedule</span>
                    <button type="button" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
                      <span>Add to Calendar</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VOICEPRINT & PILLARS */}
      {activeTab === 'voiceprint' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Anti-AI Voiceprint & Content Pillars</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Strictly bans corporate fluff and preserves your authentic conversational cadence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Pillars (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="frosted-glass rounded-3xl p-6 shadow-apple-card">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Layers size={18} className="text-amber-600" />
                  Calibrated Content Pillars
                </h3>
                <div className="space-y-3">
                  {profile.content_pillars.map((pil, idx) => (
                    <div key={pil.id} className="bg-white/80 p-4 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">{pil.name}</span>
                        <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {pil.ratio}% of calendar
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{pil.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Founder's Spicy Take */}
              <div className="frosted-glass rounded-3xl p-6 shadow-apple-card border border-amber-200/80">
                <span className="text-[10px] font-bold uppercase text-amber-700 block mb-1">
                  The Founder's Contrarian Anchor
                </span>
                <p className="text-sm font-semibold text-slate-900 italic">
                  "{profile.voiceprint.spicy_take}"
                </p>
              </div>
            </div>

            {/* Right Banned AI Slop & Rules (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="frosted-glass rounded-3xl p-6 shadow-apple-card">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-3 flex items-center gap-2 text-rose-700">
                  <ShieldAlert size={18} className="text-rose-600" />
                  Banned AI Clichés & Buzzwords
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {profile.voiceprint.banned_phrases.map((phrase, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 line-through"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The engine automatically flags and strips these synthetic patterns prior to post drafting.
                </p>
              </div>

              <div className="frosted-glass rounded-3xl p-6 shadow-apple-card">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">Voiceprint Directives</h3>
                <ul className="space-y-2">
                  {profile.voiceprint.voice_rules.map((rule, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FAD02C] mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOAL & AUTHORITY SCORECARD */}
      {activeTab === 'goals' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Progress & Authority Scorecard</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Tracking tangible business ROI over your {profile.goals_tracking.timeframe} execution horizon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(profile.goals_tracking.metrics).map(([key, val]) => (
              <div key={key} className="frosted-glass rounded-3xl p-6 shadow-apple-card">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {key.replace(/_/g, ' ')}
                </span>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-extrabold text-slate-900">{val.current}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {val.target} {val.unit}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FAD02C] rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${Math.min(100, (val.current / val.target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* LangGraph Adaptive Feedback Loop */}
          <div className="frosted-glass rounded-3xl p-6 md:p-8 shadow-apple-card border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-heading text-base font-bold text-slate-900">
                LangGraph Adaptive Strategy Review (Checkpoint Memory)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Observation: High technical teardown resonance
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Teardowns drove 4x more inbound senior engineer inquiries than high-level thoughts.
                </p>
                <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                  Recommended Pivot: Shift calendar to 70% deep-dive engineering.
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Observation: Photo & Diagram Attachment Lift
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Posts paired with authentic terminal logs or warehouse photos had 2.8x higher comment depth.
                </p>
                <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                  Enforce mandatory visual direction on Monday & Thursday posts.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CameraIcon(props) {
  return (
    <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  );
}
