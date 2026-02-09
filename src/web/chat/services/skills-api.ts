import type { Skill } from '../components/Skills/skills-data';
import { getAuthToken } from '../../hooks/useAuth';

interface SkillsShResult {
  id: string;
  name: string;
  description: string;
  owner: string;
  repo: string;
  installs?: number;
}

export async function searchSkills(query: string): Promise<Skill[]> {
  const authToken = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`/api/skills/search?q=${encodeURIComponent(query)}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data: { skills: SkillsShResult[] } = await response.json();

  return data.skills.map((item) => {
    const installsText = item.installs ? ` (${item.installs.toLocaleString()} installs)` : '';
    return {
      id: `skills-sh-${item.owner}-${item.repo}`,
      name: item.name || item.repo,
      icon: '🧩',
      description: (item.description || `${item.owner}/${item.repo}`) + installsText,
      prompt: `Use the skill from ${item.owner}/${item.repo} to help me with [describe your task]`,
      source: 'skills.sh' as const,
    };
  });
}
