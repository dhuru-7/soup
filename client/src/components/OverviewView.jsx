import React, { useState, useEffect } from 'react';
import Icon from './Icon';

export default function OverviewView({ 
  profile, 
  contentItems, 
  onNavigateToMuse, 
  onNavigateToStudio, 
  onNavigateToYou,
  onOpenQuickCapture 
}) {
  const isMaya = profile?.founder_id === 'maya_lin';
  const secondaryPlatform = isMaya ? 'Instagram' : 'X';
  const secondaryPlatformLabel = isMaya ? 'Instagram' : 'X (Twitter)';

  const [platformFilter, setPlatformFilter] = useState('All'); // 'All' | 'LinkedIn' | secondaryPlatform
  const [timeFilter, setTimeFilter] = useState('Last 30d');

  const defaultWins = isMaya ? [
    { id: 1, text: "Regional Northeast buyer at Whole Foods requested sample flight after seeing supply chain transparency video", date: "Yesterday", tag: "Wholesale Lead", source: "Instagram DM" },
    { id: 2, text: "Keynote panel invitation: Modern Sustainable FMCG at Natural Products Expo East", date: "3 days ago", tag: "Speaking", source: "LinkedIn" },
    { id: 3, text: "Angel investor in clean CPG reached out for Series Seed allocation via LinkedIn DM", date: "5 days ago", tag: "Investor Lead", source: "LinkedIn DM" }
  ] : [
    { id: 1, text: "Invited as technical speaker on 'The Latency Podcast' (Episode #44)", date: "Yesterday", tag: "Speaking", source: "LinkedIn DM" },
    { id: 2, text: "2 Enterprise CTOs reached out for custom trace engine demo via LinkedIn DM", date: "3 days ago", tag: "Inbound Lead", source: "LinkedIn" },
    { id: 3, text: "Staff Tracing Architect at Datadog quote-tweeted SQLite benchmark thread", date: "5 days ago", tag: "Advocacy", source: "X (Twitter)" }
  ];

  const [offlineWins, setOfflineWins] = useState(defaultWins);
  const [showLogWinInput, setShowLogWinInput] = useState(false);
  const [newWinText, setNewWinText] = useState('');

  // Sync wins and reset platform filter when profile changes
  useEffect(() => {
    setOfflineWins(defaultWins);
    setPlatformFilter('All');
  }, [profile?.founder_id]);

  const firstName = profile?.identity?.name?.split(' ')[0] || 'Founder';
  const companyName = profile?.identity?.company_name || (isMaya ? 'Solace Botanicals' : 'AgentScale');
  const activePositioning = profile?.identity?.tagline || (isMaya 
    ? 'Crafting organic adaptogenic sparkling elixirs with 0g sugar and zero artificial gums.' 
    : 'Building open-source observability for autonomous AI agent fleets.');
  const archetypeName = profile?.voiceprint?.insead_archetype || (isMaya ? 'The Vulnerable Operator' : 'The Builder');
  const originScar = profile?.identity?.origin_scar || (isMaya 
    ? '14 commercial beverage co-packers told me clean organic sparkling formulas were commercially impossible without synthetic stabilizers and gums.' 
    : 'Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans.');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddWin = () => {
    if (!newWinText.trim()) return;
    setOfflineWins(prev => [
      { id: Date.now(), text: newWinText.trim(), date: 'Just now', tag: 'Achievement', source: platformFilter === 'All' ? 'Direct' : platformFilter },
      ...prev
    ]);
    setNewWinText('');
    setShowLogWinInput(false);
  };

  // Find draft needing review and founder story idea
  const pendingDraft = contentItems.find(i => i.stage === 'draft') || contentItems[0] || {};
  const thisWeekPosts = contentItems.slice(0, 3);

  // Platform-specific metrics breakdown
  const getMetrics = () => {
    if (isMaya) {
      if (platformFilter === 'LinkedIn') {
        return [
          { label: 'LinkedIn Reach', value: '14.2k', change: '+22%', note: 'CPG founder & operator network', platform: 'LinkedIn' },
          { label: 'Avg Engagement Rate', value: '4.5%', change: '+1.2%', note: 'High founder & investor debate', platform: 'LinkedIn' },
          { label: 'Operator Comments', value: '68', change: '+42%', note: 'CPG founders & retail buyers', platform: 'LinkedIn' },
          { label: 'Wholesale Inbounds', value: '2', change: '+100%', note: 'Whole Foods & regional co-op', platform: 'LinkedIn' }
        ];
      }
      if (platformFilter === 'Instagram') {
        return [
          { label: 'Instagram Reach', value: '17.6k', change: '+31%', note: 'Organic video & story impressions', platform: 'Instagram' },
          { label: 'Saves & Shares', value: '420', change: '+55%', note: 'Saved as clean label reference', platform: 'Instagram' },
          { label: 'Consumer Inbound DMs', value: '89', change: '+34%', note: 'Where to buy in-store questions', platform: 'Instagram' },
          { label: 'Store Locator Clicks', value: '512', change: '+44%', note: 'Direct foot-traffic navigation', platform: 'Instagram' }
        ];
      }
      // 'All' (Maya)
      return [
        { label: 'Total Content Reach', value: '31.8k', change: '+26%', note: '14.2k LinkedIn · 17.6k Instagram', platform: 'Cross-platform' },
        { label: 'Avg Engagement Rate', value: '5.2%', change: '+1.8%', note: '3.1x D2C beverage benchmark', platform: 'Cross-platform' },
        { label: 'Retail & Angel Inbounds', value: '4', change: '+3 this week', note: 'Whole Foods, Sprouts, 2 Angels', platform: 'Cross-platform' },
        { label: 'Community Advocates', value: '340', change: '+82', note: 'Clean ingredient champions', platform: 'Cross-platform' }
      ];
    }

    // Arjun (DeepTech AI)
    if (platformFilter === 'LinkedIn') {
      return [
        { label: 'LinkedIn Reach', value: '18.4k', change: '+24%', note: 'Organic post impressions', platform: 'LinkedIn' },
        { label: 'Avg Engagement Rate', value: '4.8%', change: '+1.4%', note: '2.3x tech industry benchmark', platform: 'LinkedIn' },
        { label: 'Technical Comments', value: '94', change: '+38%', note: '62% Staff / Principal engineers', platform: 'LinkedIn' },
        { label: 'Qualified Inbounds', value: '2', change: '+100%', note: 'Direct CTO conversations', platform: 'LinkedIn' }
      ];
    }
    if (platformFilter === 'X') {
      return [
        { label: 'X Impressions', value: '24.5k', change: '+14%', note: 'Developer timeline impressions', platform: 'X' },
        { label: 'Reposts & Quotes', value: '35', change: '+8', note: 'High technical validation', platform: 'X' },
        { label: 'Bookmarks / Saves', value: '182', change: '+45%', note: 'Saved as code reference', platform: 'X' },
        { label: 'GitHub Link Clicks', value: '314', change: '+22%', note: 'Direct traffic to repo', platform: 'X' }
      ];
    }
    // 'All' (Arjun)
    return [
      { label: 'Total Content Reach', value: '42.9k', change: '+18%', note: '18.4k LinkedIn · 24.5k X', platform: 'Cross-platform' },
      { label: 'Avg Engagement Rate', value: '4.6%', change: '+1.1%', note: 'High-proof technical tier', platform: 'Cross-platform' },
      { label: 'Qualified Inbound DMs', value: '3', change: '+2 this week', note: '2 Enterprise CTOs, 1 Angel', platform: 'Cross-platform' },
      { label: 'Community Advocates', value: '129', change: '+34', note: 'Engineers actively sharing', platform: 'Cross-platform' }
    ];
  };

  const currentMetrics = getMetrics();

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* 1. Header Greeting & Active Strategy Banner */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <span>{getGreeting()} {firstName}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Your brand, performance, and social distribution at a glance
          </p>
        </div>

        {/* Strategy Card ("Direction in Use") */}
        <div className="frosted-glass bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-apple-card relative overflow-hidden bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Your current strategy
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Week 2 of 12
                </span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                {companyName}: {archetypeName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
                {activePositioning}
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToYou}
              className="self-start md:self-center px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Review strategy</span>
              <Icon name="arrow_forward" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Social Media Performance Snapshot */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Social Media Performance</span>
              <span className="text-[11px] font-normal text-slate-400">· Real-time sync</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live engagement across your primary distribution channels
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Platform Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPlatformFilter('All')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  platformFilter === 'All'
                    ? 'bg-white text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Channels
              </button>
              <button
                type="button"
                onClick={() => setPlatformFilter('LinkedIn')}
                className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                  platformFilter === 'LinkedIn'
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
              
              {isMaya ? (
                <button
                  type="button"
                  onClick={() => setPlatformFilter('Instagram')}
                  className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    platformFilter === 'Instagram'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlatformFilter('X')}
                  className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    platformFilter === 'X'
                      ? 'bg-slate-950 text-white font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X (Twitter)</span>
                </button>
              )}
            </div>

            {/* Timeframe Dropdown */}
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className="h-8 px-3 pr-7 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold outline-none cursor-pointer hover:border-slate-300"
            >
              <option value="Last 7d">Last 7d</option>
              <option value="Last 30d">Last 30d</option>
              <option value="Last 90d">Last 90d</option>
            </select>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {currentMetrics.map((stat, i) => (
            <div 
              key={i} 
              className="frosted-glass bg-white/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  stat.platform === 'LinkedIn' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : stat.platform === 'Instagram'
                    ? 'bg-pink-50 text-pink-700 border border-pink-200'
                    : stat.platform === 'X' 
                    ? 'bg-slate-100 text-slate-800 border border-slate-300' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {stat.platform === 'LinkedIn' && (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                    </svg>
                  )}
                  {stat.platform === 'Instagram' && (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {stat.platform === 'X' && (
                    <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  <span>{stat.platform}</span>
                </span>
              </div>
              <div className="my-2">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-600">
                  {stat.change} vs previous period
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {stat.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Channel Distribution Split Bar */}
        <div className="frosted-glass bg-white/70 rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-2.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">Reach Distribution</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {isMaya ? 'LinkedIn 45% (14.2k)' : 'LinkedIn 43% (18.4k)'}
                </span>
                <span className="text-slate-300">|</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                  <span className={`w-2 h-2 rounded-full ${isMaya ? 'bg-pink-600' : 'bg-slate-950'}`} />
                  {isMaya ? 'Instagram 55% (17.6k)' : 'X / Twitter 57% (24.5k)'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {isMaya 
                ? 'High intent: Instagram DMs leading to regional retail & co-op requests' 
                : 'High intent: LinkedIn DMs (2.1x higher inbound response)'}
            </span>
          </div>

          {/* Visual Segmented Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden p-0.5 border border-slate-200/70">
            <div 
              className="bg-blue-600 h-full rounded-l-full transition-all duration-500" 
              style={{ width: isMaya ? '45%' : '43%' }} 
              title={isMaya ? 'LinkedIn: 45% of total reach' : 'LinkedIn: 43% of total reach'} 
            />
            <div 
              className={`${isMaya ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-slate-950'} h-full rounded-r-full transition-all duration-500`} 
              style={{ width: isMaya ? '55%' : '57%' }} 
              title={isMaya ? 'Instagram: 55% of total reach' : 'X (Twitter): 57% of total reach'} 
            />
          </div>
        </div>
      </div>

      {/* 3. Real Social Media Engagement Insights */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Engagement & Distribution Insights</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEEC98] text-slate-950">
              Verified Signals
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Concrete engagement signals and format teardowns analyzed from your recent posts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Insight 1: Maya (Instagram Reel) or Arjun (LinkedIn Teardown) */}
          {isMaya ? (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-50 text-pink-800 border border-pink-200 uppercase tracking-wide">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                    </svg>
                    <span>Instagram Reel Insight</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    5.8% Engagement Rate
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Exposing co-packer manufacturing rejections drove 5.8% organic engagement
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2.5">
                  Your video detailing why <strong>14 commercial co-packers refused to bottle without artificial gums</strong> drove 280+ DMs and 2 retail buyer inquiries. Showing raw unboxing of organic lion's mane bales proved formula authenticity.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-pink-50/70 border border-pink-100 flex items-center gap-2 text-[11px] text-pink-900 font-medium">
                  <span className="font-bold">Signals:</span>
                  <span>280+ consumer DMs · 2 retail buyer inquiries · 17.6k video impressions</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Audience: Conscious Consumers & Retail Buyers</span>
                <button
                  type="button"
                  onClick={() => onNavigateToMuse("Draft a new short video reel exposing the hidden additives in commercial canning")}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <span>Draft next reel in Muse</span>
                  <Icon name="arrow_forward" size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wide">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                    </svg>
                    <span>LinkedIn Insight</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    4.8% Engagement Rate
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Incident post-mortems drive 3.8x deeper discussions than tips
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2.5">
                  Your post detailing the <strong>$412 Redis Memory Leak</strong> drove 94 comments from engineering leads. Attaching the raw terminal flame graph eliminated skepticism and directly generated 2 enterprise CTO inbound inquiries.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center gap-2 text-[11px] text-blue-900 font-medium">
                  <span className="font-bold">Signals:</span>
                  <span>94 technical comments · 2 CTO conversations · 18.4k impressions</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Audience: Staff Backend Engineers</span>
                <button
                  type="button"
                  onClick={() => onNavigateToMuse("Draft a new high-proof technical post-mortem about our eBPF trace proxy")}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <span>Draft next teardown in Muse</span>
                  <Icon name="arrow_forward" size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Insight 2: Maya (LinkedIn FMCG debate) or Arjun (X Contrarian Benchmarks) */}
          {isMaya ? (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-900 border border-blue-200 uppercase tracking-wide">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                    </svg>
                    <span>LinkedIn Insight</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    42 Reposts · 68 Comments
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Critiques of 2-year shelf-life preservatives spark intense FMCG debate
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2.5">
                  Your post analyzing the <strong>true cost of room-temperature stabilizers vs real adaptogen efficacy</strong> drove 68 comments and 42 reposts from clean wellness founders and retail stockists.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100/70 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-800 font-medium">
                  <span className="font-bold">Signals:</span>
                  <span>42 reposts · 68 operator comments · 14.2k impressions</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Trend: High FMCG operator sharing</span>
                <button
                  type="button"
                  onClick={() => onNavigateToStudio()}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <span>Open in Scrapbook</span>
                  <Icon name="arrow_forward" size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-900 border border-slate-300 uppercase tracking-wide">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X (Twitter) Insight</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    35 Quotes · 182 Bookmarks
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Contrarian benchmarks trigger high developer quote-tweet velocity
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2.5">
                  Your thread on <strong>"SQLite beats Vector DBs for 90% of apps"</strong> was quoted by senior distributed systems engineers. Multiple readers pushed back on concurrent write locks, creating an open opportunity for a follow-up RFC benchmark.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100/70 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-800 font-medium">
                  <span className="font-bold">Signals:</span>
                  <span>35 quote-tweets · 182 code bookmarks · 314 GitHub repo clicks</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Trend: Benchmark reference retention</span>
                <button
                  type="button"
                  onClick={() => onNavigateToStudio()}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <span>Open in Scrapbook</span>
                  <Icon name="arrow_forward" size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Insight 3: Format Performance Breakdown */}
          <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wide">
                  <span>Format Benchmark</span>
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Last 30 Days
                </span>
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-900 mb-2">
                {isMaya ? 'What drives consumer trust & retail inbounds' : 'What drives technical authority across formats'}
              </h4>
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-900 font-bold">
                      {isMaya ? '1. Supply Chain & Lab Exposés' : '1. Incident Post-Mortems'}
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {isMaya ? '5.8% avg engagement' : '5.4% avg engagement'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isMaya ? 'Highest driver of wholesale stockist & angel inquiries' : 'Highest driver of inbound CTO direct messages'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-900 font-bold">
                      {isMaya ? '2. Contrarian Ingredient Takes' : '2. Contrarian Takes'}
                    </span>
                    <span className="text-amber-800 font-bold">
                      {isMaya ? '4.6% avg engagement' : '4.1% avg engagement'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isMaya ? 'Highest driver of organic shares & customer saves' : 'Highest driver of reposts & architectural debates'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-900 font-bold">
                      {isMaya ? '3. Founder Journey & Batch Testing' : '3. Founder Journey'}
                    </span>
                    <span className="text-slate-700 font-bold">
                      {isMaya ? '3.8% avg engagement' : '2.9% avg engagement'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full" style={{ width: '52%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isMaya ? 'Highest driver of brand advocacy & repeats' : 'Highest driver of engineering talent recruitment'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Insight 4: Publishing Timing & Cadence Window */}
          <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                  <span>Publishing Window</span>
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  +44% Initial Velocity
                </span>
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                Optimal distribution cadence by platform
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                {isMaya 
                  ? 'Your Instagram audience engages heaviest between 12:00 PM – 1:30 PM EST on Wednesdays and Fridays. LinkedIn operators engage heaviest at 8:30 AM EST.' 
                  : 'Your LinkedIn audience engages heaviest between 8:00 AM – 9:00 AM EST on Tuesdays and Thursdays. Posting before morning standups yields 68% velocity.'}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between font-medium text-slate-800">
                  <span>⏱️ Next recommended window:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {isMaya ? 'Wednesday 12:15 PM EST' : 'Thursday 8:15 AM EST'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{isMaya ? 'Primary target: Instagram Reel' : 'Primary target: LinkedIn Post'}</span>
                  <span>Peak attention window: 45 mins</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. The Core Action Queue ("Your next best actions") */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Your next best actions
            </h3>
            <p className="text-xs text-slate-500">
              Actions calibrated to move your personal brand forward this week
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Action 1: Story idea from onboarding */}
          <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-amber-200/80 bg-amber-50/20 shadow-apple-card flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEEC98] text-slate-950 uppercase tracking-wide">
                  Suggested by Muse
                </span>
                <span className="text-xs font-medium text-slate-500">
                  From onboarding note
                </span>
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                Review a founder-story idea
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Your failure post-mortem ("{originScar.slice(0, 85)}...") is ready to turn into a 45-second high-proof script for LinkedIn and short video.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToMuse("Develop my onboarding origin story into a 45-second script")}
              className="self-start px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Icon name="star" size={15} className="text-[#FFCC00]" />
              <span>Develop in Muse →</span>
            </button>
          </div>

          {/* Action 2: Pending Draft Review */}
          <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wide">
                  Pending Review
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Thursday Post
                </span>
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                Approve Thursday's draft: "{pendingDraft.title || 'Technical Teardown'}"
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                One content item is waiting for your review in Scrapbook. Hook, whiteboard diagram, and technical takeaway are prepared.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToStudio(pendingDraft.id)}
              className="self-start px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Review in Scrapbook →</span>
              <Icon name="arrow_forward" size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* 5. This Week's Plan ("Your week") */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              This week's plan
            </h3>
            <p className="text-xs text-slate-500">
              3 planned items · Content cadence
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToStudio()}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <span>Open Scrapbook</span>
            <Icon name="arrow_forward" size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {thisWeekPosts.map((post, idx) => (
            <div 
              key={post.id || idx}
              onClick={() => onNavigateToStudio(post.id)}
              className="frosted-glass bg-white/70 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-amber-300 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-950 font-mono">
                    {post.day?.slice(0, 3)?.toUpperCase() || 'POST'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    post.stage === 'published' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : post.stage === 'approved' 
                      ? 'bg-blue-100 text-blue-800' 
                      : post.stage === 'draft'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {post.stage?.toUpperCase() || 'IDEA'}
                  </span>
                </div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                  {post.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mb-3">
                  {post.platform} • {post.format}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 font-medium line-clamp-2">
                  "{post.hook}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Click to edit</span>
                <span className="text-amber-700 font-bold flex items-center gap-0.5">
                  <span>View card</span>
                  <Icon name="arrow_forward" size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Offline Wins & Tangible Outcomes */}
      <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="military_tech" size={20} className="text-amber-600" />
              <h3 className="font-heading text-base font-bold text-slate-900">
                Tangible founder outcomes & offline wins
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowLogWinInput(!showLogWinInput)}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <Icon name="add" size={14} />
              <span>Log win</span>
            </button>
          </div>

          {/* Quick Log Input */}
          {showLogWinInput && (
            <div className="mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 animate-fade-in">
              <input
                type="text"
                autoFocus
                value={newWinText}
                onChange={e => setNewWinText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddWin()}
                placeholder="e.g. Podcast invite, customer DM, angel intro..."
                className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddWin}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {offlineWins.map(win => (
              <div key={win.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between gap-2 shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      {win.tag}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                      win.source.includes('LinkedIn') 
                        ? 'bg-blue-50 text-blue-700' 
                        : win.source.includes('X') 
                        ? 'bg-slate-100 text-slate-800' 
                        : 'bg-slate-50 text-slate-600'
                    }`}>
                      {win.source.includes('LinkedIn') && (
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                        </svg>
                      )}
                      {win.source.includes('X') && (
                        <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )}
                      <span>{win.source}</span>
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    {win.text}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                  {win.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Track high-value outcomes beyond social algorithms (speaking invites, customer pipeline, angel introductions).
        </p>
      </div>

    </div>
  );
}
