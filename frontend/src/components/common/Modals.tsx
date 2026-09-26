import React, { useState } from 'react';
import { SavedJourney } from '../../types/travel';
import { CONCIERGE_AVATAR } from '../../data/mockData';

// 1. WhatsApp Chat Modal with Concierge Arun V.
interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'arun',
      text: 'Good morning Sarah! This is Arun, your concierge lead for Kerala. I am tracking your schedule closely today. How can I assist you?',
      time: '10:15 AM',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { sender: 'sarah', text: input, time: 'Now' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'arun',
          text: 'Understood, Sarah. Rest assured our private EV sedan is on standby and our dispatch desk has everything synchronized!',
          time: 'Now',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={CONCIERGE_AVATAR}
                alt="Arun V"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"></span>
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight">Arun V.</h4>
              <p className="text-[11px] text-white/80">
                TripFlow Senior Concierge · Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 bg-[#EFEAE2] overflow-y-auto space-y-3 custom-scrollbar text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'sarah' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-2.5 rounded-xl shadow-2xs leading-relaxed ${
                  m.sender === 'sarah'
                    ? 'bg-[#DCF8C6] text-[#111827] rounded-tr-none'
                    : 'bg-white text-[#111827] rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[10px] text-[#737686] block text-right mt-1">
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={sendMessage}
          className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message to Arun..."
            className="flex-1 bg-[#F0F3FF] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. Journey Details Modal
interface JourneyDetailsModalProps {
  journey: SavedJourney | null;
  onClose: () => void;
  onBookNow: (journey: SavedJourney) => void;
  onReserveTour?: (journey: SavedJourney) => void;
}

export const JourneyDetailsModal: React.FC<JourneyDetailsModalProps> = ({
  journey,
  onClose,
  onBookNow,
  onReserveTour,
}) => {
  if (!journey) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Outer Bezel (Exact same design language as LuxuryCard, zero drop shadow) */}
      <div
        onClick={e => e.stopPropagation()}
        className="bg-[#1e242b] p-1.5 sm:p-2 rounded-[28px] sm:rounded-[32px] max-w-lg w-full border border-black/40 shadow-none animate-in zoom-in-95 duration-200 text-left"
      >
        {/* Inner Framed Container */}
        <div className="relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#222830] flex flex-col max-h-[88vh] overflow-y-auto custom-scrollbar">
          {/* Top Hero Image Header */}
          <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden">
            <img
              src={journey.image}
              alt={journey.title}
              className="w-full h-full object-cover"
            />

            {/* Progressive Blur & Gradient: Starts at bottom, ends halfway up the header */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none backdrop-blur-md"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, #1e242b 0%, rgba(30,36,43,0.96) 22%, rgba(30,36,43,0.82) 46%, rgba(30,36,43,0.45) 72%, rgba(30,36,43,0.12) 88%, transparent 100%)',
              }}
            />

            {/* Top Floating Controls */}
            <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between z-10">
              <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                <span
                  className="material-symbols-outlined text-white text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>{journey.rating || '4.9/5'}</span>
                <span className="text-white/60 text-[10px] ml-0.5 font-normal">· Verified</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-7.5 h-7.5 rounded-full bg-black/45 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Floating Title & Route over Progressive Fade */}
            <div className="absolute bottom-2.5 left-3.5 right-3.5 z-10 space-y-0.5">
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300">
                <span className="material-symbols-outlined text-[13px]">location_on</span>
                <span>{journey.origin} → {journey.destination} · {journey.duration}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {journey.title}
              </h2>
            </div>
          </div>

          {/* Details Body - NO horizontal line separators anywhere */}
          <div className="p-3.5 sm:p-4 space-y-3.5 text-left">
            <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-normal">
              {journey.description}
            </p>

            {/* 3x2 Amenity Pills matching Card */}
            {journey.amenities && journey.amenities.length > 0 && (
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                {journey.amenities.slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-full px-2 py-1 bg-white/10 text-white/90 text-[10px] font-medium flex items-center justify-center gap-1 border border-white/10 whitespace-nowrap overflow-hidden"
                  >
                    <span className="material-symbols-outlined text-[11px] text-white/80 shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Curated Travel Specifications */}
            <div className="space-y-1.5 pt-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Curated Travel Specifications
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5 shrink-0">
                    flight_takeoff
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white">Commercial Aviation Telemetry</div>
                    <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                      Live schedule tracking & auto-delay reconciliation with assigned driver.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5 shrink-0">
                    hotel
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white">Boutique Luxury Stays</div>
                    <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                      Pre-verified premium properties with guaranteed breakfast included.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-sm mt-0.5 shrink-0">
                    directions_car
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white">Chauffeur & Fleet Dispatch</div>
                    <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                      Dedicated SUV/EV transfers with real-time GPS monitoring & luggage care.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-sm mt-0.5 shrink-0">
                    support_agent
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white">24/7 Operations Concierge</div>
                    <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                      Assigned specialist Arun V. on priority hotline & WhatsApp dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day-by-Day Itinerary Highlights Preview */}
            <div className="space-y-1.5 pt-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Synchronized Itinerary Overview
              </div>
              <div className="space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                  <span>Day 1 — Private Arrival & Check-In</span>
                  <span className="text-[10px] text-blue-300 font-normal">Chauffeur Ready</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                  <span>Day 2 — Curated Guided Circuit & Experiences</span>
                  <span className="text-[10px] text-emerald-300 font-normal">VIP Pass</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                  <span>Day 3 — Culinary Tasting & Sunset Cruise</span>
                  <span className="text-[10px] text-amber-300 font-normal">Included</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                  <span>Day 4–6 — Wellness Retreat & Return Transfer</span>
                  <span className="text-[10px] text-purple-300 font-normal">Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Price & Actions (NO horizontal line separator) */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {journey.price}
                  </span>
                  <span className="text-[10px] text-white/60 ml-1">/night</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  All taxes, permits & chauffeur included
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onBookNow(journey);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Explore Timeline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onReserveTour) {
                      onReserveTour(journey);
                    } else {
                      onBookNow(journey);
                    }
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-blue-600/30"
                >
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  <span>Confirm & Reserve Tour</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Preferences Modal
interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-5 text-left animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC6]">tune</span>
            <h3 className="font-bold text-sm text-[#111827]">
              Traveler Concierge Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#737686] hover:text-[#111827] p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-semibold uppercase text-[#737686] block mb-1">
              Dietary Requirements
            </label>
            <select className="w-full p-2 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#111827]">
              <option>Vegetarian (Strict)</option>
              <option>Vegan</option>
              <option>Pescatarian</option>
              <option>No Restrictions</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-[#737686] block mb-1">
              Transfer Vehicle Preference
            </label>
            <select className="w-full p-2 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#111827]">
              <option>Electric Vehicle (Tata Nexon / Ioniq 5)</option>
              <option>Premium SUV (Innova Crysta)</option>
              <option>Luxury Sedan (BMW 3 Series / Mercedes)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-[#737686] block mb-1">
              Pacing & Rhythm
            </label>
            <select className="w-full p-2 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#111827]">
              <option>Leisurely & Serene (Max 2 activities/day)</option>
              <option>Balanced Discovery (3 activities/day)</option>
              <option>Fast Exploration</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. New Dispatch Modal for Operator
interface NewDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tourTitle: string) => void;
}

export const NewDispatchModal: React.FC<NewDispatchModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [tourName, setTourName] = useState('');
  const [traveler, setTraveler] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName) return;
    onCreate(tourName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4 text-left animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC6]">add_task</span>
            <h3 className="font-bold text-sm text-[#111827]">Create New Dispatch</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#737686] hover:text-[#111827] p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#737686] block mb-1">
              Tour Title & Destination
            </label>
            <input
              type="text"
              required
              value={tourName}
              onChange={e => setTourName(e.target.value)}
              placeholder="e.g. Tour #1105 — Ladakh High Pass Adventure"
              className="w-full p-2 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#737686] block mb-1">
              Lead Traveler & Contact
            </label>
            <input
              type="text"
              value={traveler}
              onChange={e => setTraveler(e.target.value)}
              placeholder="e.g. Vikram Malhotra (+91 98200 44102)"
              className="w-full p-2 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E7EB] rounded-full text-xs font-semibold text-[#575E70] hover:bg-[#F9FAFB] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              Create Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
