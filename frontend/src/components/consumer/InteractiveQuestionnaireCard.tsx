import React, { useState } from 'react';

export interface QuestionnaireOption {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  desc?: string;
}

export interface QuestionnaireQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single_choice' | 'multi_choice' | 'budget' | 'text';
  options?: QuestionnaireOption[];
  allowCustomText?: boolean;
  customTextPlaceholder?: string;
  defaultValue?: any;
}

interface InteractiveQuestionnaireCardProps {
  destination: string;
  days: number;
  travelers: number;
  questions: QuestionnaireQuestion[];
  answers: Record<string, any>;
  customTexts: Record<string, string>;
  onAnswerChange: (questionId: string, value: any) => void;
  onCustomTextChange: (questionId: string, text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InteractiveQuestionnaireCard: React.FC<InteractiveQuestionnaireCardProps> = ({
  destination,
  days,
  travelers,
  questions,
  answers,
  customTexts,
  onAnswerChange,
  onCustomTextChange,
  onSubmit,
  isLoading,
}) => {
  const [currency] = useState<'INR'>('INR');
  const currencySymbol = '₹';

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-left animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                AI Concierge Questionnaire
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {days} Days · {travelers} {travelers === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Personalizing your {destination} Journey
            </h3>
          </div>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-lg text-blue-700 text-xs font-bold shrink-0">
          <span className="material-symbols-outlined text-sm">currency_rupee</span>
          <span>Pricing in INR (₹)</span>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const currentVal = answers[q.id];
          const customTextVal = customTexts[q.id] || '';

          return (
            <div key={q.id} className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {q.title}
                  </h4>
                  {q.subtitle && (
                    <p className="text-xs text-slate-500 mt-0.5">{q.subtitle}</p>
                  )}
                </div>
              </div>

              {/* 1. SINGLE CHOICE CARDS */}
              {q.type === 'single_choice' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map(opt => {
                    const isSelected = currentVal === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onAnswerChange(q.id, opt.id)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className="material-symbols-outlined text-base">
                            {opt.icon || 'check_circle'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                              {opt.label}
                            </span>
                            {isSelected && (
                              <span className="material-symbols-outlined text-blue-600 text-sm">
                                check_circle
                              </span>
                            )}
                          </div>
                          {opt.desc && (
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                              {opt.desc}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. MULTI CHOICE PILL CHIPS */}
              {q.type === 'multi_choice' && q.options && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => {
                      const selectedArray: string[] = Array.isArray(currentVal) ? currentVal : [];
                      const isSelected = selectedArray.includes(opt.id);

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              onAnswerChange(q.id, selectedArray.filter(id => id !== opt.id));
                            } else {
                              onAnswerChange(q.id, [...selectedArray, opt.id]);
                            }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs scale-101'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {opt.icon && (
                            <span className="material-symbols-outlined text-sm shrink-0">
                              {opt.icon}
                            </span>
                          )}
                          <span>{opt.label}</span>
                          {opt.badge && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                          {isSelected && (
                            <span className="material-symbols-outlined text-sm ml-0.5">check</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {q.allowCustomText && (
                    <div className="relative pt-1">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-sm">
                        edit_note
                      </span>
                      <input
                        type="text"
                        value={customTextVal}
                        onChange={e => onCustomTextChange(q.id, e.target.value)}
                        placeholder={q.customTextPlaceholder || 'Add any other special requests or specific places...'}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 3. BUDGET SELECTOR */}
              {q.type === 'budget' && (
                <div className="space-y-3 pt-1">
                  {/* Preset Budget Cards */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {q.options.map(opt => {
                        const selectedTier = typeof currentVal === 'object' ? currentVal?.selectedTier : currentVal;
                        const isSelected = selectedTier === opt.id;

                        let amount = Math.round(days * 28000 * travelers);
                        if (opt.id === 'smart_value' || opt.id === 'silver') amount = Math.round(days * 14000 * travelers);
                        if (opt.id === 'premium_comfort' || opt.id === 'gold') amount = Math.round(days * 28000 * travelers);
                        if (opt.id === 'ultra_luxury' || opt.id === 'platinum') amount = Math.round(days * 55000 * travelers);

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              onAnswerChange(q.id, {
                                selectedTier: opt.id,
                                targetAmount: amount,
                                currency: 'INR',
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">
                                  {opt.icon || 'payments'}
                                </span>
                              </span>
                              {opt.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                  {opt.badge.includes('₹')
                                    ? opt.badge
                                    : `~₹${amount.toLocaleString('en-IN')} Total`}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                              {opt.desc && (
                                <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                                  {opt.desc}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Custom Target Budget Input */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
                      <span className="material-symbols-outlined text-blue-600 text-base">tune</span>
                      <span>Custom Exact Budget:</span>
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        min="25000"
                        step="5000"
                        value={
                          typeof currentVal === 'object' && currentVal?.targetAmount
                            ? currentVal.targetAmount
                            : ''
                        }
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          onAnswerChange(q.id, {
                            selectedTier: 'custom',
                            targetAmount: val,
                            currency: 'INR',
                          });
                        }}
                        placeholder="e.g. 250000"
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 self-center">
                      (Covers round-trip flights, 5★ stays & private transfers in INR)
                    </span>
                  </div>
                </div>
              )}

              {/* 4. FREE TEXT / DEPARTURE CITY */}
              {q.type === 'text' && (
                <div className="relative pt-1">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-sm">
                    flight_takeoff
                  </span>
                  <input
                    type="text"
                    value={typeof currentVal === 'string' ? currentVal : ''}
                    onChange={e => onAnswerChange(q.id, e.target.value)}
                    placeholder={q.customTextPlaceholder || 'e.g. Mumbai (BOM) or New York (JFK)'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gemini AI Engine will calibrate flight, hotel, and daily options to your budget.</span>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
          }`}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Calibrated Itinerary...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>Generate Tailored Itinerary & Options</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
