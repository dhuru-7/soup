import React from 'react';
import Icon from './Icon';

export default function Navigation({ 
  activePage, 
  setActivePage, 
  profile, 
  currentProfileId,
  onSwitchProfile,
  onRestartOnboarding,
  onOpenQuickCapture,
  currentUser,
  onOpenAuth 
}) {
  const navItems = [
    { id: 'overview', label: 'Home', icon: 'home', desc: 'Command center & pulse' },
    { id: 'muse', label: 'Muse', icon: 'star', desc: 'AI collaborator & research' },
    { id: 'studio', label: 'Scrapbook', icon: 'collections_bookmark', desc: 'Content command center & board' },
  ];

  return (
    <>
      {/* =========================================================================
          DESKTOP VERTICAL SIDEMENU (md and up)
         ========================================================================= */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white/90 backdrop-blur-md border-r border-slate-200/80 sticky top-0 h-screen flex-col justify-between p-5 select-none z-30">
        
        {/* Top Section: Clean Soup Brand & Quick CTA */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="font-heading text-2xl font-black tracking-tight text-slate-950">
              Soup
            </span>
          </div>

          {/* Primary Action Button: 10% more intense canary gold (#FFCC00) */}
          <button
            type="button"
            onClick={onOpenQuickCapture}
            className="w-full mt-4 h-10 px-4 rounded-xl bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] transition-all"
            title="Capture raw note, voice memo, or idea"
          >
            <Icon name="add" size={18} className="text-slate-950 font-bold" />
            <span>New idea</span>
          </button>

          {/* Vertical Page Switcher Menu */}
          <nav className="flex flex-col gap-1.5 mt-6">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left active:scale-[0.98] ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                  title={item.desc}
                >
                  <Icon 
                    name={item.icon} 
                    size={19} 
                    className={isActive ? 'text-[#FFCC00]' : 'text-slate-400'} 
                  />
                  <span className="text-[13px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Founder Identity */}
        {profile?.identity && (
          <div className="pt-3 border-t border-slate-200/80 flex items-center px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={profile.identity.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt={profile.identity.name || 'Founder'} 
                className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-2xs shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {profile.identity.name || 'Founder'}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {profile.identity.company_name || 'Founder Identity'}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* =========================================================================
          MOBILE TOP & BOTTOM BARS (< md screens)
         ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 h-14 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <span className="font-heading text-xl font-black tracking-tight text-slate-950">
            Soup
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenQuickCapture}
            className="h-8 px-3 rounded-lg bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs flex items-center gap-1 shadow-2xs active:scale-95"
          >
            <Icon name="add" size={16} />
            <span>New</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 flex items-center justify-around select-none">
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
                isActive ? 'text-slate-950 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                className={isActive ? 'text-amber-500 font-bold' : 'text-slate-400'} 
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
