import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createLogger } from './logger.js';

export interface Command {
  name: string;
  type: 'builtin' | 'custom';
  description?: string;
}

const logger = createLogger('CommandsService');

/**
 * Scan a commands directory for .md files, including subdirectories.
 * Root-level: file.md → /file
 * Subdirectory: subdir/file.md → /subdir:file
 */
function scanCommandsDir(dir: string, commands: Map<string, Command>): void {
  try {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const commandName = '/' + entry.name.slice(0, -3);
        commands.set(commandName, { name: commandName, type: 'custom' });
      } else if (entry.isDirectory()) {
        // Scan subdirectory: subdir/file.md → /subdir:file
        const subDir = path.join(dir, entry.name);
        try {
          const subFiles = fs.readdirSync(subDir);
          for (const subFile of subFiles) {
            if (subFile.endsWith('.md')) {
              const commandName = '/' + entry.name + ':' + subFile.slice(0, -3);
              commands.set(commandName, { name: commandName, type: 'custom' });
            }
          }
        } catch (error) {
          logger.warn('Failed to read commands subdirectory', {
            error: error instanceof Error ? error.message : String(error),
            path: subDir,
          });
        }
      }
    }
  } catch (error) {
    logger.warn('Failed to read commands directory', {
      error: error instanceof Error ? error.message : String(error),
      path: dir,
    });
  }
}

/**
 * Scan skill directories for SKILL.md files and register them as commands.
 * Scans:
 *   ~/.claude/skills/<name>/SKILL.md                                        → user skills
 *   ~/.claude/plugins/marketplaces/<mkt>/plugins/<plugin>/skills/<name>/SKILL.md → plugin skills
 *   ~/.claude/plugins/marketplaces/<mkt>/skills/<name>/SKILL.md             → marketplace skills
 * Excludes cache/ to avoid version duplicates.
 */
function scanSkillDirs(commands: Map<string, Command>): void {
  const claudeDir = path.join(os.homedir(), '.claude');

  // 1. User-installed skills: ~/.claude/skills/<name>/SKILL.md
  const userSkillsDir = path.join(claudeDir, 'skills');
  try {
    if (fs.existsSync(userSkillsDir)) {
      for (const entry of fs.readdirSync(userSkillsDir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          const skillMd = path.join(userSkillsDir, entry.name, 'SKILL.md');
          if (fs.existsSync(skillMd)) {
            const name = '/' + entry.name;
            if (!commands.has(name)) {
              commands.set(name, { name, type: 'custom', description: 'skill' });
            }
          }
        }
      }
    }
  } catch (error) {
    logger.warn('Failed to scan user skills directory', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // 2. Plugin & marketplace skills from marketplaces/
  const marketplacesDir = path.join(claudeDir, 'plugins', 'marketplaces');
  try {
    if (fs.existsSync(marketplacesDir)) {
      for (const mkt of fs.readdirSync(marketplacesDir, { withFileTypes: true })) {
        if (!mkt.isDirectory()) continue;
        const mktPath = path.join(marketplacesDir, mkt.name);

        // 2a. marketplace/plugins/<plugin>/skills/<name>/SKILL.md
        const pluginsPath = path.join(mktPath, 'plugins');
        try {
          if (fs.existsSync(pluginsPath)) {
            for (const plugin of fs.readdirSync(pluginsPath, { withFileTypes: true })) {
              if (!plugin.isDirectory()) continue;
              scanSkillEntries(path.join(pluginsPath, plugin.name, 'skills'), commands);
            }
          }
        } catch { /* skip */ }

        // 2b. marketplace/skills/<name>/SKILL.md
        scanSkillEntries(path.join(mktPath, 'skills'), commands);
      }
    }
  } catch (error) {
    logger.warn('Failed to scan marketplace skills', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // 3. Plugin skills from cache/ (for marketplaces that only have registry repos)
  //    cache/<marketplace>/<plugin>/<version>/skills/<name>/SKILL.md
  //    Deduplication by skill name is handled by the Map.
  const cacheDir = path.join(claudeDir, 'plugins', 'cache');
  try {
    if (fs.existsSync(cacheDir)) {
      for (const mkt of fs.readdirSync(cacheDir, { withFileTypes: true })) {
        if (!mkt.isDirectory()) continue;
        for (const plugin of fs.readdirSync(path.join(cacheDir, mkt.name), { withFileTypes: true })) {
          if (!plugin.isDirectory()) continue;
          // Pick any version — skills are deduped by name via Map
          const pluginDir = path.join(cacheDir, mkt.name, plugin.name);
          for (const ver of fs.readdirSync(pluginDir, { withFileTypes: true })) {
            if (!ver.isDirectory()) continue;
            scanSkillEntries(path.join(pluginDir, ver.name, 'skills'), commands);
          }
        }
      }
    }
  } catch (error) {
    logger.warn('Failed to scan cache skills', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/** Scan a skills/ directory for <name>/SKILL.md entries */
function scanSkillEntries(skillsDir: string, commands: Map<string, Command>): void {
  try {
    if (!fs.existsSync(skillsDir)) return;
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (fs.existsSync(path.join(skillsDir, entry.name, 'SKILL.md'))) {
        const name = '/' + entry.name;
        if (!commands.has(name)) {
          commands.set(name, { name, type: 'custom', description: 'skill' });
        }
      }
    }
  } catch { /* skip */ }
}

/**
 * Get all available commands (custom commands + skills)
 */
export function getAvailableCommands(workingDirectory?: string): Command[] {
  const commands: Map<string, Command> = new Map();

  // Custom commands from .claude/commands/ (global + local)
  scanCommandsDir(path.join(os.homedir(), '.claude', 'commands'), commands);
  if (workingDirectory) {
    scanCommandsDir(path.join(workingDirectory, '.claude', 'commands'), commands);
  }

  // Skills from .claude/skills/ and .claude/plugins/marketplaces/
  scanSkillDirs(commands);

  return Array.from(commands.values());
}