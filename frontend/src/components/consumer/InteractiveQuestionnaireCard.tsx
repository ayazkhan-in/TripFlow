import React, { useState, useEffect } from 'react';

export interface QuestionnaireOption {
  id: string;
  label: string;
  icon?: string;
  image?: string;
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

interface StepQuestionnaireFlowProps {
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
  userName?: string;
  destinationImage?: string;
  countryName?: string;
}

// Fallback high-res photographic covers for options matching user reference UI
const OPTION_IMAGE_FALLBACKS: Record<string, string> = {
  // Travel party
  couple_relaxed: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=700&q=80',
  couple: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=700&q=80',
  family_balanced: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=700&q=80',
  family: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=700&q=80',
  friends_active: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=700&q=80',
  friends: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=700&q=80',
  solo_explorer: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=700&q=80',
  solo: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=700&q=80',

  // Guests count options
  guests_1: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=700&q=80',
  guests_2: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=700&q=80',
  guests_4: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=700&q=80',
  guests_6: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=700&q=80',

  // Trip duration options
  days_3: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=700&q=80',
  days_5: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
  days_7: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=700&q=80',
  days_10: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80',

  // Interests / Experiences
  culture: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
  nature: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
  wellness: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
  shopping: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80',
  nightlife: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80',

  // Specific highlights
  cappadocia_balloon: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=700&q=80',
  bosphorus_yacht: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80',
  historic_sultanahmet: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=700&q=80',
  pamukkale_terraces: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=700&q=80',
  culinary_bazaar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
  hamam_spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',

  shibuya_sky: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80',
  kyoto_temples: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
  hakone_onsen: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
  omakase_dining: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80',
  bullet_train: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80',

  landmark_tour: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=700&q=80',
  private_yacht: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80',
  fine_dining: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
  wellness_retreat: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',

  // Budget cards
  smart_value: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80',
  premium_comfort: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=700&q=80',
  ultra_luxury: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80',
};

function getOptionImage(opt: QuestionnaireOption, questionId: string, index: number): string {
  if (opt.image) return opt.image;
  const key = opt.id.toLowerCase();
  for (const [k, v] of Object.entries(OPTION_IMAGE_FALLBACKS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  const defaults = [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80',
  ];
  return defaults[index % defaults.length];
}

export const InteractiveQuestionnaireCard: React.FC<StepQuestionnaireFlowProps> = ({
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
  userName = 'Traveler',
  destinationImage,
  countryName,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>(answers || {});
  const [localCustomTexts, setLocalCustomTexts] = useState<Record<string, string>>(customTexts || {});

  // Keep local state synced when parent answers update
  useEffect(() => {
    if (answers) {
      setLocalAnswers(prev => ({ ...prev, ...answers }));
    }
  }, [answers]);

  useEffect(() => {
    if (customTexts) {
      setLocalCustomTexts(prev => ({ ...prev, ...customTexts }));
    }
  }, [customTexts]);

  const effectiveAnswers = { ...(answers || {}), ...localAnswers };
  const effectiveCustomTexts = { ...(customTexts || {}), ...localCustomTexts };

  const handleSelectAnswer = (qId: string, val: any) => {
    setLocalAnswers(prev => ({ ...prev, [qId]: val }));
    onAnswerChange(qId, val);
  };

  const handleUpdateCustomText = (qId: string, text: string) => {
    setLocalCustomTexts(prev => ({ ...prev, [qId]: text }));
    onCustomTextChange(qId, text);
  };

  const totalSteps = questions.length;
  const currentQuestion = questions[currentStepIndex] || questions[0];

  const currentVal = currentQuestion ? effectiveAnswers[currentQuestion.id] : undefined;
  const customTextVal = currentQuestion ? (effectiveCustomTexts[currentQuestion.id] || '') : '';

  // Extract human readable summary for Right Sidebar Card
  const departureCityAnswer =
    effectiveAnswers['departure_city'] || effectiveCustomTexts['departure_city'] || 'Mumbai (BOM)';
  const partyAnswer = effectiveAnswers['travel_party_pace'] || 'couple_relaxed';

  // Find highlights from answers
  const highlightsKey =
    Object.keys(effectiveAnswers).find(
      k => k === 'must_do_highlights' || k.includes('highlight') || k.includes('experience')
    ) || 'must_do_highlights';
  const highlightsAnswer: string[] = Array.isArray(effectiveAnswers[highlightsKey])
    ? effectiveAnswers[highlightsKey]
    : Array.isArray(effectiveAnswers['must_do_highlights'])
    ? effectiveAnswers['must_do_highlights']
    : [];

  const budgetAnswer = effectiveAnswers['budget_tier'];

  // Dynamically resolve actual days and guests from questionnaire answers if answered
  const daysAnswer = effectiveAnswers['trip_duration'];
  const activeDays = typeof daysAnswer === 'number'
    ? daysAnswer
    : typeof daysAnswer === 'string' && parseInt(daysAnswer, 10) > 0
    ? parseInt(daysAnswer, 10)
    : days;

  const guestsAnswer = effectiveAnswers['guests_count'];
  const activeGuests = typeof guestsAnswer === 'number'
    ? guestsAnswer
    : typeof guestsAnswer === 'string' && parseInt(guestsAnswer, 10) > 0
    ? parseInt(guestsAnswer, 10)
    : travelers;

  const partyLabel = partyAnswer === 'solo_balanced' || partyAnswer === 'solo'
    ? 'Solo Explorer'
    : partyAnswer === 'family_balanced' || partyAnswer === 'family'
    ? 'Family'
    : partyAnswer === 'friends_active' || partyAnswer === 'friends'
    ? 'Friends'
    : 'Couple';

  const budgetLabel = typeof budgetAnswer === 'object' && budgetAnswer?.selectedTier === 'smart_value'
    ? 'Smart Value'
    : typeof budgetAnswer === 'object' && budgetAnswer?.selectedTier === 'ultra_luxury'
    ? 'Ultra Luxury'
    : 'Premium';

  const defaultHero = destinationImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80';

  const allOptions = questions.flatMap(q => q.options || []);
  const getOptionLabel = (val: string) => {
    const opt = allOptions.find(o => o.id === val || String(o.id).toLowerCase() === String(val).toLowerCase());
    return opt?.label || val.replace(/_/g, ' ').replace(/^hl-\d+/, 'Highlight');
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Conversational AI Greeting per step
  const getStepGreeting = () => {
    const qId = currentQuestion?.id;
    if (qId === 'trip_duration') {
      return {
        greeting: `Hi ${userName.split(' ')[0]}! 👋`,
        message: `How long would you like your journey in ${destination} to be? Tell us your exact days without guessing.`,
      };
    }
    if (qId === 'guests_count') {
      return {
        greeting: 'Got it! 👥',
        message: 'How many travelers or guests will be joining this trip?',
      };
    }
    if (qId === 'travel_party_pace') {
      return {
        greeting: 'Sounds wonderful! ✨',
        message: 'Who is traveling and what is your preferred pace between downtime and exploration?',
      };
    }
    if (qId === 'must_do_highlights') {
      return {
        greeting: 'City Highlights 🏛️',
        message: `What highlights in ${destination} are on your bucket list? Select all that appeal to you.`,
      };
    }
    if (qId === 'budget_tier') {
      return {
        greeting: 'Budget Calibration 💎',
        message: 'What is your target budget for this journey? All flights, hotels, and transfers are calibrated to this.',
      };
    }
    if (qId === 'departure_city') {
      return {
        greeting: 'Almost there! 🛫',
        message: 'Where will you be departing from? We will look up optimal direct and connection flights.',
      };
    }
    return {
      greeting: `Step ${currentStepIndex + 1}`,
      message: currentQuestion?.subtitle || 'Please answer the question below.',
    };
  };

  const { greeting, message } = getStepGreeting();

  return (
    <div className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm text-left animate-in fade-in duration-300">
      {/* Top Bar: Step Counter, Back Button & Gemini Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div className="flex items-center gap-3">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Go back to previous step"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              AI CONCIERGE
            </span>
            <div className="text-xs font-semibold text-slate-800">
              Step {currentStepIndex + 1} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Step progress track */}
        <div className="hidden sm:flex items-center gap-1.5">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-10 bg-blue-600'
                  : idx < currentStepIndex
                  ? 'w-6 bg-blue-300'
                  : 'w-6 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Powered by Gemini Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-full shadow-2xs text-xs font-semibold text-slate-700">
          <span className="material-symbols-outlined text-blue-600 text-sm">auto_awesome</span>
          <span>Powered by <span className="text-blue-600">Gemini</span></span>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Step Content vs Right Live Trip Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: ACTIVE STEP QUESTION (Col 1 to 8)                     */}
        {/* =================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI Bubble Greeting */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <span className="material-symbols-outlined text-base">auto_awesome</span>
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs text-xs text-slate-700 leading-relaxed max-w-xl">
              <span className="font-bold text-slate-900 block mb-0.5">{greeting}</span>
              <span>{message}</span>
            </div>
          </div>

          {/* Question Title & Subtitle */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>

          {/* 1. SINGLE CHOICE CARDS WITH IMAGES & ICONS */}
          {currentQuestion.type === 'single_choice' && currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = currentVal === opt.id || String(currentVal) === String(opt.id);
                const img = getOptionImage(opt, currentQuestion.id, oIdx);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectAnswer(currentQuestion.id, opt.id);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border text-left transition-all duration-200 cursor-pointer bg-white ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-600/40 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Top Image Banner */}
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                      <img
                        src={img}
                        alt={opt.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Checkmark badge */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </div>
                      )}

                      {/* Icon Bubble */}
                      <div className="absolute bottom-2.5 left-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-sm text-blue-600">
                        <span className="material-symbols-outlined text-base">
                          {opt.icon || 'travel_explore'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Label & Description */}
                    <div className="p-3.5">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {opt.label}
                      </div>
                      {opt.desc && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {opt.desc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. MULTI CHOICE GRID CARDS (Must-do highlights / experiences) */}
          {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {currentQuestion.options.map((opt, oIdx) => {
                  const selectedArray: string[] = Array.isArray(currentVal) ? currentVal : [];
                  const isSelected =
                    selectedArray.includes(opt.id) ||
                    selectedArray.some(s => String(s).toLowerCase() === String(opt.id).toLowerCase());
                  const img = getOptionImage(opt, currentQuestion.id, oIdx);

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        let nextSelected: string[];
                        if (isSelected) {
                          nextSelected = selectedArray.filter(
                            id => id !== opt.id && String(id).toLowerCase() !== String(opt.id).toLowerCase()
                          );
                        } else {
                          nextSelected = [...selectedArray, opt.id];
                        }
                        handleSelectAnswer(currentQuestion.id, nextSelected);
                      }}
                      className={`group relative rounded-2xl overflow-hidden border text-left transition-all duration-200 cursor-pointer bg-white ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/40 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Image Banner */}
                      <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-100">
                        <img
                          src={img}
                          alt={opt.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Checkmark badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                            <span className="material-symbols-outlined text-xs font-bold">check</span>
                          </div>
                        )}

                        {/* Icon Bubble */}
                        <div className="absolute bottom-2 left-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-sm text-blue-600">
                          <span className="material-symbols-outlined text-sm">
                            {opt.icon || 'star'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {opt.label}
                        </div>
                        {opt.desc ? (
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {opt.desc}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Local flavors & curated experience
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Specific Text Input Box if allowed */}
              {currentQuestion.allowCustomText && (
                <div className="relative pt-2">
                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <span className="material-symbols-outlined text-blue-600 text-base shrink-0">
                      add_circle
                    </span>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
                        Tell us something specific
                      </div>
                      <input
                        type="text"
                        value={customTextVal}
                        onChange={e => handleUpdateCustomText(currentQuestion.id, e.target.value)}
                        placeholder={
                          currentQuestion.customTextPlaceholder ||
                          'e.g. hidden food spots, local markets, a particular type of experience...'
                        }
                        className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. BUDGET SELECTOR CARDS */}
          {currentQuestion.type === 'budget' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {(currentQuestion.options || []).map((opt, oIdx) => {
                  const selectedTier =
                    typeof currentVal === 'object' ? currentVal?.selectedTier : currentVal;
                  const isSelected = selectedTier === opt.id;
                  const img = getOptionImage(opt, currentQuestion.id, oIdx);

                  let amount = Math.round(days * 28000 * travelers);
                  if (opt.id === 'smart_value') amount = Math.round(days * 14000 * travelers);
                  if (opt.id === 'premium_comfort') amount = Math.round(days * 28000 * travelers);
                  if (opt.id === 'ultra_luxury') amount = Math.round(days * 55000 * travelers);

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectAnswer(currentQuestion.id, {
                          selectedTier: opt.id,
                          targetAmount: amount,
                          currency: 'INR',
                        });
                      }}
                      className={`group relative rounded-2xl overflow-hidden border text-left transition-all duration-200 cursor-pointer bg-white ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/40 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="relative h-24 w-full overflow-hidden bg-slate-100">
                        <img
                          src={img}
                          alt={opt.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-xs font-bold">check</span>
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-800 shadow-2xs">
                          ~₹{amount.toLocaleString('en-IN')} Total
                        </span>
                      </div>

                      <div className="p-3">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                            {opt.desc}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Exact Custom Budget input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
                  <span className="material-symbols-outlined text-blue-600 text-base">tune</span>
                  <span>Custom Exact Budget:</span>
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
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
                      handleSelectAnswer(currentQuestion.id, {
                        selectedTier: 'custom',
                        targetAmount: val,
                        currency: 'INR',
                      });
                    }}
                    placeholder="e.g. 250000"
                    className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <span className="text-[11px] text-slate-600 self-center">
                  (Covers round-trip flights, 5★ stays & private transfers in INR)
                </span>
              </div>
            </div>
          )}

          {/* 4. FREE TEXT / DEPARTURE CITY STEP */}
          {currentQuestion.type === 'text' && (
            <div className="space-y-3 pt-1">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-blue-600 text-lg">
                  flight_takeoff
                </span>
                <input
                  type="text"
                  value={typeof currentVal === 'string' ? currentVal : ''}
                  onChange={e => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  placeholder={
                    currentQuestion.customTextPlaceholder || 'e.g. Mumbai (BOM) or New York (JFK)'
                  }
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs font-semibold"
                />
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-600 font-medium mr-1">Popular Hubs:</span>
                {['Mumbai (BOM)', 'New Delhi (DEL)', 'Bengaluru (BLR)', 'Dubai (DXB)', 'London (LHR)'].map(hub => (
                  <button
                    key={hub}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectAnswer(currentQuestion.id, hub);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition-colors shadow-2xs"
                  >
                    {hub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Step Actions: Back, Step Indicators & Continue Button */}
          <div className="pt-6 border-t border-slate-200/60 flex items-center justify-between gap-4">
            {/* Back Button */}
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200 bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {/* Step Dots indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-600 font-medium mr-1">
                {currentStepIndex + 1}/{totalSteps}
              </span>
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-4 bg-blue-600'
                      : idx < currentStepIndex
                      ? 'bg-blue-400'
                      : 'bg-slate-300'
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Continue / Submit Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-98 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : currentStepIndex < totalSteps - 1 ? (
                <>
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: LIVE TRIP PREVIEW CARD (Col 9 to 12)                  */}
        {/* Matches screenshot 2 & 3: Tokyo card with live updating details     */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            {/* Card Header Media */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={defaultHero}
                alt={destination}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Tag pill at top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-sm">
                  <span className="material-symbols-outlined text-blue-600 text-sm">auto_awesome</span>
                  <span>YOUR TRIP</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-semibold text-white/90 border border-white/20">
                  Building your dream trip...
                </div>
              </div>

              {/* Bottom text inside image */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                  {destination}
                </h3>
                <div className="flex items-center gap-1 text-xs text-white/90">
                  <span className="material-symbols-outlined text-sm text-red-400">location_on</span>
                  <span>{countryName || destination}</span>
                  <span className="mx-1">•</span>
                  <span>{activeDays} Days · {activeGuests} Guests</span>
                </div>
              </div>
            </div>

            {/* Selected Preferences Summary List */}
            <div className="p-4 space-y-3.5 divide-y divide-slate-100">
              {/* Preferences Stack */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Party */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <span className="material-symbols-outlined text-base text-blue-600">
                      favorite
                    </span>
                    <span className="font-semibold">{partyLabel}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Party</span>
                </div>

                {/* 2. Highlights selected */}
                {highlightsAnswer.length > 0 ? (
                  highlightsAnswer.slice(0, 4).map((hl, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 text-slate-700 min-w-0">
                        <span className="material-symbols-outlined text-base text-emerald-600 shrink-0">
                          {i === 0 ? 'star' : i === 1 ? 'explore' : i === 2 ? 'restaurant' : 'spa'}
                        </span>
                        <span className="font-semibold truncate max-w-[170px]" title={getOptionLabel(hl)}>
                          {getOptionLabel(hl)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">Bucket List</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">interests</span>
                      <span>Highlights</span>
                    </div>
                    <span className="text-[10px]">Select in step 2</span>
                  </div>
                )}

                {/* 3. Budget Tier */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <span className="material-symbols-outlined text-base text-amber-500">
                      diamond
                    </span>
                    <span className="font-semibold">{budgetLabel} Comfort</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Budget</span>
                </div>
              </div>

              {/* Departure City Section with inline quick edit */}
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="material-symbols-outlined text-base text-blue-600">
                      flight_takeoff
                    </span>
                    <div>
                      <div className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                        Starting from
                      </div>
                      <div className="font-bold text-slate-900">{departureCityAnswer}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const depIdx = questions.findIndex(q => q.id === 'departure_city');
                      if (depIdx !== -1) setCurrentStepIndex(depIdx);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                    title="Edit departure city"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
              </div>

              {/* Progress pill & Quick Jump button */}
              <div className="pt-3 space-y-2">
                <div className="bg-blue-50/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-blue-800 font-semibold text-[11px]">
                    <span className="material-symbols-outlined text-sm text-blue-600">auto_awesome</span>
                    <span>{Math.max(1, highlightsAnswer.length + 2)} preferences selected</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(0)}
                  className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                >
                  Edit preferences →
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
