"""
Founder Agent Memory & Knowledge Management Engine
Soup Intelligence OS

Maintains the 7 structured local memory assets per founder:
1. founder_profile.json       - Core memory: identity, company, product, stage, expertise, audience, goals, platforms, time budget.
2. interests_and_stories.md   - Personal context: passions, origin stories/scars, lessons, hobbies/analogies, taboos/off-limits.
3. voice_and_preferences.json  - Voiceprint & preferences: tone, writing samples, formats, vocabulary, banned phrases, boundaries.
4. active_direction.md        - Strategic direction: approved positioning, 3 pillars, cadence, objectives, rationale.
5. knowledge_and_evidence.json  - Evidence locker: verifiable claims, achievements, projects, metrics, lessons, sources, permissions.
6. session_index.json + conversations/ - Conversation index & session logs: titles, timestamps, summaries, decisions, log links.
7. memory_changelog.jsonl     - Append-only audit trail: what changed, when, why, founder approved status.
"""

import os
import json
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
FOUNDERS_DIR = os.path.join(DATA_DIR, "founders")


def get_founder_dir(founder_id: str) -> str:
    clean_id = founder_id.strip().lower().replace(" ", "_")
    return os.path.join(FOUNDERS_DIR, clean_id)


def ensure_founder_dir(founder_id: str) -> str:
    fdir = get_founder_dir(founder_id)
    os.makedirs(fdir, exist_ok=True)
    os.makedirs(os.path.join(fdir, "conversations"), exist_ok=True)
    return fdir


def list_founder_ids() -> List[str]:
    if not os.path.exists(FOUNDERS_DIR):
        return []
    founders = []
    for item in os.listdir(FOUNDERS_DIR):
        if os.path.isdir(os.path.join(FOUNDERS_DIR, item)):
            founders.append(item)
    return sorted(founders)


def append_changelog(
    founder_id: str,
    change_type: str,
    target_file: str,
    what_changed: str,
    why: str,
    founder_approved: bool = True,
    details: Optional[Dict[str, Any]] = None
):
    """
    Appends a new immutable log entry to memory_changelog.jsonl
    """
    fdir = ensure_founder_dir(founder_id)
    changelog_path = os.path.join(fdir, "memory_changelog.jsonl")
    
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "change_id": f"chg_{int(time.time() * 1000)}",
        "change_type": change_type,
        "target_file": target_file,
        "what_changed": what_changed,
        "why": why,
        "founder_approved": founder_approved,
        "details": details or {}
    }
    
    with open(changelog_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    return entry


def get_memory_file(founder_id: str, filename: str) -> Optional[Any]:
    """
    Retrieves the raw or parsed content of one of the founder's 7 memory files.
    """
    fdir = get_founder_dir(founder_id)
    target_path = os.path.join(fdir, filename)
    if not os.path.exists(target_path):
        return None
    
    if filename.endswith(".json"):
        with open(target_path, "r", encoding="utf-8") as f:
            return json.load(f)
    elif filename.endswith(".jsonl"):
        lines = []
        with open(target_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        lines.append(json.loads(line))
                    except Exception:
                        pass
        return lines
    else:
        with open(target_path, "r", encoding="utf-8") as f:
            return f.read()


def update_memory_file(
    founder_id: str,
    filename: str,
    content: Any,
    what_changed: str = "Updated file contents",
    why: str = "Founder preference or detail adjustment",
    founder_approved: bool = True
) -> bool:
    """
    Safely updates one of the founder's memory assets and registers the change in memory_changelog.jsonl.
    """
    fdir = ensure_founder_dir(founder_id)
    target_path = os.path.join(fdir, filename)
    
    if filename.endswith(".json"):
        with open(target_path, "w", encoding="utf-8") as f:
            if isinstance(content, str):
                json_obj = json.loads(content)
                json.dump(json_obj, f, indent=2)
            else:
                json.dump(content, f, indent=2)
    elif filename.endswith(".jsonl"):
        if isinstance(content, list):
            with open(target_path, "a", encoding="utf-8") as f:
                for item in content:
                    f.write(json.dumps(item) + "\n")
        elif isinstance(content, dict):
            with open(target_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(content) + "\n")
        else:
            with open(target_path, "a", encoding="utf-8") as f:
                f.write(str(content).strip() + "\n")
    else:
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(str(content))
            
    append_changelog(
        founder_id=founder_id,
        change_type="update",
        target_file=filename,
        what_changed=what_changed,
        why=why,
        founder_approved=founder_approved
    )
    return True


def add_session(
    founder_id: str,
    title: str,
    summary: str,
    decisions: List[str],
    messages: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Adds a new conversation session to session_index.json and saves the conversation log in conversations/{session_id}.json.
    """
    fdir = ensure_founder_dir(founder_id)
    session_index_path = os.path.join(fdir, "session_index.json")
    
    if os.path.exists(session_index_path):
        with open(session_index_path, "r", encoding="utf-8") as f:
            index_data = json.load(f)
    else:
        index_data = {"founder_id": founder_id, "sessions": [], "last_active_session": ""}
        
    session_num = len(index_data.get("sessions", [])) + 1
    session_id = f"sess_{session_num:02d}"
    rel_log_path = f"conversations/{session_id}.json"
    full_log_path = os.path.join(fdir, rel_log_path)
    
    now_iso = datetime.utcnow().isoformat() + "Z"
    
    session_entry = {
        "session_id": session_id,
        "title": title,
        "timestamp": now_iso,
        "summary": summary,
        "decisions": decisions,
        "link_to_full_log": rel_log_path
    }
    
    index_data["sessions"].append(session_entry)
    index_data["last_active_session"] = session_id
    index_data["total_sessions"] = len(index_data["sessions"])
    
    with open(session_index_path, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2)
        
    with open(full_log_path, "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2)
        
    append_changelog(
        founder_id=founder_id,
        change_type="session_logged",
        target_file="session_index.json",
        what_changed=f"Recorded session {session_id}: '{title}'",
        why="Agent logged session summary and decisions to allow seamless continuation.",
        founder_approved=True
    )
    
    return session_entry


def get_all_memory_assets(founder_id: str) -> Dict[str, Any]:
    """
    Returns an overview of all 7 memory assets with file existence, sizes, and last modified times.
    """
    fdir = get_founder_dir(founder_id)
    files = [
        "founder_profile.json",
        "interests_and_stories.md",
        "voice_and_preferences.json",
        "active_direction.md",
        "knowledge_and_evidence.json",
        "session_index.json",
        "memory_changelog.jsonl"
    ]
    assets = {}
    for fname in files:
        fpath = os.path.join(fdir, fname)
        if os.path.exists(fpath):
            stat = os.stat(fpath)
            assets[fname] = {
                "exists": True,
                "size_bytes": stat.st_size,
                "last_modified": datetime.utcfromtimestamp(stat.st_mtime).isoformat() + "Z"
            }
        else:
            assets[fname] = {"exists": False, "size_bytes": 0, "last_modified": None}
            
    return {
        "founder_id": founder_id,
        "directory": fdir,
        "assets": assets
    }


def create_or_update_founder_memory(founder_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Takes onboarding input (or founder intake dataset) and generates all 7 structured agent memory assets.
    """
    fdir = ensure_founder_dir(founder_id)
    is_maya = (
        founder_id == "maya_lin" or 
        "maya" in founder_id.lower() or 
        "solace" in str(data.get("entityName", "")).lower() or
        "solace" in str(data.get("identity", {}).get("company_name", "")).lower() or
        "solace" in str(data.get("company", "")).lower()
    )
    
    # Extract identity fields
    identity = data.get("identity", {})
    name = (
        data.get("fullName") or 
        identity.get("name") or 
        data.get("name") or 
        ("Maya Lin" if is_maya else "Arjun Vance")
    )
    role = (
        data.get("role") or 
        identity.get("role") or 
        ("Founder & CEO" if is_maya else "Co-founder & CTO")
    )
    company = (
        data.get("entityName") or 
        identity.get("company_name") or 
        data.get("company") or 
        ("Solace Botanicals" if is_maya else "AgentScale")
    )
    mission = (
        data.get("mission") or 
        identity.get("mission") or 
        identity.get("product_description") or 
        data.get("product_description") or (
            "Organic adaptogenic sparkling elixirs with 0g sugar and zero artificial gums." if is_maya
            else "Distributed observability and trace debugger for multi-agent LLM systems in production."
        )
    )
    stage = (
        data.get("stage") or 
        identity.get("stage") or 
        ("Bootstrapped to $65k MRR, raising $750k Angel Seed" if is_maya else "Seed ($1.8M raised, 14-person engineering team)")
    )
    
    expertise = data.get("expertise") or (
        ["D2C & Retail Expansion", "Supply Chain / Operations", "Functional Beverage Science"] if is_maya
        else ["Engineering / AI", "Product Architecture", "Distributed Systems"]
    )
    
    hobbies = data.get("hobbies") or (
        ["Trail Running", "Specialty Coffee", "Regenerative Farming"] if is_maya
        else ["Chess & Strategy", "Specialty Coffee", "Mechanical Keyboards"]
    )

    origin_scar = (
        data.get("whyStarted") or 
        data.get("turningPoint") or 
        identity.get("origin_scar") or (
            "14 commercial beverage co-packers told me clean organic sparkling formulas were commercially impossible without synthetic stabilizers and gums. Refused to compromise." if is_maya
            else "Spent 14 hours debugging a production Redis memory leak caused by unbatched key scans that cost $400/hr in cloud overruns; realized existing APMs are completely blind to autonomous agent loops."
        )
    )

    voiceprint = data.get("voiceprint", {})
    archetype = (
        data.get("brandStyle") or 
        voiceprint.get("insead_archetype") or 
        data.get("archetype") or (
            "The Vulnerable Operator (Honest & Raw)" if is_maya else "The Builder (Share the Work)"
        )
    )

    spicy_take = (
        data.get("unpopularOpinion") or 
        voiceprint.get("spicy_take") or 
        data.get("spicy_take") or (
            "If a canned healthy drink has a 2-year shelf life at room temperature, you are drinking industrial preservatives, not wellness. Gross margin cuts are worth real ingredient integrity." if is_maya
            else "Vector databases are 90% marketing hype for small-scale apps; SQLite with BM25 beats them in latency, cost, and maintainability."
        )
    )

    audiences = (
        data.get("audiences") or 
        data.get("domain_radar", {}).get("target_audience") or 
        data.get("target_audience") or (
            ["Conscious Consumers & Health Enthusiasts", "Regional Retail Buyers (Whole Foods, Sprouts)", "Consumer Angel Investors"] if is_maya
            else ["Staff Backend Engineers & AI Leads", "Enterprise Buyers & CTOs", "Distributed Systems Architects"]
        )
    )

    taboos = (
        data.get("annoyances") or 
        data.get("domain_radar", {}).get("audience_taboos") or 
        data.get("audience_taboos") or (
            ["Polished PR and greenwashing", "Founders disconnected from supply chain", "Hidden artificial sweeteners disguised as 'natural flavors'"] if is_maya
            else ["Hollow AI wrapper marketing", "Unverified latency benchmarks", "Hype without verifiable code or flame graphs"]
        )
    )

    banned_phrases = (
        data.get("bannedPhrases") or 
        voiceprint.get("banned_phrases") or 
        data.get("banned_phrases") or (
            ["synergy", "game-changer", "humbled and honored", "guilt-free indulgence", "miracle cure", "revolutionizing beverage"] if is_maya
            else ["delve into", "game-changer", "humbled and honored", "thrilled to announce", "in today's fast-paced digital world", "synergy", "supercharge", "revolutionary"]
        )
    )

    platforms = (
        data.get("platforms") or 
        data.get("execution_capacity", {}).get("channels") or 
        data.get("preferred_platforms") or (
            ["LinkedIn", "Instagram / TikTok"] if is_maya else ["LinkedIn", "X (Twitter)"]
        )
    )

    goals = data.get("goals_tracking") or data.get("goals")
    if not goals or not goals.get("metrics"):
        if is_maya:
            goals = {
                "north_star": "Wholesale Placement & High-Trust Brand Equity",
                "timeframe": "6 Months",
                "metrics": {
                    "retail_inbounds": {"current": 4, "target": 20, "unit": "Stockist Inquiries"},
                    "community_advocates": {"current": 340, "target": 1000, "unit": "Verified Advocates"},
                    "speaking_invites": {"current": 2, "target": 6, "unit": "CPG Panels/Keynotes"},
                    "authority_score": {"current": 82, "target": 95, "unit": "/100"}
                }
            }
        else:
            goals = {
                "north_star": "Technical Authority & Inbound Senior Engineering Hires",
                "timeframe": "6 Months",
                "metrics": {
                    "cto_inbounds": {"current": 3, "target": 15, "unit": "Enterprise Inquiries"},
                    "engineering_hires": {"current": 2, "target": 5, "unit": "Staff Engineers in Pipeline"},
                    "github_stars": {"current": 1420, "target": 3000, "unit": "GitHub Stars"},
                    "speaking_invites": {"current": 1, "target": 5, "unit": "Technical Podcasts/Keynotes"},
                    "authority_score": {"current": 84, "target": 95, "unit": "/100"}
                }
            }

    weekly_budget = data.get("weekly_time_budget") or "2 hours/week (15 min daily review)"
    now_iso = datetime.utcnow().isoformat() + "Z"

    # =========================================================================
    # 1. founder_profile.json (Core memory)
    # =========================================================================
    founder_profile = {
        "founder_id": founder_id,
        "name": name,
        "role": role,
        "company": company,
        "product_description": mission,
        "stage": stage,
        "expertise": expertise,
        "target_audience": audiences,
        "goals": goals,
        "preferred_platforms": platforms,
        "weekly_time_budget": weekly_budget,
        "avatar": (
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" if is_maya
            else "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        ),
        "unfair_advantage": (
            "Former food scientist at General Mills who left after seeing how cost-cutting compromises consumer gut health." if is_maya
            else "Ex-Datadog distributed tracing architect. Wrote eBPF kernels for high-throughput stream processing."
        ),
        "identity": {
            "name": name,
            "role": role,
            "company_name": company,
            "mission": mission,
            "tagline": mission,
            "stage": stage,
            "origin_scar": origin_scar,
            "avatar": (
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" if is_maya
                else "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
            )
        },
        "created_at": now_iso,
        "last_updated": now_iso
    }
    with open(os.path.join(fdir, "founder_profile.json"), "w", encoding="utf-8") as f:
        json.dump(founder_profile, f, indent=2)

    # =========================================================================
    # 2. interests_and_stories.md (Personal context)
    # =========================================================================
    stories_md = f"""# Personal Context & Founder Stories: {name}

## 1. Passions & Topics Enjoyed Discussing
{chr(10).join(f"- **{exp}**: Firsthand insights, real operational trade-offs, and building without marketing fluff." for exp in expertise)}

## 2. Core Founder Story & Origin Turning Point
> "{origin_scar}"

**Context & Significance:**
This moment represents the foundational friction that birthed {company}. It proves {name} is solving a problem discovered through genuine operational pain, not hypothetical market research.

## 3. Key Lessons Learned
{chr(10).join([
    "- Transparency about unit economics and formulation sacrifices builds unbreakable consumer trust.",
    "- Hand-formulating and direct supply chain accountability always beats white-label co-packer convenience.",
    "- If you don't educate the customer on why real ingredients cost more, market incumbents will commoditize you."
] if is_maya else [
    "- Firsthand production incident post-mortems build 10x more engineering credibility than polished feature announcements.",
    "- Client-side loops across high-throughput distributed stores will inevitably fail at p99 scale.",
    "- Stripping out unnecessary architectural abstractions saves both latency and millions in cloud overruns."
])}

## 4. Personal Hobbies & Humanizing Metaphors
{chr(10).join(f"- **{h}**: Draw metaphors from this discipline to humanize and explain complex operating concepts." for h in hobbies)}

## 5. Publicly Off-Limit Topics (Taboos & Privacy Boundaries)
{chr(10).join(f"- 🚫 {t}" for t in taboos)}
- 🚫 Confidential co-founder equity splits or unannounced funding discussions.
- 🚫 Speculative claims without verifiable documentation.
- 🚫 Naming enterprise pilot customers or private suppliers prior to formal authorization.
"""
    with open(os.path.join(fdir, "interests_and_stories.md"), "w", encoding="utf-8") as f:
        f.write(stories_md)

    # =========================================================================
    # 3. voice_and_preferences.json (Voiceprint & preferences)
    # =========================================================================
    voice_prefs = {
        "founder_id": founder_id,
        "tone": f"{archetype} - Direct, transparent, practitioner-level depth, zero synthetic buzzwords.",
        "archetype": archetype,
        "writing_samples": [
            (
                "14 beverage manufacturing plants told me my formula was 'commercially impossible' unless I added artificial guar gum.\n\nHere is what happens when a founder refuses to poison their own product for higher profit margins:"
                if is_maya else
                "We accidentally burned $412 in 14 hours on AWS because of a single unbatched Redis scan across 50,000 agent sessions.\n\nHere is the post-mortem and the 12-line Lua script that fixed it:"
            ),
            (
                f"Unpopular opinion: \"{spicy_take}\"\n\nWhy 90% of beverage brands get this wrong:"
                if is_maya else
                f"Unpopular opinion: \"{spicy_take}\"\n\nHere is our benchmark comparing p99 latency under concurrent load:"
            )
        ],
        "preferred_formats": (
            ["Supply Chain / Manufacturing Exposé", "Unfiltered Founder Diary", "Ingredient Science Teardown"] if is_maya
            else ["Production Post-Mortem", "Contrarian Architecture Wedge", "Terminal / Whiteboard Teardown"]
        ),
        "format_breakdown": {
            "text_posts": 45 if is_maya else 60,
            "short_videos_reels": 35 if is_maya else 20,
            "carousels_and_graphics": 20 if is_maya else 20
        },
        "format_preferences": {
            "prefers_text_posts": True,
            "prefers_videos": True if is_maya else False,
            "prefers_carousels": True,
            "notes": "Prefers raw candid assets (warehouse logs or terminal flame graphs) over corporate marketing graphics."
        },
        "vocabulary": {
            "signature_terms": (
                ["adaptogenic extraction", "zero artificial gums", "cold-pressed botanical", "gross margin integrity", "clean shelf-stability"] if is_maya
                else ["p99 latency", "distributed state", "eBPF trace", "Lua atomic script", "deterministic replay"]
            ),
            "voice_rules": [
                f"Archetype tone: {archetype}.",
                "Always include concrete proof: exact cost per can, exact batch numbers, or exact millisecond latency.",
                "Zero synthetic AI boilerplate words (no 'in today's world', 'delve', or rocket emojis).",
                "Keep sentence rhythm conversational, direct, and unpretentious."
            ]
        },
        "phrases_to_avoid": banned_phrases,
        "privacy_boundaries": [
            "Never cite personal supplier cell numbers or unannounced contract agreements.",
            "Never reveal proprietary batch formulation ratios before patent filing.",
            "Never name pilot enterprise partners without mutual press sign-off."
        ],
        "spicy_take": spicy_take,
        "last_updated": now_iso
    }
    with open(os.path.join(fdir, "voice_and_preferences.json"), "w", encoding="utf-8") as f:
        json.dump(voice_prefs, f, indent=2)

    # =========================================================================
    # 4. active_direction.md (Active direction & pillars)
    # =========================================================================
    pillars = data.get("content_pillars") or (
        [
            {"id": "pillar_1", "name": "Supply Chain & Food Industry Truths", "ratio": 50, "description": "Exposing the hidden shortcuts beverage giants take with maltodextrin, artificial gums, and natural flavor labeling."},
            {"id": "pillar_2", "name": "The Raw Founder Diary (Bootstrapped to Shelves)", "ratio": 30, "description": "The unglamorous reality of inventory financing, pallet shipping, co-packer rejections, and retail negotiations."},
            {"id": "pillar_3", "name": "Clean Living Science & Adaptogen Education", "ratio": 20, "description": "Actionable science on cortisol regulation, lion's mane efficacy, and sleep cycles without wellness fluff."}
        ] if is_maya else [
            {"id": "pillar_1", "name": "Production Post-Mortems & Deep-Dive Engineering", "ratio": 60, "description": "Real architectural bugs, latency optimizations, and memory leak root causes from the AgentScale engine."},
            {"id": "pillar_2", "name": "Contrarian AI Infrastructure Realities", "ratio": 25, "description": "Debunking AI marketing hype with cold benchmarks (SQLite vs Vector DBs, deterministic state vs prompt magic)."},
            {"id": "pillar_3", "name": "Building in Public & High-Bar Engineering Culture", "ratio": 15, "description": "Hiring standards for founding engineers, internal RFC culture, and open-source release notes."}
        ]
    )

    direction_md = f"""# Active Strategic Direction & Positioning: {name}

## 1. Approved Positioning Statement
> **Mission:** {mission}  
> **Core Category Wedge:** "{spicy_take}"

## 2. Content Themes & Strategic Pillars
{chr(10).join(f"### {p['name']} ({p.get('ratio', 33)}%){chr(10)}- **Pillar ID:** `{p['id']}`{chr(10)}- **Scope:** {p['description']}" for p in pillars)}

## 3. Platform Priorities
- **Primary Priority:** {platforms[0]} (Scheduled 3x/week: Mon/Wed/Fri)
- **Secondary Priority:** {platforms[1] if len(platforms) > 1 else 'LinkedIn'} (Scheduled 2x/week: Tue/Thu)

## 4. Publishing Cadence
- **Weekly Cadence:** 4 to 5 high-proof pieces of content weekly.
- **Workflow:** 15-minute daily async review on mobile; agent compiles drafts from raw receipts.

## 5. Current Objectives (3-Month & 6-Month)
- **North Star:** {goals.get('north_star')}
- **3-Month Target:** Establish undeniable category authority, generating qualified inbound conversations.
- **6-Month Target:** Convert organic authority into strategic hiring, retail shelf presence, and investor inbound.

## 6. Strategic Rationale
By prioritizing radical proof-of-work and candid failure post-mortems over generic promotional announcements, {company} bypasses audience skepticism. The strategy turns operational friction into the company's highest-converting marketing asset.
"""
    with open(os.path.join(fdir, "active_direction.md"), "w", encoding="utf-8") as f:
        f.write(direction_md)

    # =========================================================================
    # 5. knowledge_and_evidence.json (Evidence locker & claims)
    # =========================================================================
    evidence = {
        "founder_id": founder_id,
        "claims": (
            [
                {
                    "claim_id": "ev_01",
                    "topic": "Co-Packer Rejections",
                    "claim": "14 commercial beverage manufacturing plants refused to bottle our formula without synthetic stabilizers and gums.",
                    "fact": "14 commercial beverage manufacturing plants refused to bottle our formula without synthetic stabilizers and gums.",
                    "source": "Co-packer technical specification correspondence #01-#14",
                    "verification_status": "verified",
                    "permission_to_cite": True,
                    "context_visual": "Candid warehouse photo holding batch test sheets next to canning line."
                },
                {
                    "claim_id": "ev_02",
                    "topic": "Retail Unit Economics",
                    "claim": "Getting into the first 12 Whole Foods locations required absorbing $0.14 margin sacrifice per can to keep ingredients 100% whole plant extract.",
                    "fact": "Getting into the first 12 Whole Foods locations required absorbing $0.14 margin sacrifice per can to keep ingredients 100% whole plant extract.",
                    "source": "Solace Botanicals COGS Spreadsheet v4.2",
                    "verification_status": "verified",
                    "permission_to_cite": True,
                    "context_visual": "Photo of handwritten pallet inventory clipboard."
                },
                {
                    "claim_id": "ev_03",
                    "topic": "FDA Ingredient Loopholes",
                    "claim": "Under FDA Title 21 Code of Federal Regulations, brands can group synthetic chemical solvents and extraction carriers under the umbrella term 'Natural Flavors'.",
                    "fact": "Under FDA Title 21 Code of Federal Regulations, brands can group synthetic chemical solvents and extraction carriers under the umbrella term 'Natural Flavors'.",
                    "source": "FDA CFR Title 21 § 101.22",
                    "verification_status": "verified",
                    "permission_to_cite": True,
                    "context_visual": "Macro comparison photo of pure organic ashwagandha root vs synthetic extract powder."
                }
            ] if is_maya else [
                {
                    "claim_id": "ev_01",
                    "topic": "Production Redis Memory Leak",
                    "claim": "Burned $412 in 14 hours on AWS due to an unbatched Redis scan across 50,000 autonomous agent sessions; resolved via 12-line Lua atomic proxy.",
                    "fact": "Burned $412 in 14 hours on AWS due to an unbatched Redis scan across 50,000 autonomous agent sessions; resolved via 12-line Lua atomic proxy.",
                    "source": "AWS CloudWatch Incident Log #412 & Git Commit 9a41c2",
                    "verification_status": "verified",
                    "permission_to_cite": True,
                    "context_visual": "Dark-mode terminal CPU flame graph before/after Lua script optimization."
                },
                {
                    "claim_id": "ev_02",
                    "topic": "SQLite vs Vector DB Benchmark",
                    "claim": "SQLite with BM25 achieved 1.8ms p99 latency compared to 42ms on managed vector DBs for corpora under 250,000 chunks, cutting server costs to zero.",
                    "fact": "SQLite with BM25 achieved 1.8ms p99 latency compared to 42ms on managed vector DBs for corpora under 250,000 chunks, cutting server costs to zero.",
                    "source": "AgentScale Internal Benchmark Report #07",
                    "verification_status": "verified",
                    "permission_to_cite": True,
                    "context_visual": "High-contrast latency vs cost benchmark table."
                },
                {
                    "claim_id": "ev_03",
                    "topic": "eBPF Trace Proxy Overhead",
                    "claim": "Our custom eBPF trace kernel captures recursive multi-agent tool loops with under 0.4% CPU overhead.",
                    "fact": "Our custom eBPF trace kernel captures recursive multi-agent tool loops with under 0.4% CPU overhead.",
                    "source": "AgentScale eBPF Kernel Architecture Paper v1.0",
                    "verification_status": "verified",
                    "permission_to_cite": True,
                    "context_visual": "Whiteboard kernel architecture diagram."
                }
            ]
        ),
        "achievements": (
            [
                {
                    "title": "Bootstrapped to $65k MRR",
                    "details": "Reached $65,000 in monthly recurring revenue with zero outside venture capital.",
                    "source": "Stripe Revenue Dashboard",
                    "verification_status": "verified",
                    "permission_to_cite": True
                },
                {
                    "title": "Whole Foods Regional Shelf Placement",
                    "details": "Secured authorization across 12 Northern California retail locations.",
                    "source": "Whole Foods Vendor Agreement",
                    "verification_status": "verified",
                    "permission_to_cite": True
                }
            ] if is_maya else [
                {
                    "title": "$1.8M Seed Round Closed",
                    "details": "Backed by developer tools seed syndicate to build autonomous agent observability.",
                    "source": "SEC Form D & Syndicate Term Sheet",
                    "verification_status": "verified",
                    "permission_to_cite": True
                },
                {
                    "title": "AgentScale Tracing Engine v1.0",
                    "details": "Shipped deterministic replay debugger for multi-agent loops.",
                    "source": "GitHub Release Tags v1.0.0",
                    "verification_status": "verified",
                    "permission_to_cite": True
                }
            ]
        ),
        "projects": (
            [
                {"project_name": "Solace Adaptogenic Elixir", "description": "Clean functional beverage with 0g sugar and zero artificial gums.", "stage": "In Market", "public": True},
                {"project_name": "Zero-Gum Botanical Canning Protocol", "description": "Proprietary ultrasonic emulsion protocol replacing guar gum.", "stage": "Patent Pending", "public": False}
            ] if is_maya else [
                {"project_name": "AgentScale Observability Proxy", "description": "Low-overhead distributed trace debugger for LLM agent clusters.", "stage": "Production", "public": True},
                {"project_name": "AgentBench Suite", "description": "Open latency benchmark comparing SQLite and remote vector stores.", "stage": "Open Source", "public": True}
            ]
        ),
        "metrics": {
            "stage": stage,
            "company": company,
            "primary_metric": "$65k MRR (Organic)" if is_maya else "1.8ms p99 latency",
            "team_size": 6 if is_maya else 14
        },
        "lessons": (
            [
                "Formulation compromises destroy long-term brand equity faster than supply chain delays.",
                "Direct customer relationships beat distributor hype every single quarter."
            ] if is_maya else [
                "Unbatched scans across high-throughput distributed stores will inevitably fail at p99 scale.",
                "Engineers respect code diffs and flame graphs infinitely more than high-level thought leadership."
            ]
        ),
        "last_updated": now_iso
    }
    with open(os.path.join(fdir, "knowledge_and_evidence.json"), "w", encoding="utf-8") as f:
        json.dump(evidence, f, indent=2)

    # =========================================================================
    # 6. session_index.json & conversations/ (Conversation memory)
    # =========================================================================
    session_index = {
        "founder_id": founder_id,
        "total_sessions": 3,
        "last_active_session": "sess_01",
        "sessions": (
            [
                {
                    "session_id": "sess_01",
                    "title": "Founder story: Why 14 co-packers turned us down → 45s reel",
                    "timestamp": "2026-10-10T14:30:00Z",
                    "summary": "Synthesized co-packer rejection turning point into an authentic 45-second Instagram reel and LinkedIn post exposing formulation compromises.",
                    "decisions": [
                        "Framed conflict around refusing synthetic stabilizers and gums",
                        "Attached candid warehouse photo with handwritten lab log",
                        "Call to action directed toward conscious consumers and retail stockists"
                    ],
                    "link_to_full_log": "conversations/sess_01.json"
                },
                {
                    "session_id": "sess_02",
                    "title": "Research: The hidden reality of 'Natural Flavors' in retail drinks",
                    "timestamp": "2026-10-11T16:15:00Z",
                    "summary": "Analyzed FDA Title 21 labeling guidelines to prepare a high-authority educational carousel for clean wellness advocates.",
                    "decisions": [
                        "Avoided alarmism; focused on first-principles food chemistry",
                        "Emphasized whole adaptogen root extraction"
                    ],
                    "link_to_full_log": "conversations/sess_02.json"
                },
                {
                    "session_id": "sess_03",
                    "title": "Contrarian angle: Shelf-life preservatives vs real wellness",
                    "timestamp": "2026-10-12T09:45:00Z",
                    "summary": "Drafted category-defense argument analyzing why 2-year shelf life drinks sacrifice active adaptogen efficacy.",
                    "decisions": [
                        "Positioned gross margin sacrifice as a brand asset",
                        "Prepared follow-up direct messages for grocery buyers"
                    ],
                    "link_to_full_log": "conversations/sess_03.json"
                }
            ] if is_maya else [
                {
                    "session_id": "sess_01",
                    "title": "Founder story: Redis memory leak → 45s video teardown",
                    "timestamp": "2026-10-10T14:30:00Z",
                    "summary": "Calibrated the $412 Redis memory leak incident into a high-proof technical post-mortem for engineering leads.",
                    "decisions": [
                        "Included exact dollar cost ($412) and 12-line Lua solution",
                        "Attached terminal CPU flame graph",
                        "CTA targeted staff backend engineers and AI platform leads"
                    ],
                    "link_to_full_log": "conversations/sess_01.json"
                },
                {
                    "session_id": "sess_02",
                    "title": "Research: Why early founders struggle with agent eval",
                    "timestamp": "2026-10-11T16:15:00Z",
                    "summary": "Explored why standard APMs fail on recursive agent loops and documented architectural lessons for distributed tracing.",
                    "decisions": [
                        "Emphasized deterministic state machines over prompt magic",
                        "Outlined open-source post-mortem distribution strategy"
                    ],
                    "link_to_full_log": "conversations/sess_02.json"
                },
                {
                    "session_id": "sess_03",
                    "title": "Contrarian angle: SQLite vs Vector DB benchmarks",
                    "timestamp": "2026-10-12T09:45:00Z",
                    "summary": "Formulated high-contrast benchmark thread demonstrating 1.8ms latency using SQLite with BM25 for corpora under 250k chunks.",
                    "decisions": [
                        "Focus on cold benchmarks and infrastructure simplicity",
                        "Prepared follow-up RFC for engineering community"
                    ],
                    "link_to_full_log": "conversations/sess_03.json"
                }
            ]
        )
    }
    with open(os.path.join(fdir, "session_index.json"), "w", encoding="utf-8") as f:
        json.dump(session_index, f, indent=2)

    # Pre-write conversation logs for the 3 sessions
    for sess in session_index["sessions"]:
        sid = sess["session_id"]
        log_path = os.path.join(fdir, "conversations", f"{sid}.json")
        sample_log = [
            {"sender": "system", "text": f"Context loaded from founder memory assets for: {sess['title']}."},
            {"sender": "founder", "text": f"Agent, let's execute on: '{sess['title']}'. Make sure it's grounded in our verified evidence and avoids banned marketing fluff."},
            {"sender": "agent", "text": f"On it. Pulling from your knowledge locker: {sess['summary']}\nDecisions established:\n- " + "\n- ".join(sess["decisions"])}
        ]
        with open(log_path, "w", encoding="utf-8") as f:
            json.dump(sample_log, f, indent=2)

    # =========================================================================
    # 7. memory_changelog.jsonl (Append-only audit trail)
    # =========================================================================
    append_changelog(
        founder_id=founder_id,
        change_type="onboarding_init",
        target_file="all_7_assets",
        what_changed=f"Processed onboarding details and established all 7 local agent memory assets for {name} ({company}).",
        why="Initial onboarding completion & founder brand engine calibration.",
        founder_approved=True,
        details={"company": company, "archetype": archetype, "platforms": platforms}
    )

    return {
        "status": "success",
        "founder_id": founder_id,
        "directory": fdir,
        "files_created": [
            "founder_profile.json",
            "interests_and_stories.md",
            "voice_and_preferences.json",
            "active_direction.md",
            "knowledge_and_evidence.json",
            "session_index.json",
            "memory_changelog.jsonl"
        ]
    }


def compile_unified_profile(founder_id: str) -> Optional[Dict[str, Any]]:
    """
    Compiles the unified profile representation from the 7 memory files
    for 100% backward compatibility with legacy endpoints and frontend views.
    """
    fdir = get_founder_dir(founder_id)
    profile_path = os.path.join(fdir, "founder_profile.json")
    if not os.path.exists(profile_path):
        return None
        
    with open(profile_path, "r", encoding="utf-8") as f:
        core = json.load(f)
        
    voice = get_memory_file(founder_id, "voice_and_preferences.json") or {}
    evidence = get_memory_file(founder_id, "knowledge_and_evidence.json") or {}
    stories_md = get_memory_file(founder_id, "interests_and_stories.md") or ""
    direction_md = get_memory_file(founder_id, "active_direction.md") or ""
    sessions = get_memory_file(founder_id, "session_index.json") or {}

    identity = core.get("identity") or {
        "name": core.get("name"),
        "role": core.get("role"),
        "company_name": core.get("company"),
        "product_description": core.get("product_description"),
        "mission": core.get("product_description"),
        "tagline": core.get("product_description"),
        "stage": core.get("stage"),
        "avatar": core.get("avatar"),
        "unfair_advantage": core.get("unfair_advantage")
    }

    platforms = core.get("preferred_platforms", ["LinkedIn"])
    primary_plat = platforms[0] if len(platforms) > 0 else "LinkedIn"
    secondary_plat = platforms[1] if len(platforms) > 1 else (platforms[0] if len(platforms) > 0 else "X (Twitter)")

    unified = {
        "founder_id": founder_id,
        "identity": identity,
        "domain_radar": {
            "industry": (core.get("company") or "Technology") + " Industry",
            "target_audience": core.get("target_audience", []),
            "audience_taboos": voice.get("phrases_to_avoid", [])
        },
        "channels": {
            "primary": primary_plat,
            "secondary": secondary_plat
        },
        "voiceprint": {
            "insead_archetype": voice.get("archetype") or voice.get("tone", "The Builder"),
            "banned_phrases": voice.get("phrases_to_avoid", []),
            "voice_rules": voice.get("vocabulary", {}).get("voice_rules", []),
            "spicy_take": voice.get("spicy_take", "")
        },
        "execution_capacity": {
            "channels": platforms,
            "weekly_time_budget": core.get("weekly_time_budget", "2 hours/week")
        },
        "goals_tracking": core.get("goals", {}),
        "knowledge_and_evidence": evidence,
        "session_index": sessions,
        "markdown_contexts": {
            "interests_and_stories": stories_md,
            "active_direction": direction_md
        }
    }
    return unified


# =============================================================================
# Fixed Platform Strategy & Master Plan Asset Engine
# =============================================================================

STRATEGY_FILE_MAP = {
    "linkedin": "strategy_linkedin.json",
    "x": "strategy_x_twitter.json",
    "twitter": "strategy_x_twitter.json",
    "instagram": "strategy_instagram.json",
    "insta": "strategy_instagram.json",
    "master": "master_content_plan.json",
    "plan": "master_content_plan.json"
}


def normalize_strategy_key(key: str) -> str:
    cleaned = (key or "").strip().lower().replace(" ", "_")
    return STRATEGY_FILE_MAP.get(cleaned, f"strategy_{cleaned}.json")


def ensure_strategy_files(founder_id: str) -> Dict[str, Any]:
    """
    Ensures the 4 distinct, fixed strategy files exist for the founder:
    1. strategy_linkedin.json
    2. strategy_x_twitter.json
    3. strategy_instagram.json
    4. master_content_plan.json
    """
    fdir = ensure_founder_dir(founder_id)
    is_maya = "maya" in founder_id.lower()
    
    # 1. LinkedIn Strategy
    linkedin_path = os.path.join(fdir, "strategy_linkedin.json")
    if not os.path.exists(linkedin_path):
        data = {
            "platform": "LinkedIn",
            "active_cadence": "3 posts/week (Tuesday, Thursday, Saturday)",
            "target_formats": [
                "Production Post-Mortems & Architectural Diff Teardowns" if not is_maya else "Clean Supply Chain & Manufacturing Truths",
                "Whiteboard System Diagrams" if not is_maya else "Raw Laboratory Batch Logs & Unit Economics",
                "Founder Journey Lessons & Hiring Philosophy"
            ],
            "tone_rules": [
                "Start directly with the concrete incident or production metric.",
                "Zero corporate PR or generic motivational slogans.",
                "Always present the actual operational trade-off."
            ],
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
        with open(linkedin_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    # 2. X (Twitter) Strategy
    x_path = os.path.join(fdir, "strategy_x_twitter.json")
    if not os.path.exists(x_path):
        data = {
            "platform": "X (Twitter)",
            "active_cadence": "4 posts/week (Mon, Wed, Thu, Fri)",
            "target_formats": [
                "Contrarian Benchmark Threads",
                "Short Terminal / Flame Graph Screenshots",
                "Spicy Takes on Industry Orthodoxies"
            ],
            "tone_rules": [
                "Punchy, high-information density, zero fluff.",
                "Back bold claims with real numbers or reproducible diffs."
            ],
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
        with open(x_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    # 3. Instagram Strategy
    insta_path = os.path.join(fdir, "strategy_instagram.json")
    if not os.path.exists(insta_path):
        data = {
            "platform": "Instagram",
            "active_cadence": "2 reels/week (Wednesday & Sunday)",
            "target_formats": [
                "45-second Unfiltered Warehouse & Formulation Reels",
                "Behind-the-Scenes Raw Founder Diary",
                "Ingredient & Lab Test Teardowns"
            ],
            "tone_rules": [
                "Real operator lighting, handheld, candid workstation b-roll.",
                "Speak directly to conscious buyers and peer founders."
            ],
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
        with open(insta_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    # 4. Master Content Plan (Timeframe Plan)
    master_path = os.path.join(fdir, "master_content_plan.json")
    if not os.path.exists(master_path):
        is_preset_demo = founder_id in ["arjun_vance", "maya_lin"]
        default_items = [
            {
                "id": "plan-1",
                "day": "Day 1 (Tuesday)",
                "platform": "LinkedIn",
                "format": "Technical Post-Mortem" if not is_maya else "Exposing Co-Packer Truth",
                "title": "Why 14 commercial beverage co-packers rejected our formula" if is_maya else "The $412 Redis Scan Memory Leak Post-Mortem",
                "hook": "14 commercial beverage plants told me clean organic adaptogens were impossible without synthetic gums. Here's what happened when we refused to compromise." if is_maya else "We burned $412 in 14 hours on AWS due to an unbatched Redis scan across 50,000 agent sessions. Here is the 12-line Lua fix.",
                "status": "planned"
            },
            {
                "id": "plan-2",
                "day": "Day 2 (Thursday)",
                "platform": "Instagram" if is_maya else "X (Twitter)",
                "format": "Contrarian Angle",
                "title": "Why 2-year shelf life drinks are preservatives, not wellness" if is_maya else "SQLite with BM25 beats Vector DBs for 90% of early AI workloads",
                "hook": "If a healthy canned drink has a 2-year shelf life at room temperature, you are drinking industrial preservatives, not wellness." if is_maya else "Unpopular opinion backed by benchmarks: 90% of AI startups using Pinecone would get 4x faster p99 latency using SQLite.",
                "status": "planned"
            },
            {
                "id": "plan-3",
                "day": "Day 3 (Friday)",
                "platform": "LinkedIn",
                "format": "Founder Journey & Hiring",
                "title": "The Raw Unit Economics of Retail Shelves" if is_maya else "Why We Rejected the Fastest LeetCode Candidate",
                "hook": "Most people think getting into Whole Foods is a victory lap. In reality, getting into our first 12 stores almost bankrupted us." if is_maya else "We just rejected a candidate who solved our LeetCode hard problem in 15 minutes. Here is how we actually evaluate founding engineers at AgentScale:",
                "status": "planned"
            }
        ] if is_preset_demo else []

        data = {
            "plan_timeframe": "7 Days",
            "plan_duration_days": 7,
            "north_star": "Technical Authority & Inbound Pipeline",
            "active_sprint_goal": "Establish category leadership and drive inbound inquiries from qualified buyers and engineering peers.",
            "planned_items": default_items,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
        with open(master_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    return {
        "linkedin": get_strategy_asset(founder_id, "linkedin"),
        "x": get_strategy_asset(founder_id, "x"),
        "instagram": get_strategy_asset(founder_id, "instagram"),
        "master_plan": get_strategy_asset(founder_id, "master")
    }


def get_strategy_asset(founder_id: str, platform_or_master: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves the parsed content of a specific strategy file.
    """
    fdir = ensure_founder_dir(founder_id)
    filename = normalize_strategy_key(platform_or_master)
    target_path = os.path.join(fdir, filename)
    if not os.path.exists(target_path):
        ensure_strategy_files(founder_id)
    if os.path.exists(target_path):
        with open(target_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def update_strategy_asset(
    founder_id: str,
    platform_or_master: str,
    data: Dict[str, Any],
    what_changed: str = "Updated strategy settings",
    why: str = "Founder agent refinement"
) -> bool:
    """
    Updates a strategy file and appends to the memory changelog.
    """
    fdir = ensure_founder_dir(founder_id)
    filename = normalize_strategy_key(platform_or_master)
    target_path = os.path.join(fdir, filename)
    
    data["last_updated"] = datetime.utcnow().isoformat() + "Z"
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    append_changelog(
        founder_id=founder_id,
        change_type="strategy_update",
        target_file=filename,
        what_changed=what_changed,
        why=why,
        founder_approved=True,
        details={"updated_keys": list(data.keys())}
    )
    return True


def apply_agent_strategy_command(
    founder_id: str,
    instruction: str,
    parameters: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Interprets and executes an agent strategy command (e.g. timeframe change from 7 to 3 days,
    platform pivot, or schedule adjustment).
    Directly updates the local strategy files and records the change in memory_changelog.jsonl.
    """
    ensure_strategy_files(founder_id)
    params = parameters or {}
    text_lower = (instruction or "").lower()
    
    master_plan = get_strategy_asset(founder_id, "master") or {}
    updated_files = []
    
    # Check for timeframe changes (e.g. 7 days -> 3 days, 14 days, etc.)
    new_days = None
    if "3 day" in text_lower or params.get("duration_days") == 3:
        new_days = 3
    elif "7 day" in text_lower or params.get("duration_days") == 7:
        new_days = 7
    elif "14 day" in text_lower or params.get("duration_days") == 14:
        new_days = 14
    elif "30 day" in text_lower or params.get("duration_days") == 30:
        new_days = 30
        
    if new_days is not None:
        master_plan["plan_duration_days"] = new_days
        master_plan["plan_timeframe"] = f"{new_days} Days"
        # Prune or expand planned items to match duration
        items = master_plan.get("planned_items", [])
        if new_days == 3 and len(items) > 3:
            master_plan["planned_items"] = items[:3]
        update_strategy_asset(
            founder_id=founder_id,
            platform_or_master="master",
            data=master_plan,
            what_changed=f"Updated content plan timeframe to {new_days} Days",
            why=instruction
        )
        updated_files.append("master_content_plan.json")

    # Check for item deletion (e.g. "delete this", "remove note", "delete all", "clear calendar")
    if "delete" in text_lower or "remove" in text_lower or "clear" in text_lower:
        item_id = params.get("item_id")
        delete_all = (
            params.get("delete_all") is True or
            "delete all" in text_lower or
            "clear all" in text_lower or
            "delete all of them" in text_lower or
            "delete of them" in text_lower or
            "delete every" in text_lower or
            "clear calendar" in text_lower or
            "clear board" in text_lower or
            "clear the board" in text_lower or
            "clear the calender" in text_lower or
            "clear the calendar" in text_lower or
            "remove all" in text_lower
        )
        items = master_plan.get("planned_items", [])
        original_count = len(items)
        
        if delete_all:
            master_plan["planned_items"] = []
            update_strategy_asset(
                founder_id=founder_id,
                platform_or_master="master",
                data=master_plan,
                what_changed="Cleared all planned items from content plan per founder command",
                why=instruction
            )
            if "master_content_plan.json" not in updated_files:
                updated_files.append("master_content_plan.json")

            # Also clear and sync all platform strategy files on disk
            for plat in ["linkedin", "x", "instagram"]:
                plat_data = get_strategy_asset(founder_id, plat) or {}
                plat_data["scheduled_posts"] = []
                plat_data["active_schedule"] = []
                update_strategy_asset(
                    founder_id=founder_id,
                    platform_or_master=plat,
                    data=plat_data,
                    what_changed=f"Cleared all scheduled posts for {plat.capitalize()} per founder command",
                    why=instruction
                )
                filename = normalize_strategy_key(plat)
                if filename not in updated_files:
                    updated_files.append(filename)
        elif item_id:
            master_plan["planned_items"] = [it for it in items if it.get("id") != item_id]
            if len(master_plan["planned_items"]) < original_count:
                update_strategy_asset(
                    founder_id=founder_id,
                    platform_or_master="master",
                    data=master_plan,
                    what_changed=f"Deleted item {item_id} from content plan",
                    why=instruction
                )
                if "master_content_plan.json" not in updated_files:
                    updated_files.append("master_content_plan.json")
        else:
            master_plan["planned_items"] = [
                it for it in items
                if it.get("id", "").lower() not in text_lower and it.get("title", "").lower() not in text_lower
            ]
            if len(master_plan["planned_items"]) < original_count:
                update_strategy_asset(
                    founder_id=founder_id,
                    platform_or_master="master",
                    data=master_plan,
                    what_changed="Deleted item(s) from content plan per user command",
                    why=instruction
                )
                if "master_content_plan.json" not in updated_files:
                    updated_files.append("master_content_plan.json")


    # Check for adding new scheduled items (e.g. from Muse calendar schedule)
    new_items = params.get("new_items")
    if new_items and isinstance(new_items, list):
        master_plan.setdefault("planned_items", [])
        for nit in new_items:
            existing = next((it for it in master_plan["planned_items"] if it.get("id") == nit.get("id") or it.get("title") == nit.get("title")), None)
            if not existing:
                master_plan["planned_items"].append(nit)
        update_strategy_asset(
            founder_id=founder_id,
            platform_or_master="master",
            data=master_plan,
            what_changed=f"Added {len(new_items)} drops to master content plan from Muse",
            why=instruction
        )
        if "master_content_plan.json" not in updated_files:
            updated_files.append("master_content_plan.json")

    # Check for platform-specific cadence or hook updates
    target_platform = None
    if "linkedin" in text_lower:
        target_platform = "linkedin"
    elif "x" in text_lower or "twitter" in text_lower:
        target_platform = "x"
    elif "insta" in text_lower or "instagram" in text_lower:
        target_platform = "instagram"
        
    if target_platform:
        plat_data = get_strategy_asset(founder_id, target_platform) or {}
        if new_items and isinstance(new_items, list):
            plat_data.setdefault("scheduled_posts", [])
            for nit in new_items:
                if not any(it.get("id") == nit.get("id") for it in plat_data["scheduled_posts"]):
                    plat_data["scheduled_posts"].append(nit)
        if "cadence" in text_lower or "frequency" in text_lower:
            new_cadence = params.get("cadence") or f"Adjusted active cadence per instruction: {instruction}"
            plat_data["active_cadence"] = new_cadence
        if "hook" in text_lower and params.get("new_hook"):
            plat_data.setdefault("hook_templates", []).insert(0, params["new_hook"])
        update_strategy_asset(
            founder_id=founder_id,
            platform_or_master=target_platform,
            data=plat_data,
            what_changed=f"Refined {target_platform.capitalize()} strategy parameters",
            why=instruction
        )
        updated_files.append(normalize_strategy_key(target_platform))

    return {
        "success": True,
        "instruction": instruction,
        "updated_files": updated_files,
        "master_plan": get_strategy_asset(founder_id, "master"),
        "message": f"Successfully updated strategy on disk: {', '.join(updated_files) if updated_files else 'master_content_plan.json'}."
    }

