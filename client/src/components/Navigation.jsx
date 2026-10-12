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

          {/* Vertical Page Switcher Menu */}
          <nav className="flex flex-col gap-1.5 mt-4">
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
                    fill={isActive}
                    className={isActive ? 'text-[#FFCC00]' : 'text-slate-400'} 
                  />
                  <span className="text-[13px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Founder Identity (Clicking navigates to Profile) */}
        {profile?.identity && (
          <div className="pt-3 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => setActivePage('you')}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left active:scale-[0.98] ${
                activePage === 'you'
                  ? 'bg-slate-950 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
              }`}
              title="Open Founder Profile (/profile)"
            >
              <img 
                src={profile.identity.avatar || (profile.founder_id === 'maya_lin' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')} 
                alt={profile.identity.name || profile.name || 'User Profile'} 
                className={`w-8 h-8 rounded-full object-cover shrink-0 shadow-2xs transition-colors ${
                  activePage === 'you' ? 'border border-white/20' : 'border border-slate-200 group-hover:border-slate-300'
                }`}
              />
              <div className="flex flex-col min-w-0">
                <span className={`text-[13px] font-semibold truncate leading-tight transition-colors ${
                  activePage === 'you' ? 'text-white font-bold' : 'text-slate-900 group-hover:text-slate-950'
                }`}>
                  {profile.identity.name || profile.name || 'User Profile'}
                </span>
                <span className={`text-[11px] truncate leading-normal transition-colors ${
                  activePage === 'you' ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-600'
                }`}>
                  {profile.identity.company_name || profile.company || profile.identity.role || ''}
                </span>
              </div>
            </button>
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
          {profile?.identity && (
            <button
              type="button"
              onClick={() => setActivePage('you')}
              className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 active:scale-95 shadow-2xs"
              title="Open Profile"
            >
              <img 
                src={profile.identity.avatar || (profile.founder_id === 'maya_lin' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </button>
          )}
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
                fill={isActive}
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
