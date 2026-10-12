"""
Soup Intelligence OS — Founder Branding Engine & Agent Memory MCP Server
Exposes founder branding tools & the 7 local agent memory assets to
Claude Code, Antigravity, Cursor, and Windsurf via standard MCP protocol.
"""
import sys
import json
import os
import requests

API_BASE = os.environ.get("BRAND_ENGINE_API", "http://localhost:5050/api")

TOOLS = [
    {
        "name": "get_founder_profile",
        "description": "Fetch the complete unified profile, identity, voiceprint, content pillars, and goals for a founder.",
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
        "name": "read_founder_memory_file",
        "description": "Read any of the 7 local agent memory assets for a founder: 1. founder_profile.json, 2. interests_and_stories.md, 3. voice_and_preferences.json, 4. active_direction.md, 5. knowledge_and_evidence.json, 6. session_index.json, 7. memory_changelog.jsonl.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string", "description": "e.g. 'arjun_vance' or 'maya_lin'" },
                "filename": {
                    "type": "string",
                    "description": "Exact asset filename to read (e.g. 'knowledge_and_evidence.json', 'interests_and_stories.md', 'active_direction.md')"
                }
            },
            "required": ["founder_id", "filename"]
        }
    },
    {
        "name": "update_founder_memory_file",
        "description": "Update any of the 7 local agent memory assets. Automatically logs the change to memory_changelog.jsonl with timestamp and rationale.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" },
                "filename": { "type": "string", "description": "Asset filename to update (e.g. 'knowledge_and_evidence.json' or 'voice_and_preferences.json')" },
                "content": { "description": "New content (JSON object/array for .json/.jsonl, or string for .md)" },
                "what_changed": { "type": "string", "description": "Summary of what changed" },
                "why": { "type": "string", "description": "Reason for the change" },
                "founder_approved": { "type": "boolean", "default": True }
            },
            "required": ["founder_id", "filename", "content"]
        }
    },
    {
        "name": "get_founder_sessions",
        "description": "Retrieve the conversation session index (session titles, timestamps, summaries, decisions, and log links). Allows the agent to continue previous work without reloading every past message.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" }
            },
            "required": ["founder_id"]
        }
    },
    {
        "name": "log_founder_session",
        "description": "Save a completed conversation session into session_index.json and archive full conversation in conversations/<session_id>.json.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" },
                "title": { "type": "string", "description": "Title of the session" },
                "summary": { "type": "string", "description": "Condensed summary of what was accomplished" },
                "decisions": { "type": "array", "items": { "type": "string" }, "description": "Key decisions made" },
                "messages": { "type": "array", "items": { "type": "object" }, "description": "Full conversation transcript" }
            },
            "required": ["founder_id", "title", "summary", "decisions"]
        }
    },
    {
        "name": "get_memory_changelog",
        "description": "Retrieve the append-only history of meaningful changes from memory_changelog.jsonl: what changed, when, why, and founder approval.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "founder_id": { "type": "string" }
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
                "raw_content": { "type": "string", "description": "The unstructured voice note, thought, or incident post-mortem" },
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

            elif tool_name == "read_founder_memory_file":
                founder_id = args.get("founder_id", "arjun_vance")
                filename = args.get("filename", "founder_profile.json")
                res = requests.get(f"{API_BASE}/founder/{founder_id}/file/{filename}", timeout=5)
                if filename.endswith(".json") or filename.endswith(".jsonl"):
                    text_out = json.dumps(res.json(), indent=2)
                else:
                    text_out = res.text
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": text_out}]}}

            elif tool_name == "update_founder_memory_file":
                founder_id = args.get("founder_id", "arjun_vance")
                filename = args.get("filename", "knowledge_and_evidence.json")
                payload = {
                    "content": args.get("content"),
                    "what_changed": args.get("what_changed", "Updated asset"),
                    "why": args.get("why", "Agent update"),
                    "founder_approved": args.get("founder_approved", True)
                }
                res = requests.post(f"{API_BASE}/founder/{founder_id}/file/{filename}", json=payload, timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "get_founder_sessions":
                founder_id = args.get("founder_id", "arjun_vance")
                res = requests.get(f"{API_BASE}/founder/{founder_id}/sessions", timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "log_founder_session":
                founder_id = args.get("founder_id", "arjun_vance")
                res = requests.post(f"{API_BASE}/founder/{founder_id}/session", json=args, timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "get_memory_changelog":
                founder_id = args.get("founder_id", "arjun_vance")
                res = requests.get(f"{API_BASE}/founder/{founder_id}/changelog", timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "process_raw_asset":
                res = requests.post(f"{API_BASE}/assets/process", json=args, timeout=5)
                return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "text", "text": json.dumps(res.json(), indent=2)}]}}

            elif tool_name == "get_weekly_calendar":
                founder_id = args.get("founder_id", "arjun_vance")
                res = requests.get(f"{API_BASE}/calendar/{founder_id}", timeout=5)
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
                "serverInfo": {"name": "soup-founder-brand-engine-mcp", "version": "2.0.0"}
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
