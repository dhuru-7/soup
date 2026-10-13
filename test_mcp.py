"""
Test runner for Soup MCP Server tools
"""
import sys
import json
from pathlib import Path

# Add server dir to sys.path
sys.path.insert(0, str(Path(__file__).parent / "server"))

from mcp_server import (
    get_founder_profile,
    get_brand_voice_guidelines,
    search_scrapbook,
    add_scrapbook_item,
    get_content_calendar,
    schedule_content_drop,
    evaluate_trend_safety
)

def run_tests():
    print("=== Testing Soup MCP Server Tools ===")

    # 1. Founder Profile
    print("\n1. Testing get_founder_profile()...")
    profile = get_founder_profile()
    print("Founder:", profile.get("founder_name"))
    print("Company:", profile.get("company"))
    print("Archetype:", profile.get("voice_archetype"))
    assert profile.get("founder_name") == "Dhruv Gautam", "Founder name mismatch"
    print("-> PASS: get_founder_profile")

    # 2. Brand Voice Guidelines
    print("\n2. Testing get_brand_voice_guidelines()...")
    voice = get_brand_voice_guidelines()
    print("Pillar 1:", voice["pillar_1_founder_presence"][:60], "...")
    print("Pillar 2 Rule:", voice["trend_guardrails"]["rule"] if "trend_guardrails" in voice else voice["pillar_2_trend_guardrails"]["rule"])
    print("-> PASS: get_brand_voice_guidelines")

    # 3. Search Scrapbook
    print("\n3. Testing search_scrapbook()...")
    scraps = search_scrapbook()
    print(f"Total scraps found: {len(scraps)}")
    print("-> PASS: search_scrapbook")

    # 4. Add Scrapbook Item
    print("\n4. Testing add_scrapbook_item()...")
    res = add_scrapbook_item(
        title="MCP Real-Time Test Item",
        content="Testing tool call from Claude Code via Model Context Protocol.",
        category="Founder Insight",
        tags=["mcp", "live_demo"]
    )
    print("Add Scrap Result:", res.get("message"))
    assert res.get("success") is True
    print("-> PASS: add_scrapbook_item")

    # 5. Get Calendar
    print("\n5. Testing get_content_calendar()...")
    cal = get_content_calendar()
    print(f"Calendar events found: {len(cal)}")
    print("-> PASS: get_content_calendar")

    # 6. Schedule Content Drop
    print("\n6. Testing schedule_content_drop()...")
    sched_res = schedule_content_drop(
        day_number=6,
        platform="Instagram",
        pillar="Technical Teardown",
        hook="Why we built an MCP server in 10 minutes instead of a separate mobile app.",
        draft_brief="Teardown on MCP protocol vs bloated APIs."
    )
    print("Schedule Result:", sched_res.get("message"))
    assert sched_res.get("success") is True
    print("-> PASS: schedule_content_drop")

    # 7. Evaluate Trend Safety
    print("\n7. Testing evaluate_trend_safety()...")
    # Test safe trend
    safe = evaluate_trend_safety(
        trend_name="Local-first Architecture Teardowns",
        trend_description="Engineering leaders comparing SQLite local sync to cloud latency",
        competitors_doing_it=True
    )
    print("Safe Trend Decision:", safe["status"], "->", safe["decision"])
    assert safe["status"] == "SAFE_TO_ADOPT"

    # Test risky trend
    risky = evaluate_trend_safety(
        trend_name="Drama & Expose on Silicon Valley VC",
        trend_description="Ragebait about bad investors",
        competitors_doing_it=False
    )
    print("Risky Trend Decision:", risky["status"], "->", risky["decision"])
    assert risky["status"] == "REJECT_RISKY"
    print("-> PASS: evaluate_trend_safety")

    print("\n ALL 7 SOUP MCP SERVER TOOLS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
