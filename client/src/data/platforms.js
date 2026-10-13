/**
 * Utility to extract and normalize the platforms selected by the founder in their profile
 */
export function getUserPlatforms(profile) {
  const rawList = [
    ...(Array.isArray(profile?.execution_capacity?.channels) ? profile.execution_capacity.channels : []),
    ...(Array.isArray(profile?.platforms) ? profile.platforms : []),
    ...(profile?.channels?.primary ? [profile.channels.primary] : []),
    ...(profile?.channels?.secondary ? [profile.channels.secondary] : [])
  ];

  const normalized = [];
  const seen = new Set();

  for (const item of rawList) {
    if (!item) continue;
    const str = String(item).trim();
    let norm = str;
    if (/linkedin/i.test(str)) norm = 'LinkedIn';
    else if (/^(x|twitter)/i.test(str) || /x\s*\(/i.test(str)) norm = 'X';
    else if (/instagram/i.test(str)) norm = 'Instagram';
    else if (/youtube/i.test(str)) norm = 'YouTube';
    else if (/substack/i.test(str) || /newsletter/i.test(str)) norm = 'Substack';

    if (!seen.has(norm)) {
      seen.add(norm);
      normalized.push(norm);
    }
  }

  // Fallback defaults only if profile has zero channel selections
  if (normalized.length === 0) {
    if (profile?.founder_id === 'maya_lin') {
      return ['LinkedIn', 'Instagram'];
    }
    return ['LinkedIn', 'X'];
  }

  return normalized;
}
