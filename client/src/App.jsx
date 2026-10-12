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
    const dynamicProfile = {
      founder_id: 'custom_founder',
      identity: {
        name: onboardingState.fullName,
        role: onboardingState.personalRole,
        company_name: onboardingState.entityName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        tagline: onboardingState.mission,
        mission: onboardingState.mission,
        stage: onboardingState.stage.toUpperCase() + ' Stage',
        unfair_advantage: `Expertise in ${onboardingState.expertise.join(', ')}`
      },
      domain_radar: {
        industry: onboardingState.segment || 'Technology & Innovation',
        target_audience: [onboardingState.audience],
        audience_taboos: ['Generic AI advice', 'Unverified assertions'],
        competitors_watched: ['Market Leaders']
      },
      channels: {
        primary: onboardingState.platforms[0] || 'LinkedIn',
        secondary: onboardingState.platforms[1] || 'X (Twitter)'
      },
      voiceprint: {
        insead_archetype: 'The Magnet (Attractor)',
        banned_phrases: ['delve into', 'game-changer', 'humbled and honored', 'thrilled to announce'],
        voice_rules: [
          `Tone signature: ${onboardingState.tones.join(' & ')}`,
          'Zero synthetic corporate filler words.',
          'Direct takeaways rooted in firsthand building.'
        ],
        spicy_take: `We focus strictly on: ${onboardingState.problems}`
      },
      content_pillars: onboardingState.topics.map((top, idx) => ({
        id: `pillar_${idx + 1}`,
        name: top,
        ratio: idx === 0 ? 55 : idx === 1 ? 30 : 15,
        description: `Focused on ${top} delivered via ${onboardingState.formats.join(' and ')}.`
      })),
      weekly_calendar: [
        {
          day: 'Monday',
          platform: onboardingState.platforms[0] || 'LinkedIn',
          format: onboardingState.formats[0] || 'Text post',
          hook: `When we started building ${onboardingState.entityName}, everyone assumed our biggest challenge would be market size.\n\nThey were wrong. The real bottleneck was: ${onboardingState.problems.slice(0, 80)}.`,
          visual_direction: 'Candid photo of current workstation or whiteboard roadmap diagram.',
          follow_up_action: 'Reply to comments from peers and prospective users within the first hour.'
        },
        {
          day: 'Wednesday',
          platform: onboardingState.platforms[1] || 'X (Twitter)',
          format: 'Contrarian Breakdown',
          hook: `Unpopular perspective on ${onboardingState.segment || 'our industry'}:\n\nMost teams over-index on theory. Here is what happened when we tested our hypothesis with real users:`,
          visual_direction: 'Clean benchmark chart or key milestone metric screenshot.',
          follow_up_action: 'Direct-message anyone asking for implementation advice.'
        },
        {
          day: 'Friday',
          platform: onboardingState.platforms[0] || 'LinkedIn',
          format: 'Story & Culture',
          hook: `Building in public isn't about celebrating comfortable wins.\n\nHere is what we learned this week while shipping at ${onboardingState.entityName}:`,
          visual_direction: 'Unfiltered team or prototype development photo.',
          follow_up_action: 'Engage with community members who share their own lessons.'
        }
      ],
      goals_tracking: {
        timeframe: onboardingState.horizon,
        metrics: {
          inbound_leads: { current: 3, target: 15, unit: 'Inquiries' },
          community_advocates: { current: 140, target: 500, unit: 'Members' },
          speaking_invites: { current: 1, target: 5, unit: 'Panels' },
          authority_score: { current: 75, target: 92, unit: '/100' }
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
