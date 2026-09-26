import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ConsumerTab } from '../../types/travel';
import { TripItinerary } from '../../types/itinerary';
import {
  parseInitialPrompt,
  generateProposalFromDetails,
  compileFinalItinerary,
  AITripDetails,
  AIGeneratedProposal,
} from '../../utils/aiTripPlanner';
import { addCustomCatalogItems } from '../../data/itineraryData';
import { USER_AVATAR } from '../../data/mockData';
import { TripFlowApi } from '../../services/api';
import {
  InteractiveQuestionnaireCard,
  QuestionnaireQuestion,
} from './InteractiveQuestionnaireCard';
import { MultiOptionComparisonDeck } from './MultiOptionComparisonDeck';

export interface ClarifyQuestionnaire {
  id: string;
  destination: string;
  days: number;
  travelers: number;
  questions: QuestionnaireQuestion[];
  answers: Record<string, any>;
  customTexts: Record<string, string>;
  isSubmitted?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  questionnaire?: ClarifyQuestionnaire;
  proposal?: AIGeneratedProposal;
  targetBudgetUSD?: number;
  quickReplies?: string[];
  selectedFlightId?: string;
  selectedHotelId?: string;
  selectedTransferId?: string;
  selectedActivityIds?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  destination: string;
  updatedAt: string;
  messages: ChatMessage[];
  proposal?: AIGeneratedProposal;
}

interface AssistantScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onOpenItineraryInBuilder: (itinerary: TripItinerary) => void;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
  currentUser?: any;
}

const DEFAULT_WELCOME_SESSION: ChatSession = {
  id: 'session-turkey-welcome',
  title: 'Turkey Curated Journey',
  destination: 'Turkey',
  updatedAt: 'Just now',
  messages: [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I am your **TripFlow AI Travel Concierge** powered by Gemini.

Where would you like to travel next? You can type your dream destination, dates, and budget (e.g. *"I want to plan an itinerary for 7 days for Turkey with Cappadocia"*), and I will generate an interactive questionnaire, calibrated flight & hotel tiers, and a living day-by-day plan!`,
      quickReplies: [
        '7 days itinerary for Turkey with Cappadocia',
        '5 days luxury getaway to Tokyo & Kyoto',
        '6 days Kerala backwaters with private houseboat',
        'Weekend catamaran charter in Goa',
      ],
    },
  ],
};

const TYPEWRITER_PHRASES = [
  '7 days itinerary for Turkey with Cappadocia and Istanbul...',
  '5 days luxury getaway to Tokyo with temples and omakase...',
  'Romantic 6-day honeymoon in Kerala with private houseboat...',
  '7 days royal Rajasthan palaces with private chauffeur...',
  'Swiss Alps Glacier Express & luxury chalet in Zermatt...',
];

function buildDefaultQuestionnaire(
  clarifyData: any,
  destination: string,
  days: number,
  travelers: number
): ClarifyQuestionnaire {
  const isTurkey = destination.toLowerCase().includes('turkey');
  const isJapan = destination.toLowerCase().includes('japan');

  const highlightOptions = isTurkey
    ? [
        { id: 'cappadocia_balloon', label: 'Hot Air Balloon in Cappadocia', icon: 'flight_takeoff', badge: 'Signature' },
        { id: 'bosphorus_yacht', label: 'Private Sunset Bosphorus Yacht', icon: 'directions_boat', badge: 'Popular' },
        { id: 'historic_sultanahmet', label: 'Hagia Sophia & Blue Mosque VIP', icon: 'temple_buddhist' },
        { id: 'pamukkale_terraces', label: 'Pamukkale Travertines & Hierapolis', icon: 'landscape' },
        { id: 'culinary_bazaar', label: 'Grand Bazaar Food & Spice Tasting', icon: 'restaurant' },
        { id: 'hamam_spa', label: 'Traditional Sultan Hamam Turkish Bath', icon: 'spa' },
      ]
    : isJapan
    ? [
        { id: 'shibuya_sky', label: 'Tokyo Skyline & Hidden Cocktail Bars', icon: 'nightlife' },
        { id: 'kyoto_temples', label: 'Kyoto Bamboo Forest & Golden Pavilion', icon: 'temple_buddhist', badge: 'Signature' },
        { id: 'hakone_onsen', label: 'Private Mount Fuji Onsen & Ryokan', icon: 'hot_tub' },
        { id: 'omakase_dining', label: 'Ginza Michelin Omakase Feast', icon: 'restaurant', badge: 'Luxury' },
        { id: 'bullet_train', label: 'Shinkansen Gran Class Green Car', icon: 'train' },
      ]
    : [
        { id: 'landmark_tour', label: 'Iconic Historical Landmarks & Hidden Alleys', icon: 'tour' },
        { id: 'private_yacht', label: 'Private Sunset Cruise / Panoramic Tour', icon: 'directions_boat' },
        { id: 'fine_dining', label: 'Curated Gastronomy & Chef Table Dinner', icon: 'restaurant' },
        { id: 'wellness_retreat', label: 'Luxury Wellness & Traditional Spa Day', icon: 'spa' },
      ];

  const baseSmartBudget = Math.round(days * 14000 * travelers);
  const basePremiumBudget = Math.round(days * 28000 * travelers);
  const baseLuxuryBudget = Math.round(days * 55000 * travelers);

  const fallbackQuestions: QuestionnaireQuestion[] = [
    {
      id: 'travel_party_pace',
      title: 'Who is traveling and what is your preferred pace?',
      subtitle: 'This helps us tune the itinerary balance between downtime and exploration.',
      type: 'single_choice',
      defaultValue: travelers === 1 ? 'solo_balanced' : 'couple_relaxed',
      options: [
        { id: 'couple_relaxed', label: 'Couple · Romantic & Relaxed', desc: 'Scenic mornings, candlelit dinners, stress-free transfers', icon: 'favorite' },
        { id: 'family_balanced', label: 'Family · Balanced & Comfortable', desc: 'Kid-friendly, spacious suites, flexible pace', icon: 'family_restroom' },
        { id: 'friends_active', label: 'Friends · Active & Nightlife', desc: 'High energy tours, vibrant dining, exploration', icon: 'groups' },
        { id: 'solo_explorer', label: 'Solo Explorer · Cultural Discovery', desc: 'Hidden alleys, artisan walks, freedom to roam', icon: 'person' },
      ],
    },
    {
      id: 'must_do_highlights',
      title: `What highlights in ${destination} are on your bucket list?`,
      subtitle: 'Select any that appeal to you, or write your own specific places below.',
      type: 'multi_choice',
      options: highlightOptions,
      allowCustomText: true,
      customTextPlaceholder: 'e.g. Cappadocia Cave suite with valley view, authentic pottery workshop...',
      defaultValue: [highlightOptions[0]?.id, highlightOptions[1]?.id].filter(Boolean),
    },
    {
      id: 'budget_tier',
      title: 'What is your target budget for this journey?',
      subtitle: 'All flights, hotels, and experiences will be calibrated strictly to this amount.',
      type: 'budget',
      defaultValue: {
        selectedTier: 'premium_comfort',
        targetAmount: basePremiumBudget,
        currency: 'INR',
      },
      options: [
        {
          id: 'smart_value',
          label: 'Smart Value / Boutique',
          badge: `~₹${baseSmartBudget.toLocaleString('en-IN')} Total`,
          desc: 'High-value 4★ boutique stays, reliable economy flights, core highlights',
          icon: 'savings',
        },
        {
          id: 'premium_comfort',
          label: 'Premium Comfort (Recommended)',
          badge: `~₹${basePremiumBudget.toLocaleString('en-IN')} Total`,
          desc: '5★ landmark luxury properties, optimal direct flights, private chauffeur',
          icon: 'stars',
        },
        {
          id: 'ultra_luxury',
          label: 'Ultra-Luxury VIP Concierge',
          badge: `~₹${baseLuxuryBudget.toLocaleString('en-IN')}+ Total`,
          desc: 'Iconic Palace / Penthouse suites, Business Class lie-flat seating, private yachts',
          icon: 'diamond',
        },
      ],
    },
    {
      id: 'departure_city',
      title: 'Where will you be flying from?',
      subtitle: 'We will search round-trip flight routes matching your budget tier.',
      type: 'text',
      defaultValue: 'Mumbai (BOM)',
      customTextPlaceholder: 'e.g. Mumbai (BOM), Delhi (DEL), New York (JFK), London (LHR)...',
    },
  ];

  const questions: QuestionnaireQuestion[] = (clarifyData?.questions && clarifyData.questions.length > 0)
    ? clarifyData.questions
    : fallbackQuestions;

  const initialAnswers: Record<string, any> = {};
  questions.forEach(q => {
    if (q.defaultValue !== undefined) {
      initialAnswers[q.id] = q.defaultValue;
    } else if (q.type === 'multi_choice') {
      initialAnswers[q.id] = q.options?.slice(0, 2).map(o => o.id) || [];
    } else if (q.type === 'single_choice') {
      initialAnswers[q.id] = q.options?.[0]?.id || '';
    } else if (q.type === 'budget') {
      initialAnswers[q.id] = {
        selectedTier: 'premium_comfort',
        targetAmount: basePremiumBudget,
        currency: 'INR',
      };
    }
  });

  return {
    id: `quest-${Date.now()}`,
    destination,
    days,
    travelers,
    questions,
    answers: initialAnswers,
    customTexts: {},
    isSubmitted: false,
  };
}

/**
 * Clean & Lightweight Markdown Text Renderer
 */
export const MarkdownText: React.FC<{ content: string; className?: string }> = ({
  content,
  className = '',
}) => {
  const renderInline = (text: string): React.ReactNode[] => {
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-700 font-medium"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;
  let keyCounter = 0;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${keyCounter++}`} className="space-y-1.5 my-2.5 ml-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              <span className="flex-1 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol
          key={`ol-${keyCounter++}`}
          className="space-y-1.5 my-2.5 ml-4 list-decimal list-outside text-slate-700 text-sm"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="pl-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemContent = renderInline(trimmed.slice(2));
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const itemContent = renderInline(numMatch[2]);
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      return;
    }

    flushList();

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4
          key={`h4-${index}`}
          className="text-sm font-bold text-slate-900 mt-3 mb-1 tracking-tight"
        >
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-base font-bold text-slate-900 mt-3.5 mb-1.5 tracking-tight"
        >
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    elements.push(
      <p key={`p-${index}`} className="text-sm leading-relaxed text-slate-700 my-1">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  onNavigateTab,
  onOpenItineraryInBuilder,
  initialPrompt,
  onClearInitialPrompt,
  currentUser,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([DEFAULT_WELCOME_SESSION]);
  const [activeSessionId, setActiveSessionId] = useState<string>(DEFAULT_WELCOME_SESSION.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typewriterIndex, setTypewriterIndex] = useState<number>(0);
  const [typewriterText, setTypewriterText] = useState<string>('...');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper to persist session to Neon PostgreSQL
  const persistSessionToDb = (session: ChatSession) => {
    if (!session || !session.id) return;
    TripFlowApi.saveAssistantSession({
      id: session.id,
      title: session.title,
      destination: session.destination,
      messages: session.messages,
      proposal: session.proposal || null,
    }).catch(err => {
      console.warn('Failed to save session to DB:', err);
    });
  };

  // Sync / Load user-specific sessions from database
  useEffect(() => {
    let isSubscribed = true;

    TripFlowApi.getAssistantSessions()
      .then(dbSessions => {
        if (!isSubscribed) return;
        if (dbSessions && Array.isArray(dbSessions) && dbSessions.length > 0) {
          setSessions(dbSessions);
          if (!initialPrompt) {
            setActiveSessionId(dbSessions[0].id);
          }
        } else {
          // If no sessions yet in DB for this user, seed default welcome
          setSessions([DEFAULT_WELCOME_SESSION]);
          if (!initialPrompt) {
            setActiveSessionId(DEFAULT_WELCOME_SESSION.id);
          }
        }
      })
      .catch(err => {
        if (!isSubscribed) return;
        console.warn('Could not load sessions from DB:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [currentUser?.id]);

  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || sessions[0] || DEFAULT_WELCOME_SESSION;
  }, [sessions, activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages?.length, isTyping]);

  // Typewriter effect
  useEffect(() => {
    if (inputMessage) return;

    const fullTarget = TYPEWRITER_PHRASES[typewriterIndex];
    let timeoutId: any;

    if (!isDeleting) {
      if (typewriterText !== fullTarget) {
        timeoutId = setTimeout(() => {
          setTypewriterText(fullTarget.slice(0, typewriterText.length + 1));
        }, 40);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (typewriterText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypewriterText(typewriterText.slice(0, -1));
        }, 20);
      } else {
        setIsDeleting(false);
        setTypewriterIndex(prev => (prev + 1) % TYPEWRITER_PHRASES.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [typewriterText, isDeleting, typewriterIndex, inputMessage]);

  // Helper to update current session messages and persist
  const updateCurrentSessionMessages = (msgs: ChatMessage[], newTitle?: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const updated: ChatSession = {
            ...s,
            title: newTitle || s.title,
            updatedAt: 'Just now',
            messages: msgs,
          };
          persistSessionToDb(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Handle incoming initialPrompt from DiscoverScreen
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const promptText = initialPrompt.trim();
      const details = parseInitialPrompt(promptText);

      const newSessionId = `session-${Date.now()}`;
      const userMsg: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: promptText,
      };

      const newSession: ChatSession = {
        id: newSessionId,
        title: `${details.destination} Journey`,
        destination: details.destination,
        updatedAt: 'Just now',
        messages: [userMsg],
      };

      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
      setInputMessage('');
      persistSessionToDb(newSession);

      if (onClearInitialPrompt) onClearInitialPrompt();

      setIsTyping(true);

      TripFlowApi.getAssistantClarification(promptText).then(clarifyData => {
        setIsTyping(false);

        const questionnaire = buildDefaultQuestionnaire(
          clarifyData,
          clarifyData?.destination || details.destination,
          clarifyData?.days || details.days,
          clarifyData?.travelers || details.travelers
        );

        const assistantQuestionMsg: ChatMessage = {
          id: `msg-asst-quest-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `I'd love to curate a bespoke journey to **${questionnaire.destination}** for you! Please answer these preferences so our AI can calibrate flights, stays, and daily plans to your budget:`,
          questionnaire,
        };

        setSessions(prev =>
          prev.map(s => {
            if (s.id === newSessionId) {
              const updated = {
                ...s,
                messages: [userMsg, assistantQuestionMsg],
              };
              persistSessionToDb(updated);
              return updated;
            }
            return s;
          })
        );
      });
    }
  }, [initialPrompt]);

  // Create new chat session
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Trip Conversation',
      destination: 'Worldwide',
      updatedAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: `Hello! Where would you like to travel next? Tell me your dream destination, dates, and budget (e.g. *"7 days in Turkey with Cappadocia"*).`,
          quickReplies: [
            '7 days itinerary for Turkey with Cappadocia',
            '5 days luxury getaway to Tokyo & Kyoto',
            '6 days Kerala backwaters with private houseboat',
            'Weekend catamaran charter in Goa',
          ],
        },
      ],
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInputMessage('');
    persistSessionToDb(newSession);
  };

  // Delete chat session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    TripFlowApi.deleteAssistantSession(id).catch(err => {
      console.warn('Failed to delete session in DB:', err);
    });
    if (sessions.length <= 1) {
      handleNewChat();
      return;
    }
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };


  // User submits a prompt text
  const handleUserSubmit = async (userText?: string) => {
    const textToSend = (userText !== undefined ? userText : inputMessage).trim();
    if (!textToSend) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    const updatedMessages = [...(activeSession?.messages || []), userMsg];
    updateCurrentSessionMessages(updatedMessages);

    setIsTyping(true);

    const details = parseInitialPrompt(textToSend);
    const clarifyData = await TripFlowApi.getAssistantClarification(textToSend);

    setIsTyping(false);

    const questionnaire = buildDefaultQuestionnaire(
      clarifyData,
      clarifyData?.destination || details.destination,
      clarifyData?.days || details.days,
      clarifyData?.travelers || details.travelers
    );

    const assistantQuestionMsg: ChatMessage = {
      id: `msg-asst-quest-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `I'd love to curate a bespoke journey to **${questionnaire.destination}** for you! Please answer these preferences so our AI can calibrate flights, stays, and daily plans to your budget:`,
      questionnaire,
    };

    updateCurrentSessionMessages([...updatedMessages, assistantQuestionMsg], `${questionnaire.destination} Bespoke Plan`);
  };

  // Update Questionnaire answers
  const handleAnswerChange = (msgId: string, questionId: string, val: any) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const updated: ChatSession = {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === msgId && m.questionnaire) {
                return {
                  ...m,
                  questionnaire: {
                    ...m.questionnaire,
                    answers: {
                      ...m.questionnaire.answers,
                      [questionId]: val,
                    },
                  },
                };
              }
              return m;
            }),
          };
          persistSessionToDb(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Update Questionnaire custom text
  const handleCustomTextChange = (msgId: string, questionId: string, text: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === msgId && m.questionnaire) {
                return {
                  ...m,
                  questionnaire: {
                    ...m.questionnaire,
                    customTexts: {
                      ...m.questionnaire.customTexts,
                      [questionId]: text,
                    },
                  },
                };
              }
              return m;
            }),
          };
        }
        return s;
      })
    );
  };

  // User submits questionnaire -> generates Proposal
  const handleQuestionnaireSubmit = async (msgId: string, questionnaire: ClarifyQuestionnaire) => {
    // 1. Mark questionnaire submitted
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const updated: ChatSession = {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === msgId && m.questionnaire) {
                return {
                  ...m,
                  questionnaire: {
                    ...m.questionnaire,
                    isSubmitted: true,
                  },
                };
              }
              return m;
            }),
          };
          persistSessionToDb(updated);
          return updated;
        }
        return s;
      })
    );

    // 2. Extract budget
    let targetBudget = Math.round(questionnaire.days * 28000 * questionnaire.travelers);
    const budgetAns = questionnaire.answers['budget_tier'];
    if (budgetAns && typeof budgetAns === 'object' && budgetAns.targetAmount) {
      targetBudget = budgetAns.targetAmount;
    } else if (typeof budgetAns === 'number') {
      targetBudget = budgetAns;
    }

    setIsTyping(true);

    const promptText = activeSession.messages.find(m => m.sender === 'user')?.text || `Trip to ${questionnaire.destination}`;

    const proposalRes = await TripFlowApi.generateAssistantProposal({
      prompt: promptText,
      destination: questionnaire.destination,
      days: questionnaire.days,
      travelers: questionnaire.travelers,
      answers: questionnaire.answers,
      targetBudgetUSD: targetBudget,
    });

    setIsTyping(false);

    const proposal: AIGeneratedProposal = proposalRes || generateProposalFromDetails({
      destination: questionnaire.destination,
      country: questionnaire.destination,
      days: questionnaire.days,
      travelers: questionnaire.travelers,
      startDate: '2025-10-15',
      travelStyle: 'Luxury Concierge',
      interests: ['Heritage', 'Local Dining', 'Private Chauffeur'],
    });

    const assistantProposalMsg: ChatMessage = {
      id: `msg-asst-prop-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `✨ **Here is your customized living itinerary for ${proposal.title}!**

I have calibrated flight routes, luxury accommodations, and private transfers strictly to your target budget of ₹${targetBudget.toLocaleString('en-IN')}. You can switch flight options, select hotel tiers, or add extra experiences below before opening in the **Itinerary Builder**.`,
      proposal,
      targetBudgetUSD: targetBudget,
      selectedFlightId: proposal.selectedFlightId || proposal.flights[1]?.id || proposal.flights[0]?.id,
      selectedHotelId: proposal.selectedHotelId || proposal.hotels[1]?.id || proposal.hotels[0]?.id,
      selectedTransferId: proposal.selectedTransferId || proposal.transfers[1]?.id || proposal.transfers[0]?.id,
      selectedActivityIds: proposal.extraActivities?.filter(a => a.isIncluded).map(a => a.id) || [],
    };

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const currentMsgs = s.messages.map(m => {
            if (m.id === msgId && m.questionnaire) {
              return {
                ...m,
                questionnaire: {
                  ...m.questionnaire,
                  isSubmitted: true,
                },
              };
            }
            return m;
          });
          const updated: ChatSession = {
            ...s,
            proposal,
            messages: [...currentMsgs, assistantProposalMsg],
          };
          persistSessionToDb(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Update proposal selections (flights, hotels, transfers, activities)
  const handleUpdateProposalSelection = (msgId: string, updates: Partial<ChatMessage>) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const updated: ChatSession = {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === msgId) {
                return {
                  ...m,
                  ...updates,
                };
              }
              return m;
            }),
          };
          persistSessionToDb(updated);
          return updated;
        }
        return s;
      })
    );
  };


  // Open in Builder
  const handleOpenProposalInBuilder = (msg: ChatMessage) => {
    if (!msg.proposal) return;

    const chosenFlightId = msg.selectedFlightId || msg.proposal.selectedFlightId || msg.proposal.flights[0]?.id;
    const chosenHotelId = msg.selectedHotelId || msg.proposal.selectedHotelId || msg.proposal.hotels[0]?.id;
    const chosenTransferId = msg.selectedTransferId || msg.proposal.selectedTransferId || msg.proposal.transfers[0]?.id;
    const chosenActivityIds = msg.selectedActivityIds || [];

    const finalItinerary = compileFinalItinerary(
      msg.proposal,
      chosenFlightId,
      chosenHotelId,
      chosenTransferId,
      chosenActivityIds
    );

    if (msg.proposal.extraActivities && msg.proposal.extraActivities.length > 0) {
      addCustomCatalogItems(msg.proposal.extraActivities);
    }

    onOpenItineraryInBuilder(finalItinerary);
  };

  const filteredSessions = useMemo(() => {
    if (!searchHistoryQuery.trim()) return sessions;
    const q = searchHistoryQuery.toLowerCase();
    return sessions.filter(
      s => s.title.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q)
    );
  }, [sessions, searchHistoryQuery]);

  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex bg-[#FAFBFD] text-[#0F172A] overflow-hidden select-none">
      {/* 1. LEFT SIDEBAR: CHAT SESSIONS */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64 sm:w-72' : 'w-0'
        } transition-all duration-300 ease-in-out bg-[#F8F9FA] border-r border-slate-200/80 flex flex-col shrink-0 overflow-hidden z-20`}
      >
        <div className="p-3.5 border-b border-slate-200/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </span>
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">AI Concierge</h2>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Gemini Active
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/60 cursor-pointer transition-colors"
            title="Collapse sidebar"
          >
            <span className="material-symbols-outlined text-lg">dock_to_left</span>
          </button>
        </div>

        <div className="p-3 border-b border-slate-200/60 shrink-0 space-y-2">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-indigo-600">add</span>
              <span>New Journey</span>
            </span>
            <kbd className="text-[10px] bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded text-slate-500 font-mono">
              +
            </kbd>
          </button>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-xs">
              search
            </span>
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={e => setSearchHistoryQuery(e.target.value)}
              placeholder="Search journeys..."
              className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-slate-200/80 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Recent Journeys
          </div>

          {filteredSessions.map(session => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`group relative px-2.5 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-white shadow-2xs border border-slate-200/80 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">
                    chat_bubble_outline
                  </span>
                  <span className="text-xs truncate">{session.title}</span>
                </div>

                <button
                  type="button"
                  onClick={e => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 rounded transition-opacity"
                  title="Delete chat"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-200/60 shrink-0 bg-white/60">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="material-symbols-outlined text-xs text-emerald-600">cloud_done</span>
            <span className="truncate">Saved to {currentUser?.name ? `${currentUser.name}'s Account` : 'Secure Neon Database'}</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONVERSATION STREAM */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <header className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer mr-1"
                title="Open sidebar"
              >
                <span className="material-symbols-outlined text-lg">dock_to_right</span>
              </button>
            )}

            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {activeSession?.title || 'TripFlow Concierge'}
              </h1>
              <p className="text-[10px] text-slate-400">
                Calibrated living itineraries powered by Gemini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Synced</span>
            </span>

            <button
              type="button"
              onClick={handleNewChat}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 cursor-pointer transition-colors"
            >
              + New Chat
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            {activeSession?.messages?.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  </div>
                )}

                <div
                  className={`flex flex-col ${
                    msg.sender === 'user'
                      ? 'items-end max-w-[85%] sm:max-w-[75%]'
                      : 'items-start flex-1 min-w-0'
                  }`}
                >
                  {/* User Bubble */}
                  {msg.sender === 'user' ? (
                    <div className="p-3.5 rounded-2xl rounded-tr-xs bg-blue-600 text-white text-sm leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    /* Assistant Output */
                    <div className="w-full text-left space-y-4">
                      {msg.text && <MarkdownText content={msg.text} />}

                      {/* Quick Replies */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.quickReplies.map((reply, rIdx) => (
                            <button
                              key={rIdx}
                              type="button"
                              onClick={() => handleUserSubmit(reply)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 1. DYNAMIC QUESTIONNAIRE CARD */}
                      {msg.questionnaire && !msg.questionnaire.isSubmitted && (
                        <InteractiveQuestionnaireCard
                          destination={msg.questionnaire.destination}
                          days={msg.questionnaire.days}
                          travelers={msg.questionnaire.travelers}
                          questions={msg.questionnaire.questions}
                          answers={msg.questionnaire.answers}
                          customTexts={msg.questionnaire.customTexts}
                          onAnswerChange={(qId, val) => handleAnswerChange(msg.id, qId, val)}
                          onCustomTextChange={(qId, txt) => handleCustomTextChange(msg.id, qId, txt)}
                          onSubmit={() => handleQuestionnaireSubmit(msg.id, msg.questionnaire!)}
                          isLoading={isTyping}
                        />
                      )}

                      {/* 2. MULTI-OPTION PROPOSAL COMPARISON DECK */}
                      {msg.proposal && (
                        <MultiOptionComparisonDeck
                          proposal={msg.proposal}
                          targetBudgetUSD={msg.targetBudgetUSD || msg.proposal.basePriceUSD}
                          selectedFlightId={msg.selectedFlightId || msg.proposal.selectedFlightId}
                          onSelectFlight={fltId => handleUpdateProposalSelection(msg.id, { selectedFlightId: fltId })}
                          selectedHotelId={msg.selectedHotelId || msg.proposal.selectedHotelId}
                          onSelectHotel={htId => handleUpdateProposalSelection(msg.id, { selectedHotelId: htId })}
                          selectedTransferId={msg.selectedTransferId || msg.proposal.selectedTransferId}
                          onSelectTransfer={trId => handleUpdateProposalSelection(msg.id, { selectedTransferId: trId })}
                          selectedActivityIds={msg.selectedActivityIds || []}
                          onToggleActivity={actId => {
                            const cur = msg.selectedActivityIds || [];
                            const updated = cur.includes(actId) ? cur.filter(id => id !== actId) : [...cur, actId];
                            handleUpdateProposalSelection(msg.id, { selectedActivityIds: updated });
                          }}
                          onOpenInBuilder={() => handleOpenProposalInBuilder(msg)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm animate-spin">auto_awesome</span>
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-slate-600 font-medium ml-1">
                    Gemini AI is analyzing destinations and calibrating budget options...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 3. INPUT BAR */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl border border-slate-200/90 bg-slate-50/70 p-2 shadow-2xs focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleUserSubmit();
                  }
                }}
                placeholder={inputMessage ? '' : typewriterText}
                className="w-full pl-3 pr-12 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none max-h-32"
              />

              <button
                type="button"
                disabled={!inputMessage.trim() || isTyping}
                onClick={() => handleUserSubmit()}
                className={`absolute right-2.5 bottom-2.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-base">arrow_upward</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Press Enter to send inquiry</span>
              <span>TripFlow AI · Instant Budget-Calibrated Travel Curation</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
