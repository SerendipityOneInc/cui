import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/web/chat/components/ui/popover';
import type { Command } from '../../types';

/** Convert "/lark-docs" → "Lark Docs", "/seo:audit" → "SEO : Audit" */
function toDisplayName(name: string): string {
  return name
    .replace(/^\//, '')       // strip leading /
    .replace(/:/g, ' : ')    // "seo:audit" → "seo : audit"
    .replace(/-/g, ' ')      // "lark-docs" → "lark docs"
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title case
}

interface SkillBrowserPopoverProps {
  commands: Command[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (commandName: string) => void;
  trigger: React.ReactNode;
}

export function SkillBrowserPopover({
  commands,
  isOpen,
  onOpenChange,
  onSelect,
  trigger,
}: SkillBrowserPopoverProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return commands;
    const q = searchQuery.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(q) ||
        toDisplayName(cmd.name).toLowerCase().includes(q) ||
        (cmd.description && cmd.description.toLowerCase().includes(q))
    );
  }, [commands, searchQuery]);

  const handleSelect = (name: string) => {
    onSelect(name);
    onOpenChange(false);
    setSearchQuery('');
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setSearchQuery('');
    }}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-[18px] border border-black/15 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900 dark:shadow-2xl"
        align="start"
        sideOffset={5}
        avoidCollisions={true}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            autoFocus
          />
        </div>
        <div className="h-px bg-black/15 dark:bg-white/10 w-full" />

        {/* Skill list */}
        <div className="overflow-y-auto max-h-[320px] p-1.5 scrollbar-thin scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20 scrollbar-track-transparent">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No skills found
            </div>
          ) : (
            filtered.map((cmd) => {
              const truncatedDesc = cmd.description && cmd.description.length > 60
                ? cmd.description.slice(0, 60) + '...'
                : cmd.description;
              return (
                <div
                  key={cmd.name}
                  className="flex flex-col items-start gap-0.5 w-full px-3 py-2.5 rounded-[10px] cursor-pointer transition-all text-left text-sm text-neutral-900 dark:text-neutral-100 mb-px hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => handleSelect(cmd.name)}
                  title={cmd.description}
                >
                  <span className="font-medium">{toDisplayName(cmd.name)}</span>
                  {truncatedDesc && (
                    <span className="text-xs text-muted-foreground/80 leading-tight">
                      {truncatedDesc}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
