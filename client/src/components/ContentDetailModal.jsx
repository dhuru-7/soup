import React from 'react';
import Icon from './Icon';

/**
 * ContentDetailModal - Apple-designed Post Details Inspector
 * 
 * Strict Apple Design Guidelines:
 * - Read-only post detail inspector (all clumsy edit inputs/selects removed)
 * - Translucent frosted materials (backdrop blur, subtle border highlights)
 * - Clear typographic hierarchy: Title, Scroll-stopping Hook, Outline/Script, Visual Direction
 * - Subtle metadata chips for Platform, Format, Schedule Day, and Pipeline Stage
 * - Seamless "Refine in Muse" action button to develop with AI
 */
export default function ContentDetailModal({ 
  item, 
  isOpen, 
  onClose, 
  onOpenInMuse 
}) {
  if (!isOpen || !item) return null;

  // Platform brand icon helper with official colors
  const renderPlatformBadge = (platformStr) => {
    if (!platformStr) return null;
    const lower = platformStr.toLowerCase();
    
    if (lower.includes('linkedin')) {
      return (
        <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-semibold border border-[#0A66C2]/25 shadow-2xs">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z"/>
          </svg>
          <span>LinkedIn</span>
        </span>
      );
    }

    if (lower.includes('x') || lower.includes('twitter')) {
      return (
        <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-slate-900/10 text-slate-900 text-xs font-semibold border border-slate-900/20 shadow-2xs">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X (Twitter)</span>
        </span>
      );
    }

    if (lower.includes('instagram') || lower.includes('insta')) {
      return (
        <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-rose-500/10 text-rose-600 text-xs font-semibold border border-rose-500/20 shadow-2xs">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>Instagram</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-medium shadow-2xs">
        <span>{platformStr}</span>
      </span>
    );
  };

  const contentBody = item.script || item.outline || item.body || '';

  const handleRefineInMuse = () => {
    if (onOpenInMuse) {
      onOpenInMuse(
        `Let's refine this post: "${item.title}". Hook: "${item.hook || ''}". Outline: "${contentBody.slice(0, 200)}". What are the best hooks and distribution angles?`,
        item
      );
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-md animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 ring-1 ring-slate-900/5 max-h-[88vh] flex flex-col overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Apple-style Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 flex-wrap">
            {renderPlatformBadge(item.platform)}
            {item.format && (
              <span className="inline-flex items-center h-7 px-3 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-semibold shadow-2xs">
                {item.format}
              </span>
            )}
            {item.day && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-amber-50 text-amber-900 border border-amber-200/90 text-xs font-semibold shadow-2xs">
                <Icon name="calendar_month" size={13} className="text-amber-800" />
                <span>{item.day}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200/60 flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ml-2 shadow-2xs"
            title="Close"
          >
            <Icon name="close" size={15} />
          </button>
        </div>

        {/* Scrollable Details Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex flex-col gap-6">
          
          {/* Post Title */}
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 tracking-tight leading-snug">
              {item.title}
            </h2>
            {item.sourceMaterial && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
                <Icon name="description" size={13} className="text-slate-400" />
                <span>Source: {item.sourceMaterial}</span>
              </div>
            )}
          </div>

          {/* The Hook (Scroll-stopper) */}
          {item.hook && (
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                <Icon name="bolt" size={13} className="text-amber-600" />
                <span>The Hook</span>
              </div>
              <p className="text-[14.5px] font-semibold text-slate-900 leading-relaxed italic">
                "{item.hook}"
              </p>
            </div>
          )}

          {/* Body / Script / Outline */}
          {contentBody && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Icon name="notes" size={13} className="text-slate-400" />
                <span>Draft Structure & Outline</span>
              </div>
              <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 text-[13.5px] text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {contentBody}
              </div>
            </div>
          )}

          {/* Visual Asset Direction */}
          {item.visualDirection && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Icon name="photo_camera" size={13} className="text-slate-400" />
                <span>Visual Direction</span>
              </div>
              <div className="rounded-xl bg-slate-50/60 border border-slate-200/60 p-3.5 text-xs text-slate-700 leading-relaxed font-medium">
                {item.visualDirection}
              </div>
            </div>
          )}

        </div>

        {/* Apple-style Bottom Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRefineInMuse}
            className="group relative inline-flex items-center gap-2 h-10 px-5 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm hover:shadow-[0_4px_16px_-2px_rgba(15,23,42,0.4)] border border-slate-800/90 hover:border-slate-700 transition-all duration-150 active:scale-[0.97] cursor-pointer"
            title="Refine this note with Muse"
          >
            <span className="flex items-center justify-center text-[#FEEC98] transition-transform duration-200 group-hover:scale-110">
              <Icon name="muse_star" size={13} />
            </span>
            <span className="tracking-tight">Edit with Muse</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-950 border border-slate-200/90 hover:border-slate-300 text-xs font-semibold transition-all duration-150 active:scale-[0.97] cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
