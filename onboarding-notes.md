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
- What painful failure or epiphany led you to start this company? ("The Origin Scar")
- Current Company Stage: (Pre-seed, Seed, Series A, Bootstrapped).

---

### Pillar 2: Domain, Competitors & Target Audience ("The Radar")
*Why we need it: Powers the Trend Scanner and Opportunity Gap Matrix.*
- **Industry & Domain**: (e.g., AI Agent Observability, D2C Adaptogenic Drinks, Enterprise FinTech).
- **Primary Target Audience**: Who *must* see and respect your content? (Senior Software Engineers, VCs, Enterprise Procurement).
- **Audience Pain Points & Taboos**: What does this audience secretly hate about legacy solutions or generic posts? ("The Common Enemy").
- **Contrarian Wedge / Spicy Take**: What accepted industry practice is complete nonsense?

---

### Pillar 3: Tone Archetype & Anti-AI Calibration ("The Voiceprint")
*Why we need it: Calibrates the INSEAD Executive Brand model and enforces automated anti-AI cliches.*
- **INSEAD Strategic Archetype**:
  1. **The Magnet (Attractor)**: Builds in public, shares real numbers, bugs, post-mortems, draws inbound talent & users.
  2. **The Megaphone (Broadcaster)**: Champions a new philosophy, challenges industry status quo, bold paradigm shifts.
  3. **The Pragmatic Operator**: Deep teardowns, tactical frameworks, no fluff, actionable systems.
- **Automated Anti-AI Negative Lexicon (System Guardrail)**:
  - Automatically filtered in engine without asking founder to fill out a word quiz (blocks *"delve into"*, *"game-changer"*, *"thrilled to announce"*, *"humbled and honored"*, *"synergy"*, etc.).

---

### Pillar 4: Content Fuel & Available Raw Assets ("The Fuel")
*Why we need it: Connects real camera-roll assets to weekly posts instead of Canva graphics.*
- **Available Asset Types**:
  - [x] Camera roll / warehouse / office candid photos
  - [x] Whiteboard diagrams / architecture sketches
  - [x] Voice notes (brain dumps while walking or driving)
  - [x] Terminal screenshots / Code snippets / Github PRs
  - [x] Customer chat receipts / Slack win screenshots (redacted)
  - [x] Casual loom / selfie video clips

---

### Pillar 5: Operational Strategy (DEFERRED TO CONVERSATIONAL CHAT)
*Why this is deferred to chat*:
- Operational horizons (3 vs 6 months), weekly hour limits (1-2 vs 3-5 hrs), and posting cadences belong in the **LangGraph adaptive chat dialogue**.
- Asking this in onboarding creates cognitive fatigue; in chat, the agent negotiates bandwidth dynamically based on real analytics and weekly velocity.

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
    "origin_scar": "Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans that cost $400/hr in cloud overruns; realized existing APMs are blind to agent loops.",
    "expertise": ["Engineering / AI", "Product Architecture"]
  },
  "domain_radar": {
    "industry": "AI Infrastructure & Developer Tooling",
    "target_audience": "Staff Backend Engineers & AI Platform Leads",
    "audience_taboos": ["Hollow AI wrapper marketing", "Unverified latency benchmarks", "Vector database overhype"]
  },
  "voiceprint": {
    "insead_archetype": "The Magnet",
    "spicy_take": "Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency and cost.",
    "banned_phrases": ["delve into", "game-changer", "thrilled to announce", "humbled and honored", "paradigm shift", "revolutionary"],
    "tone_traits": ["Analytical", "Direct", "Proof-of-Work"]
  },
  "execution_capacity": {
    "channels": ["X / Twitter", "LinkedIn"],
    "available_assets": [
      "Terminal screenshots & CPU/Memory trace graphs",
      "Whiteboard architecture sketches",
      "Raw voice notes"
    ]
  }
}
```

---

## 4. UI/UX Flow for the Onboarding Screen

The streamlined 5-step onboarding experience:
1. **Step 1: Executive DNA & Role**: Name, role chips, and expertise pillars.
2. **Step 2: Domain, Entity & Scars**: Company name, mission, and the catalyst "Origin Scar".
3. **Step 3: The Contrarian Wedge**: The "Spicy Take" and INSEAD Archetype selector.
4. **Step 4: Audience & Taboos**: Target stakeholder and Audience Taboos / "Common Enemy".
5. **Step 5: Voiceprint & Raw Fuel**: Negative Lexicon (banned AI words), Raw asset inventory chips, and channel toggles.
6. **Instant Result ("The Reveal")**: Live Identity Resonance Card rendering extracted voiceprint, 3 calibrated content pillars, and first 3 live hook angles.

