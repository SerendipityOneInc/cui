import React from 'react';
import { ToolLabel } from '../../../chat/components/ToolRendering/ToolLabel';
import { ToolContent } from '../../../chat/components/ToolRendering/ToolContent';
import { AskUserQuestionDialog } from './AskUserQuestionDialog';
import type { PermissionRequest } from '../../types';

interface PermissionDialogProps {
  permissionRequest: PermissionRequest;
  isVisible: boolean;
  onAnswersChange?: (answers: Record<string, string>) => void;
  onSubmit?: () => void;
  onSkip?: () => void;
}

export function PermissionDialog({ permissionRequest, isVisible, onAnswersChange, onSubmit, onSkip }: PermissionDialogProps) {
  if (!isVisible || !permissionRequest) {
    return null;
  }

  const isAskUserQuestion = permissionRequest.toolName === 'AskUserQuestion';

  if (isAskUserQuestion && onAnswersChange && onSubmit && onSkip) {
    const toolInput = permissionRequest.toolInput as {
      question?: string;
      questions?: Array<{
        question: string;
        header: string;
        options: Array<{ label: string; description: string }>;
        multiSelect: boolean;
      }>;
      options?: Array<{ label: string; description: string }>;
      header?: string;
      multiSelect?: boolean;
    };

    // Handle questions array format
    let questions = toolInput.questions;

    // Handle single question format: { question, options, header, multiSelect }
    if (!questions && toolInput.question) {
      questions = [{
        question: toolInput.question,
        header: toolInput.header || 'Question',
        options: Array.isArray(toolInput.options) ? toolInput.options : [],
        multiSelect: toolInput.multiSelect || false,
      }];
    }

    if (questions && Array.isArray(questions) && questions.length > 0) {
      return (
        <AskUserQuestionDialog
          questions={questions}
          onAnswersChange={onAnswersChange}
          onSubmit={onSubmit}
          onSkip={onSkip}
        />
      );
    }
  }

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 z-[1000] mb-3 w-full"
      role="dialog"
      aria-label="Permission request dialog"
    >
      <div className="bg-black border border-border rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.15)] w-full max-h-[70vh] flex flex-col overflow-hidden animate-slide-up">
        <div className="px-4 pt-3">
          <div
            className="text-sm font-semibold mb-2.5 text-white"
            role="heading"
            aria-level={2}
          >
            PERMISSION REQUEST:
          </div>
        </div>
        <div className="px-4 pb-4 pt-[15px] m-0.5 rounded-[7px] overflow-y-auto bg-background flex-1">
          <ToolLabel
            toolName={permissionRequest.toolName}
            toolInput={permissionRequest.toolInput}
          />
          <ToolContent
            toolName={permissionRequest.toolName}
            toolInput={permissionRequest.toolInput}
          />
        </div>
      </div>
    </div>
  );
}
