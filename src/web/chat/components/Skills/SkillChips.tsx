import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Minus, Search, Loader2 } from 'lucide-react';
import { FEATURED_SKILLS, ALL_BUILTIN_SKILLS, type Skill } from './skills-data';
import { SkillCard } from './SkillCard';
import { searchSkills } from '../../services/skills-api';

interface SkillChipsProps {
  onSkillSelect: (skill: Skill) => void;
}

export function SkillChips({ onSkillSelect }: SkillChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus search input when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [isExpanded]);

  // Debounced search
  const handleSearch = useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchSkills(query);
        setSearchResults(results);
        setHasSearched(true);
      } catch (error) {
        console.error('Failed to search skills:', error);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  const handleSkillSelect = (skill: Skill) => {
    setIsExpanded(false);
    onSkillSelect(skill);
  };

  return (
    <div className="w-full">
      {/* Chips row */}
      <div className="flex flex-wrap items-center gap-2 py-3 px-1">
        {FEATURED_SKILLS.map((skill) => (
          <button
            key={skill.id}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
            onClick={() => onSkillSelect(skill)}
            title={skill.description}
          >
            <span>{skill.icon}</span>
            <span>{skill.name}</span>
          </button>
        ))}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-border bg-background hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse skills' : 'Browse all skills'}
        >
          {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
          <span>More</span>
        </button>
      </div>

      {/* Expanded inline panel */}
      {isExpanded && (
        <div className="flex flex-col px-1 pb-2 max-h-[calc(100vh-360px)]">
          {/* Search - sticky */}
          <div className="pb-3 flex-shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            {/* Search Results */}
            {hasSearched && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Search Results {searchResults.length > 0 && `(${searchResults.length})`}
                </h3>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {searchResults.map((skill) => (
                      <SkillCard key={skill.id} skill={skill} onClick={handleSkillSelect} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2 text-center">
                    No skills found for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            )}

            {/* All Built-in Skills */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">All Skills</h3>
              <div className="grid grid-cols-2 gap-2">
                {ALL_BUILTIN_SKILLS.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onClick={handleSkillSelect} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
