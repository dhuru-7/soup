export const PROFILES_DATA = {
  arjun_vance: {
    founder_id: "arjun_vance",
    identity: {
      name: "Arjun Vance",
      role: "Co-founder & CTO",
      company_name: "AgentScale",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      tagline: "Building open-source observability for autonomous AI agent fleets.",
      mission: "Making autonomous multi-agent systems debuggable, deterministic, and cost-effective in production.",
      stage: "Seed ($1.8M raised, 14-person engineering team)",
      origin_scar: "Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans during our first enterprise launch.",
      unfair_advantage: "Ex-Datadog distributed tracing architect. Wrote eBPF kernels for high-throughput stream processing."
    },
    domain_radar: {
      industry: "AI Infrastructure & Developer Tools",
      target_audience: ["Staff Backend Engineers", "AI Platform Architects", "Technical CTOs"],
      audience_taboos: [
        "Hype without code or benchmarks",
        "Vague marketing buzzwords like 'revolutionary AI'",
        "Ignoring p99 latency spikes and token costs"
      ],
      competitors_watched: ["LangSmith", "Arize AI", "Braintrust Data"]
    },
    channels: {
      primary: "X (Twitter)",
      secondary: "LinkedIn"
    },
    voiceprint: {
      insead_archetype: "The Magnet (Attractor)",
      banned_phrases: [
        "delve into", "game-changer", "humbled and honored", 
        "thrilled to announce", "in today's fast-paced digital world", 
        "synergy", "paradigm shift"
      ],
      voice_rules: [
        "Always include concrete numbers (latency in ms, dollars spent, memory in MB).",
        "Share the actual bug post-mortem before sharing the solution.",
        "Short, high-velocity sentence cadence. Code snippets and flame graphs speak louder than paragraphs."
      ],
      spicy_take: "Most AI startups don't have a model problem; they have an uninstrumented distributed state catastrophe."
    },
    content_pillars: [
      {
        id: "pillar_1",
        name: "Production Post-Mortems & Deep-Dive Engineering",
        ratio: 60,
        description: "Real architectural bugs, latency optimizations, and memory leak root causes from the AgentScale engine."
      },
      {
        id: "pillar_2",
        name: "Contrarian AI Infrastructure Realities",
        ratio: 25,
        description: "Debunking AI marketing hype with cold benchmarks (SQLite vs Vector DBs, deterministic state vs prompt magic)."
      },
      {
        id: "pillar_3",
        name: "Building in Public & High-Bar Engineering Culture",
        ratio: 15,
        description: "Hiring standards for founding engineers, internal RFC culture, and open-source release notes."
      }
    ],
    weekly_calendar: [
      {
        day: "Monday",
        platform: "LinkedIn & X",
        format: "Technical Teardown",
        hook: "We accidentally burned $412 in 14 hours on AWS because of a single unbatched Redis scan across 50,000 agent sessions.\n\nHere is the post-mortem and the 12-line Lua script that fixed it.",
        visual_direction: "Screenshot of terminal CPU flame graph before/after Lua script optimization with dark background.",
        follow_up_action: "Drop the public GitHub Gist link in the 1st comment; reply to engineers asking about Redis cluster compatibility within 45 mins."
      },
      {
        day: "Wednesday",
        platform: "X (Twitter)",
        format: "Contrarian Benchmark",
        hook: "Hot take backed by benchmarks: 90% of AI startups using Pinecone or Weaviate would get 4x faster p99 latency and save $800/mo using SQLite with FTS5.\n\nHere is the side-by-side benchmark data on 100k agent memory lookups:",
        visual_direction: "Clean ASCII benchmark table or terminal plot comparing latency and memory consumption.",
        follow_up_action: "Quote-retweet any AI researchers who disagree with the benchmark repo."
      },
      {
        day: "Friday",
        platform: "LinkedIn",
        format: "Hiring & Engineering RFC",
        hook: "We just rejected a candidate who solved our LeetCode hard problem in 15 minutes.\n\nInstead, we gave the offer to an engineer who spent 45 minutes asking why our distributed queue was designed that way in the first place.\n\nHere is how we interview founding engineers at AgentScale:",
        visual_direction: "Photo of handwritten whiteboard system architecture diagram from the office interview room.",
        follow_up_action: "DM candidates who like or comment on the post with a direct calendar link for an informal intro chat."
      }
    ],
    goals_tracking: {
      timeframe: "6 Months",
      metrics: {
        inbound_engineer_dms: { current: 9, target: 20, unit: "DMs" },
        github_stars: { current: 1420, target: 3000, unit: "Stars" },
        podcast_speaking_invites: { current: 3, target: 8, unit: "Invites" },
        authority_score: { current: 84, target: 95, unit: "/100" }
      }
    }
  },
  maya_lin: {
    founder_id: "maya_lin",
    identity: {
      name: "Maya Lin",
      role: "Founder & CEO",
      company_name: "Solace Botanicals",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      tagline: "Organic adaptogenic sparkling elixirs with 0g sugar and zero artificial gums.",
      mission: "Fixing the broken commercial beverage industry by replacing synthetic stabilizers with regenerative plant adaptogens.",
      stage: "Bootstrapped to $65k MRR, raising $750k Angel Seed",
      origin_scar: "14 beverage manufacturing plants told me clean organic sparkling formulas were commercially impossible without synthetic stabilizers.",
      unfair_advantage: "Former food scientist at General Mills who left after seeing how cost-cutting compromises consumer gut health."
    },
    domain_radar: {
      industry: "D2C Functional Beverage & Clean Food",
      target_audience: ["Conscious Health Consumers", "Regional Retail Buyers (Whole Foods, Sprouts)", "Consumer Angel Investors"],
      audience_taboos: [
        "Hidden artificial sweeteners disguised as 'natural flavors'",
        "Polished corporate PR greenwashing",
        "Founders who don't know where their ingredients are grown"
      ],
      competitors_watched: ["Olipop", "Poppi", "Recess"]
    },
    channels: {
      primary: "LinkedIn",
      secondary: "Instagram / TikTok"
    },
    voiceprint: {
      insead_archetype: "The Megaphone (Category Champion)",
      banned_phrases: [
        "synergy", "game-changing wellness", "humbled and honored", 
        "miracle cure", "guilt-free indulgence", "revolutionizing beverage"
      ],
      voice_rules: [
        "Talk like a candid food scientist who cares about people's families.",
        "Show the warehouse mess, the lab rejections, and the exact cost breakdowns per can.",
        "Never preach or sound elite; educate with empathy and transparency."
      ],
      spicy_take: "If a healthy canned drink has a 2-year shelf life at room temperature, you are drinking preservatives, not nutrition."
    },
    content_pillars: [
      {
        id: "pillar_1",
        name: "Supply Chain & Food Industry Truths",
        ratio: 50,
        description: "Exposing the hidden shortcuts beverage giants take with maltodextrin, artificial gums, and natural flavor labeling."
      },
      {
        id: "pillar_2",
        name: "The Raw Founder Diary (Bootstrapped to Shelves)",
        ratio: 30,
        description: "The unglamorous reality of inventory financing, pallet shipping, co-packer rejections, and retail negotiations."
      },
      {
        id: "pillar_3",
        name: "Clean Living Science & Adaptogen Education",
        ratio: 20,
        description: "Actionable science on cortisol regulation, lion's mane efficacy, and sleep cycles without wellness fluff."
      }
    ],
    weekly_calendar: [
      {
        day: "Tuesday",
        platform: "LinkedIn",
        format: "Industry Exposé / Supply Chain Truth",
        hook: "14 beverage manufacturing plants told me my formula was 'commercially impossible' unless I added artificial guar gum and industrial foaming agents.\n\nHere is what happens when a founder refuses to poison their own product for higher profit margins:",
        visual_direction: "Unfiltered candid photo of Maya on the warehouse floor holding a prototype can next to laboratory lab test sheets.",
        follow_up_action: "Reply to grocery buyers in comments; send direct samples to any boutique store owners who chime in."
      },
      {
        day: "Thursday",
        platform: "LinkedIn & Instagram",
        format: "Raw Founder Diary & Unit Economics",
        hook: "Most people think getting into retail is a victory lap.\n\nIn reality, getting our first 12 Whole Foods placements almost bankrupted us.\n\nHere is the raw unit economics of consumer packaged goods that nobody warns you about:",
        visual_direction: "Photo of handwritten pallet inventory clipboard and shipping boxes in the cold storage warehouse.",
        follow_up_action: "Tag angel investors who focus on consumer goods; engage with other D2C brand founders."
      },
      {
        day: "Sunday",
        platform: "LinkedIn",
        format: "Science Education & Category Defense",
        hook: "Next time you pick up a 'healthy sparkling water', look at the ingredients list.\n\nIf it says 'Natural Flavors', here is what the FDA legally allows the beverage brand to hide from you:",
        visual_direction: "Macro close-up photo comparing pure organic ashwagandha root vs industrial synthetic powder in petri dishes.",
        follow_up_action: "Engage for 60 minutes answering every single comment with real scientific ingredient breakdowns."
      }
    ],
    goals_tracking: {
      timeframe: "6 Months",
      metrics: {
        retail_store_placements: { current: 18, target: 50, unit: "Stores" },
        angel_investor_inquiries: { current: 4, target: 12, unit: "Calls" },
        consumer_waitlist_signups: { current: 2340, target: 5000, unit: "Subscribers" },
        authority_score: { current: 79, target: 92, unit: "/100" }
      }
    }
  }
};
