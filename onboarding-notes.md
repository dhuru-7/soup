# Founder Onboarding Architecture & Specification
> **System Component**: Module 1 — Founder DNA & Strategic Onboarding Engine  
> **Target Deliverable**: Multi-step onboarding experience that extracts rich, authentic founder context while eliminating generic AI fluff.

---

## 1. Objectives of the Onboarding Flow
Founders hate long, tedious 50-field forms. The onboarding must be **frictionless, high-signal, and intelligent**:
1. Extract the founder's authentic **Voiceprint** and **Unfair Advantage**.
2. Identify their **Domain, Competitors, and Target Audience**.
3. Establish their **INSEAD Executive Archetype** (Magnet, Megaphone, Connector).
4. Lock in **3- or 6-Month Business Objectives** to enable measurable ROI tracking.
5. Catalog **Available Raw Assets** (photos, voice notes, engineering logs, customer messages).

---

## 2. The 6 Core Information Pillars to Collect

### Pillar 1: Founder Identity & Origin Story ("The DNA")
*Why we need it: Powers the founder's personal lore, storytelling hooks, and authentic authority.*
- **Founder Name & Current Role**: (e.g., Co-founder & CTO, Solo Founder & CEO).
- **Company Name & One-Line Mission**: Plain-English explanation of what the company solves without jargon.
- **Backstory & Unfair Advantage**:
  - What did you do before this? (Ex-Google infra engineer? 10 years in organic agriculture supply chains?)
  - What painful failure or epiphany led you to start this company?
- **Current Company Stage**: (Pre-seed, Seed, Series A, Bootstrapped, $0-10k MRR, $100k+ MRR).

---

### Pillar 2: Domain, Competitors & Target Audience ("The Radar")
*Why we need it: Powers the Trend Scanner and Opportunity Gap Matrix.*
- **Industry & Domain**: (e.g., AI Agent Observability, D2C Adaptogenic Drinks, Enterprise FinTech).
- **Primary Target Audience**: Who *must* see and respect your content?
  - *Options*: Senior Software Engineers, VCs & Angel Investors, Enterprise Procurement Heads, Conscious Consumers, Potential Hires.
- **Audience Pain Points & Taboos**: What does this audience secretly hate about the industry?
- **3 Competitor Founders or Admired Voices**: Who in your space is winning visibility, and what do you do differently?

---

### Pillar 3: Social Footprint & Platform Priorities ("The Channels")
*Why we need it: Platform-native formatting (character limits, hook breaks, media ratios).*
- **Existing Social Media Handles**:
  - LinkedIn Profile URL
  - X (Twitter) Handle
  - YouTube Channel URL / Substack Link / GitHub Profile
- **Current Baseline Numbers**: (Follower count, average engagement per post — auto-ingested or self-reported).
- **Primary vs. Secondary Platform Focus**:
  - *Primary*: Where 70% of energy goes (e.g., LinkedIn for B2B/Hiring, X for Devs/Crypto, Instagram for D2C).
  - *Secondary*: Repurposing channel (e.g., X threads $\rightarrow$ LinkedIn carousel, or Substack essays).

---

### Pillar 4: Tone Archetype & Anti-AI Calibration ("The Voiceprint")
*Why we need it: Hard-filters AI cliches and calibrates the INSEAD Executive Brand model.*
- **INSEAD Strategic Archetype**:
  1. **The Magnet (Attractor)**: Builds in public, shares real numbers, bugs, post-mortems, draws inbound talent & users.
  2. **The Megaphone (Broadcaster)**: Champions a new philosophy, challenges industry status quo, bold paradigm shifts.
  3. **The Pragmatic Operator**: Deep teardowns, tactical frameworks, no fluff, actionable systems.
- **Tone Dial (Sliders / Choices)**:
  - Technical & Analytical $\longleftrightarrow$ Warm & Story-driven
  - Contrarian & Provocative $\longleftrightarrow$ Measured & Academic
  - Candid & Raw $\longleftrightarrow$ Polished & Executive
- **The "Spicy Take" / Non-Negotiable Opinion**:
  - What is one industry "best practice" you think is complete garbage? (e.g., *"Microservices before $1M ARR is suicide"*, *"Adding artificial gums to drinks is lazy manufacturing"*).
- **Anti-AI Banned Words / Habits**:
  - Words the founder refuses to say (e.g., *"delve"*, *"game-changing"*, *"excited to announce"*, *"synergy"*).

---

### Pillar 5: Content Creation Capacity & Available Raw Assets ("The Fuel")
*Why we need it: Generates a realistic calendar the founder won't abandon after 3 days.*
- **Weekly Time Commitment**:
  - 15 mins/day (Async reviews, voice memo dumps)
  - 30 mins/day (Interactive engagement, drafting)
  - 1 hour/week batch review (Pure executive review)
- **Posting Frequency**: (3x/week, 5x/week, Daily).
- **Available Asset Types**:
  - [x] Camera roll / warehouse / office candid photos
  - [x] Whiteboard diagrams / architecture sketches
  - [x] Voice notes (brain dumps while walking or driving)
  - [x] Terminal screenshots / Code snippets / Github PRs
  - [x] Customer chat receipts / Slack win screenshots (redacted)
  - [x] Casual loom / selfie video clips

---

### Pillar 6: 3-to-6 Month Business Objectives & North Star KPIs ("The ROI")
*Why we need it: Measures whether content generates real business outcomes, not vanity likes.*
- **Primary 3-Month Objective**:
  - [ ] **Talent Acquisition**: Hire founding engineers, head of sales, or lead designers.
  - [ ] **Fundraising**: Build investor buzz and warm inbound deal flow for Seed / Series A.
  - [ ] **Customer Acquisition / Leads**: Close 20 B2B enterprise pilots or 1,000 D2C pre-orders.
  - [ ] **Authority & Speaking**: Get invited to podcasts, conferences, and keynote panels.
  - [ ] **Open-Source Adoption**: Drive GitHub stars, documentation views, and community Discord members.
- **Current Progress Metrics**: Baseline inbound leads/month, current applicants/month.

---

## 3. Data Schema: How Onboarding is Stored (Firestore / JSON)

```json
{
  "founder_id": "founder_arjun_01",
  "identity": {
    "name": "Arjun Vance",
    "role": "Co-founder & CTO",
    "company_name": "AgentScale",
    "mission": "Distributed observability and trace debugger for multi-agent LLM systems in production",
    "stage": "Seed ($1.8M raised)",
    "unfair_advantage": "Spent 6 years at Datadog scaling distributed tracing; built the first eBPF agent collector"
  },
  "domain_radar": {
    "industry": "AI Infrastructure & Developer Tooling",
    "target_audience": ["Staff Backend Engineers", "AI Platform Leads", "CTOs"],
    "competitors_watched": ["LangSmith", "Arize AI", "Braintrust"],
    "spicy_take": "Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency and cost"
  },
  "channels": {
    "primary": "X (Twitter)",
    "secondary": "LinkedIn",
    "handles": {
      "x": "@arjun_scale",
      "linkedin": "linkedin.com/in/arjunvance",
      "github": "github.com/agentscale"
    }
  },
  "voiceprint": {
    "insead_archetype": "The Magnet",
    "tone_profile": {
      "technical_depth": 9,
      "contrarian_level": 8,
      "formality": 2,
      "humor": 4
    },
    "banned_phrases": ["delve into", "game-changer", "thrilled to announce", "humbled and honored", "paradigm shift"]
  },
  "execution_capacity": {
    "posts_per_week": 4,
    "time_budget_mins_per_day": 20,
    "preferred_assets": ["terminal_screenshots", "github_diffs", "architecture_whiteboards", "voice_notes"]
  },
  "goals": {
    "timeframe_months": 6,
    "primary_objective": "Hiring 3 Lead Distributed Systems Engineers & 2,500 GitHub Stars",
    "north_star_metric": "Inbound Senior Engineering DM Inquiries",
    "baseline_metric": 1,
    "target_metric": 15
  }
}
```

---

## 4. UI/UX Flow for the Onboarding Screen

To keep it engaging and non-tedious, the UI should use a **4-Step Interactive Flow with Live Instant Preview**:
1. **Step 1: The Basics (DNA & Role)**: 3 fields + company one-liner.
2. **Step 2: Who Are You Speaking To? (Audience & Channels)**: Select tags for audience and toggle platform priorities.
3. **Step 3: Calibrate Your Voiceprint**: Sliders for Tone + Pick your INSEAD archetype + Textbox for your spicy take.
4. **Step 4: Lock Your North Star Goals**: Choose 3-month outcome (Hiring, Leads, Raising) and available asset types.
5. **Instant Result ("The Reveal")**: The engine immediately renders:
   - Extracted Voiceprint card
   - Top 3 Custom Content Pillars
   - First 3 Generated Sample Hooks based on their spicy take!
