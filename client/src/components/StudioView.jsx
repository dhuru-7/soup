import React, { useState } from 'react';
import Icon from './Icon';
import { getUserPlatforms } from '../data/platforms';

export default function StudioView({ 
  profile, 
  contentItems, 
  onUpdateContentItem, 
  onAddContentItem, 
  onDeleteContentItem,
  onOpenContentModal, 
  onOpenInMuse, 
  onTransferToCalendar,
  onOpenQuickCapture,
  initialSubView = 'board',
  showToast 
}) {
  const [activeSubView, setActiveSubView] = useState(initialSubView || 'board'); // 'board' | 'calendar' | 'published'
  const [platformFilter, setPlatformFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  const userPlatforms = getUserPlatforms(profile);
  const effectiveFilter = (platformFilter !== 'All' && !userPlatforms.includes(platformFilter)) ? 'All' : platformFilter;

  const stages = [
    { id: 'idea', label: 'Ideas', color: 'border-slate-300 text-slate-700 bg-slate-100' },
    { id: 'draft', label: 'Drafts (Needs Review)', color: 'border-amber-300 text-amber-900 bg-amber-100' },
    { id: 'approved', label: 'Approved', color: 'border-blue-300 text-blue-900 bg-blue-100' },
    { id: 'published', label: 'Published', color: 'border-emerald-300 text-emerald-900 bg-emerald-100' },
  ];

  const filteredItems = contentItems.filter(item => {
    const matchesPlatform = effectiveFilter === 'All' || item.platform?.toLowerCase().includes(effectiveFilter.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.hook?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const calendarDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Render official brand icon without platform name text
  const renderPlatformIcons = (platformStr) => {
    if (!platformStr) return null;
    const lower = platformStr.toLowerCase();
    const hasLinkedIn = lower.includes('linkedin');
    const hasX = lower.includes('x') || lower.includes('twitter');
    const hasInstagram = lower.includes('instagram') || lower.includes('insta');
    const hasYouTube = lower.includes('youtube');

    const icons = [];

    if (hasLinkedIn) {
      icons.push(
        <span 
          key="linkedin"
          className="w-5.5 h-5.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2] shadow-2xs shrink-0"
          title="LinkedIn"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
          </svg>
        </span>
      );
    }

    if (hasX) {
      icons.push(
        <span 
          key="x"
          className="w-5.5 h-5.5 rounded-lg bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-slate-950 shadow-2xs shrink-0"
          title="X / Twitter"
        >
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </span>
      );
    }

    if (hasInstagram) {
      icons.push(
        <span 
          key="instagram"
          className="w-5.5 h-5.5 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-[#E4405F] shadow-2xs shrink-0"
          title="Instagram"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </span>
      );
    }

    if (hasYouTube) {
      icons.push(
        <span 
          key="youtube"
          className="w-5.5 h-5.5 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-[#FF0000] shadow-2xs shrink-0"
          title="YouTube"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </span>
      );
    }

    const hasSubstack = lower.includes('substack') || lower.includes('newsletter');
    if (hasSubstack) {
      icons.push(
        <span 
          key="substack"
          className="w-5.5 h-5.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF6719] shadow-2xs shrink-0"
          title="Substack"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
          </svg>
        </span>
      );
    }

    if (icons.length === 0) {
      icons.push(
        <span key="generic" className="w-5.5 h-5.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-[10px] font-bold shrink-0">
          {platformStr.slice(0, 2).toUpperCase()}
        </span>
      );
    }

    return <div className="flex items-center gap-1 shrink-0">{icons}</div>;
  };

  const handleMoveStage = (e, item, newStage) => {
    e.stopPropagation();
    onUpdateContentItem({
      ...item,
      stage: newStage
    });
  };

  const handleQuickTransferToCalendar = (e, item, day = 'Wednesday') => {
    e.stopPropagation();
    if (onTransferToCalendar) {
      onTransferToCalendar(item, day);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Studio Header: Clean title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Scrapbook
          </h1>
        </div>
      </div>

      {/* Sub-View Switcher & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* 3 Internal Views: Board · Calendar · Published (Collected Inbox removed) */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 self-start">
          {[
            { id: 'board', label: 'Board', icon: 'view_kanban', count: contentItems.length },
            { id: 'calendar', label: 'Calendar', icon: 'calendar_month', count: contentItems.filter(i => i.day).length },
            { id: 'published', label: 'Published', icon: 'task_alt', count: contentItems.filter(i => i.stage === 'published').length },
          ].map(view => {
            const isActive = activeSubView === view.id;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveSubView(view.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-2xs font-bold border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon name={view.icon} size={15} />
                <span>{view.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#FEEC98] text-slate-950 font-bold' : 'bg-slate-200/70 text-slate-600'}`}>
                  {view.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter and Search: Consistent Sleek UI */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Platform Filter Segmented Capsule Pill Group */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80">
            {[
              { id: 'All', label: 'All platforms', icon: 'all' },
              ...userPlatforms.map(p => ({
                id: p,
                label: p,
                icon: p.toLowerCase()
              }))
            ].map(plat => {
              const isActive = effectiveFilter === plat.id;
              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => setPlatformFilter(plat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-2xs font-bold border border-slate-200/90'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {plat.icon === 'linkedin' && (
                    <svg className={`w-3 h-3 fill-current ${isActive ? 'text-blue-600' : 'text-slate-400'}`} viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                    </svg>
                  )}
                  {plat.icon === 'x' && (
                    <svg className={`w-2.5 h-2.5 fill-current ${isActive ? 'text-slate-950' : 'text-slate-400'}`} viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {plat.icon === 'instagram' && (
                    <svg className={`w-3 h-3 fill-current ${isActive ? 'text-pink-600' : 'text-slate-400'}`} viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {plat.icon === 'youtube' && (
                    <svg className={`w-3.5 h-3.5 fill-current ${isActive ? 'text-red-600' : 'text-slate-400'}`} viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                  {plat.icon === 'substack' && (
                    <svg className={`w-3 h-3 fill-current ${isActive ? 'text-orange-600' : 'text-slate-400'}`} viewBox="0 0 24 24">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                  )}
                  <span>{plat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
              <Icon name="search" size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="h-9 pl-9 pr-3.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs outline-none w-36 sm:w-44 focus:w-52 transition-all shadow-2xs focus:border-slate-400 font-sans"
            />
          </div>
        </div>

      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeSubView === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {stages.map(col => {
            const colItems = filteredItems.filter(item => item.stage === col.id);
            return (
              <div 
                key={col.id} 
                className="frosted-glass bg-white/70 rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-3 min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-bold text-slate-900">
                      {col.label}
                    </span>
                  </div>
                  {col.id === 'idea' && (
                    <button
                      type="button"
                      onClick={() => onAddContentItem({
                        id: `item-${Date.now()}`,
                        title: 'New unrefined idea',
                        stage: 'idea',
                        platform: 'LinkedIn',
                        format: 'Text post',
                        hook: 'Hook draft...',
                        day: 'Friday'
                      })}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                      title="Add quick idea"
                    >
                      <Icon name="add" size={15} />
                    </button>
                  )}
                </div>

                {/* Cards in Column */}
                <div className="flex flex-col gap-3">
                  {colItems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium italic border border-dashed border-slate-200 rounded-2xl">
                      No items in {col.label.toLowerCase()} yet
                    </div>
                  ) : (
                    colItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => onOpenContentModal(item)}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:shadow-xs cursor-pointer flex flex-col justify-between gap-3 transition-all active:scale-[0.99] group"
                      >
                        <div>
                          {/* Tags: Platform icon in official color (no text), Format, Calendar Day (Single time) */}
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            {renderPlatformIcons(item.platform)}
                            <span className="text-[11px] text-slate-400 font-medium">
                              {item.format}
                            </span>
                            {item.day && (
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-100/70 border border-amber-200/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5" title={`Scheduled for ${item.day}`}>
                                <Icon name="calendar_month" size={10} className="text-amber-800" />
                                <span>{item.day}</span>
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1.5">
                            {item.title}
                          </h4>

                          {/* Hook preview */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-700 font-medium line-clamp-3 mb-2 leading-relaxed">
                            "{item.hook}"
                          </div>

                          {/* Source material badge */}
                          {item.sourceMaterial && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                              <Icon name="description" size={12} className="text-slate-400" />
                              <span className="truncate">{item.sourceMaterial}</span>
                            </div>
                          )}
                        </div>

                        {/* Connected Action: Edit with Muse */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenInMuse(`Let's refine this board note: "${item.title}". Hook: "${item.hook}". How can we make it hit harder?`, item);
                            }}
                            className="group inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-semibold border border-slate-800 hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.97] cursor-pointer"
                            title="Open and edit this note inside Muse"
                          >
                            <span className="flex items-center justify-center text-[#FEEC98] transition-transform duration-200 group-hover:scale-110">
                              <Icon name="muse_star" size={11} />
                            </span>
                            <span>Edit with Muse</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: CALENDAR VIEW (Subheading removed per request) */}
      {activeSubView === 'calendar' && (
        <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Weekly Content Cadence
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Target: 3 Posts / Week
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {calendarDays.map(day => {
              const dayItems = filteredItems.filter(i => i.day === day);

              return (
                <div 
                  key={day} 
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs min-h-[200px] flex flex-col justify-between transition-all hover:border-slate-300"
                >
                  <div>
                    {/* 1. Day */}
                    <div className="pb-2 border-b border-slate-100 mb-2.5">
                      <span className="text-xs font-bold text-slate-800">{day.slice(0, 3)}</span>
                    </div>

                    {/* Content Items */}
                    <div className="flex flex-col gap-2">
                      {dayItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => onOpenContentModal(item)}
                          className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-left cursor-pointer hover:border-amber-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3 shadow-2xs group"
                        >
                          <div>
                            {/* 2. Social Media Platform Icon */}
                            <div className="flex items-center mb-1.5">
                              {renderPlatformIcons(item.platform)}
                            </div>

                            {/* 3. The Content */}
                            <span className="text-xs font-bold text-slate-900 line-clamp-3 leading-snug">
                              {item.title}
                            </span>
                          </div>

                          {/* 4. The Muse Option */}
                          <div className="pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenInMuse(`Let's refine this scheduled ${day} note: "${item.title}". Hook: "${item.hook || ''}". What are the best hooks and distribution angles?`, item);
                              }}
                              className="w-full py-1.5 px-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
                              title="Muse"
                            >
                              <Icon name="muse_star" size={10} className="text-[#FEEC98]" />
                              <span>Muse</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {dayItems.length === 0 && (
                        <div className="py-6 flex items-center justify-center text-slate-300 text-xs font-medium">
                          —
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: PUBLISHED ARCHIVE */}
      {activeSubView === 'published' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Published Content Library
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredItems.filter(i => i.stage === 'published').map(item => (
              <div 
                key={item.id} 
                className="frosted-glass bg-white/70 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Live on {item.platform}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Published {item.scheduledDate}
                    </span>
                  </div>

                  <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900 mb-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 font-medium line-clamp-1 max-w-2xl">
                    "{item.hook}"
                  </p>

                  {item.metrics && (
                    <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-700">
                      <span>{item.metrics.views?.toLocaleString()} views</span>
                      <span>• {item.metrics.likes} likes</span>
                      <span>• {item.metrics.comments} replies</span>
                      <span>• {item.metrics.reposts} reposts</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.postUrl && (
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <span>View post</span>
                      <Icon name="open_in_new" size={13} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenInMuse(`Repurpose this published post into a new format:\n\nTitle: ${item.title}\nHook: ${item.hook}`, item)}
                    className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Icon name="autorenew" size={14} className="text-[#FEEC98]" />
                    <span>Repurpose</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
