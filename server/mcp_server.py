"""
Soup Intelligence OS — Model Context Protocol (MCP) Server
Allows external AI agents (Claude Code, Antigravity IDE, Cursor, Claude Desktop)
to interact directly with Soup's founder memory graph, scrapbook, brand voice, and content scheduler.
"""

import sys
import os
import json
from pathlib import Path
from typing import Optional, List, Dict, Any

from mcp.server.mcpserver import MCPServer

# Initialize server
mcp = MCPServer(
    name="Soup Founder Intelligence OS",
    description="Founder branding, scrapbook memory graph, brand voice rules, and calendar scheduling MCP server."
)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
FOUNDER_DIR = DATA_DIR / "founders" / "arjun_vance"
CANONICAL_PROFILE_FILE = DATA_DIR / "arjun_vance.json"


def _read_json_file(file_path: Path, default_val: Any = None) -> Any:
    if not file_path.exists():
        return default_val
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"error": str(e)}


def _write_json_file(file_path: Path, data: Any) -> bool:
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        return False


# ============================================================================
# MCP TOOLS
# ============================================================================

@mcp.tool()
def get_founder_profile() -> Dict[str, Any]:
    """
    Retrieve the active founder profile, mission, origin scar, target audience,
    voice archetype, and preferred social channels.
    """
    data = _read_json_file(CANONICAL_PROFILE_FILE, {})
    identity = data.get("identity", {})
    voice = data.get("voiceprint", {})
    radar = data.get("domain_radar", {})
    channels = data.get("channels", {})

    return {
        "founder_name": identity.get("name", "Dhruv Gautam"),
        "company": identity.get("company_name", "Arka"),
        "role": identity.get("role", "Founder / Co-founder"),
        "stage": identity.get("stage", "Seed"),
        "origin_scar": identity.get("origin_scar", ""),
        "tagline": identity.get("tagline", ""),
        "channels": channels,
        "target_audience": radar.get("target_audience", []),
        "banned_phrases": voice.get("banned_phrases", []),
        "voice_archetype": voice.get("insead_archetype", "The Practical Guide")
    }


@mcp.tool()
def get_brand_voice_guidelines() -> Dict[str, Any]:
    """
    Retrieve Soup's core founder brand voice laws and presentation pillars.
    Enforces: Founder Presence > Cheap Vanity Metrics, and Strict Trend Guardrails.
    """
    return {
        "pillar_1_founder_presence": (
            "Founder presence and domain authority always triumph over cheap vanity engagement. "
            "Never farm views, chase meme dances, or post generic motivational platitudes. "
            "Every piece must establish buyer trust, investor credibility, and deep technical authority."
        ),
        "pillar_2_trend_guardrails": {
            "rule": "Trends are secondary amplifiers, NEVER the first priority.",
            "condition_1_zero_negative_pr": "Must carry 100% brand safety with zero reputational downside or controversy.",
            "condition_2_competitor_validation": "Respected peer brands or competitive innovators must have already tested and validated the format in our category.",
            "condition_3_authentic_grounding": "Must tie directly into real founder scar tissue, engineering decisions, or product truths."
        },
        "anti_slop_guidelines": [
            "Banned buzzwords: 'delve into', 'game-changer', 'thrilled to announce', 'supercharge', 'revolutionary'.",
            "Be direct, concise, and specific with real numbers and trade-offs.",
            "Adopt the voice of an experienced operator teaching, not an engagement-hungry influencer."
        ]
    }


@mcp.tool()
def search_scrapbook(query: str = "") -> List[Dict[str, Any]]:
    """
    Search or list all items in the founder's live Scrapbook (notes, inspirations, technical scars).
    """
    data = _read_json_file(CANONICAL_PROFILE_FILE, {})
    scraps = data.get("scraps", [])
    
    if not query:
        return scraps

    q = query.lower()
    results = []
    for item in scraps:
        title = item.get("title", "").lower()
        content = item.get("content", "").lower()
        tags = " ".join(item.get("tags", [])).lower()
        if q in title or q in content or q in tags:
            results.append(item)
    return results


@mcp.tool()
def add_scrapbook_item(title: str, content: str, category: str = "Technical Scar", tags: List[str] = None) -> Dict[str, Any]:
    """
    Add a new note, lesson, or content idea into the founder's Scrapbook.
    This immediately syncs with the Soup Web UI Scrapboard!
    """
    if tags is None:
        tags = ["mcp", "idea"]

    data = _read_json_file(CANONICAL_PROFILE_FILE, {})
    if "scraps" not in data or not isinstance(data["scraps"], list):
        data["scraps"] = []

    new_id = f"scrap_{len(data['scraps']) + 1}"
    new_item = {
        "id": new_id,
        "title": title,
        "content": content,
        "category": category,
        "tags": tags,
        "created_at": "Just now via MCP"
    }
    data["scraps"].insert(0, new_item)
    success = _write_json_file(CANONICAL_PROFILE_FILE, data)

    return {
        "success": success,
        "message": f"Added '{title}' to Scrapbook.",
        "item": new_item
    }


@mcp.tool()
def get_content_calendar() -> List[Dict[str, Any]]:
    """
    Retrieve the current content drops and scheduled posts from the founder's calendar.
    """
    plan_file = FOUNDER_DIR / "master_content_plan.json"
    data = _read_json_file(plan_file, {})
    schedule = data.get("schedule", [])
    return schedule


@mcp.tool()
def schedule_content_drop(
    day_number: int,
    platform: str,
    pillar: str,
    hook: str,
    draft_brief: str = "",
    status: str = "scheduled"
) -> Dict[str, Any]:
    """
    Schedule a new post into the founder's dynamic content calendar (master_content_plan.json).
    Immediately updates the Soup Web UI Calendar view!
    """
    plan_file = FOUNDER_DIR / "master_content_plan.json"
    data = _read_json_file(plan_file, {"founder_id": "arjun_vance", "schedule": []})
    schedule = data.get("schedule", [])

    new_drop = {
        "day": day_number,
        "platform": platform,
        "pillar": pillar,
        "hook": hook,
        "draft_brief": draft_brief,
        "status": status
    }
    schedule.append(new_drop)
    data["schedule"] = schedule
    success = _write_json_file(plan_file, data)

    return {
        "success": success,
        "message": f"Scheduled Day {day_number} post for {platform}: '{hook}'",
        "drop": new_drop
    }


@mcp.tool()
def evaluate_trend_safety(
    trend_name: str,
    trend_description: str,
    competitors_doing_it: bool = True
) -> Dict[str, Any]:
    """
    Evaluate whether a trend is safe to adopt according to Soup's Founder Presence Guardrails.
    Returns whether to proceed, avoid, or adapt.
    """
    has_competitor_validation = competitors_doing_it
    is_safe_pr = not any(w in (trend_name + " " + trend_description).lower() for w in [
        "scandal", "drama", "expose", "gossip", "cringe", "ragebait", "political", "controversial"
    ])

    if not is_safe_pr:
        return {
            "status": "REJECT_RISKY",
            "decision": "DO NOT ADOPT",
            "reason": "High negative PR or reputational risk. Violates Pillar 2 guardrails.",
            "recommendation": "Avoid completely. Founder presence requires zero controversy."
        }

    if not has_competitor_validation:
        return {
            "status": "WAIT_FOR_VALIDATION",
            "decision": "HOLD OFF",
            "reason": "Trend has not yet been validated by peer category leaders.",
            "recommendation": "Wait until 1-2 respected industry peers test the format first."
        }

    return {
        "status": "SAFE_TO_ADOPT",
        "decision": "APPROVED",
        "reason": "Zero negative PR risk and validated by peer innovators in your space.",
        "recommendation": "Ground the trend strictly in real founder lessons and product scars."
    }


# ============================================================================
# MCP RESOURCES
# ============================================================================

@mcp.resource("soup://founder/profile")
def resource_founder_profile() -> str:
    """Read full raw founder profile JSON."""
    data = _read_json_file(CANONICAL_PROFILE_FILE, {})
    return json.dumps(data, indent=2)


@mcp.resource("soup://founder/voice")
def resource_brand_voice() -> str:
    """Read brand voice and anti-slop rules."""
    rules = get_brand_voice_guidelines()
    return json.dumps(rules, indent=2)


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    # Runs standard stdio transport for Claude Code, Antigravity, Cursor, etc.
    mcp.run(transport="stdio")
