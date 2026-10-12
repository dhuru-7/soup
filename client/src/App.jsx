import React, { useState, useEffect, useCallback } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { PROFILES_DATA } from './data/profilesData';

function parseUrlState() {
  if (typeof window === 'undefined') {
    return { viewMode: 'dashboard', activePage: 'overview', profileId: 'arjun_vance', step: 1 };
  }
  const rawPath = (window.location.pathname || '/').toLowerCase().replace(/\\/g, '/').replace(/\/$/, '') || '/';
  const params = new URLSearchParams(window.location.search);
  const profileParam = params.get('profile') || 'arjun_vance';
  const stepParam = parseInt(params.get('step') || '1', 10);

  const validProfileId = ['arjun_vance', 'maya_lin'].includes(profileParam) ? profileParam : 'arjun_vance';
  const validStep = stepParam >= 1 && stepParam <= 5 ? stepParam : 1;

  // 1. Check path-based routing (/home, /muse, /scrapbook, /profile, /onboarding)
  if (rawPath === '/onboarding' || params.get('page') === 'onboarding') {
    return {
      viewMode: 'onboarding',
      activePage: 'overview',
      profileId: validProfileId,
      step: validStep
    };
  }

  let resolvedPage = 'overview';
  if (rawPath === '/muse' || params.get('page') === 'muse') resolvedPage = 'muse';
  else if (rawPath === '/scrapbook' || rawPath === '/studio' || params.get('page') === 'scrapbook' || params.get('page') === 'studio') resolvedPage = 'studio';
  else if (rawPath === '/profile' || rawPath === '/you' || params.get('page') === 'profile' || params.get('page') === 'you') resolvedPage = 'you';
  else if (rawPath === '/home' || rawPath === '/' || params.get('page') === 'home' || params.get('page') === 'overview') resolvedPage = 'overview';

  return {
    viewMode: 'dashboard',
    activePage: resolvedPage,
    profileId: validProfileId,
    step: validStep
  };
}

export default function App() {
  const [initialState] = useState(() => parseUrlState());
  const [viewMode, setViewMode] = useState(initialState.viewMode); // 'onboarding' | 'dashboard'
  const [activePage, setActivePage] = useState(initialState.activePage); // 'overview' | 'muse' | 'studio' | 'you'
  const [currentProfileId, setCurrentProfileId] = useState(initialState.profileId);
  const [customProfile, setCustomProfile] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(initialState.step);

  const activeProfile = customProfile || PROFILES_DATA[currentProfileId] || PROFILES_DATA['arjun_vance'];

  const syncUrl = useCallback((newViewMode, newPage, newProfileId, newStep) => {
    if (typeof window === 'undefined' || !window.history.pushState) return;

    let path = '/home';
    if (newViewMode === 'onboarding') {
      path = '/onboarding';
    } else {
      if (newPage === 'overview') path = '/home';
      else if (newPage === 'muse') path = '/muse';
      else if (newPage === 'studio') path = '/scrapbook';
      else if (newPage === 'you') path = '/profile';
    }

    const params = new URLSearchParams();
    if (newProfileId && newProfileId !== 'arjun_vance' && newProfileId !== 'custom_founder') {
      params.set('profile', newProfileId);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${path}${queryString}`;

    window.history.pushState(
      { viewMode: newViewMode, activePage: newPage, profileId: newProfileId, step: newStep },
      '',
      newUrl
    );
  }, []);

  // Sync on browser back/forward buttons & normalize root URL to clean path
  useEffect(() => {
    const handlePopState = () => {
      const state = parseUrlState();
      setViewMode(state.viewMode);
      setActivePage(state.activePage);
      setCurrentProfileId(state.profileId);
      setOnboardingStep(state.step);
    };
    window.addEventListener('popstate', handlePopState);

    // Initial URL cleanup if on root '/' or legacy query string
    if (window.location.pathname === '/' || window.location.search.includes('page=')) {
      syncUrl(viewMode, activePage, currentProfileId, onboardingStep);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewMode, activePage, currentProfileId, onboardingStep, syncUrl]);

  const handleOnboardingComplete = (onboardingState) => {
    // If completed as Maya Lin preset
    if (onboardingState.fullName === 'Maya Lin' || onboardingState.entityName === 'Solace Botanicals') {
      setCustomProfile(null);
      setCurrentProfileId('maya_lin');
      setViewMode('dashboard');
      setActivePage('overview');
      syncUrl('dashboard', 'overview', 'maya_lin', 1);
      return;
    }

    // If completed as Arjun Vance preset
    if (onboardingState.fullName === 'Arjun Vance' || onboardingState.entityName === 'AgentScale') {
      setCustomProfile(null);
      setCurrentProfileId('arjun_vance');
      setViewMode('dashboard');
      setActivePage('overview');
      syncUrl('dashboard', 'overview', 'arjun_vance', 1);
      return;
    }

    const turningPt = onboardingState.whyStarted || onboardingState.turningPoint || onboardingState.originScar || '';
    const spicy = onboardingState.unpopularOpinion || onboardingState.spicyTake || '';
    const hobbiesList = (onboardingState.hobbies || []).join(', ');
    const brandArch = onboardingState.brandStyle || onboardingState.archetype || 'The Builder (Share the Work)';
    const realAssetsList = onboardingState.realAssets || onboardingState.availableAssets || [];
    const annoyancesList = onboardingState.annoyances || onboardingState.audienceTaboos || [];
    const targetAudiencesList = onboardingState.audiences || (onboardingState.audience ? [onboardingState.audience] : ['Technical Leaders']);

    const dynamicProfile = {
      founder_id: 'custom_founder',
      identity: {
        name: onboardingState.fullName,
        role: onboardingState.role,
        company_name: onboardingState.entityName,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        tagline: onboardingState.mission,
        mission: onboardingState.mission,
        origin_scar: turningPt,
        stage: 'Active Scaling',
        unfair_advantage: `Authority in ${(onboardingState.expertise || []).join(', ')}${hobbiesList ? ` • Personal quirks: ${hobbiesList}` : ''}`
      },
      domain_radar: {
        industry: onboardingState.entityName ? `${onboardingState.entityName} Space` : 'Technology & Innovation',
        target_audience: targetAudiencesList,
        audience_taboos: annoyancesList,
        competitors_watched: ['Market Incumbents', 'Legacy Tools']
      },
      channels: {
        primary: onboardingState.platforms?.[0] || 'LinkedIn',
        secondary: onboardingState.platforms?.[1] || 'X (Twitter)'
      },
      voiceprint: {
        insead_archetype: brandArch,
        banned_phrases: onboardingState.bannedPhrases || ['delve into', 'game-changer', 'humbled and honored', 'thrilled to announce'],
        voice_rules: [
          `Tone signature: ${brandArch}`,
          hobbiesList ? `Humanizing metaphors: draws analogies from ${hobbiesList}` : 'Real-world personal analogies',
          'Zero synthetic corporate filler words.',
          'Direct takeaways rooted in firsthand building.'
        ],
        spicy_take: spicy
      },
      execution_capacity: {
        channels: onboardingState.platforms || ['LinkedIn', 'X / Twitter'],
        available_assets: realAssetsList
      },
      content_pillars: [
        {
          id: 'pillar_1',
          name: 'Core Proof & Building in Public',
          ratio: 60,
          description: `Real building-in-public metrics, architectural teardowns, and lessons from ${onboardingState.entityName}.`
        },
        {
          id: 'pillar_2',
          name: 'Unpopular Industry Takes',
          ratio: 25,
          description: `Challenging lazy orthodoxies. Centerpiece: "${spicy}".`
        },
        {
          id: 'pillar_3',
          name: 'The Human Founder Story',
          ratio: 15,
          description: `Turning points and lessons from struggle: "${turningPt.slice(0, 80)}...".`
        }
      ],
      weekly_calendar: [
        {
          day: 'Monday',
          platform: onboardingState.platforms?.[0] || 'LinkedIn',
          format: 'High-Proof Teardown',
          hook: `Most founders hide what goes wrong behind closed doors.\n\nWhen we were building ${onboardingState.entityName}, here is the exact friction that forced us to rewrite our core engine:`,
          visual_direction: `Attach: ${realAssetsList[0] || 'Terminal screenshot or trace log'}.`,
          follow_up_action: 'Reply to comments from peers and engineers within the first 60 minutes.'
        },
        {
          day: 'Wednesday',
          platform: onboardingState.platforms?.[1] || 'X (Twitter)',
          format: 'The Contrarian Wedge',
          hook: `Unpopular opinion: "${spicy}"\n\nWhy 90% of people in our industry get this wrong:`,
          visual_direction: `Attach: ${realAssetsList[1] || 'Whiteboard sketch comparing old vs new approach'}.`,
          follow_up_action: 'Retweet with additional context if debate sparks in comments.'
        },
        {
          day: 'Friday',
          platform: onboardingState.platforms?.[0] || 'LinkedIn',
          format: 'Origin Story & Culture',
          hook: `This is what building looks like when things break:\n\n${turningPt.slice(0, 110)}...`,
          visual_direction: `Attach: ${realAssetsList[2] || 'Unfiltered workstation photo'}.`,
          follow_up_action: 'Directly message qualified applicants or prospective partners who engage.'
        }
      ],
      goals_tracking: {
        north_star: 'Authority & Inbound Velocity',
        metrics: {
          inbound_leads: { current: 3, target: 15, unit: 'Inquiries' },
          community_advocates: { current: 140, target: 500, unit: 'Members' },
          speaking_invites: { current: 1, target: 5, unit: 'Panels' },
          authority_score: { current: 78, target: 94, unit: '/100' }
        }
      }
    };

    setCustomProfile(dynamicProfile);
    setViewMode('dashboard');
    setActivePage('overview');
    syncUrl('dashboard', 'overview', 'custom_founder', 1);
  };

  const handleSwitchProfile = (profileId) => {
    setCustomProfile(null);
    setCurrentProfileId(profileId);
    syncUrl(viewMode, activePage, profileId, onboardingStep);
  };

  const handlePageChange = (newPageId) => {
    setActivePage(newPageId);
    setViewMode('dashboard');
    syncUrl('dashboard', newPageId, currentProfileId, onboardingStep);
  };

  const handleStepChange = (newStep) => {
    setOnboardingStep(newStep);
    syncUrl('onboarding', activePage, currentProfileId, newStep);
  };

  const handleRestartOnboarding = () => {
    setOnboardingStep(1);
    setViewMode('onboarding');
    syncUrl('onboarding', 'overview', currentProfileId, 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#FEEC98] selection:text-slate-950 flex flex-col">
      <main className={`flex-1 flex flex-col ${viewMode === 'onboarding' ? 'justify-center' : ''}`}>
        {viewMode === 'onboarding' ? (
          <Onboarding 
            initialProfile={activeProfile} 
            currentStep={onboardingStep}
            onStepChange={handleStepChange}
            onComplete={handleOnboardingComplete} 
          />
        ) : (
          <Dashboard 
            profile={activeProfile}
            currentProfileId={currentProfileId}
            activePage={activePage}
            onPageChange={handlePageChange}
            onSwitchProfile={handleSwitchProfile}
            onRestartOnboarding={handleRestartOnboarding}
          />
        )}
      </main>
    </div>
  );
}
