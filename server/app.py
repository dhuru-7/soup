import os
import json
import logging
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

import memory_manager

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def load_profile(founder_id: str):
    """
    Loads unified founder profile.
    Checks structured memory manager assets first, then falls back to legacy single JSON files.
    """
    clean_id = founder_id.strip().lower().replace(" ", "_")
    
    # 1. Try unified profile compiled from the 7 memory assets
    unified = memory_manager.compile_unified_profile(clean_id)
    if unified:
        return unified
        
    # Check alias / fuzzy match (e.g. 'arjun' -> 'arjun_vance', 'maya' -> 'maya_lin')
    for fid in memory_manager.list_founder_ids():
        if clean_id in fid or fid in clean_id:
            unified = memory_manager.compile_unified_profile(fid)
            if unified:
                return unified

    # 2. Check direct JSON file in DATA_DIR
    if os.path.exists(DATA_DIR):
        for candidate in [f"{clean_id}.json", f"founder_{clean_id}.json"]:
            file_path = os.path.join(DATA_DIR, candidate)
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)

        # 3. Search inside JSON files
        for fname in os.listdir(DATA_DIR):
            if fname.endswith(".json"):
                try:
                    with open(os.path.join(DATA_DIR, fname), "r", encoding="utf-8") as f:
                        p = json.load(f)
                        if p.get("founder_id") == clean_id or clean_id in str(p.get("founder_id", "")):
                            return p
                except Exception:
                    continue
    return None


def save_legacy_profile(founder_id: str, data: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    file_path = os.path.join(DATA_DIR, f"{founder_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# =============================================================================
# Core System Endpoints
# =============================================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Soup Intelligence OS — Founder Branding Engine & Agent Memory",
        "version": "2.0.0",
        "memory_storage": "7-Asset Structured Local Agent Memory",
        "port": 5050
    })


@app.route("/api/profiles", methods=["GET"])
def list_profiles():
    """
    Lists all available founders with summary identity cards.
    """
    profiles = []
    seen_ids = set()

    # 1. Profiles from memory manager
    for fid in memory_manager.list_founder_ids():
        p = memory_manager.compile_unified_profile(fid)
        if p and fid not in seen_ids:
            seen_ids.add(fid)
            identity = p.get("identity", {})
            profiles.append({
                "founder_id": fid,
                "name": identity.get("name"),
                "role": identity.get("role"),
                "company_name": identity.get("company_name"),
                "avatar": identity.get("avatar"),
                "tagline": identity.get("tagline") or identity.get("mission"),
                "industry": p.get("domain_radar", {}).get("industry"),
                "archetype": p.get("voiceprint", {}).get("insead_archetype")
            })

    # 2. Add any legacy profiles if not already included
    if os.path.exists(DATA_DIR):
        for fname in os.listdir(DATA_DIR):
            if fname.endswith(".json") and not fname.startswith("founder_"):
                fid = fname.replace(".json", "")
                if fid not in seen_ids:
                    seen_ids.add(fid)
                    try:
                        with open(os.path.join(DATA_DIR, fname), "r", encoding="utf-8") as f:
                            p = json.load(f)
                            profiles.append({
                                "founder_id": p.get("founder_id", fid),
                                "name": p.get("identity", {}).get("name"),
                                "role": p.get("identity", {}).get("role"),
                                "company_name": p.get("identity", {}).get("company_name"),
                                "avatar": p.get("identity", {}).get("avatar"),
                                "tagline": p.get("identity", {}).get("tagline"),
                                "industry": p.get("domain_radar", {}).get("industry"),
                                "archetype": p.get("voiceprint", {}).get("insead_archetype")
                            })
                    except Exception:
                        continue

    return jsonify({"profiles": profiles})


@app.route("/api/profile/<founder_id>", methods=["GET"])
def get_profile(founder_id):
    profile = load_profile(founder_id)
    if not profile:
        return jsonify({"error": f"Profile '{founder_id}' not found"}), 404
    return jsonify(profile)


# =============================================================================
# Onboarding & Memory Ingestion Pipeline
# =============================================================================

@app.route("/api/onboard", methods=["POST"])
def onboard_founder():
    """
    Onboarding handler:
    When onboarding happens, the details shared by the user create the user's profile
    in the backend and database. The agent processes the given data and saves it in
    the 7 structured local memory assets:
    1. founder_profile.json
    2. interests_and_stories.md
    3. voice_and_preferences.json
    4. active_direction.md
    5. knowledge_and_evidence.json
    6. session_index.json + conversation logs
    7. memory_changelog.jsonl
    """
    payload = request.get_json() or {}
    
    # Determine founder_id
    founder_id = payload.get("founder_id")
    if not founder_id:
        name_val = payload.get("fullName") or payload.get("identity", {}).get("name", "new_founder")
        founder_id = name_val.lower().strip().replace(" ", "_").replace("/", "_")
    
    # Process given onboarding data and generate all 7 agent memory files
    result = memory_manager.create_or_update_founder_memory(founder_id, payload)
    
    # Also compile the unified profile for immediate frontend render
    unified_profile = memory_manager.compile_unified_profile(founder_id)
    
    # Save legacy JSON snapshot for backwards compatibility
    if unified_profile:
        save_legacy_profile(founder_id, unified_profile)
    
    return jsonify({
        "status": "success",
        "message": "Founder onboarding successfully processed. Agent memory generated across 7 local assets.",
        "founder_id": founder_id,
        "files_created": result.get("files_created", []),
        "directory": result.get("directory", ""),
        "profile": unified_profile
    }), 201


# =============================================================================
# Agent Memory & Knowledge Management Endpoints
# =============================================================================

@app.route("/api/founder/<founder_id>/memory", methods=["GET"])
def get_founder_memory_overview(founder_id):
    """
    Returns an overview of all 7 memory assets with file existence, sizes, and timestamps.
    """
    overview = memory_manager.get_all_memory_assets(founder_id)
    return jsonify({
        "status": "success",
        "memory_overview": overview
    })


@app.route("/api/founder/<founder_id>/file/<filename>", methods=["GET"])
def get_memory_file_endpoint(founder_id, filename):
    """
    Allows the agent or client to retrieve any of the 7 memory assets anytime:
    - founder_profile.json
    - interests_and_stories.md
    - voice_and_preferences.json
    - active_direction.md
    - knowledge_and_evidence.json
    - session_index.json
    - memory_changelog.jsonl
    """
    content = memory_manager.get_memory_file(founder_id, filename)
    if content is None:
        return jsonify({"error": f"Memory file '{filename}' not found for founder '{founder_id}'"}), 404
        
    if filename.endswith(".json") or filename.endswith(".jsonl"):
        return jsonify({
            "status": "success",
            "founder_id": founder_id,
            "filename": filename,
            "content": content
        })
    else:
        # Markdown / text file
        return Response(content, mimetype="text/markdown")


@app.route("/api/founder/<founder_id>/file/<filename>", methods=["POST", "PUT"])
def update_memory_file_endpoint(founder_id, filename):
    """
    Allows the agent or user to update any of the 7 memory files.
    Automatically logs the mutation to memory_changelog.jsonl!
    """
    payload = request.get_json() or {}
    content = payload.get("content")
    if content is None:
        return jsonify({"error": "Missing 'content' field in request body"}), 400
        
    what_changed = payload.get("what_changed", f"Updated {filename}")
    why = payload.get("why", "Founder profile or preference adjustment")
    founder_approved = payload.get("founder_approved", True)
    
    success = memory_manager.update_memory_file(
        founder_id=founder_id,
        filename=filename,
        content=content,
        what_changed=what_changed,
        why=why,
        founder_approved=founder_approved
    )
    
    if not success:
        return jsonify({"error": f"Failed to update '{filename}'"}), 500
        
    return jsonify({
        "status": "success",
        "message": f"Updated {filename} and registered entry in memory_changelog.jsonl",
        "founder_id": founder_id,
        "filename": filename
    })


@app.route("/api/founder/<founder_id>/sessions", methods=["GET"])
def get_founder_sessions(founder_id):
    """
    Returns session_index.json (session titles, timestamps, summaries, decisions, log links).
    This lets the agent continue previous work without reloading every past message each time.
    """
    sessions = memory_manager.get_memory_file(founder_id, "session_index.json")
    if not sessions:
        return jsonify({"error": f"No sessions found for '{founder_id}'"}), 404
    return jsonify({
        "status": "success",
        "founder_id": founder_id,
        "session_index": sessions
    })


@app.route("/api/founder/<founder_id>/session", methods=["POST"])
def create_founder_session(founder_id):
    """
    Records a new conversation session: title, summary, decisions, and full message log.
    Saves message log to conversations/<session_id>.json and updates session_index.json.
    """
    payload = request.get_json() or {}
    title = payload.get("title", "New Founder Strategy Session")
    summary = payload.get("summary", "Session summary")
    decisions = payload.get("decisions", [])
    messages = payload.get("messages", [])
    
    session_entry = memory_manager.add_session(
        founder_id=founder_id,
        title=title,
        summary=summary,
        decisions=decisions,
        messages=messages
    )
    
    return jsonify({
        "status": "success",
        "message": "Session recorded and indexed successfully.",
        "session": session_entry
    }), 201


@app.route("/api/founder/<founder_id>/changelog", methods=["GET"])
def get_founder_changelog(founder_id):
    """
    Returns the complete append-only history of meaningful changes from memory_changelog.jsonl:
    what changed, when, why, and whether the founder approved it.
    """
    changelog = memory_manager.get_memory_file(founder_id, "memory_changelog.jsonl")
    if changelog is None:
        changelog = []
    return jsonify({
        "status": "success",
        "founder_id": founder_id,
        "total_changes": len(changelog),
        "changelog": changelog
    })


# =============================================================================
# Execution & Content Pipeline Endpoints
# =============================================================================

@app.route("/api/assets/process", methods=["POST"])
def process_raw_asset():
    """
    Module 4: Raw Asset / Brain Dump Ingestion Pipeline
    Converts messy voice notes, camera roll photos, terminal logs, or wins into 3 usable post angles.
    """
    payload = request.get_json() or {}
    founder_id = payload.get("founder_id", "arjun_vance")
    raw_content = payload.get("raw_content", "")
    asset_type = payload.get("asset_type", "quick_thought")
    
    profile = load_profile(founder_id)
    name = profile.get("identity", {}).get("name", "Founder") if profile else "Founder"
    company = profile.get("identity", {}).get("company_name", "Startup") if profile else "Startup"
    spicy_take = profile.get("voiceprint", {}).get("spicy_take", "") if profile else ""
    
    angles = [
        {
            "angle_name": "The High-Proof Teardown",
            "platform": "LinkedIn",
            "hook": f"Most founders hide what goes wrong behind closed doors. Here is the exact friction we hit today at {company}:\n\n\"{raw_content[:90]}...\"",
            "body": f"Here is the breakdown:\n1. The unexpected breakdown.\n2. The immediate operational pivot.\n3. The exact metric that saved our milestone.",
            "visual_direction": "Attach candid screen capture or whiteboard diagram showing the exact metric or architecture change.",
            "follow_up_action": "Engage in comments for 45 minutes; share the GitHub link or lab sheet with anyone who asks."
        },
        {
            "angle_name": "The Contrarian Take",
            "platform": "X (Twitter)",
            "hook": f"Unpopular opinion based on today's data:\n\n{raw_content[:120]}",
            "body": f"Why 90% of teams over-engineer this: They optimize for vanity before validation. {spicy_take}",
            "visual_direction": "High-contrast 2-column comparison graphic (Old Way vs New Way).",
            "follow_up_action": "Retweet with additional context if debate sparks in comments."
        },
        {
            "angle_name": "The Vulnerable Founder Story",
            "platform": "LinkedIn & Substack",
            "hook": f"This is what building {company} actually looks like at 6 AM when nobody is watching.\n\n{raw_content[:80]}",
            "body": "Building in public isn't about bragging about wins. It's about taking full accountability for the hard trade-offs.",
            "visual_direction": "Authentic photo taken on a phone camera—no filters, no corporate staging.",
            "follow_up_action": "Directly message candidate applicants or prospective investors who engage with the post."
        }
    ]
    
    return jsonify({
        "status": "success",
        "founder_id": founder_id,
        "input_asset_type": asset_type,
        "raw_content": raw_content,
        "generated_angles": angles
    })


@app.route("/api/calendar/<founder_id>", methods=["GET"])
def get_calendar(founder_id):
    profile = load_profile(founder_id)
    if not profile:
        return jsonify({"error": "Profile not found"}), 404
        
    return jsonify({
        "status": "success",
        "founder_id": founder_id,
        "weekly_calendar": profile.get("weekly_calendar", [
            {
                "day": "Monday",
                "platform": "LinkedIn",
                "format": "High-Proof Post-Mortem",
                "hook": "Most teams hide their production incidents behind vague status pages.",
                "visual_direction": "Terminal flame graph or warehouse test sheet.",
                "follow_up_action": "Engage with engineers in comments within 60 minutes."
            },
            {
                "day": "Wednesday",
                "platform": "LinkedIn",
                "format": "Contrarian Category Wedge",
                "hook": "Unpopular opinion: Conventional wisdom told us to do the opposite.",
                "visual_direction": "2-column comparison table.",
                "follow_up_action": "Follow up with inbounds."
            },
            {
                "day": "Friday",
                "platform": "X (Twitter)",
                "format": "Raw Builder Log",
                "hook": "Here is what we shipped this week and the exact tradeoff we made.",
                "visual_direction": "Candid workstation photo or commit log.",
                "follow_up_action": "Share RFC link."
            }
        ])
    })


@app.route("/api/generate/draft", methods=["POST"])
def generate_draft():
    """
    Live AI draft generation calibrated with founder voiceprint and anti-AI filter.
    Integrates with Sarvam 105B API or provides robust local template fallback.
    """
    payload = request.get_json() or {}
    founder_id = payload.get("founder_id", "arjun_vance")
    prompt = payload.get("prompt", "Draft a high-proof post about our latest technical pivot")
    platform = payload.get("platform", "LinkedIn")
    
    profile = load_profile(founder_id) or {}
    name = profile.get("identity", {}).get("name", "Founder")
    company = profile.get("identity", {}).get("company_name", "Startup")
    archetype = profile.get("voiceprint", {}).get("insead_archetype", "The Builder")
    turning_point = profile.get("identity", {}).get("origin_scar", "Overcoming operational friction")
    spicy_take = profile.get("voiceprint", {}).get("spicy_take", "Keep it simple and direct.")
    
    sarvam_key = os.environ.get("SARVAM_API_KEY", "sk_f26yysgz_RnnhvjCJvFXNAOUq8F2E5ZxN")
    system_prompt = (
        f"You are Muse, the founder brand strategist for {name} ({company}). "
        f"Archetype: {archetype}. Turning point: {turning_point}. Spicy take: {spicy_take}. "
        f"ANTI-AI LAWS: Zero cliches (no 'in today's world', 'delve', 'supercharge', 'game-changer', rocket emojis). "
        f"Write with concrete metrics, friction, and direct human conclusions. Format: Hook, Core Story, Actionable Takeaway, Visual Brief."
    )
    
    try:
        import requests
        res = requests.post(
            "https://api.sarvam.ai/v1/chat/completions",
            headers={"Content-Type": "application/json", "api-subscription-key": sarvam_key},
            json={
                "model": "sarvam-105b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 1024
            },
            timeout=8
        )
        if res.status_code == 200:
            ai_text = res.json().get("choices", [{}])[0].get("message", {}).get("content", "")
            if ai_text:
                return jsonify({
                    "status": "success",
                    "model": "sarvam-105b",
                    "founder_id": founder_id,
                    "platform": platform,
                    "draft": ai_text
                })
    except Exception as e:
        logging.warning(f"Sarvam API call fallback triggered: {e}")
        
    fallback_draft = (
        f"Most founders hide what goes wrong behind closed doors. At {company}, we almost lost our main production pipeline.\n\n"
        f"The friction: {turning_point}.\n\n"
        f"Here is what the metrics showed:\n"
        f"1. Latency jumped 4.2x under unexpected concurrent load.\n"
        f"2. Our initial hypothesis was wrong; the real bottleneck was unbatched I/O.\n"
        f"3. Stripped away 2 layers of abstraction and p99 returned to normal.\n\n"
        f"Key principle: {spicy_take}\n\n"
        f"Visual direction: Attach raw terminal CPU flame graph or candid architecture sketch."
    )
    return jsonify({
        "status": "success",
        "model": "anti-ai-calibrated-engine",
        "founder_id": founder_id,
        "platform": platform,
        "draft": fallback_draft
    })


@app.route("/api/strategy/<founder_id>", methods=["GET"])
@app.route("/api/strategy/<founder_id>/<platform_or_master>", methods=["GET", "POST"])
def handle_strategy(founder_id: str, platform_or_master: str = "all"):
    """
    Get or update dedicated strategy assets:
    - strategy_linkedin.json
    - strategy_x_twitter.json
    - strategy_instagram.json
    - master_content_plan.json
    """
    if request.method == "POST":
        payload = request.get_json() or {}
        data = payload.get("data", {})
        what_changed = payload.get("what_changed", "Updated strategy parameters")
        why = payload.get("why", "Founder request")
        updated = memory_manager.update_strategy_asset(founder_id, platform_or_master, data, what_changed, why)
        return jsonify({
            "status": "success" if updated else "error",
            "founder_id": founder_id,
            "target": platform_or_master,
            "data": updated
        })
    
    if platform_or_master == "all":
        all_strat = memory_manager.ensure_strategy_files(founder_id)
        return jsonify({
            "status": "success",
            "founder_id": founder_id,
            "strategy": all_strat
        })
    else:
        strat = memory_manager.get_strategy_asset(founder_id, platform_or_master)
        return jsonify({
            "status": "success" if strat else "not_found",
            "founder_id": founder_id,
            "target": platform_or_master,
            "data": strat
        })


@app.route("/api/agent/apply_update", methods=["POST"])
def agent_apply_update():
    """
    Directly applies user changes/instructions (e.g. changing 7-day plan to 3-day plan)
    to the distinct strategy files on disk and logs to memory_changelog.jsonl.
    """
    payload = request.get_json() or {}
    founder_id = payload.get("founder_id", "arjun_vance")
    instruction = payload.get("instruction", "")
    params = payload.get("params", {})
    
    result = memory_manager.apply_agent_strategy_command(founder_id, instruction, params)
    return jsonify(result)


@app.route("/api/export/mcp", methods=["GET"])
def export_mcp_config():
    cwd = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    server_script = os.path.join(cwd, "mcp-server", "server.py")
    
    config = {
        "mcpServers": {
            "soup-branding-engine": {
                "command": "python",
                "args": [server_script],
                "env": {
                    "BRAND_ENGINE_API": "http://localhost:5050/api"
                }
            }
        }
    }
    return jsonify({
        "status": "success",
        "config": config,
        "instructions": "Add this to your Claude Desktop config (claude_desktop_config.json) or Antigravity/Cursor MCP settings."
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    logging.info(f"Starting Soup Intelligence OS Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
