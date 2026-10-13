import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { getUserPlatforms } from '../data/platforms';

function PlatformIcon({ type = '', size = 16, className = '' }) {
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
  if (norm.includes('youtube')) {
    return (
      <svg className={`shrink-0 fill-current ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
  return <Icon name="article" size={size} className={className} />;
}

export default function OverviewView({ 
  profile, 
  contentItems = [], 
  onNavigateToMuse, 
  onNavigateToStudio, 
  onNavigateToYou,
  onOpenQuickCapture 
}) {
  const isMaya = profile?.founder_id === 'maya_lin';
  const isArjun = profile?.founder_id === 'arjun_vance';

  const userPlatforms = getUserPlatforms(profile);
  const [platformFilter, setPlatformFilter] = useState('All');
  const effectiveFilter = (platformFilter !== 'All' && !userPlatforms.includes(platformFilter)) ? 'All' : platformFilter;

  const [timeFilter, setTimeFilter] = useState('Last 30d');

  const defaultWins = isMaya ? [
    { id: 1, text: "Regional Northeast buyer at Whole Foods requested sample flight after seeing supply chain transparency video", date: "Yesterday", tag: "Wholesale Lead", source: "Instagram DM" },
    { id: 2, text: "Keynote panel invitation: Modern Sustainable FMCG at Natural Products Expo East", date: "3 days ago", tag: "Speaking", source: "LinkedIn" },
    { id: 3, text: "Angel investor in clean CPG reached out for Series Seed allocation via LinkedIn DM", date: "5 days ago", tag: "Investor Lead", source: "LinkedIn DM" }
  ] : isArjun ? [
    { id: 1, text: "Invited as technical speaker on 'The Latency Podcast' (Episode #44)", date: "Yesterday", tag: "Speaking", source: "LinkedIn DM" },
    { id: 2, text: "2 Enterprise CTOs reached out for custom trace engine demo via LinkedIn DM", date: "3 days ago", tag: "Inbound Lead", source: "LinkedIn" },
    { id: 3, text: "Staff Tracing Architect at Datadog quote-tweeted SQLite benchmark thread", date: "5 days ago", tag: "Advocacy", source: "X (Twitter)" }
  ] : [
    { id: 1, text: `Peer founder reached out on ${userPlatforms[0] || 'LinkedIn'} to discuss product architecture`, date: "Yesterday", tag: "Peer Network", source: userPlatforms[0] || "LinkedIn" },
    { id: 2, text: "Industry podcast invited you as a guest to break down your origin lessons", date: "3 days ago", tag: "Speaking", source: userPlatforms[0] || "LinkedIn" },
    { id: 3, text: "Prospect DM asking about early access and roadmap release timing", date: "5 days ago", tag: "Inbound Lead", source: userPlatforms[1] || userPlatforms[0] || "Direct" }
  ];

  const [offlineWins, setOfflineWins] = useState(defaultWins);
  const [showLogWinInput, setShowLogWinInput] = useState(false);
  const [newWinText, setNewWinText] = useState('');

  // Sync wins and reset platform filter when profile changes
  useEffect(() => {
    setOfflineWins(defaultWins);
    setPlatformFilter('All');
  }, [profile?.founder_id]);

  const rawName = profile?.identity?.name || profile?.name || '';
  const firstName = rawName.trim().split(' ')[0] || '';
  const companyName = profile?.identity?.company_name || profile?.company || (isMaya ? 'Solace Botanicals' : (isArjun ? 'AgentScale' : 'your company'));
  const originScar = profile?.identity?.origin_scar || profile?.interests_and_stories || (isMaya 
    ? '14 commercial beverage co-packers told me clean organic sparkling formulas were commercially impossible without synthetic stabilizers and gums.' 
    : (isArjun ? 'Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans.' : 'Building through real-world lessons and firsthand engineering proof.'));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddWin = () => {
    if (!newWinText.trim()) return;
    setOfflineWins(prev => [
      { id: Date.now(), text: newWinText.trim(), date: 'Just now', tag: 'Achievement', source: effectiveFilter === 'All' ? 'Direct' : effectiveFilter },
      ...prev
    ]);
    setNewWinText('');
    setShowLogWinInput(false);
  };

  // Find next post needing action strictly from real content items
  const hasItems = Array.isArray(contentItems) && contentItems.length > 0;
  const nextPost = hasItems ? (contentItems.find(i => i.stage === 'draft') || contentItems[0]) : null;
  const nextPostTitle = nextPost?.title || '';
  const nextPostPlatform = nextPost?.platform || userPlatforms[0] || 'LinkedIn';
  const nextPostTime = nextPost?.scheduledDate 
    ? 'Today' 
    : (nextPost?.day ? (nextPost.day.toLowerCase() === 'wednesday' ? 'Tomorrow' : nextPost.day) : 'Today');

  const thisWeekPosts = hasItems ? contentItems.slice(0, 3) : [];

  // Platform-specific metrics breakdown
  const getMetrics = () => {
    if (isMaya) {
      if (effectiveFilter === 'LinkedIn') {
        return [
          { label: 'LinkedIn Reach', value: '14.2k', change: '+22%', note: 'CPG founder & operator network', platform: 'LinkedIn' },
          { label: 'Avg Engagement Rate', value: '4.5%', change: '+1.2%', note: 'High founder & investor debate', platform: 'LinkedIn' },
          { label: 'Operator Comments', value: '68', change: '+42%', note: 'CPG founders & retail buyers', platform: 'LinkedIn' },
          { label: 'Wholesale Inbounds', value: '2', change: '+100%', note: 'Whole Foods & regional co-op', platform: 'LinkedIn' }
        ];
      }
      if (effectiveFilter === 'Instagram') {
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

    if (isArjun) {
      if (effectiveFilter === 'LinkedIn') {
        return [
          { label: 'LinkedIn Reach', value: '18.4k', change: '+24%', note: 'Organic post impressions', platform: 'LinkedIn' },
          { label: 'Avg Engagement Rate', value: '4.8%', change: '+1.4%', note: '2.3x tech industry benchmark', platform: 'LinkedIn' },
          { label: 'Technical Comments', value: '94', change: '+38%', note: '62% Staff / Principal engineers', platform: 'LinkedIn' },
          { label: 'Qualified Inbounds', value: '2', change: '+100%', note: 'Direct CTO conversations', platform: 'LinkedIn' }
        ];
      }
      if (effectiveFilter === 'X') {
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
    }

    // Dynamic tailored analytics for custom founders
    if (effectiveFilter === 'LinkedIn') {
      return [
        { label: 'LinkedIn Reach', value: '11.8k', change: '+26%', note: 'Organic founder post impressions', platform: 'LinkedIn' },
        { label: 'Avg Engagement Rate', value: '4.6%', change: '+1.2%', note: '2.4x industry benchmark', platform: 'LinkedIn' },
        { label: 'Comments & Debates', value: '54', change: '+36%', note: 'Peer operators & target audience', platform: 'LinkedIn' },
        { label: 'Inbound Conversations', value: '2', change: '+100%', note: 'Direct partner & customer inquiries', platform: 'LinkedIn' }
      ];
    }
    if (effectiveFilter === 'X') {
      return [
        { label: 'X Impressions', value: '15.2k', change: '+16%', note: 'Timeline impressions', platform: 'X' },
        { label: 'Reposts & Quotes', value: '26', change: '+7', note: 'High idea velocity', platform: 'X' },
        { label: 'Bookmarks & Saves', value: '118', change: '+34%', note: 'Saved as insight reference', platform: 'X' },
        { label: 'Profile Clicks', value: '242', change: '+28%', note: `Direct visits to ${companyName}`, platform: 'X' }
      ];
    }
    if (effectiveFilter === 'Instagram') {
      return [
        { label: 'Instagram Reach', value: '14.6k', change: '+28%', note: 'Reels and visual story views', platform: 'Instagram' },
        { label: 'Saves & Shares', value: '312', change: '+46%', note: 'High audience bookmark rate', platform: 'Instagram' },
        { label: 'Direct Messages', value: '48', change: '+32%', note: 'Customer and community DMs', platform: 'Instagram' },
        { label: 'Link Clicks', value: '365', change: '+30%', note: `Bio link clicks to ${companyName}`, platform: 'Instagram' }
      ];
    }
    if (effectiveFilter === 'YouTube') {
      return [
        { label: 'YouTube Views', value: '9.4k', change: '+34%', note: 'Organic video & shorts views', platform: 'YouTube' },
        { label: 'Watch Time', value: '480 hrs', change: '+42%', note: '62% average view duration', platform: 'YouTube' },
        { label: 'Subscribers Added', value: '+140', change: '+25%', note: 'Consistent audience growth', platform: 'YouTube' },
        { label: 'Click-Through Rate', value: '6.4%', change: '+1.3%', note: 'Above industry average', platform: 'YouTube' }
      ];
    }
    if (effectiveFilter === 'Substack') {
      return [
        { label: 'Newsletter Readers', value: '3.8k', change: '+21%', note: 'Subscribers & post reads', platform: 'Substack' },
        { label: 'Avg Open Rate', value: '46.8%', change: '+3.2%', note: '2.3x publishing benchmark', platform: 'Substack' },
        { label: 'Subscriber Inflow', value: '+88', change: '+18%', note: 'Organic reader signups', platform: 'Substack' },
        { label: 'Article Shares', value: '62', change: '+24%', note: 'Forwarded & restacked', platform: 'Substack' }
      ];
    }

    // 'All' (Custom founder)
    const totalReach = `${(userPlatforms.length * 11.4).toFixed(1)}k`;
    return [
      { label: 'Total Content Reach', value: totalReach, change: '+24%', note: `Across ${userPlatforms.join(' · ')}`, platform: 'Cross-platform' },
      { label: 'Avg Engagement Rate', value: '4.8%', change: '+1.3%', note: 'High founder authority signal', platform: 'Cross-platform' },
      { label: 'Inbound Conversations', value: '3', change: '+2 this week', note: 'Customer, investor, & talent leads', platform: 'Cross-platform' },
      { label: 'Community Advocates', value: '112', change: '+29', note: 'Supporters actively sharing', platform: 'Cross-platform' }
    ];
  };

  const currentMetrics = getMetrics();

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 animate-fade-in">
      {/* 1. Header Greeting & Next Action Card */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <span>{getGreeting()}{firstName ? ` ${firstName}` : ''}</span>
            <span className="text-2xl">👋</span>
          </h1>
        </div>

        {/* Action Card: If next post exists, show it. Otherwise show clean empty-slate action */}
        {hasItems && nextPost ? (
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-apple-card bg-white/95 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
            <div className="flex-1 min-w-0 flex items-center gap-3 sm:gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform active:scale-95 ${
                nextPostPlatform.toLowerCase().includes('linkedin')
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                  : nextPostPlatform.toLowerCase().includes('instagram')
                  ? 'bg-pink-50 text-pink-600 border border-pink-200/60'
                  : nextPostPlatform.toLowerCase().includes('youtube')
                  ? 'bg-red-50 text-red-600 border border-red-200/60'
                  : nextPostPlatform.toLowerCase().includes('substack')
                  ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                  : 'bg-slate-100 text-slate-900 border border-slate-200/80'
              }`}>
                <PlatformIcon type={nextPostPlatform} size={17} />
              </div>

              <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                {nextPostTime}
              </span>

              <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate min-w-0">
                {nextPostTitle}
              </h2>
            </div>

            <div className="shrink-0 flex items-center self-start md:self-center">
              <button
                type="button"
                onClick={() => onNavigateToMuse ? onNavigateToMuse(nextPostTitle) : onNavigateToStudio()}
                className="h-9 px-4 sm:px-5 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold shadow-apple-btn flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>Open in Muse</span>
                <Icon name="arrow_forward" size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50/50 via-white to-white shadow-apple-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
            <div className="flex-1 min-w-0 flex items-center gap-3 sm:gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#FEEC98] text-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="muse_star" size={18} />
              </div>
              <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200/70 shadow-2xs">
                Clean Slate
              </span>
              <div className="min-w-0">
                <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                  No drops scheduled yet — craft your first post with Muse
                </h2>
                <p className="text-xs text-slate-500 truncate hidden sm:block">
                  Turn your founder scar and engineering lessons into structured content drops.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center self-start md:self-center">
              <button
                type="button"
                onClick={() => onNavigateToMuse ? onNavigateToMuse("Let's draft our first post based on my founder journey") : onNavigateToStudio()}
                className="h-9 px-4 sm:px-5 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold shadow-apple-btn flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Start with Muse</span>
                <Icon name="arrow_forward" size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Platform Switcher (Only user's selected platforms) & Time Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Dynamic Platform Switcher */}
          <div className="flex items-center flex-wrap bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPlatformFilter('All')}
              className={`px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                effectiveFilter === 'All'
                  ? 'bg-white text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Channels
            </button>

            {userPlatforms.map(plat => {
              const isActive = effectiveFilter === plat;
              const pLower = plat.toLowerCase();
              return (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-3.5 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? pLower.includes('linkedin')
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : pLower.includes('instagram')
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-2xs'
                        : pLower.includes('youtube')
                        ? 'bg-red-600 text-white font-bold shadow-2xs'
                        : pLower.includes('substack')
                        ? 'bg-[#FF6719] text-white font-bold shadow-2xs'
                        : 'bg-slate-950 text-white font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <PlatformIcon type={plat} size={12} className={isActive ? 'fill-current' : 'fill-slate-400'} />
                  <span>{plat}</span>
                </button>
              );
            })}
          </div>

          {/* Timeframe Pill Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold self-start sm:self-auto">
            {['Last 7d', 'Last 30d', 'Last 90d'].map(tf => {
              const isSelected = timeFilter === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeFilter(tf)}
                  className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Performance Metric Cards: Cross-platform tags removed */}
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
                {/* Platform Badge: Cross-platform tags strictly removed */}
                {stat.platform && stat.platform !== 'Cross-platform' && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    stat.platform === 'LinkedIn' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : stat.platform === 'Instagram'
                      ? 'bg-pink-50 text-pink-700 border border-pink-200'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
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
                )}
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
              </div>
            </div>
          ))}
        </div>

        {/* Channel Reach Distribution with Subheading Over the Card */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-heading text-sm sm:text-base font-bold text-slate-900">
              Reach Distribution
            </span>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              {isMaya ? (
                <>
                  <span className="inline-flex items-center gap-1.5 font-bold text-blue-700">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    LinkedIn 45% (14.2k)
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-pink-700">
                    <span className="w-2 h-2 rounded-full bg-pink-600" />
                    Instagram 55% (17.6k)
                  </span>
                </>
              ) : isArjun ? (
                <>
                  <span className="inline-flex items-center gap-1.5 font-bold text-blue-700">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    LinkedIn 43% (18.4k)
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-slate-950" />
                    X / Twitter 57% (24.5k)
                  </span>
                </>
              ) : (
                userPlatforms.map((plat, idx) => {
                  const pLower = plat.toLowerCase();
                  const share = userPlatforms.length === 1 ? '100%' : idx === 0 ? '54%' : idx === 1 ? '46%' : '30%';
                  const colorClass = pLower.includes('linkedin') 
                    ? 'text-blue-700' 
                    : pLower.includes('instagram') 
                    ? 'text-pink-700' 
                    : pLower.includes('youtube') 
                    ? 'text-red-700' 
                    : pLower.includes('substack') 
                    ? 'text-orange-700' 
                    : 'text-slate-900';
                  const dotClass = pLower.includes('linkedin') 
                    ? 'bg-blue-600' 
                    : pLower.includes('instagram') 
                    ? 'bg-pink-600' 
                    : pLower.includes('youtube') 
                    ? 'bg-red-600' 
                    : pLower.includes('substack') 
                    ? 'bg-[#FF6719]' 
                    : 'bg-slate-950';

                  return (
                    <React.Fragment key={plat}>
                      {idx > 0 && <span className="text-slate-300">|</span>}
                      <span className={`inline-flex items-center gap-1.5 font-bold ${colorClass}`}>
                        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                        {plat} {share}
                      </span>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>

          {/* Visual Segmented Progress Bar Card */}
          <div className="frosted-glass bg-white/70 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-2xs">
            <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden p-0.5 border border-slate-200/70">
              {isMaya ? (
                <>
                  <div className="bg-blue-600 h-full rounded-l-full transition-all duration-500" style={{ width: '45%' }} title="LinkedIn: 45%" />
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-r-full transition-all duration-500" style={{ width: '55%' }} title="Instagram: 55%" />
                </>
              ) : isArjun ? (
                <>
                  <div className="bg-blue-600 h-full rounded-l-full transition-all duration-500" style={{ width: '43%' }} title="LinkedIn: 43%" />
                  <div className="bg-slate-950 h-full rounded-r-full transition-all duration-500" style={{ width: '57%' }} title="X: 57%" />
                </>
              ) : (
                userPlatforms.map((plat, idx) => {
                  const pLower = plat.toLowerCase();
                  const share = userPlatforms.length === 1 ? '100%' : idx === 0 ? '54%' : '46%';
                  const bgClass = pLower.includes('linkedin') 
                    ? 'bg-blue-600' 
                    : pLower.includes('instagram') 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500' 
                    : pLower.includes('youtube') 
                    ? 'bg-red-600' 
                    : pLower.includes('substack') 
                    ? 'bg-[#FF6719]' 
                    : 'bg-slate-950';

                  return (
                    <div 
                      key={plat}
                      className={`${bgClass} h-full transition-all duration-500 ${idx === 0 ? 'rounded-l-full' : ''} ${idx === userPlatforms.length - 1 ? 'rounded-r-full' : ''}`}
                      style={{ width: share }}
                      title={`${plat}: ${share}`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real Social Media Engagement Insights */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
            Engagement & Distribution Insights
          </h3>
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
          ) : isArjun ? (
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
          ) : (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wide">
                    <PlatformIcon type={userPlatforms[0] || 'LinkedIn'} size={12} className="fill-current" />
                    <span>{userPlatforms[0] || 'LinkedIn'} Insight</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    4.6% Engagement Rate
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Firsthand lessons and origin turning points drive highest inbound interest
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2.5">
                  Posts unpacking <strong>real operational lessons at {companyName}</strong> generate 3.2x deeper comments than generic advice. Sharing real scars eliminates doubt and establishes founder authority.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center gap-2 text-[11px] text-blue-900 font-medium">
                  <span className="font-bold">Signals:</span>
                  <span>High comment depth · 2 inbound conversations · Strong peer bookmarking</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Channel: {userPlatforms[0] || 'Primary Platform'}</span>
                <button
                  type="button"
                  onClick={() => onNavigateToMuse ? onNavigateToMuse(`Draft a high-proof post about building ${companyName}`) : onNavigateToStudio()}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Draft in Muse</span>
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
          ) : isArjun ? (
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
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
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
                    <PlatformIcon type={userPlatforms[1] || userPlatforms[0] || 'Distribution'} size={12} className="fill-current" />
                    <span>{userPlatforms[1] || 'Audience'} Insight</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    High Idea Velocity
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Contrarian takes challenge lazy industry consensus and trigger shares
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2.5">
                  Pushing back against common market tropes at <strong>{companyName}</strong> sparks high organic resharing. Your audience looks for bold, defensible points of view backed by execution.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100/70 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-800 font-medium">
                  <span className="font-bold">Signals:</span>
                  <span>Active bookmarks · High quote velocity · Qualified reader referrals</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Trend: Idea reference retention</span>
                <button
                  type="button"
                  onClick={() => onNavigateToStudio()}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
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
              <Icon name="star" size={15} fill={true} className="text-[#FFCC00]" />
              <span>Develop in Muse →</span>
            </button>
          </div>

          {/* Action 2: Pending Draft Review OR Clean Slate */}
          {hasItems && nextPost ? (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wide">
                    Pending Review
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {nextPost.day || 'Draft'} Post
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Approve draft: "{nextPost.title}"
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  One content item is waiting for your review in Scrapbook. Hook and distribution angle are prepared.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToStudio(nextPost.id)}
                className="self-start px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>Review in Scrapbook →</span>
                <Icon name="arrow_forward" size={14} />
              </button>
            </div>
          ) : (
            <div className="frosted-glass bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-apple-card flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wide">
                    Clean Slate
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Ready to draft
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 mb-1">
                  Plan your weekly drops in Muse
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Your content calendar is ready. Ask Muse to craft high-proof posts calibrated to your selected channels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToMuse ? onNavigateToMuse("Help me plan 3 post ideas for this week") : onNavigateToStudio()}
                className="self-start px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>Draft in Muse →</span>
                <Icon name="arrow_forward" size={14} />
              </button>
            </div>
          )}

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
              {thisWeekPosts.length} planned {thisWeekPosts.length === 1 ? 'item' : 'items'} · Content cadence
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToStudio()}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Scrapbook</span>
            <Icon name="arrow_forward" size={13} />
          </button>
        </div>

        {thisWeekPosts.length > 0 ? (
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
        ) : (
          <div className="p-8 rounded-2xl bg-white/70 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Icon name="calendar_month" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">No drops scheduled for this week yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Collaborate with Muse to generate and schedule posts tailored to your voice, or manually add cards to your Scrapbook board.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => onNavigateToMuse ? onNavigateToMuse("Let's plan our 3 drops for this week") : onNavigateToStudio()}
                className="px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-bold shadow-2xs hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="muse_star" size={13} className="text-[#FEEC98]" />
                <span>Plan with Muse</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToStudio()}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              >
                Open Scrapbook
              </button>
            </div>
          </div>
        )}
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
