"""
Founder Personal Branding & Content Execution Engine - MCP Server
Exposes founder branding tools to Claude Code, Antigravity, Cursor, and Windsurf via standard MCP protocol.
"""
import sys
import json
import os
import requests

API_BASE = os.environ.get("BRAND_ENGINE_API", "http://localhost:5000/api")

TOOLS = [
    {
        "name": "get_founder_profile",
        "description": "Fetch the complete DNA, voiceprint, content pillars, and 3/6-month goals for a founder.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": {
                    "type": "string",
                    "description": "Unique identifier of the founder (e.g. 'arjun_vance' or 'maya_lin')"
                }
            },
            "required": ["founder_id"]
        }
    },
    {
        "name": "process_raw_asset",
        "description": "Transform messy raw founder notes, terminal logs, whiteboard sketches, or voice memo transcripts into 3 platform-native post drafts with visual briefs.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" },
                "raw_content": { "type": "string", "description": "The unstructured voice note, thought, or bug postmortem" },
                "asset_type": { "type": "string", "enum": ["quick_thought", "terminal_log", "warehouse_photo", "voice_memo"] }
            },
            "required": ["founder_id", "raw_content"]
        }
    },
    {
        "name": "get_weekly_calendar",
        "description": "Retrieve the current 7-day execution calendar with post structures, visual asset direction, and follow-up checklists.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" }
            },
            "required": ["founder_id"]
        }
    },
    {
        "name": "observe_analytics_feedback",
        "description": "Run the LangGraph-style adaptive feedback loop comparing actual reach against 3/6-month goals and suggest strategic pivots.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" }
            },
            "required": ["founder_id"]
        }
    }
]

def handle_request(req):
    method = req.get("method")
    req_id = req.get("id")

    if method == "tools/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": TOOLS}}

    elif method == "tools/call":
        params = req.get("params", {})
        tool_name = params.get("name")
        args = params.get("arguments", {})

        try:
            if tool_name == "get_founder_profile":
                founder_id = args.get("founder_id", "arjun_vance")
                res = requests.get(f"{API_BASE}/profile/{founder_id}", timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "process_raw_asset":
                res = requests.post(f"{API_BASE}/assets/process", json=args, timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "get_weekly_calendar":
                founder_id = args.get("founder_id", "arjun_vance")
                res = requests.get(f"{API_BASE}/profile/{founder_id}", timeout=5)
                calendar = res.json().get("weekly_calendar", [])
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(calendar, indent=2)}]}}

            elif tool_name == "observe_analytics_feedback":
                res = requests.post(f"{API_BASE}/analytics/observe", json=args, timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            else:
                return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"Tool '{tool_name}' not found"}}

        except Exception as e:
            return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32603, "message": str(e)}}

    elif method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "founder-brand-engine-mcp", "version": "1.0.0"}
            }
        }

    return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": "Method not found"}}

def main():
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            req = json.loads(line)
            resp = handle_request(req)
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()
        except Exception as e:
            sys.stderr.write(f"Error handling line: {e}\n")

if __name__ == "__main__":
    main()
