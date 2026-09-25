import React, { useState } from 'react';

interface AIAssistantInputProps {
  onSubmitPrompt: (prompt: string) => Promise<void>;
  isLoading: boolean;
  lastFeedback?: string | null;
}

export const AIAssistantInput: React.FC<AIAssistantInputProps> = ({
  onSubmitPrompt,
  isLoading,
  lastFeedback,
}) => {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const samplePrompts = [
    'Add sunset deck on Day 3',
    'Add Michelin sushi to Day 1',
    'Make Day 1 more budget friendly',
    'Add bullet train transfer Day 2',
    'Add another day for Kyoto street food',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    const current = prompt;
    setPrompt('');
    setShowSuggestions(false);
    await onSubmitPrompt(current);
  };

  const handleSelectPrompt = async (sample: string) => {
    setPrompt('');
    setShowSuggestions(false);
    await onSubmitPrompt(sample);
  };

  return (
    <div className="fixed bottom-2 left-0 right-0 z-30 px-4 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto">
        {/* Last AI Feedback Toast */}
        {lastFeedback && (
          <div className="mb-1.5 px-3 py-1.5 bg-blue-50/95 backdrop-blur-md border border-blue-200/80 rounded-lg shadow-sm text-xs text-blue-900 flex items-center gap-1.5 animate-in fade-in duration-150">
            <span className="material-symbols-outlined text-xs text-blue-600 shrink-0">
              auto_awesome
            </span>
            <span className="line-clamp-1">{lastFeedback}</span>
          </div>
        )}

        {/* Suggestion Chips */}
        {showSuggestions && (
          <div className="mb-1.5 bg-white/95 backdrop-blur-md border border-neutral-200 p-2 rounded-xl shadow-lg flex flex-wrap gap-1 animate-in fade-in zoom-in-95 duration-100">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPrompt(p)}
                className="text-[11px] font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200/70 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Main Notion AI Pill */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white/95 backdrop-blur-md border border-neutral-300/80 rounded-full shadow-md px-3 py-1 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all"
        >
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-blue-600 flex items-center justify-center cursor-pointer"
            title="Suggestions"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
          </button>

          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="✨ What would you like to change?"
            disabled={isLoading}
            className="flex-1 min-w-0 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent focus:outline-none"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-6 h-6 rounded-full bg-blue-600 text-white disabled:opacity-30 hover:bg-blue-700 flex items-center justify-center cursor-pointer shrink-0 transition-opacity"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-xs">arrow_upward</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
