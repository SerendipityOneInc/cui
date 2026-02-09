import React, { useState } from 'react';

interface QuestionOption {
  label: string;
  description: string;
}

interface Question {
  question: string;
  header: string;
  options: QuestionOption[];
  multiSelect: boolean;
}

interface AskUserQuestionDialogProps {
  questions: Question[];
  onAnswersChange: (answers: Record<string, string>) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

export function AskUserQuestionDialog({
  questions,
  onAnswersChange,
  onSubmit,
  onSkip,
}: AskUserQuestionDialogProps) {
  const [selections, setSelections] = useState<Record<number, string[]>>({});
  const [otherTexts, setOtherTexts] = useState<Record<number, string>>({});

  const updateAnswers = (
    newSelections: Record<number, string[]>,
    newOtherTexts: Record<number, string>
  ) => {
    const answers: Record<string, string> = {};
    questions.forEach((q, idx) => {
      const selected = newSelections[idx] || [];
      const otherText = newOtherTexts[idx] || '';
      const parts: string[] = [...selected];
      if (otherText.trim()) {
        parts.push(otherText.trim());
      }
      if (parts.length > 0) {
        answers[q.header] = parts.join(', ');
      }
    });
    onAnswersChange(answers);
  };

  const handleOptionClick = (questionIdx: number, label: string, multiSelect: boolean) => {
    setSelections(prev => {
      const current = prev[questionIdx] || [];
      let updated: string[];

      if (multiSelect) {
        updated = current.includes(label)
          ? current.filter(l => l !== label)
          : [...current, label];
      } else {
        updated = current.includes(label) ? [] : [label];
      }

      const newSelections = { ...prev, [questionIdx]: updated };
      const newOtherTexts = multiSelect ? otherTexts : { ...otherTexts, [questionIdx]: '' };
      updateAnswers(newSelections, newOtherTexts);
      if (!multiSelect) {
        setOtherTexts(newOtherTexts);
      }
      return newSelections;
    });
  };

  const handleOtherTextChange = (questionIdx: number, text: string, multiSelect: boolean) => {
    const newOtherTexts = { ...otherTexts, [questionIdx]: text };
    setOtherTexts(newOtherTexts);

    let newSelections = selections;
    if (!multiSelect && text.trim()) {
      newSelections = { ...selections, [questionIdx]: [] };
      setSelections(newSelections);
    }

    updateAnswers(newSelections, newOtherTexts);
  };

  const hasAnyAnswer = () => {
    return questions.some((_, idx) => {
      const selected = selections[idx] || [];
      const otherText = otherTexts[idx] || '';
      return selected.length > 0 || otherText.trim().length > 0;
    });
  };

  const RadioIndicator = ({ selected }: { selected: boolean }) => (
    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full border-[1.5px] transition-colors ${
      selected ? 'border-blue-500' : 'border-zinc-300'
    }`}>
      {selected && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
    </span>
  );

  const CheckIndicator = ({ selected }: { selected: boolean }) => (
    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-sm transition-colors ${
      selected ? 'bg-blue-500 border-[1.5px] border-blue-500' : 'border-[1.5px] border-zinc-300'
    }`}>
      {selected && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
  );

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 z-[1000] mb-3 w-full"
      role="dialog"
      aria-label="Question dialog"
    >
      <div className="bg-white border border-zinc-200 rounded-xl shadow-lg w-full max-h-[50vh] flex flex-col overflow-hidden animate-slide-up">
        <div className="px-3.5 pb-2.5 pt-2.5 overflow-y-auto flex-1">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className={qIdx > 0 ? 'mt-2.5 pt-2.5 border-t border-zinc-100' : ''}>
              {/* Header badge */}
              <span className="inline-block px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider rounded bg-blue-50 text-blue-600 mb-1">
                {q.header}
              </span>

              {/* Question text */}
              <p className="text-[13px] font-medium text-zinc-800 mb-1.5">{q.question}</p>

              {/* Option list */}
              <div className="flex flex-col gap-px">
                {q.options.map((opt, optIdx) => {
                  const isSelected = (selections[qIdx] || []).includes(opt.label);
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={`group w-full text-left px-2.5 py-1.5 rounded-md transition-colors duration-100 ${
                        isSelected
                          ? 'bg-blue-50'
                          : 'hover:bg-zinc-50'
                      }`}
                      onClick={() => handleOptionClick(qIdx, opt.label, q.multiSelect)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0">
                          {q.multiSelect
                            ? <CheckIndicator selected={isSelected} />
                            : <RadioIndicator selected={isSelected} />
                          }
                        </span>
                        <span className={`text-[13px] transition-colors ${
                          isSelected ? 'text-zinc-900 font-medium' : 'text-zinc-600 group-hover:text-zinc-800'
                        }`}>{opt.label}</span>
                        {opt.description && (
                          <span className={`text-[11px] transition-colors truncate ${
                            isSelected ? 'text-zinc-400' : 'text-zinc-300 group-hover:text-zinc-400'
                          }`}>{opt.description}</span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* "Other" option */}
                {(() => {
                  const hasOtherText = (otherTexts[qIdx] || '').trim().length > 0;
                  return (
                    <div
                      className={`w-full px-2.5 py-1.5 rounded-md transition-colors duration-100 ${
                        hasOtherText ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0">
                          {q.multiSelect
                            ? <CheckIndicator selected={hasOtherText} />
                            : <RadioIndicator selected={hasOtherText} />
                          }
                        </span>
                        <span className={`text-[13px] flex-shrink-0 ${
                          hasOtherText ? 'text-zinc-900 font-medium' : 'text-zinc-600'
                        }`}>Other</span>
                        <input
                          type="text"
                          className="flex-1 min-w-0 bg-transparent text-[13px] text-zinc-700 placeholder-zinc-300 outline-none border-b border-zinc-200 focus:border-blue-400 transition-colors"
                          placeholder="Type your response..."
                          value={otherTexts[qIdx] || ''}
                          onChange={(e) => handleOtherTextChange(qIdx, e.target.value, q.multiSelect)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && hasAnyAnswer()) {
                              e.preventDefault();
                              onSubmit();
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-1.5 px-3.5 py-2 border-t border-zinc-100">
          <button
            type="button"
            className="px-3 py-1 text-xs rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            onClick={onSkip}
          >
            Skip
          </button>
          <button
            type="button"
            className={`px-3.5 py-1 text-xs rounded-full font-medium transition-all duration-150 ${
              hasAnyAnswer()
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
            }`}
            disabled={!hasAnyAnswer()}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
