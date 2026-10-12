import React, { useState } from 'react';
import Icon from './Icon';

export default function YouView({ profile, agentMemory, onUpdateMemory, onAddMemoryNote, onDeleteMemoryNote }) {
  const [activeMemoryCategory, setActiveMemoryCategory] = useState('all'); // 'all' | 'fact' | 'voice' | 'research'
  const [showAddMemoryInput, setShowAddMemoryInput] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState('fact');
  const [editingPositioning, setEditingPositioning] = useState(false);
  const [positioningText, setPositioningText] = useState(profile.identity.tagline || '');
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    LinkedIn: true,
    'X (Twitter)': true,
    Substack: false,
    YouTube: false
  });

  const toggleConnect = (plat) => {
    setConnectedPlatforms(prev => ({
      ...prev,
      [plat]: !prev[plat]
    }));
  };

  const handleAddMemory = () => {
    if (!newMemoryText.trim()) return;
    onAddMemoryNote({
      id: `mem-${Date.now()}`,
      category: newMemoryCategory,
      text: newMemoryText.trim(),
      origin: 'Founder added',
      verified: true
    });
    setNewMemoryText('');
    setShowAddMemoryInput(false);
  };

  const filteredMemory = agentMemory.filter(item => {
    if (activeMemoryCategory === 'all') return true;
    return item.category === activeMemoryCategory;
  });

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* 1. Header Profile Banner */}
      <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-apple-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img 
            src={profile.identity.avatar} 
            alt={profile.identity.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950">
                {profile.identity.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEEC98] text-slate-950">
                {profile.voiceprint.insead_archetype}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {profile.identity.role} • <span className="font-bold text-slate-900">{profile.identity.company_name}</span> ({profile.identity.stage})
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {profile.identity.mission}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Icon name="verified" size={14} className="text-emerald-700" />
            <span>DNA Profile Verified</span>
          </span>
        </div>
      </div>

      {/* 2. Direction & Themes (Positioning & Content Pillars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Direction Card */}
        <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Direction / Positioning
              </span>
              <button
                type="button"
                onClick={() => setEditingPositioning(!editingPositioning)}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <Icon name="edit" size={12} />
                <span>{editingPositioning ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {editingPositioning ? (
              <textarea
                value={positioningText}
                onChange={e => setPositioningText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl frosted-input text-xs sm:text-sm text-slate-900 font-medium outline-none"
              />
            ) : (
              <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-snug">
                "{positioningText}"
              </h3>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs text-slate-600 font-medium leading-relaxed">
            <strong className="text-slate-900">Why this matters:</strong> Every recommendation, draft hook, and tone adjustment filters through this single direction sentence.
          </div>
        </div>

        {/* Content Pillars / Themes */}
        <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Calibrated Content Themes
            </span>
            <div className="flex flex-col gap-2.5">
              {[
                { title: 'Founder Story & Firsthand Experience', desc: `Anchored in: "${(profile?.identity?.origin_scar || profile?.identity?.tagline || 'Real production lessons').slice(0, 65)}..."`, pct: '35%' },
                { title: 'Core Proof & Building in Public', desc: 'Concrete benchmarks, unbatched incident post-mortems, and engineering receipts', pct: '40%' },
                { title: 'Unpopular Contrarian Takes', desc: `Centerpiece: "${(profile?.voiceprint?.spicy_take || 'Challenging lazy orthodoxies with data').slice(0, 65)}..."`, pct: '25%' },
              ].map((theme, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{theme.title}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{theme.desc}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                    {theme.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. "What Muse Knows" (Transparent Editable Memory Banks) */}
      <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="psychology" size={20} className="text-amber-600" />
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-950">
                What Muse knows about you
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              The persistent memory used to draft content. Every entry has a transparent origin and can be edited.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddMemoryInput(!showAddMemoryInput)}
              className="px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <Icon name="add" size={14} />
              <span>Add fact / rule</span>
            </button>
          </div>
        </div>

        {/* Add Memory Note Input Drawer */}
        {showAddMemoryInput && (
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 animate-fade-in">
            <select
              value={newMemoryCategory}
              onChange={e => setNewMemoryCategory(e.target.value)}
              className="h-10 px-3 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold outline-none shrink-0"
            >
              <option value="fact">Confirmed Fact</option>
              <option value="voice">Voice & Preference</option>
              <option value="research">Research / Assumption</option>
            </select>
            <input
              type="text"
              autoFocus
              value={newMemoryText}
              onChange={e => setNewMemoryText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMemory()}
              placeholder="e.g. We wrote our first prototype in Python before switching to Rust..."
              className="flex-1 h-10 px-4 rounded-full frosted-input text-slate-900 text-xs sm:text-sm outline-none"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAddMemory}
                className="h-10 px-5 rounded-full bg-slate-950 text-white font-bold text-xs"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddMemoryInput(false)}
                className="h-10 px-3.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All memories' },
            { id: 'fact', label: 'Confirmed facts' },
            { id: 'voice', label: 'Voice & preferences' },
            { id: 'research', label: 'Research & assumptions' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveMemoryCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeMemoryCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMemory.map(mem => (
            <div 
              key={mem.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    mem.category === 'fact' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    mem.category === 'voice' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {mem.category === 'fact' ? 'Confirmed Fact' : mem.category === 'voice' ? 'Voice & Preference' : 'Assumption'}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Origin: {mem.origin}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  "{mem.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400">
                  {mem.verified ? '✓ Verified by founder' : '⚠️ Needs confirmation'}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteMemoryNote(mem.id)}
                  className="text-slate-400 hover:text-rose-600 flex items-center"
                  title="Delete memory entry"
                >
                  <Icon name="delete" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Connected Accounts & Privacy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Connected Platforms */}
        <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              Connected Platforms
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Publishing destinations and analytics integrations
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {Object.entries(connectedPlatforms).map(([platformName, isConnected]) => (
              <div 
                key={platformName}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-xs font-bold text-slate-900">{platformName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleConnect(platformName)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    isConnected 
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Export & Transparency */}
        <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              Transparency & Data Sovereignty
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Soup stores all persona vectors, origin scars, and voice constraints in your private workspace. You can export or clear your memory bank at any time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${profile.identity.name.toLowerCase().replace(/\s+/g, '_')}_dna.json`;
                a.click();
              }}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Icon name="download" size={14} />
              <span>Export Founder DNA (JSON)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
