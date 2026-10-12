import React, { useState } from 'react';
import Icon from './Icon';

export default function StudioView({ 
  profile, 
  contentItems, 
  collectedInbox, 
  onUpdateContentItem, 
  onAddContentItem, 
  onDeleteContentItem,
  onOpenContentModal, 
  onOpenInMuse, 
  onOpenQuickCapture 
}) {
  const [activeSubView, setActiveSubView] = useState('board'); // 'board' | 'calendar' | 'inbox' | 'published'
  const [platformFilter, setPlatformFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const stages = [
    { id: 'idea', label: 'Ideas', color: 'border-slate-300 text-slate-700 bg-slate-100' },
    { id: 'draft', label: 'Drafts (Needs Review)', color: 'border-amber-300 text-amber-900 bg-amber-100' },
    { id: 'approved', label: 'Approved', color: 'border-blue-300 text-blue-900 bg-blue-100' },
    { id: 'published', label: 'Published', color: 'border-emerald-300 text-emerald-900 bg-emerald-100' },
  ];

  const filteredItems = contentItems.filter(item => {
    const matchesPlatform = platformFilter === 'All' || item.platform?.toLowerCase().includes(platformFilter.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.hook?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const calendarDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleMoveStage = (e, item, newStage) => {
    e.stopPropagation();
    onUpdateContentItem({
      ...item,
      stage: newStage
    });
  };

  return (
    <div className="max-w-[1320px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* Studio Header & Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Scrapbook
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Turn ideas, research, personal stories, and raw uploads into an organized publishing pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Primary CTA button: 10% more intense canary gold #FFCC00 */}
          <button
            type="button"
            onClick={onOpenQuickCapture}
            className="px-4 py-2 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Icon name="add" size={16} />
            <span>Capture note</span>
          </button>
        </div>
      </div>

      {/* Sub-View Switcher & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* 4 Internal Views: Board · Calendar · Collected (Inbox) · Published */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 self-start">
          {[
            { id: 'board', label: 'Board', icon: 'view_kanban', count: contentItems.length },
            { id: 'calendar', label: 'Calendar', icon: 'calendar_month', count: 3 },
            { id: 'inbox', label: 'Collected (Inbox)', icon: 'inbox', count: collectedInbox.length },
            { id: 'published', label: 'Published', icon: 'task_alt', count: contentItems.filter(i => i.stage === 'published').length },
          ].map(view => {
            const isActive = activeSubView === view.id;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveSubView(view.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
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

        {/* Filter and Search */}
        <div className="flex items-center gap-2">
          <select
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value)}
            className="h-8 px-3 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold outline-none"
          >
            <option value="All">All platforms</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X">X / Twitter</option>
            <option value="Instagram">Instagram</option>
          </select>

          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
              <Icon name="search" size={13} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="h-8 pl-7 pr-3 rounded-full bg-white border border-slate-200 text-slate-800 text-xs outline-none w-36 sm:w-44 focus:w-52 transition-all"
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${col.color}`}>
                      {colItems.length}
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
                      className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
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
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:shadow-xs cursor-pointer flex flex-col justify-between gap-3 transition-all active:scale-[0.99]"
                      >
                        <div>
                          {/* Tags */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                              {item.platform}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {item.format}
                            </span>
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

                        {/* Action Bar & Quick Stage Move */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5">
                            <span>Edit card</span>
                            <Icon name="chevron_right" size={13} />
                          </span>

                          {/* Quick stage selector */}
                          <select
                            value={item.stage}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleMoveStage(e, item, e.target.value)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 outline-none cursor-pointer"
                          >
                            <option value="idea">Idea</option>
                            <option value="draft">Draft</option>
                            <option value="approved">Approved</option>
                            <option value="published">Published</option>
                          </select>
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

      {/* VIEW 2: CALENDAR VIEW */}
      {activeSubView === 'calendar' && (
        <div className="frosted-glass bg-white/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Weekly Content Cadence (Week 2 of 12)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Publishing slots vs planning tasks for this sprint
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Target: 3 Posts / Week
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {calendarDays.map(day => {
              const dayItems = filteredItems.filter(i => i.day === day || (day === 'Wednesday' && i.stage === 'draft'));
              const isPublishDay = ['Monday', 'Wednesday', 'Friday'].includes(day);

              return (
                <div 
                  key={day} 
                  className={`p-3.5 rounded-2xl border min-h-[220px] flex flex-col justify-between ${
                    isPublishDay 
                      ? 'bg-white border-amber-200/80 shadow-2xs' 
                      : 'bg-slate-50/60 border-slate-200/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold text-slate-800">{day.slice(0, 3)}</span>
                      {isPublishDay ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                          Live slot
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Rest/Prep</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {dayItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => onOpenContentModal(item)}
                          className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-left cursor-pointer hover:bg-amber-100/70 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[9px] font-bold text-amber-900 mb-1">
                            <span>{item.platform}</span>
                            <span className="uppercase">{item.stage}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isPublishDay && dayItems.length === 0 && (
                    <button
                      type="button"
                      onClick={() => onOpenQuickCapture()}
                      className="w-full py-1.5 rounded-lg border border-dashed border-amber-300 text-[11px] font-semibold text-amber-800 hover:bg-amber-50 transition-colors"
                    >
                      + Schedule slot
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: COLLECTED / IDEA INBOX */}
      {activeSubView === 'inbox' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Idea Inbox (Raw Scraps & Proof Receipts)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Unprocessed voice notes, Slack quotes, customer feedback, and quick thoughts
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenQuickCapture}
              className="px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-slate-800 transition-all"
            >
              <Icon name="add" size={14} />
              <span>Capture new note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collectedInbox.map(inboxItem => (
              <div 
                key={inboxItem.id}
                className="frosted-glass bg-white/70 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-4 hover:border-amber-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {inboxItem.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {inboxItem.date}
                    </span>
                  </div>

                  <h4 className="font-heading text-sm font-bold text-slate-900 mb-1.5">
                    {inboxItem.title}
                  </h4>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    "{inboxItem.snippet}"
                  </p>

                  <span className="text-[10px] text-slate-400 block mt-2">
                    Source: {inboxItem.source}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenInMuse(`Develop this raw thought into a calibrated post:\n\nTitle: ${inboxItem.title}\nSnippet: ${inboxItem.snippet}`)}
                  className="self-start px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                >
                  <Icon name="smart_toy" size={14} className="text-[#FEEC98]" />
                  <span>Develop with Muse →</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: PUBLISHED ARCHIVE */}
      {activeSubView === 'published' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Published Content Library
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live posts with engagement benchmarks and instant repurpose actions
              </p>
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
                    onClick={() => onOpenInMuse(`Repurpose this published post into a new format:\n\nTitle: ${item.title}\nHook: ${item.hook}`)}
                    className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
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
