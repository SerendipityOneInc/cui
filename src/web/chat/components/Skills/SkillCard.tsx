import React from 'react';
import type { Skill } from './skills-data';

interface SkillCardProps {
  skill: Skill;
  onClick: (skill: Skill) => void;
}

export function SkillCard({ skill, onClick }: SkillCardProps) {
  return (
    <button
      type="button"
      className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 text-left transition-colors cursor-pointer w-full"
      onClick={() => onClick(skill)}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{skill.icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
        <span className="text-xs text-muted-foreground line-clamp-2">{skill.description}</span>
      </div>
    </button>
  );
}
