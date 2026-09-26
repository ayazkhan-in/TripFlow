import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ConsumerTab } from '../../types/travel';
import { TripItinerary } from '../../types/itinerary';
import {
  parseInitialPrompt,
  generateProposalFromDetails,
  compileFinalItinerary,
  AITripDetails,
  AIGeneratedProposal,
  AIFlightOption,
  AIHotelOption,
  AITransferOption,
  AIActivityOption,
} from '../../utils/aiTripPlanner';
import { addCustomCatalogItems } from '../../data/itineraryData';
import { USER_AVATAR } from '../../data/mockData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  proposal?: AIGeneratedProposal;
  quickReplies?: string[];
  selectedFlightId?: string;
  selectedHotelId?: string;
  selectedTransferId?: string;
  selectedActivityIds?: string[];
  activeDrawer?: 'none' | 'flight' | 'hotel';
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
}

const TYPEWRITER_PHRASES = [
  '5 days luxury getaway to Tokyo with temples and omakase...',
  'Romantic 6-day honeymoon in Kerala with private houseboat...',
  '7 days royal Rajasthan palaces with private chauffeur...',
  'Catamaran charter & coastal boutique villas in Goa...',
  'Swiss Alps Glacier Express & luxury chalet in Zermatt...',
];

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-tokyo-1',
    title: 'Tokyo & Hakone Cultural Escape',
    destination: 'Tokyo',
    updatedAt: 'Just now',
    messages: [
      {
        id: 'msg-init-1',
        sender: 'user',
        timestamp: '10:15 AM',
        text: 'I want to plan a 5-day luxury trip to Tokyo and Hakone with fine dining and onsen.',
      },
      {
        id: 'msg-init-2',
        sender: 'assistant',
        timestamp: '10:16 AM',
        text: `I'd love to curate this **Tokyo & Hakone** journey for you! To tailor every detail, could you let me know:

1. **Duration & Dates:** 5 Days (or custom dates)?
2. **Travel Party:** Solo, Couple, or Family?
3. **Accommodation Style:** **Ultra Luxury 5-Star** (Aman / Palace) vs **Boutique Ryokan**?
4. **Must-Experience Priorities:** Michelin dining, ancient temples, onsen wellness, or modern city?`,
        quickReplies: ['5 Days', 'Couple / 2 Pax', 'Ultra Luxury 5-Star', 'Michelin Dining & Temples', '✨ Generate with these options'],
      },
    ],
  },
  {
    id: 'session-kerala-2',
    title: 'Kerala Backwaters & Tea Trails',
    destination: 'Kerala',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 'msg-kl-1',
        sender: 'user',
        timestamp: 'Yesterday',
        text: 'Plan a relaxing 6-day monsoon trip to Kerala with private chauffeur and tea plantations.',
      },
      {
        id: 'msg-kl-2',
        sender: 'assistant',
        timestamp: 'Yesterday',
        text: `Kerala is magical during the monsoon! Here is what we can organize:
- **Private Chauffeur**: Luxury Toyota Vellfire covering Kochi, Munnar, and Alleppey.
- **Houseboat**: Presidential glass-roofed private cruise on the Vembanad Lake.
- **Tea Plantations**: Private bungalows with high-tea at Windermere Estate.

Would you like me to generate your full itinerary?`,
        quickReplies: ['✨ Generate Itinerary', 'Add 1 Extra Day', 'Ayurveda Spa Focus'],
      }
    ],
  },
  {
    id: 'session-swiss-3',
    title: 'Swiss Alps Glacier Express',
    destination: 'Swiss Alps',
    updatedAt: '3 days ago',
    messages: [
      {
        id: 'msg-sw-1',
        sender: 'user',
        timestamp: '3 days ago',
        text: 'Scenic rail journeys and 5-star mountain hotels in Switzerland.',
      },
      {
        id: 'msg-sw-2',
        sender: 'assistant',
        timestamp: '3 days ago',
        text: `Switzerland by train is unforgettable! We can arrange the **Glacier Express Excellence Class** connecting Zermatt to St. Moritz, paired with stays at **The Chedi Andermatt** and **Badrutt's Palace**.`,
        quickReplies: ['6 Days Itinerary', 'Add Jungfraujoch Day Pass', 'Budget Saver Flights'],
      }
    ],
  },
];

/**
 * Clean & Lightweight Markdown Renderer
 * Parses bold, italic, code, headings, bullet lists, numbered lists, blockquotes, and paragraphs.
 */
export const MarkdownText: React.FC<{ content: string; className?: string }> = ({
  content,
  className = '',
}) => {
  // Parse inline text: **bold**, *italic*, `code`
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

  // Block-level parsing
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

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${keyCounter++}`} className="text-sm font-bold text-slate-900 mt-3 mb-1">
          {renderInline(trimmed.replace('### ', ''))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${keyCounter++}`} className="text-base font-bold text-slate-900 mt-3.5 mb-1.5">
          {renderInline(trimmed.replace('## ', ''))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${keyCounter++}`} className="text-lg font-bold text-slate-900 mt-4 mb-2">
          {renderInline(trimmed.replace('# ', ''))}
        </h1>
      );
      return;
    }

    // Unordered List: - or * or •
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      const rawText = trimmed.replace(/^[-*•]\s+/, '');
      currentList.items.push(renderInline(rawText));
      return;
    }

    // Numbered List: 1. , 2. , etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(renderInline(numMatch[2]));
      return;
    }

    // Blockquote: >
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${keyCounter++}`}
          className="border-l-2 border-slate-300 pl-3 my-2 text-slate-600 italic text-sm"
        >
          {renderInline(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      );
      return;
    }

    // Regular paragraph line
    flushList();
    elements.push(
      <p key={`p-${keyCounter++}`} className="leading-relaxed mb-2 last:mb-0 text-slate-800 text-sm">
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return <div className={`text-slate-800 leading-relaxed text-sm ${className}`}>{elements}</div>;
};

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  onNavigateTab,
  onOpenItineraryInBuilder,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  // Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('tripflow_assistant_chats_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved sessions:', e);
    }
    return INITIAL_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-tokyo-1';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');

  // Input Box State
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typewriterIndex, setTypewriterIndex] = useState<number>(0);
  const [typewriterText, setTypewriterText] = useState<string>('...');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active session
  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem('tripflow_assistant_chats_v2', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Error saving sessions:', e);
    }
  }, [sessions]);

  // Scroll to bottom on messages update
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

  // Handle incoming initialPrompt from Discover
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const promptText = initialPrompt.trim();
      const details = parseInitialPrompt(promptText);

      // Create a dedicated fresh session for this inquiry
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

      if (onClearInitialPrompt) onClearInitialPrompt();

      // Trigger AI reasoning and text questions in markdown
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const assistantQuestionMsg: ChatMessage = {
          id: `msg-asst-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `I'd love to curate a bespoke journey to **${details.destination}, ${details.country}** for you!

To tailor every detail to your exact expectations, could you clarify a few details:

1. **Duration & Dates:** How many days are you planning (e.g. **${details.days} Days**)?
2. **Travel Party:** Who is joining you (**${details.travelers} Guests** — Solo, Couple, or Family)?
3. **Accommodation Style:** **Ultra Luxury 5-Star** (Aman / Palace) vs **Boutique Heritage Villa** vs **Balanced Comfort**?
4. **Curated Priorities:** Any must-experience highlights (**${details.interests.join(', ')}**)?`,
          quickReplies: [
            `${details.days} Days`,
            details.travelers === 2 ? 'Couple / 2 Pax' : `${details.travelers} Travelers`,
            details.travelStyle,
            'Gourmet Dining & Culture',
            '✨ Generate Itinerary with these options',
          ],
        };

        setSessions(prev =>
          prev.map(s => {
            if (s.id === newSessionId) {
              return {
                ...s,
                messages: [userMsg, assistantQuestionMsg],
              };
            }
            return s;
          })
        );
      }, 700);
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
          text: `Hello Sarah! I am your **TripFlow AI Travel Assistant**. 

Where would you like to travel next? Tell me your dream destination, travel dates, or who is joining you, and I will craft an end-to-end living itinerary with flight, hotel, and private chauffeur options.`,
          quickReplies: [
            '5 days luxury getaway to Tokyo',
            '6 days Kerala backwaters & tea trails',
            '7 days Rajasthan royal palaces',
            'Weekend catamaran in Goa',
          ],
        },
      ],
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInputMessage('');
  };

  // Delete chat session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  // User sends a message
  const handleUserSubmit = (userText?: string) => {
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

    setTimeout(() => {
      setIsTyping(false);
      processAIResponse(textToSend, updatedMessages);
    }, 750);
  };

  // Helper to update current session messages
  const updateCurrentSessionMessages = (msgs: ChatMessage[], newTitle?: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: newTitle || s.title,
            updatedAt: 'Just now',
            messages: msgs,
          };
        }
        return s;
      })
    );
  };

  // Process AI reasoning & reply in markdown text format
  const processAIResponse = (userText: string, currentHistory: ChatMessage[]) => {
    const lower = userText.toLowerCase();

    const isDirectGenerate =
      lower.includes('generate') ||
      lower.includes('options') ||
      lower.includes('proceed') ||
      lower.includes('build it') ||
      lower.includes('ready');

    const details = parseInitialPrompt(userText);

    const hasAskedQuestions = currentHistory.some(
      m => m.sender === 'assistant' && (m.text.includes('To tailor every detail') || m.text.includes('could you let me know'))
    );

    if (!hasAskedQuestions && !isDirectGenerate) {
      // 1. ASK QUESTIONS IN TEXT FORMAT (No overlay!)
      const assistantQuestionMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `I'd love to curate a bespoke journey to **${details.destination}, ${details.country}** for you!

To tailor every detail to your exact expectations, could you clarify a few details:

1. **Duration & Dates:** How many days are you planning (e.g. **${details.days} Days**)?
2. **Travel Party:** Who is joining you (**${details.travelers} Guests** — Solo, Couple, or Family)?
3. **Accommodation Style:** **Ultra Luxury 5-Star** (Aman / Palace) vs **Boutique Heritage Villa** vs **Balanced Comfort**?
4. **Curated Priorities:** Any must-experience highlights (**${details.interests.join(', ')}**)?`,
        quickReplies: [
          `${details.days} Days`,
          details.travelers === 2 ? 'Couple / 2 Pax' : `${details.travelers} Travelers`,
          details.travelStyle,
          'Gourmet Dining & Culture',
          '✨ Generate Itinerary with these options',
        ],
      };

      updateCurrentSessionMessages(
        [...currentHistory, assistantQuestionMsg],
        `${details.destination} Bespoke Journey`
      );
    } else {
      // 2. GENERATE FULL ITINERARY WITH FLIGHT / HOTEL ALTERNATIVES
      const proposal = generateProposalFromDetails(details);

      const assistantProposalMsg: ChatMessage = {
        id: `msg-asst-prop-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `✨ **Here is your customized living itinerary for ${proposal.title}!**

I have orchestrated a complete living itinerary with handpicked flights, luxury accommodations, and a dedicated executive chauffeur.

- **Destination**: ${proposal.destination}, ${proposal.country}
- **Duration**: ${proposal.days} Days (${Math.max(1, proposal.days - 1)} Nights)
- **Travelers**: ${proposal.travelers} Guests
- **Package Base**: $${proposal.basePriceUSD.toLocaleString()} USD

You can personalize flight alternatives, switch hotels, or add curated activities below before opening in the **Itinerary Builder**.`,
        proposal,
        selectedFlightId: proposal.selectedFlightId,
        selectedHotelId: proposal.selectedHotelId,
        selectedTransferId: proposal.selectedTransferId,
        selectedActivityIds: [],
        activeDrawer: 'none',
      };

      updateCurrentSessionMessages(
        [...currentHistory, assistantProposalMsg],
        proposal.title
      );
    }
  };

  // Modify proposal inside a message
  const handleUpdateMessageProposal = (
    messageId: string,
    updates: Partial<ChatMessage>
  ) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === messageId) {
                return { ...m, ...updates };
              }
              return m;
            }),
          };
        }
        return s;
      })
    );
  };

  // Confirm proposal and launch in Itinerary Builder
  const handleConfirmAndLaunchBuilder = (msg: ChatMessage) => {
    if (!msg.proposal) return;

    const chosenFlightId = msg.selectedFlightId || msg.proposal.selectedFlightId;
    const chosenHotelId = msg.selectedHotelId || msg.proposal.selectedHotelId;
    const chosenTransferId = msg.selectedTransferId || msg.proposal.selectedTransferId;
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

  // Filter sessions by search
  const filteredSessions = useMemo(() => {
    if (!searchHistoryQuery.trim()) return sessions;
    const q = searchHistoryQuery.toLowerCase();
    return sessions.filter(
      s => s.title.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q)
    );
  }, [sessions, searchHistoryQuery]);

  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex bg-[#FAFBFD] text-[#0F172A] overflow-hidden select-none">
      {/* ============================================================= */}
      {/* 1. LEFT SIDEBAR: CHAT HISTORY (CLEAN & MINIMAL)               */}
      {/* ============================================================= */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64 sm:w-72' : 'w-0'
        } transition-all duration-300 ease-in-out bg-[#F8F9FA] border-r border-slate-200/80 flex flex-col shrink-0 overflow-hidden z-20`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-200/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </span>
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">AI Concierge</h2>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
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

        {/* New Chat Button */}
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

          {/* Search Box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-xs">
              search
            </span>
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={e => setSearchHistoryQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-slate-200/80 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors"
            />
          </div>
        </div>

        {/* Chat History List */}
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
                    ? 'bg-slate-200/70 text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    className={`material-symbols-outlined text-xs shrink-0 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    chat_bubble_outline
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs truncate">{session.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {session.destination} · {session.updatedAt}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={e => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded transition-opacity cursor-pointer"
                  title="Delete chat"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* User Status Bar */}
        <div className="p-3 border-t border-slate-200/60 bg-white/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={USER_AVATAR}
              alt="Sarah Mehta"
              className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-800 truncate">Sarah Mehta</div>
              <div className="text-[10px] text-slate-400 truncate">Concierge Elite</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded">
            VIP
          </span>
        </div>
      </aside>

      {/* ============================================================= */}
      {/* 2. MAIN CHAT AREA (CLEAN, MINIMAL, SPACIOUS)                  */}
      {/* ============================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-[#FAFBFD]">
        {/* Chat Top Bar */}
        <header className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Open chats sidebar"
              >
                <span className="material-symbols-outlined text-lg">dock_to_right</span>
              </button>
            )}

            <div className="min-w-0 flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                {activeSession?.title || 'TripFlow AI Travel Assistant'}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                TripFlow 2.5
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('discover')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              <span>Packages</span>
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 cursor-pointer transition-colors"
            >
              + New Chat
            </button>
          </div>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            {activeSession?.messages?.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Assistant Avatar */}
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end max-w-[85%] sm:max-w-[75%]' : 'items-start flex-1 min-w-0'
                  }`}
                >
                  {/* User Bubble */}
                  {msg.sender === 'user' ? (
                    <div className="p-3.5 rounded-2xl rounded-tr-xs bg-[#F1F3F6] text-slate-900 text-sm leading-relaxed shadow-2xs">
                      {msg.text}
                    </div>
                  ) : (
                    /* Assistant Output (Pure Clean Markdown Text) */
                    <div className="w-full text-left space-y-2">
                      <MarkdownText content={msg.text} />

                      {/* Quick Reply Pills */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
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

                      {/* Embedded Minimal Proposal Card (Lovable / Artifact Style) */}
                      {msg.proposal && (
                        <div className="w-full mt-4 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 text-left animate-in fade-in duration-150">
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ✨ Bespoke Plan
                                </span>
                                <span className="text-xs text-slate-500">
                                  {msg.proposal.days} Days · {msg.proposal.travelers} Guests
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-slate-900 mt-1">
                                {msg.proposal.title}
                              </h4>
                            </div>

                            {/* Live Calculated Price */}
                            <div className="sm:text-right">
                              <div className="text-sm font-black text-slate-900">
                                ${(
                                  (msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.priceUSD || 0) * msg.proposal.travelers +
                                  (msg.proposal.hotels.find(h => h.id === (msg.selectedHotelId || msg.proposal?.selectedHotelId))?.pricePerNightUSD || 0) * Math.max(1, msg.proposal.days - 1) +
                                  180 * msg.proposal.days +
                                  (msg.selectedActivityIds || []).length * 80
                                ).toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-400">Total estimated package</div>
                            </div>
                          </div>

                          {/* Flight Option & Switcher */}
                          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-semibold text-slate-900">
                                <span className="material-symbols-outlined text-sm text-blue-600">
                                  flight
                                </span>
                                <span>
                                  Flight: {msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.airline} (
                                  {msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.flightNumber})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMessageProposal(msg.id, {
                                    activeDrawer: msg.activeDrawer === 'flight' ? 'none' : 'flight',
                                  })
                                }
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                              >
                                <span>
                                  {msg.activeDrawer === 'flight' ? 'Hide Options' : '⇄ Switch Flight'}
                                </span>
                                <span className="material-symbols-outlined text-xs">
                                  {msg.activeDrawer === 'flight' ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-500">
                              {msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.originCode} ➔{' '}
                              {msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.destCode} ·{' '}
                              {msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.departureTime} –{' '}
                              {msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.arrivalTime} ·{' '}
                              ${msg.proposal.flights.find(f => f.id === (msg.selectedFlightId || msg.proposal?.selectedFlightId))?.priceUSD} / traveler
                            </p>

                            {/* Flight Alternatives Drawer */}
                            {msg.activeDrawer === 'flight' && (
                              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 animate-in fade-in duration-150">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Alternative Flight Options:
                                </div>
                                {msg.proposal.flights.map(flt => {
                                  const isChosen = (msg.selectedFlightId || msg.proposal?.selectedFlightId) === flt.id;
                                  return (
                                    <div
                                      key={flt.id}
                                      onClick={() =>
                                        handleUpdateMessageProposal(msg.id, {
                                          selectedFlightId: flt.id,
                                          activeDrawer: 'none',
                                        })
                                      }
                                      className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                        isChosen
                                          ? 'bg-blue-50 border-blue-500'
                                          : 'bg-white border-slate-200 hover:border-slate-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs ${isChosen ? 'font-bold text-blue-700' : 'text-slate-800'}`}>
                                          {flt.airline} ({flt.cabinClass})
                                        </span>
                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                                          {flt.label}
                                        </span>
                                      </div>
                                      <div className="text-right font-bold text-xs">
                                        ${flt.priceUSD}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Hotel Option & Switcher */}
                          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-semibold text-slate-900">
                                <span className="material-symbols-outlined text-sm text-emerald-600">
                                  hotel
                                </span>
                                <span>
                                  Hotel: {msg.proposal.hotels.find(h => h.id === (msg.selectedHotelId || msg.proposal?.selectedHotelId))?.name} (
                                  {msg.proposal.hotels.find(h => h.id === (msg.selectedHotelId || msg.proposal?.selectedHotelId))?.roomType})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMessageProposal(msg.id, {
                                    activeDrawer: msg.activeDrawer === 'hotel' ? 'none' : 'hotel',
                                  })
                                }
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                              >
                                <span>
                                  {msg.activeDrawer === 'hotel' ? 'Hide Options' : '⇄ Switch Hotel'}
                                </span>
                                <span className="material-symbols-outlined text-xs">
                                  {msg.activeDrawer === 'hotel' ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-500">
                              ⭐ {msg.proposal.hotels.find(h => h.id === (msg.selectedHotelId || msg.proposal?.selectedHotelId))?.rating} ·{' '}
                              {msg.proposal.hotels.find(h => h.id === (msg.selectedHotelId || msg.proposal?.selectedHotelId))?.location} ·{' '}
                              ${msg.proposal.hotels.find(h => h.id === (msg.selectedHotelId || msg.proposal?.selectedHotelId))?.pricePerNightUSD} / night
                            </p>

                            {/* Hotel Alternatives Drawer */}
                            {msg.activeDrawer === 'hotel' && (
                              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 animate-in fade-in duration-150">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Alternative Hotel Accommodations:
                                </div>
                                {msg.proposal.hotels.map(htl => {
                                  const isChosen = (msg.selectedHotelId || msg.proposal?.selectedHotelId) === htl.id;
                                  return (
                                    <div
                                      key={htl.id}
                                      onClick={() =>
                                        handleUpdateMessageProposal(msg.id, {
                                          selectedHotelId: htl.id,
                                          activeDrawer: 'none',
                                        })
                                      }
                                      className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                        isChosen
                                          ? 'bg-emerald-50 border-emerald-500'
                                          : 'bg-white border-slate-200 hover:border-slate-300'
                                      }`}
                                    >
                                      <div>
                                        <div className={`text-xs ${isChosen ? 'font-bold text-emerald-700' : 'text-slate-800'}`}>
                                          {htl.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          {htl.label} · {htl.roomType}
                                        </div>
                                      </div>
                                      <div className="text-right font-bold text-xs">
                                        ${htl.pricePerNightUSD}/night
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Extra Activities Toggles */}
                          {msg.proposal.extraActivities && msg.proposal.extraActivities.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                                <span>✨ Recommended Extra Activities:</span>
                                <span className="text-[10px] text-slate-400">
                                  Picks for Itinerary Builder
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {msg.proposal.extraActivities.slice(0, 4).map(act => {
                                  const isAdded = (msg.selectedActivityIds || []).includes(act.id);
                                  return (
                                    <div
                                      key={act.id}
                                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                                        isAdded
                                          ? 'border-emerald-500 bg-emerald-50/40'
                                          : 'border-slate-200 bg-slate-50/50'
                                      }`}
                                    >
                                      <div className="min-w-0">
                                        <div className="font-semibold text-slate-900 truncate">
                                          {act.title}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          ${act.price} · {act.duration}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = msg.selectedActivityIds || [];
                                          const updated = isAdded
                                            ? current.filter(id => id !== act.id)
                                            : [...current, act.id];
                                          handleUpdateMessageProposal(msg.id, {
                                            selectedActivityIds: updated,
                                          });
                                        }}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer ${
                                          isAdded
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                        }`}
                                      >
                                        {isAdded ? '✓ Added' : '+ Add'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Action Button: Open in Itinerary Builder */}
                          <div className="pt-2 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleConfirmAndLaunchBuilder(msg)}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
                            >
                              <span>Open in Itinerary Builder</span>
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <img
                    src={USER_AVATAR}
                    alt="Sarah"
                    className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200 mt-0.5"
                  />
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                </div>
                <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ============================================================= */}
        {/* 3. LARGE EXPANDING INPUT BOX (MATCHING DISCOVER PAGE)        */}
        {/* ============================================================= */}
        <div className="p-4 sm:p-5 bg-[#FAFBFD] shrink-0">
          <div className="max-w-3xl mx-auto">
            {/* The expanding input box */}
            <div
              className={`relative flex flex-col bg-[#F1F3F6] transition-all duration-300 ${
                inputMessage.trim().length > 0
                  ? 'rounded-2xl p-4 sm:p-4.5 min-h-[105px] focus-within:ring-2 focus-within:ring-slate-300 shadow-inner'
                  : 'rounded-full px-5 sm:px-6 py-3 focus-within:ring-2 focus-within:ring-slate-300'
              }`}
            >
              {inputMessage.trim().length === 0 ? (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUserSubmit();
                      }
                    }}
                    placeholder={`Ask AI Assistant: ${typewriterText}`}
                    className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-normal focus:outline-none pr-3"
                  />
                  <button
                    type="button"
                    onClick={() => handleUserSubmit()}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2F3542] hover:bg-slate-900 active:scale-95 text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer focus:outline-none"
                    title="Send message"
                  >
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleUserSubmit();
                        }
                      }}
                      rows={3}
                      placeholder="Type your message, answers, or trip requests..."
                      className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-normal focus:outline-none resize-none leading-relaxed"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setInputMessage('')}
                      className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1 shrink-0"
                      title="Clear"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>Press</span>
                      <kbd className="font-mono bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-600 border border-slate-200 shadow-2xs font-semibold">
                        Enter ↵
                      </kbd>
                      <span>to send</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUserSubmit()}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                    >
                      <span>Send</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 text-center mt-2">
              TripFlow AI Assistant orchestrates live inventory. Verify key flight and hotel details before booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
