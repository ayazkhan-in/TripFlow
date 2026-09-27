import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ConsumerTab } from '../../types/travel';
import { TripItinerary } from '../../types/itinerary';
import {
  parseInitialPrompt,
  generateProposalFromDetails,
  compileFinalItinerary,
  AITripDetails,
  AIGeneratedProposal,
  AIActivityOption,
} from '../../utils/aiTripPlanner';
import { addCustomCatalogItems } from '../../data/itineraryData';
import { USER_AVATAR } from '../../data/mockData';
import { TripFlowApi } from '../../services/api';
import {
  InteractiveQuestionnaireCard,
  TripSummaryCard,
  QuestionnaireQuestion,
  QuestionnaireOption,
} from './InteractiveQuestionnaireCard';
import { MultiOptionComparisonDeck } from './MultiOptionComparisonDeck';
import { findValidDestination, VALID_DESTINATIONS, TravelDestination } from '../../data/citiesData';
import {
  QuestionnaireSkeleton,
  ProposalDeckSkeleton,
  ChatSessionListSkeleton,
} from '../common/Skeleton';

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
      text: `Hello! I am your **Bookit Travel Concierge**.

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
  travelers: number,
  defaultDepartureCity = 'Mumbai (BOM)'
): ClarifyQuestionnaire {
  // Find city-specific highlights & images from VALID_DESTINATIONS
  const matchedDest = findValidDestination(destination);
  
  let highlightOptions: QuestionnaireOption[] = [];
  if (matchedDest && matchedDest.highlightCategories && matchedDest.highlightCategories.length > 0) {
    highlightOptions = matchedDest.highlightCategories.map((h, i) => ({
      id: h.id,
      label: h.label,
      desc: h.desc,
      icon: h.icon,
      image: h.image,
      badge: i === 0 ? 'Signature' : i === 1 ? 'Popular' : undefined,
    }));
  } else {
    // Dynamic fallback options for generic destination
    highlightOptions = [
      { id: 'landmark_tour', label: `${destination} Iconic Heritage & Cultural Discovery`, icon: 'tour', badge: 'Signature' },
      { id: 'private_yacht', label: `${destination} Private Sunset Excursion & Scenic Panorama`, icon: 'directions_boat', badge: 'Popular' },
      { id: 'fine_dining', label: `${destination} Curated Gourmet & Chef Table Dinner`, icon: 'restaurant' },
      { id: 'wellness_retreat', label: `${destination} Luxury Wellness & Traditional Spa Day`, icon: 'spa' },
    ];
  }

  const baseSmartBudget = Math.round(days * 14000 * travelers);
  const basePremiumBudget = Math.round(days * 28000 * travelers);
  const baseLuxuryBudget = Math.round(days * 55000 * travelers);

  const fallbackQuestions: QuestionnaireQuestion[] = [
    {
      id: 'trip_duration',
      title: `How many days do you want to spend in ${destination}?`,
      subtitle: 'Tell us your exact trip duration so we can build a perfectly paced day-by-day itinerary.',
      type: 'single_choice',
      defaultValue: days,
      options: [
        { id: '3', label: '3 Days', desc: 'Weekend quick escape & essentials', icon: 'schedule' },
        { id: '5', label: '5 Days', desc: 'Signature curated circuit (Recommended)', icon: 'calendar_view_week' },
        { id: '7', label: '7 Days', desc: 'Immersive discovery & cultural depth', icon: 'date_range' },
        { id: '10', label: '10+ Days', desc: 'Extended multi-city comprehensive tour', icon: 'event_available' },
      ],
      allowCustomText: true,
      customTextPlaceholder: 'Or enter custom number of days (e.g. 4, 8, 12, 14)...',
    },
    {
      id: 'guests_count',
      title: 'How many guests or travelers are joining this journey?',
      subtitle: 'We calibrate hotel bedroom suites, flight tickets, and private vehicle capacity to your exact guest count.',
      type: 'single_choice',
      defaultValue: travelers,
      options: [
        { id: '1', label: '1 Traveler', desc: 'Solo explorer with private guide', icon: 'person' },
        { id: '2', label: '2 Guests', desc: 'Couple / Duo in 1 Luxury King Suite', icon: 'group' },
        { id: '4', label: '4 Guests', desc: 'Family / Small Group in 2 Connecting Suites', icon: 'family_restroom' },
        { id: '6', label: '6+ Guests', desc: 'Private entourage / group villa & minibus', icon: 'groups' },
      ],
      allowCustomText: true,
      customTextPlaceholder: 'Or enter exact number of adults & kids (e.g. 3 adults, 1 child)...',
    },
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
      defaultValue: defaultDepartureCity,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loadingType, setLoadingType] = useState<'questionnaire' | 'proposal' | 'chat' | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [typewriterIndex, setTypewriterIndex] = useState<number>(0);
  const [typewriterText, setTypewriterText] = useState<string>('...');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Invalid Destination Alert Modal State
  const [invalidModal, setInvalidModal] = useState<{
    isOpen: boolean;
    rawInput: string;
    message: string;
  }>({
    isOpen: false,
    rawInput: '',
    message: '',
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledInitialPromptRef = useRef<string | null>(null);

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
    setIsLoadingSessions(true);

    TripFlowApi.getAssistantSessions()
      .then(dbSessions => {
        if (!isSubscribed) return;
        if (dbSessions && Array.isArray(dbSessions) && dbSessions.length > 0) {
          setSessions(prev => {
            const seenIds = new Set<string>();
            const seenTitles = new Set<string>();
            const merged: ChatSession[] = [];

            // Add dbSessions first (ordered by updatedAt desc)
            for (const s of dbSessions) {
              if (seenIds.has(s.id)) continue;
              const titleKey = `${(s.title || '').trim().toLowerCase()}_${(s.destination || '').trim().toLowerCase()}`;
              if (s.title !== 'New Trip Conversation' && seenTitles.has(titleKey)) continue;
              seenIds.add(s.id);
              seenTitles.add(titleKey);
              merged.push(s);
            }

            // Keep unsaved in-memory sessions
            for (const s of prev) {
              if (s.id === DEFAULT_WELCOME_SESSION.id || seenIds.has(s.id)) continue;
              const titleKey = `${(s.title || '').trim().toLowerCase()}_${(s.destination || '').trim().toLowerCase()}`;
              if (s.title !== 'New Trip Conversation' && seenTitles.has(titleKey)) continue;
              seenIds.add(s.id);
              seenTitles.add(titleKey);
              merged.unshift(s);
            }

            return merged.length > 0 ? merged : [DEFAULT_WELCOME_SESSION];
          });
          setActiveSessionId(prevActive => {
            if (prevActive && prevActive !== DEFAULT_WELCOME_SESSION.id) return prevActive;
            return dbSessions[0].id;
          });
        } else {
          // If no sessions yet in DB for this user, seed default welcome
          setSessions(prev => (prev.length > 0 ? prev : [DEFAULT_WELCOME_SESSION]));
        }
      })
      .catch(err => {
        if (!isSubscribed) return;
        console.warn('Could not load sessions from DB:', err);
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingSessions(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [currentUser?.id]);

  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || sessions[0] || DEFAULT_WELCOME_SESSION;
  }, [sessions, activeSessionId]);

  // Dedicated Floating Trip Card active data (middle of the page on right side, persists across both questionnaire and proposal phases)
  const activeQuestionnaireMsg = useMemo(() => {
    // 1. Look for unsubmitted questionnaire in current session
    const unsubmitted = activeSession?.messages?.find(
      m => m.questionnaire && !m.questionnaire.isSubmitted
    );
    if (unsubmitted) return unsubmitted;

    // 2. Or the latest questionnaire in this session (even if submitted or proposal is active)
    const latestQ = activeSession?.messages?.slice().reverse().find(m => m.questionnaire);
    if (latestQ && latestQ.questionnaire) {
      return latestQ;
    }

    // 3. Or if there's a proposal message without questionnaire, synthesize questionnaire-compatible data for the TripSummaryCard
    const proposalMsg = activeSession?.messages?.slice().reverse().find(m => m.proposal);
    if (proposalMsg && proposalMsg.proposal) {
      const p = proposalMsg.proposal;
      const originAirport = p.flights?.[0]?.origin || p.flights?.[0]?.originCode || 'Mumbai (BOM)';
      const highlights = (p.extraActivities || []).map((a: AIActivityOption) => a.title).slice(0, 3);
      return {
        ...proposalMsg,
        questionnaire: {
          id: 'proposal-summary',
          destination: p.destination || activeSession.destination || 'Destination',
          days: p.days || 7,
          travelers: p.travelers || 2,
          questions: [],
          answers: {
            travel_party_pace: p.travelers === 1 ? 'solo_explorer' : p.travelers >= 4 ? 'family_balanced' : 'couple_relaxed',
            budget_tier: {
              selectedTier: 'premium',
              targetAmount: p.basePriceUSD,
            },
            departure_city: originAirport,
            must_do_highlights: highlights,
          },
          customTexts: {},
          isSubmitted: true,
        },
      };
    }

    return null;
  }, [activeSession]);

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
      if (handledInitialPromptRef.current === promptText) return;
      handledInitialPromptRef.current = promptText;

      // Check destination validity
      const validDest = findValidDestination(promptText);
      if (!validDest) {
        setInvalidModal({
          isOpen: true,
          rawInput: promptText,
          message: `We couldn't identify a valid travel destination for "${promptText}". Please specify a city or region (e.g. Tokyo, Dubai, Paris, Kerala, New Delhi) to plan without guessing.`,
        });
        if (onClearInitialPrompt) onClearInitialPrompt();
        return;
      }

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
        title: `${validDest.name} Journey`,
        destination: validDest.name,
        updatedAt: 'Just now',
        messages: [userMsg],
      };

      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
      setInputMessage('');
      persistSessionToDb(newSession);

      if (onClearInitialPrompt) onClearInitialPrompt();

      setIsTyping(true);
      setLoadingType('questionnaire');

      TripFlowApi.getAssistantClarification(promptText).then(clarifyData => {
        setIsTyping(false);
        setLoadingType(null);

        const questionnaire = buildDefaultQuestionnaire(
          clarifyData,
          validDest.name,
          clarifyData?.days || details.days,
          clarifyData?.travelers || details.travelers,
          details.originCity || 'Mumbai (BOM)'
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
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
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

    // STRICT DESTINATION VALIDATION (No guessing game)
    const validDest = findValidDestination(textToSend);
    if (!validDest) {
      // Trigger real-time popup modal
      setInvalidModal({
        isOpen: true,
        rawInput: textToSend,
        message: `We couldn't identify a valid travel destination for "${textToSend}". Please specify a city or region you want to visit so our AI can plan without guessing.`,
      });

      // Also append clarification bubble directly into active chat
      const userMsg: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: textToSend,
      };

      const asstClarifyMsg: ChatMessage = {
        id: `msg-asst-clarify-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `I noticed you mentioned **"${textToSend}"**, but I couldn't identify a real travel destination city. Could you please specify which city or country you would like to explore? (e.g. *Tokyo*, *Paris*, *Dubai*, *Kerala*, *New Delhi*, *Turkey*)`,
        quickReplies: [
          '5 days in Tokyo & Kyoto',
          '7 days in Turkey with Cappadocia',
          '5 days in Dubai luxury',
          '6 days in Kerala backwaters',
          '4 days in New Delhi heritage',
        ],
      };

      const updated = [...(activeSession?.messages || []), userMsg, asstClarifyMsg];
      updateCurrentSessionMessages(updated);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    const updatedMessages = [...(activeSession?.messages || []), userMsg];
    updateCurrentSessionMessages(updatedMessages);

    setIsTyping(true);
    setLoadingType('questionnaire');

    const details = parseInitialPrompt(textToSend);
    const clarifyData = await TripFlowApi.getAssistantClarification(textToSend);

    setIsTyping(false);
    setLoadingType(null);

    const questionnaire = buildDefaultQuestionnaire(
      clarifyData,
      validDest.name,
      clarifyData?.days || details.days,
      clarifyData?.travelers || details.travelers,
      details.originCity || 'Mumbai (BOM)'
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
  // Update Questionnaire answers
  const handleAnswerChange = (msgId: string, questionId: string, val: any) => {
    setSessions(prev =>
      prev.map(s => {
        const hasMsg = s.messages?.some(m => m.id === msgId);
        if (!hasMsg && s.id !== activeSessionId) return s;

        const updated: ChatSession = {
          ...s,
          messages: s.messages.map(m => {
            const isMatch = m.id === msgId || (!hasMsg && !!m.questionnaire);
            if (isMatch && m.questionnaire) {
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
      })
    );
  };

  // Update Questionnaire custom text
  const handleCustomTextChange = (msgId: string, questionId: string, text: string) => {
    setSessions(prev =>
      prev.map(s => {
        const hasMsg = s.messages?.some(m => m.id === msgId);
        if (!hasMsg && s.id !== activeSessionId) return s;

        const updated: ChatSession = {
          ...s,
          messages: s.messages.map(m => {
            const isMatch = m.id === msgId || (!hasMsg && !!m.questionnaire);
            if (isMatch && m.questionnaire) {
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
        persistSessionToDb(updated);
        return updated;
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

    // 2. Extract exact days and guests answered by the user (ZERO GUESSWORK)
    const rawDaysAns = questionnaire.answers['trip_duration'] || questionnaire.customTexts['trip_duration'];
    const resolvedDays = typeof rawDaysAns === 'number'
      ? rawDaysAns
      : typeof rawDaysAns === 'string' && parseInt(rawDaysAns, 10) > 0
      ? parseInt(rawDaysAns, 10)
      : questionnaire.days;

    const rawGuestsAns = questionnaire.answers['guests_count'] || questionnaire.customTexts['guests_count'];
    const resolvedTravelers = typeof rawGuestsAns === 'number'
      ? rawGuestsAns
      : typeof rawGuestsAns === 'string' && parseInt(rawGuestsAns, 10) > 0
      ? parseInt(rawGuestsAns, 10)
      : questionnaire.travelers;

    // Extract budget
    let targetBudget = Math.round(resolvedDays * 28000 * resolvedTravelers);
    const budgetAns = questionnaire.answers['budget_tier'];
    if (budgetAns && typeof budgetAns === 'object' && budgetAns.targetAmount) {
      targetBudget = budgetAns.targetAmount;
    } else if (typeof budgetAns === 'number') {
      targetBudget = budgetAns;
    }

    setIsTyping(true);
    setLoadingType('proposal');

    const promptText = activeSession.messages.find(m => m.sender === 'user')?.text || `Trip to ${questionnaire.destination}`;

    const departureCityAnswer = questionnaire.answers['departure_city'] || questionnaire.customTexts['departure_city'] || 'Mumbai (BOM)';

    const proposalRes = await TripFlowApi.generateAssistantProposal({
      prompt: promptText,
      destination: questionnaire.destination,
      originCity: departureCityAnswer,
      days: resolvedDays,
      travelers: resolvedTravelers,
      answers: questionnaire.answers,
      targetBudgetUSD: targetBudget,
    });

    setIsTyping(false);
    setLoadingType(null);

    const partyAnswer = questionnaire.answers['travel_party_pace'] || 'couple_relaxed';
    const travelStyle: AITripDetails['travelStyle'] = partyAnswer === 'friends_active'
      ? 'Balanced Comfort'
      : partyAnswer === 'solo_explorer'
      ? 'Boutique Heritage'
      : 'Luxury Concierge';

    const proposal: AIGeneratedProposal = proposalRes || generateProposalFromDetails({
      destination: questionnaire.destination,
      originCity: departureCityAnswer,
      country: questionnaire.destination,
      days: resolvedDays,
      travelers: resolvedTravelers,
      startDate: '2025-10-15',
      travelStyle,
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
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const deduped: ChatSession[] = [];

    for (const session of sessions) {
      if (!session || !session.id || seenIds.has(session.id)) continue;
      seenIds.add(session.id);

      const titleKey = `${(session.title || '').trim().toLowerCase()}_${(session.destination || '').trim().toLowerCase()}`;
      if (session.title !== 'New Trip Conversation' && seenTitles.has(titleKey)) {
        continue;
      }
      seenTitles.add(titleKey);
      deduped.push(session);
    }

    if (!searchHistoryQuery.trim()) return deduped;
    const q = searchHistoryQuery.toLowerCase();
    return deduped.filter(
      s => s.title.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q)
    );
  }, [sessions, searchHistoryQuery]);

  return (
    <div className="flex-1 w-full h-full max-h-full flex bg-[#FAFBFD] text-[#0F172A] overflow-hidden select-none relative">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
        />
      )}

      {/* 1. LEFT SIDEBAR: CHAT SESSIONS */}
      <aside
        className={`${
          isSidebarOpen
            ? 'w-72 max-w-[85vw] translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0'
        } fixed inset-y-0 left-0 z-50 md:static md:z-20 transition-all duration-300 ease-in-out bg-[#F8F9FA] border-r border-slate-200/80 flex flex-col shrink-0 overflow-hidden shadow-2xl md:shadow-none`}
      >
        <div className="p-3.5 border-b border-slate-200/60 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-800 tracking-tight">Journeys</span>

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

          {isLoadingSessions && sessions.length <= 1 ? (
            <ChatSessionListSkeleton count={4} />
          ) : (
            filteredSessions.map(session => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
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
            })
          )}
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
                {activeSession?.title || 'Trip Assistant'}
              </h1>
              <p className="text-[10px] text-slate-400">
                Calibrated living itineraries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 cursor-pointer transition-colors"
            >
              + New Chat
            </button>
          </div>
        </header>

        {/* Content Area: Left Conversation Stream + Right Dedicated Floating Trip Card Section */}
        <div className="flex-1 flex overflow-hidden bg-slate-50/20 relative">
          {/* Left: Scrollable Message Stream with Floating Bottom Input Box */}
          <div className="flex-1 flex flex-col min-w-0 relative h-full">
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 no-scrollbar pb-32 sm:pb-24">
              <div className={`mx-auto space-y-5 transition-all duration-300 ${activeQuestionnaireMsg ? 'max-w-3xl xl:max-w-4xl' : 'max-w-4xl'}`}>
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

                          {/* 1. DYNAMIC STEP-BY-STEP QUESTIONNAIRE FLOW WITH RIGHT TRIP SUMMARY */}
                          {msg.questionnaire && !msg.questionnaire.isSubmitted && (() => {
                            const matched = findValidDestination(msg.questionnaire.destination);
                            return (
                              <InteractiveQuestionnaireCard
                                destination={msg.questionnaire.destination}
                                destinationImage={matched?.heroImage}
                                countryName={matched?.country || activeSession.destination}
                                days={msg.questionnaire.days}
                                travelers={msg.questionnaire.travelers}
                                questions={msg.questionnaire.questions}
                                answers={msg.questionnaire.answers}
                                customTexts={msg.questionnaire.customTexts}
                                onAnswerChange={(qId, val) => handleAnswerChange(msg.id, qId, val)}
                                onCustomTextChange={(qId, txt) => handleCustomTextChange(msg.id, qId, txt)}
                                onSubmit={() => handleQuestionnaireSubmit(msg.id, msg.questionnaire!)}
                                isLoading={isTyping}
                                userName={currentUser?.name || 'Traveler'}
                              />
                            );
                          })()}

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
                  <div className="w-full text-left space-y-4 animate-in fade-in duration-300">
                    {loadingType === 'questionnaire' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 px-1">
                          <span className="material-symbols-outlined text-sm animate-spin">auto_awesome</span>
                          <span>Calibrating custom preferences & itinerary questions...</span>
                        </div>
                        <QuestionnaireSkeleton destination={activeSession?.destination} />
                      </div>
                    ) : loadingType === 'proposal' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 px-1">
                          <span className="material-symbols-outlined text-sm animate-spin">auto_awesome</span>
                          <span>Synthesizing live flight routes, 5★ boutique suites & private chauffeur...</span>
                        </div>
                        <ProposalDeckSkeleton destination={activeSession?.destination} />
                      </div>
                    ) : (
                      <div className="flex gap-3 items-center text-slate-400 text-xs">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                          <span className="material-symbols-outlined text-sm animate-spin">auto_awesome</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                          <span className="text-slate-600 font-medium ml-1">
                            Bookit AI is typing...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Floating Bottom Middle Input Box Without Any Surrounding Text */}
            <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex justify-center px-2.5 sm:px-4 pointer-events-none z-30">
              <div className="w-full max-w-2xl pointer-events-auto rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 shadow-xl hover:shadow-2xl focus-within:shadow-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="relative flex items-center">
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
                    className="w-full pl-3 pr-12 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none max-h-32"
                  />

                  <button
                    type="button"
                    disabled={!inputMessage.trim() || isTyping}
                    onClick={() => handleUserSubmit()}
                    className={`absolute right-1.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      inputMessage.trim() && !isTyping
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dedicated Section of its own for the Floating Trip Card (middle of the page, blending in seamlessly) */}
          {activeQuestionnaireMsg && activeQuestionnaireMsg.questionnaire && (() => {
            const q = activeQuestionnaireMsg.questionnaire;
            const matched = findValidDestination(q.destination);

            // Compute live proposal total if an active proposal exists in the session
            const proposalMsg = activeSession?.messages?.slice().reverse().find(m => m.proposal);
            let liveTotal: number | undefined;
            if (proposalMsg && proposalMsg.proposal) {
              const p = proposalMsg.proposal;
              const activeFlt = p.flights?.find(f => f.id === (proposalMsg.selectedFlightId || p.selectedFlightId)) || p.flights?.[0];
              const activeHt = p.hotels?.find(h => h.id === (proposalMsg.selectedHotelId || p.selectedHotelId)) || p.hotels?.[0];
              const activeTr = p.transfers?.find(t => t.id === (proposalMsg.selectedTransferId || p.selectedTransferId)) || p.transfers?.[0];
              const nights = Math.max(1, p.days - 1);
              const fltTotal = (activeFlt?.priceUSD || 0) * p.travelers;
              const htTotal = (activeHt?.pricePerNightUSD || 0) * nights;
              const trDelta = activeTr?.priceDeltaUSD || 0;
              const baseAct = 3500 * p.days;
              const extraAct = (p.extraActivities || [])
                .filter(act => (proposalMsg.selectedActivityIds || []).includes(act.id))
                .reduce((s, a) => s + a.price, 0);
              liveTotal = fltTotal + htTotal + trDelta + baseAct + extraAct;
            }

            return (
              <aside
                aria-label="Trip Summary Section"
                className="hidden lg:flex flex-col justify-center items-center w-84 xl:w-96 shrink-0 p-4 xl:p-6 bg-transparent overflow-y-auto no-scrollbar"
              >
                <div className="w-full my-auto animate-in fade-in duration-300">
                  <TripSummaryCard
                    destination={q.destination}
                    destinationImage={matched?.heroImage}
                    countryName={matched?.country || activeSession.destination}
                    days={q.days}
                    travelers={q.travelers}
                    answers={q.answers}
                    customTexts={q.customTexts}
                    questions={q.questions}
                    liveProposalTotal={liveTotal}
                  />
                </div>
              </aside>
            );
          })()}
        </div>


      </main>

      {/* ============================================================= */}
      {/* REAL-TIME INVALID DESTINATION ALERT POPUP MODAL               */}
      {/* ============================================================= */}
      {invalidModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top decorative amber badge */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="material-symbols-outlined text-3xl">wrong_location</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
              Destination Unrecognized
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              {invalidModal.message}
            </p>

            {/* Quick suggested destinations list */}
            <div className="text-left bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Select a valid destination to plan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Tokyo', flag: '🇯🇵' },
                  { name: 'Turkey', flag: '🇹🇷' },
                  { name: 'Dubai', flag: '🇦🇪' },
                  { name: 'Paris', flag: '🇫🇷' },
                  { name: 'Kerala', flag: '🌴' },
                  { name: 'Rajasthan', flag: '🏰' },
                  { name: 'Goa', flag: '🏖️' },
                  { name: 'New Delhi', flag: '🇮🇳' },
                  { name: 'Swiss Alps', flag: '🇨🇭' },
                ].map((dest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const newPrompt = `5 days in ${dest.name} with curated stays and dining`;
                      setInvalidModal({ isOpen: false, rawInput: '', message: '' });
                      handleUserSubmit(newPrompt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <span>{dest.flag}</span>
                    <span>{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setInvalidModal({ isOpen: false, rawInput: '', message: '' });
                  textareaRef.current?.focus();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              >
                Enter Another Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
