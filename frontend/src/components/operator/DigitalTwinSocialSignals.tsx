import React, { useState } from 'react';
import { SocialSignal } from '../../types/travel';

interface DigitalTwinSocialSignalsProps {
  signals: SocialSignal[];
  dominantSentiment?: string;
  sentimentBreakdown?: {
    positive: number;
    neutral: number;
    concerned: number;
    alarmed: number;
  };
  isLoading?: boolean;
  onSelectSignalLocation?: (coords: [number, number]) => void;
}

export const DigitalTwinSocialSignals: React.FC<DigitalTwinSocialSignalsProps> = ({
  signals,
  dominantSentiment = 'concerned',
  sentimentBreakdown = { positive: 1, neutral: 1, concerned: 3, alarmed: 1 },
  isLoading = false,
  onSelectSignalLocation,
}) => {
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSignals = signals.filter(s => {
    if (filterPlatform !== 'all' && s.platform !== filterPlatform) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.content.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return { label: 'Optimal Vibe', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'neutral':
        return { label: 'Informational', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'concerned':
        return { label: 'Elevated Caution', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'alarmed':
        return { label: 'Hazard Warning', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Normal', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'x':
        return { name: 'X', icon: 'tag', color: 'text-slate-700' };
      case 'instagram':
        return { name: 'Instagram', icon: 'photo_camera', color: 'text-pink-600' };
      case 'reddit':
        return { name: 'Reddit', icon: 'forum', color: 'text-orange-600' };
      case 'concierge_report':
        return { name: 'Fleet GPS', icon: 'directions_car', color: 'text-blue-600' };
      case 'met_dept':
        return { name: 'Met Advisory', icon: 'campaign', color: 'text-amber-600' };
      default:
        return { name: 'Public', icon: 'rss_feed', color: 'text-slate-500' };
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-slate-900 flex flex-col h-full shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">sensors</span>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Social Signals & Pulse Radar
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Crowdsourced traveler reports, traffic police updates & Met bulletins
          </p>
        </div>

        {/* Sentiment Meter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
              getSentimentBadge(dominantSentiment).bg
            }`}
          >
            {getSentimentBadge(dominantSentiment).label}
          </span>
        </div>
      </div>

      {/* Sentiment Spectrum Micro-Bar */}
      <div className="my-3 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Signal Sentiment Distribution</span>
          <span className="font-mono text-slate-400">{signals.length} Signals Verified</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(sentimentBreakdown.positive / (signals.length || 1)) * 100}%` }}
            className="bg-emerald-500 h-full"
            title="Positive"
          />
          <div
            style={{ width: `${(sentimentBreakdown.neutral / (signals.length || 1)) * 100}%` }}
            className="bg-slate-400 h-full"
            title="Neutral"
          />
          <div
            style={{ width: `${(sentimentBreakdown.concerned / (signals.length || 1)) * 100}%` }}
            className="bg-amber-400 h-full"
            title="Concerned"
          />
          <div
            style={{ width: `${(sentimentBreakdown.alarmed / (signals.length || 1)) * 100}%` }}
            className="bg-rose-500 h-full"
            title="Alarmed"
          />
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 p-0.5 rounded-xl text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'x', label: 'X' },
            { id: 'reddit', label: 'Reddit' },
            { id: 'instagram', label: 'Insta' },
            { id: 'concierge_report', label: 'Fleet' },
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setFilterPlatform(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterPlatform === p.id
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <span className="material-symbols-outlined text-[15px] text-slate-400 absolute left-2.5 top-2">
            search
          </span>
          <input
            type="text"
            placeholder="Search keywords, #tags, places..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Signal Cards Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[340px] custom-scrollbar">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Scanning real-time social channels...</span>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No matching signals found.
          </div>
        ) : (
          filteredSignals.map(signal => {
            const sentimentInfo = getSentimentBadge(signal.sentiment);
            const platformInfo = getPlatformIcon(signal.platform);

            return (
              <div
                key={signal.id}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3 transition-colors"
              >
                {/* Author & Meta */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`material-symbols-outlined text-[16px] ${platformInfo.color}`}>
                      {platformInfo.icon}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">{signal.author}</span>
                    {signal.verified && (
                      <span className="material-symbols-outlined text-[13px] text-blue-600" title="Verified Source">
                        verified
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400 truncate">
                      {signal.authorHandle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">{signal.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${sentimentInfo.bg}`}
                    >
                      {sentimentInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{signal.content}</p>

                {/* Tags & Location Footer */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div className="flex items-center gap-1 flex-wrap">
                    {signal.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {signal.coordinates && onSelectSignalLocation && (
                      <button
                        type="button"
                        onClick={() => onSelectSignalLocation(signal.coordinates!)}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 cursor-pointer"
                        title="Locate on Map"
                      >
                        <span className="material-symbols-outlined text-[13px]">location_on</span>
                        <span>{signal.location}</span>
                      </button>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">
                      {Math.round(signal.credibilityScore * 100)}% verified
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
