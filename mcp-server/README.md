# Founder Personal Branding & Content Execution Engine — MCP Server

This MCP (Model Context Protocol) server allows AI agents like **Claude Code**, **Antigravity**, **Cursor**, and **Windsurf** to directly interface with your Founder Brand Engine.

---

## 1. Prerequisites
Ensure the backend Flask API is running:
```bash
cd server
python app.py
```

---

## 2. Connect to Claude Code

Add the server to your Claude Code settings or project `claude.json`:
```json
{
  "mcpServers": {
    "founder-brand-engine": {
      "command": "python",
      "args": ["d:/project_ps02/mcp-server/server.py"],
      "env": {
        "BRAND_ENGINE_API": "http://localhost:5000/api"
      }
    }
  }
}
```

---

## 3. Available MCP Tools

1. `get_founder_profile(founder_id)`: Fetches complete founder DNA, voiceprint, and 3/6-month goals.
2. `process_raw_asset(founder_id, raw_content, asset_type)`: Ingests unstructured thoughts, bug postmortems, or voice notes and returns 3 tailored post drafts with visual briefs.
3. `get_weekly_calendar(founder_id)`: Reads the current 7-day scheduled calendar with draft structures and follow-up checklists.
4. `observe_analytics_feedback(founder_id)`: Analyzes performance against business goals and suggests strategic pivots.
