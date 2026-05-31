const ROBOTS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const ROBOTS_TIMEOUT_MS = 5_000;

interface RobotsRule {
  type: 'allow' | 'disallow';
  path: string;
}

interface RobotsCacheEntry {
  checkedAt: number;
  rules: RobotsRule[];
}

const robotsCache = new Map<string, RobotsCacheEntry>();

export function clearRobotsCache() {
  robotsCache.clear();
}

export async function checkRobotsTxt(url: string | URL): Promise<boolean> {
  const targetUrl = typeof url === 'string' ? new URL(url) : url;
  const rules = await getRobotsRules(targetUrl.origin);

  return isPathAllowed(targetUrl.pathname, rules);
}

async function getRobotsRules(origin: string) {
  const cached = robotsCache.get(origin);
  if (cached && Date.now() - cached.checkedAt < ROBOTS_CACHE_TTL_MS) {
    return cached.rules;
  }

  const rules = await fetchRobotsRules(origin);
  robotsCache.set(origin, { checkedAt: Date.now(), rules });
  return rules;
}

async function fetchRobotsRules(origin: string): Promise<RobotsRule[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ROBOTS_TIMEOUT_MS);

  try {
    const response = await fetch(`${origin}/robots.txt`, { signal: controller.signal });
    if (!response.ok) {
      return [];
    }

    return parseRobotsTxt(await response.text());
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function parseRobotsTxt(content: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let groupAgents: string[] = [];
  let groupRules: RobotsRule[] = [];

  const flushGroup = () => {
    if (groupAgents.includes('*')) {
      rules.push(...groupRules);
    }

    groupAgents = [];
    groupRules = [];
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.split('#', 1)[0].trim();

    if (!line) {
      flushGroup();
      continue;
    }

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const field = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (field === 'user-agent') {
      if (groupRules.length > 0) {
        flushGroup();
      }

      groupAgents.push(value.toLowerCase());
      continue;
    }

    if ((field === 'allow' || field === 'disallow') && groupAgents.length > 0 && value) {
      groupRules.push({ type: field, path: value });
    }
  }

  flushGroup();
  return rules;
}

function isPathAllowed(pathname: string, rules: RobotsRule[]) {
  let matchedRule: RobotsRule | undefined;

  for (const rule of rules) {
    if (!pathname.startsWith(rule.path)) {
      continue;
    }

    if (
      !matchedRule ||
      rule.path.length > matchedRule.path.length ||
      (rule.path.length === matchedRule.path.length && rule.type === 'allow')
    ) {
      matchedRule = rule;
    }
  }

  return matchedRule?.type !== 'disallow';
}
