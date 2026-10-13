export function getInitialStudioData(profile) {
  const isMaya = profile?.founder_id === 'maya_lin';
  const founderName = profile?.identity?.name || 'Founder';
  const companyName = profile?.identity?.company_name || 'Startup';
  const whyStarted = profile?.identity?.origin_scar || 'Realized existing industry tools were broken after a painful production failure.';
  const spicyTake = profile?.voiceprint?.spicy_take || 'Most common industry practices are 90% marketing hype.';
  const hobbies = profile?.voiceprint?.hobbies || 'Chess & Coffee';

  if (isMaya) {
    return {
      contentItems: [
        {
          id: 'item-m1',
          title: 'Why I left General Mills to start Solace Botanicals',
          stage: 'draft',
          platform: 'LinkedIn',
          format: 'Short video',
          day: 'Wednesday',
          theme: 'Founder story · Personal experience',
          contentAngle: 'The ethical turning point: realizing industrial food science prioritizes shelf-stability over human gut health.',
          hook: "14 beverage manufacturing plants told me my formula was 'commercially impossible' unless I added artificial guar gum and synthetic stabilizers.\n\nHere is what happened when I refused to poison my own product for higher margins:",
          outline: "1. The boardroom meeting where cost-cutting won over nutrition.\n2. Hand-formulating the first 500 cans in an Oregon lab.\n3. The retail buyers who told me I was crazy.",
          script: "When you look at a canned sparkling drink that lasts 2 years at room temperature, you aren't drinking nutrition. You are drinking preservatives. When I left big food science...",
          visualDirection: "Candid photo on the warehouse floor holding prototype can next to laboratory lab test sheets.",
          sourceMaterial: "Founder onboarding note • Oregon lab testing batch #04",
          nextAction: "Confirm story details",
          targetAudience: "Conscious Health Consumers & Retail Buyers",
          scheduledDate: "2026-10-15"
        },
        {
          id: 'item-m2',
          title: 'The raw unit economics of getting into Whole Foods',
          stage: 'published',
          platform: 'LinkedIn & Instagram',
          format: 'Raw Founder Diary',
          day: 'Monday',
          theme: 'The Raw Founder Diary',
          contentAngle: 'Exposing the hidden costs of retail slotting fees and pallet distribution that crush food startups.',
          hook: "Most people think getting into retail is a victory lap.\n\nIn reality, getting our first 12 Whole Foods placements almost bankrupted us.\n\nHere is the raw unit economics of consumer packaged goods nobody warns you about:",
          visualDirection: "Photo of handwritten pallet inventory clipboard and shipping boxes in cold storage.",
          metrics: { views: 24500, likes: 612, comments: 94, reposts: 58 },
          postUrl: "https://linkedin.com/in/mayalin/post-941",
          scheduledDate: "2026-10-13"
        },
        {
          id: 'item-m3',
          title: 'What the FDA allows beverage brands to hide under Natural Flavors',
          stage: 'idea',
          platform: 'LinkedIn',
          format: 'Carousel',
          day: 'Friday',
          theme: 'Clean Living Science & Education',
          contentAngle: 'Actionable ingredient education explaining chemical solvents and flavor extract loopholes.',
          hook: "Next time you pick up a 'healthy sparkling water', look at the ingredients list.\n\nIf it says 'Natural Flavors', here is what the FDA legally allows beverage brands to hide from you:",
          visualDirection: "Macro close-up photo comparing pure organic ashwagandha root vs synthetic powder.",
          sourceMaterial: "FDA Code of Federal Regulations Title 21 benchmark",
          nextAction: "Draft slides",
          scheduledDate: "2026-10-17"
        },
        {
          id: 'item-m4',
          title: 'Rejecting 14 co-packers: Our ingredient purity charter',
          stage: 'approved',
          platform: 'LinkedIn',
          format: 'Category Defense',
          day: 'Thursday',
          theme: 'Supply Chain & Food Truths',
          contentAngle: 'Why we refused to add maltodextrin even though it would have doubled our gross margins.',
          hook: "A co-packer looked at our ingredient bill and laughed. 'Just add 2% maltodextrin. Nobody reads the fine print and you will double your margin.'\n\nWe walked out of the room. Here is our non-negotiable purity charter:",
          visualDirection: "Photo of raw dried lion's mane mushroom bales in warehouse reception.",
          nextAction: "Ready to schedule",
          scheduledDate: "2026-10-16"
        }
      ],
      collectedInbox: [
        {
          id: 'inbox-m1',
          title: 'Whole Foods buyer comment on zero gum formulation',
          snippet: "Buyer at Pacific Northwest region said: 'Customers are specifically asking for gum-free drinks now. You are 6 months ahead of the curve.'",
          type: 'Receipt',
          date: '3 hours ago',
          source: 'Email receipt'
        },
        {
          id: 'inbox-m2',
          title: 'Why adaptogen brewing is like specialty fermentation',
          snippet: "Observation linking soil biome microbial diversity to cold-steep extraction times for rhodiola root.",
          type: 'Story',
          date: 'Yesterday',
          source: 'Voice memo from farm visit'
        },
        {
          id: 'inbox-m3',
          title: 'Cost per can breakdown vs legacy soda',
          snippet: "Legacy soda cost per can: $0.09 (mostly high-fructose corn syrup & aluminum). Solace cost per can: $0.78 (pure regenerative extracts).",
          type: 'Research',
          date: '4 days ago',
          source: 'Spreadsheet export'
        }
      ],
      agentMemory: [
        { id: 'mem-m1', category: 'fact', text: "Left General Mills food science division after discovering corporate cost-cutting compromised consumer gut health.", origin: "Onboarding DNA", verified: true },
        { id: 'mem-m2', category: 'fact', text: "Solace Botanicals operates at $65k MRR, bootstrapped to retail shelves in 18 organic stores.", origin: "Founder profile", verified: true },
        { id: 'mem-m3', category: 'fact', text: "Rejected 14 contract manufacturers because they insisted on adding artificial gums and emulsifiers.", origin: "Founder note", verified: true },
        { id: 'mem-m4', category: 'voice', text: "Speaks with the candor of a protective food scientist who cares about real families; zero elitist wellness jargon.", origin: "Voice rule", verified: true },
        { id: 'mem-m5', category: 'voice', text: "Analogies drawn from regenerative farming, soil health, and organic culinary fermentation.", origin: "Hobbies intake", verified: true },
        { id: 'mem-m6', category: 'voice', text: "Automated negative lexicon: blocks 'miracle cure', 'guilt-free indulgence', 'game-changing wellness'.", origin: "Anti-AI guardrail", verified: true },
        { id: 'mem-m7', category: 'research', text: "Consumers respond strongest to behind-the-scenes warehouse mess and unscripted lab rejections.", origin: "Performance hypothesis", verified: false }
      ]
    };
  }

  // Any founder that is not the legacy demo Arjun Vance starts with a clean slate
  const isDemoArjun = profile?.identity?.name === 'Arjun Vance' && profile?.identity?.company_name === 'AgentScale';
  if (!isDemoArjun && !isMaya) {
    const archetypeName = profile?.voiceprint?.insead_archetype || 'The Builder';
    return {
      contentItems: [],
      collectedInbox: [],
      agentMemory: [
        { id: 'mem-1', category: 'fact', text: `Founded ${companyName}: ${whyStarted}`, origin: 'Onboarding Scar', verified: true },
        { id: 'mem-2', category: 'fact', text: `Company mission: ${profile?.identity?.mission || 'Scaling products'}`, origin: 'Company Intake', verified: true },
        { id: 'mem-3', category: 'voice', text: `Voice Archetype: ${archetypeName}. Core perspective: "${spicyTake}".`, origin: 'Voice Signature', verified: true },
        { id: 'mem-4', category: 'voice', text: `Personal analogies drawn from: ${hobbies}.`, origin: 'Hobbies Intake', verified: true },
        ...(profile?.domain_radar?.audience_taboos || []).map((t, idx) => ({
          id: `mem-taboo-${idx}`,
          category: 'voice',
          text: `Anti-BS Guardrail: Rejects "${t}".`,
          origin: 'Pet Peeves Intake',
          verified: true
        }))
      ]
    };
  }

  // Preset demo Arjun Vance
  return {
    contentItems: [
      {
        id: 'item-1',
        title: `Why I started building ${companyName}`,
        stage: 'draft',
        platform: 'LinkedIn',
        format: 'Short video',
        day: 'Wednesday',
        theme: 'Founder story · Personal experience',
        contentAngle: 'The real problem that motivated the founder to start building, told through a specific moment rather than a generic motivational story.',
        hook: `I didn't start building ${companyName} because I had everything figured out.\n\nI started because: "${whyStarted.slice(0, 110)}..."`,
        outline: "1. The exact moment of friction that broke conventional tools.\n2. Realizing legacy APMs and debuggers are completely blind to multi-agent loops.\n3. Writing the first open-source proxy that solved it in 20 lines.",
        script: `When people talk about building ${companyName}, they think it began with a pitch deck. It actually began at 2 AM with a production log that made no sense...`,
        visualDirection: profile?.execution_capacity?.available_assets?.[0] || "Attach dark-mode screenshot of terminal CPU flame graph or trace log.",
        sourceMaterial: "Founder onboarding note • Production post-mortem incident log",
        nextAction: "Confirm story details",
        targetAudience: profile?.domain_radar?.target_audience?.[0] || "Staff Backend Engineers & AI Leads",
        scheduledDate: "2026-10-15"
      },
      {
        id: 'item-2',
        title: 'One lesson from building: The $412 Redis Memory Leak',
        stage: 'published',
        platform: 'LinkedIn & X',
        format: 'Text post',
        day: 'Monday',
        theme: 'Core Proof & Building in Public',
        contentAngle: 'Technical post-mortem detailing the exact production bug, cost in dollars, and lua script fix.',
        hook: `Most founders hide what goes wrong behind closed doors.\n\nWhen we were building ${companyName}, here is the post-mortem of how our engine burned $412 in 14 hours due to an unbatched Redis scan:`,
        visualDirection: "Screenshot of terminal CPU flame graph before/after Lua script optimization.",
        metrics: { views: 18400, likes: 342, comments: 48, reposts: 29 },
        postUrl: "https://x.com/arjun_scale/status/189201",
        scheduledDate: "2026-10-13"
      },
      {
        id: 'item-3',
        title: 'Three practical takeaways: SQLite beats Vector DBs for 90% of apps',
        stage: 'idea',
        platform: 'LinkedIn',
        format: 'Carousel',
        day: 'Friday',
        theme: 'Unpopular Industry Takes',
        contentAngle: `Challenging lazy orthodoxies. Centerpiece: "${spicyTake}".`,
        hook: `Hot take backed by benchmarks: "${spicyTake}"\n\nHere is our side-by-side benchmark data on 100k memory lookups:`,
        visualDirection: "ASCII benchmark table comparing p99 latency and token costs.",
        sourceMaterial: "Internal benchmark tests run on AWS m6i instances",
        nextAction: "Draft slides",
        scheduledDate: "2026-10-17"
      },
      {
        id: 'item-4',
        title: 'Why we reject candidates who solve LeetCode hard in 15 mins',
        stage: 'approved',
        platform: 'LinkedIn',
        format: 'Hiring & Culture RFC',
        day: 'Thursday',
        theme: 'Culture & High-Bar Engineering',
        contentAngle: 'Why architecture curiosity and asking first-principles questions beats memorized algorithmic drills.',
        hook: `We just gave an offer to an engineer who spent 45 minutes asking why our distributed queue was designed that way in the first place.\n\nHere is how we interview founding engineers at ${companyName}:`,
        visualDirection: "Photo of handwritten whiteboard system architecture diagram from interview room.",
        nextAction: "Ready to schedule",
        scheduledDate: "2026-10-16"
      }
    ],
    collectedInbox: [
      {
        id: 'inbox-1',
        title: 'Customer receipt: trace speed feedback',
        snippet: "Enterprise AI lead in Slack: 'Your trace engine caught the infinite loop before it drained our OpenAI budget. Saved us ~$1,200 overnight.'",
        type: 'Receipt',
        date: '2 hours ago',
        source: 'Slack screenshot'
      },
      {
        id: 'inbox-2',
        title: `Why distributed debugging is like ${hobbies.split(',')[0] || 'Chess'}`,
        snippet: `Analogy comparing ${hobbies.split(',')[0] || 'pacing'} to queue backpressure under sudden agent fan-outs.`,
        type: 'Story',
        date: 'Yesterday',
        source: 'Voice note transcript'
      },
      {
        id: 'inbox-3',
        title: 'Memory footprint: Vector DB vs SQLite with BM25',
        snippet: 'Vector DB required 1.4 GB RAM for 50k embeddings; SQLite index took 42 MB with 4x faster p99 retrieval.',
        type: 'Research',
        date: '3 days ago',
        source: 'Terminal log screenshot'
      }
    ],
    agentMemory: [
      { id: 'mem-1', category: 'fact', text: whyStarted, origin: "Onboarding DNA", verified: true },
      { id: 'mem-2', category: 'fact', text: `Founded ${companyName} to build observability for multi-agent LLM systems in production.`, origin: "Onboarding identity", verified: true },
      { id: 'mem-3', category: 'fact', text: `Targeting: ${(profile?.domain_radar?.target_audience || ['Staff Backend Engineers']).join(', ')}.`, origin: "Onboarding audience", verified: true },
      { id: 'mem-4', category: 'voice', text: `Tone signature: ${profile?.voiceprint?.insead_archetype || 'The Builder (Share the Work)'}. Prefers proof-of-work over inspirational filler.`, origin: "Voice calibration", verified: true },
      { id: 'mem-5', category: 'voice', text: `Humanizing metaphors: draws analogies from ${hobbies}.`, origin: "Hobbies intake", verified: true },
      { id: 'mem-6', category: 'voice', text: "Automated negative lexicon: blocks 'delve into', 'game-changer', 'synergy', 'revolutionary', 'thrilled to announce'.", origin: "Anti-AI guardrail", verified: true },
      { id: 'mem-7', category: 'research', text: "Audience responds with 3.4x higher comment depth when concrete dollar numbers or error logs are shared.", origin: "Observation hypothesis", verified: false },
      { id: 'mem-8', category: 'research', text: `Contrarian hook regarding "${spicyTake.slice(0, 50)}..." is ready for an expanded deep-dive thread.`, origin: "Prompt lead", verified: false }
    ]
  };
}
