import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { PROFILES_DATA } from './data/profilesData';

export default function App() {
  const [viewMode, setViewMode] = useState('onboarding'); // 'onboarding' | 'dashboard'
  const [currentProfileId, setCurrentProfileId] = useState('arjun_vance');
  const [customProfile, setCustomProfile] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(1);

  const activeProfile = customProfile || PROFILES_DATA[currentProfileId] || PROFILES_DATA['arjun_vance'];

  const handleOnboardingComplete = (onboardingState) => {
    const turningPt = onboardingState.turningPoint || onboardingState.originScar || '';
    const spicy = onboardingState.unpopularOpinion || onboardingState.spicyTake || '';
    const hobbiesList = (onboardingState.hobbies || []).join(', ');
    const brandArch = onboardingState.brandStyle || onboardingState.archetype || 'The Builder (Share the Work)';
    const realAssetsList = onboardingState.realAssets || onboardingState.availableAssets || [];
    const annoyancesList = onboardingState.annoyances || onboardingState.audienceTaboos || [];

    const dynamicProfile = {
      founder_id: 'custom_founder',
      identity: {
        name: onboardingState.fullName,
        role: onboardingState.role,
        company_name: onboardingState.entityName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        tagline: onboardingState.mission,
        mission: onboardingState.mission,
        origin_scar: turningPt,
        stage: 'Active Scaling',
        unfair_advantage: `Authority in ${(onboardingState.expertise || []).join(', ')}${hobbiesList ? ` • Personal quirks: ${hobbiesList}` : ''}`
      },
      domain_radar: {
        industry: onboardingState.entityName ? `${onboardingState.entityName} Space` : 'Technology & Innovation',
        target_audience: [onboardingState.audience],
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
  };

  const handleSwitchProfile = (profileId) => {
    setCustomProfile(null);
    setCurrentProfileId(profileId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#FAD02C] selection:text-slate-950 flex flex-col justify-center">
      <main className="flex-1 flex flex-col justify-center">
        {viewMode === 'onboarding' ? (
          <Onboarding 
            initialProfile={activeProfile} 
            currentStep={onboardingStep}
            onStepChange={setOnboardingStep}
            onComplete={handleOnboardingComplete} 
          />
        ) : (
          <Dashboard 
            profile={activeProfile}
            currentProfileId={currentProfileId}
            onSwitchProfile={handleSwitchProfile}
            onRestartOnboarding={() => {
              setOnboardingStep(1);
              setViewMode('onboarding');
            }}
          />
        )}
      </main>
    </div>
  );
}
