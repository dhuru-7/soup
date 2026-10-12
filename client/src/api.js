/**
 * Soup Backend API Client
 * Connects frontend views to the Flask/Python backend running on http://localhost:5050/api
 * Falls back gracefully to local mock data if the backend server is temporarily offline.
 */

const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5050/api';

/**
 * Health check
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed, running in frontend standalone mode:", err.message);
    return { status: "standalone", service: "Client Standalone Mode" };
  }
}

/**
 * Fetch all founder profiles
 */
export async function fetchProfiles() {
  try {
    const res = await fetch(`${API_BASE}/profiles`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.profiles || [];
  } catch (err) {
    console.warn("Using offline profiles:", err.message);
    return null;
  }
}

/**
 * Fetch full profile for a founder
 */
export async function fetchProfile(founderId = 'arjun_vance') {
  try {
    const res = await fetch(`${API_BASE}/profile/${founderId}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch profile ${founderId} from backend:`, err.message);
    return null;
  }
}

/**
 * Onboard a founder and create the 7 agent memory assets
 */
export async function onboardFounder(onboardingData) {
  try {
    const res = await fetch(`${API_BASE}/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(onboardingData),
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Onboarding API call failed:", err.message);
    return null;
  }
}

/**
 * Fetch overview of all 7 memory assets
 */
export async function fetchFounderMemory(founderId = 'arjun_vance') {
  try {
    const res = await fetch(`${API_BASE}/founder/${founderId}/memory`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch memory overview:", err.message);
    return null;
  }
}

/**
 * Fetch specific memory asset (e.g. 'knowledge_and_evidence.json', 'interests_and_stories.md')
 */
export async function fetchMemoryFile(founderId = 'arjun_vance', filename = 'knowledge_and_evidence.json') {
  try {
    const res = await fetch(`${API_BASE}/founder/${founderId}/file/${filename}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (filename.endsWith('.json') || filename.endsWith('.jsonl')) {
      return await res.json();
    }
    return await res.text();
  } catch (err) {
    console.warn(`Failed to fetch memory file ${filename}:`, err.message);
    return null;
  }
}

/**
 * Update memory asset and log to memory_changelog.jsonl
 */
export async function updateMemoryFile(founderId = 'arjun_vance', filename = 'knowledge_and_evidence.json', content, whatChanged = 'Update', why = 'Founder request') {
  try {
    const res = await fetch(`${API_BASE}/founder/${founderId}/file/${filename}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, what_changed: whatChanged, why, founder_approved: true }),
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Failed to update memory file ${filename}:`, err.message);
    return null;
  }
}

/**
 * Fetch session index & conversation logs
 */
export async function fetchSessions(founderId = 'arjun_vance') {
  try {
    const res = await fetch(`${API_BASE}/founder/${founderId}/sessions`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch sessions:", err.message);
    return null;
  }
}

/**
 * Fetch append-only memory changelog
 */
export async function fetchMemoryChangelog(founderId = 'arjun_vance') {
  try {
    const res = await fetch(`${API_BASE}/founder/${founderId}/changelog`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch changelog:", err.message);
    return null;
  }
}

/**
 * Process raw asset / brain dump into 3 high-converting post angles
 */
export async function processRawAsset({ founder_id, raw_content, asset_type = 'quick_thought' }) {
  try {
    const res = await fetch(`${API_BASE}/assets/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ founder_id, raw_content, asset_type }),
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Falling back to local asset processor:", err.message);
    return {
      status: "fallback",
      generated_angles: [
        {
          angle_name: "The High-Proof Teardown",
          platform: "LinkedIn",
          hook: `Most founders hide what goes wrong. Here is what broke today:\n\n"${raw_content.slice(0, 90)}..."`,
          body: "1. The unexpected friction.\n2. The architectural fix.\n3. The metric that saved the sprint.",
          visual_direction: "Terminal screen capture or whiteboard diagram."
        },
        {
          angle_name: "The Contrarian Take",
          platform: "X (Twitter)",
          hook: `Unpopular opinion based on today's data:\n\n${raw_content.slice(0, 100)}`,
          body: "Why 90% of teams over-engineer this: They optimize for vanity before validation.",
          visual_direction: "Side-by-side comparison table."
        },
        {
          angle_name: "The Founder Story",
          platform: "LinkedIn & Substack",
          hook: `Building a startup is taking accountability for hard trade-offs:\n\n${raw_content.slice(0, 80)}`,
          body: "Authentic building in public builds compounding trust.",
          visual_direction: "Unfiltered phone photo."
        }
      ]
    };
  }
}

/**
 * Generate calibrated draft from prompt
 */
export async function generateDraft({ founder_id, prompt, platform = 'LinkedIn' }) {
  try {
    const res = await fetch(`${API_BASE}/generate/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ founder_id, prompt, platform }),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Draft generation fallback:", err.message);
    return null;
  }
}

/**
 * Fetch weekly execution calendar
 */
export async function fetchCalendar(founderId = 'arjun_vance') {
  try {
    const res = await fetch(`${API_BASE}/calendar/${founderId}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.weekly_calendar || [];
  } catch (err) {
    console.warn("Failed to fetch calendar from backend:", err.message);
    return null;
  }
}

/**
 * Fetch exportable MCP configuration
 */
export async function fetchMcpExport() {
  try {
    const res = await fetch(`${API_BASE}/export/mcp`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: "fallback",
      config: {
        mcpServers: {
          "soup-branding-engine": {
            command: "python",
            args: ["mcp-server/server.py"],
            env: { "BRAND_ENGINE_API": "http://localhost:5050/api" }
          }
        }
      }
    };
  }
}
