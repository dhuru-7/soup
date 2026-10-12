# Soup — Founder Personal Branding & Execution Engine

> **CodeX 3.0 Hackathon — Problem Statement PS02: Founder Personal Branding & Content Execution Engine**
> 
> *A high-throughput, founder-specific execution system that turns raw founder experiences, architecture decisions, and operational lessons into authentic, compounding personal brand equity without synthetic AI slop.*

---

## ⚡ The Core Problem

Most AI tools for founders generate generic, formulaic LinkedIn posts ("thrilled to announce", "game-changer", "delve into"). Founders don't need a text generator—they need an **execution OS**:
1. **Zero Founder Time Drain**: Ingest raw voice notes, bulleted thoughts, and workstation screenshots.
2. **Anti-AI Voiceprint Positioning**: Enforce strict voice rules, calibrated INSEAD archetypes, and aggressive banned-phrase filters.
3. **Execution-Ready Weekly Calendar**: Complete with platform-specific hooks, visual creative briefs, and active distribution checklists.
4. **Zero Vendor Lock-in (Dual-Engine)**: An executive web dashboard for visual review, plus a standard **Model Context Protocol (MCP)** server for terminal founders using Claude Code, Antigravity, or Cursor.

---

## 🏗 Architecture & Dual-Engine Design

```
                     ┌──────────────────────────────────────────────┐
                     │              Founder Touchpoints             │
                     └──────────────────────┬───────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
                    ▼                                               ▼
     ┌─────────────────────────────┐                 ┌─────────────────────────────┐
     │      Executive Web UI       │                 │       Terminal Agents       │
     │    (React + Vite + CSS)     │                 │   (Claude Code / Cursor)    │
     └──────────────┬──────────────┘                 └──────────────┬──────────────┘
                    │                                               │
                    │ HTTP REST                                     │ stdio JSON-RPC
                    ▼                                               ▼
     ┌─────────────────────────────┐                 ┌─────────────────────────────┐
     │       Flask Backend         │                 │       Soup MCP Server       │
     │      (/server/app.py)       │                 │   (/mcp-server/server.py)   │
     └──────────────┬──────────────┘                 └──────────────┬──────────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                             ┌─────────────────────────────┐
                             │   Founder Voiceprint & DB   │
                             │   (Arjun Vance / Maya Lin)  │
                             └─────────────────────────────┘
```

1. **Executive Web UI (`/client`)**:
   - Apple-inspired design with frosted glass layers (`backdrop-blur: 28px`), grounded interactions (zero hover lift), and calm `0.5s` transitions.
   - 6-step guided founder onboarding with real-time vector resonance preview.
   - Command Center with 4 core views:
     - **7-Day Execution Calendar**: Hooks, full drafts, visual creative briefs, and follow-up checklists.
     - **Raw Brain Dump Dropzone**: Turn messy thoughts into 3 distinct post angles (Teardown, Contrarian, Vulnerable Story).
     - **Anti-AI Voiceprint & Pillars**: Strict banned phrases, tone signatures, and content ratios.
     - **Authority Scorecard**: Quantified milestone tracking and inbound inquiry metrics.

2. **Terminal MCP Server (`/mcp-server`)**:
   - Exposes standardized Model Context Protocol tools:
     - `get_founder_profile`: Retrieve archetype, tone signature, and banned phrases.
     - `process_raw_asset`: Transform messy notes into 3 high-leverage content drafts.
     - `get_weekly_calendar`: Fetch the scheduled publishing pipeline with visual briefs.
     - `observe_analytics_feedback`: Observe engagement metrics and update strategic weights.

3. **Backend API (`/server`)**:
   - Lightweight Python Flask service providing RESTful endpoints for onboarding, profile persistence, and content transformation.

---

## 🚀 Quickstart

### 1. Web Client (Frontend)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Flask API (Backend)
```bash
cd server
pip install -r requirements.txt
python app.py
```
API runs on `http://localhost:5000`.

### 3. Model Context Protocol (MCP) Server
To connect Soup directly into **Claude Code**, **Antigravity**, or **Cursor**:
```bash
cd mcp-server
python server.py
```

Add to your MCP configuration (`claude_desktop_config.json` / `mcp_config.json`):
```json
{
  "mcpServers": {
    "soup": {
      "command": "python",
      "args": ["d:/project_ps02/mcp-server/server.py"]
    }
  }
}
```

---

## 👥 Pre-Configured Founder Archetypes

Soup includes two distinct benchmark profiles demonstrating domain-specific voiceprint adaptation:

1. **Arjun Vance (CTO @ AgentScale)**
   - *Domain*: Autonomous AI Orchestration (B2B SaaS / DeepTech)
   - *Goal*: Attract senior distributed-systems engineers & GitHub stars
   - *Voice Archetype*: The Magnet (Technical Authority)
   - *Visual Directives*: Flame graphs, terminal traces, architecture diagrams

2. **Maya Lin (CEO @ TerraBloom Organics)**
   - *Domain*: Regenerative Wellness & Clean Botanicals (D2C)
   - *Goal*: Whole Foods retail expansion & angel investment
   - *Voice Archetype*: The Transparent Alchemist (Purpose & Craft)
   - *Visual Directives*: Candid warehouse photos, soil lab reports, packaging prototypes

---

## 🛡️ License

MIT License. Built for CodeX 3.0 Hackathon.
