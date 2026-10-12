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
  const [isHovered, setIsHovered] = React.useState(false);

  const navItems = [
    { id: 'overview', label: 'Home', icon: 'home', desc: 'Command center & pulse' },
    { id: 'muse', label: 'Muse', icon: 'star', desc: 'AI collaborator & research' },
    { id: 'studio', label: 'Scrapbook', icon: 'collections_bookmark', desc: 'Content command center & board' },
  ];

  return (
    <>
      {/* Desktop in-flow placeholder so main content never shifts or resizes */}
      <div className="hidden md:block w-[72px] shrink-0" aria-hidden="true" />

      {/* =========================================================================
          DESKTOP VERTICAL SIDEMENU (Expands OVER content on hover)
         ========================================================================= */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-0 left-0 h-screen flex-col justify-between select-none z-50 transition-[width,padding,box-shadow] duration-300 ease-out overflow-hidden ${
          isHovered 
            ? 'w-64 p-5 bg-white/98 backdrop-blur-xl border-r border-slate-200/90 shadow-2xl ring-1 ring-black/5' 
            : 'w-[72px] px-2.5 py-5 bg-white/95 backdrop-blur-md border-r border-slate-200/80 shadow-xs'
        }`}
      >
        
        {/* Navigation Items (No Soup in top header) */}
        <div className="flex flex-col pt-1">
          <nav className="flex flex-col gap-1.5">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center rounded-xl text-xs font-semibold transition-all text-left active:scale-[0.98] ${
                    isHovered ? 'px-3.5 py-2.5 gap-3' : 'p-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                  title={item.label}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    fill={isActive}
                    className={`shrink-0 ${isActive ? 'text-[#FFCC00]' : 'text-slate-400'}`} 
                  />
                  {isHovered && (
                    <span className="text-[13px] whitespace-nowrap truncate animate-fade-in font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Founder Identity (Clicking navigates to Profile) */}
        {profile?.identity && (
          <div className={`pt-3 border-t border-slate-200/80 transition-all ${isHovered ? '' : 'flex justify-center'}`}>
            <button
              type="button"
              onClick={() => setActivePage('you')}
              className={`group w-full flex items-center rounded-xl text-xs font-semibold transition-all text-left active:scale-[0.98] ${
                isHovered ? 'px-3 py-2.5 gap-3' : 'p-1.5 justify-center'
              } ${
                activePage === 'you'
                  ? 'bg-slate-950 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
              }`}
              title="Open Profile"
            >
              <img 
                src={profile.identity.avatar || (profile.founder_id === 'maya_lin' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')} 
                alt={profile.identity.name || profile.name || 'User Profile'} 
                className={`w-8 h-8 rounded-full object-cover shrink-0 shadow-2xs transition-colors ${
                  activePage === 'you' ? 'border border-white/20' : 'border border-slate-200 group-hover:border-slate-300'
                }`}
              />
              {isHovered && (
                <div className="flex flex-col min-w-0 animate-fade-in">
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
              )}
            </button>
          </div>
        )}
      </aside>

      {/* =========================================================================
          MOBILE TOP & BOTTOM BARS (< md screens)
         ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 h-14 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <span className="font-heading text-lg font-bold tracking-tight text-slate-950">
            {activePage === 'overview' ? 'Home' : activePage === 'muse' ? 'Muse' : activePage === 'studio' ? 'Scrapbook' : 'Profile'}
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
