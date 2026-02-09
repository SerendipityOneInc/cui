import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FEATURED_SKILLS, type Skill } from './skills-data';
import { SkillLibraryModal } from './SkillLibraryModal';

interface SkillChipsProps {
  onSkillSelect: (skill: Skill) => void;
}

export function SkillChips({ onSkillSelect }: SkillChipsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSkillSelect = (skill: Skill) => {
    setIsModalOpen(false);
    onSkillSelect(skill);
  };

  return (
    <>
      <div className="flex items-center gap-2 py-3 px-1 overflow-x-auto scrollbar-none">
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
          onClick={() => setIsModalOpen(true)}
          title="Browse all skills"
        >
          <Plus size={14} />
          <span>More</span>
        </button>
      </div>

      <SkillLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSkillSelect={handleSkillSelect}
      />
    </>
  );
}
