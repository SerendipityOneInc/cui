import { Router } from 'express';
import { createLogger } from '@/services/logger.js';

const logger = createLogger('skills-routes');

interface SkillsShItem {
  source: string;
  skillId: string;
  name: string;
  description?: string;
  installs?: number;
}

interface SkillsShResponse {
  skills?: SkillsShItem[];
  [key: string]: unknown;
}

export function createSkillsRoutes(): Router {
  const router = Router();

  // GET /api/skills/search?q=keyword
  router.get('/search', async (req, res) => {
    const query = (req.query.q as string || '').trim();

    if (!query) {
      return res.json({ skills: [] });
    }

    try {
      // Fetch from skills.sh API
      const response = await fetch(
        `https://skills.sh/api/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CUI/1.0',
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        logger.warn(`skills.sh API returned ${response.status}`);
        // Fallback: try scraping the main page data
        return res.json({ skills: [] });
      }

      const data: SkillsShResponse = await response.json();

      const skills = (data.skills || []).map((item: SkillsShItem) => {
        // Parse owner/repo from source field (e.g., "vercel-labs/skills")
        const parts = (item.source || '').split('/');
        const owner = parts[0] || '';
        const repo = parts[1] || item.skillId || '';

        return {
          id: item.skillId || `${owner}-${repo}`,
          name: item.name || item.skillId || repo,
          description: item.description || `${owner}/${repo}`,
          owner,
          repo,
          installs: item.installs || 0,
        };
      });

      return res.json({ skills });
    } catch (error) {
      logger.error('Failed to search skills.sh:', error);
      return res.json({ skills: [] });
    }
  });

  return router;
}
