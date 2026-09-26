import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TravelStory,
  TRAVEL_STORIES,
  getStoryVideoUrl,
  TravelStoryTip,
} from '../../data/storyData';
import { TripItinerary } from '../../types/itinerary';
import { generateAIItinerary } from '../../data/premadeItineraries';

interface StoryScreenProps {
  onPlanTripFromStory: (itinerary: TripItinerary) => void;
  showToast: (msg: string) => void;
  initialStoryId?: string | null;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({
  onPlanTripFromStory,
  showToast,
  initialStoryId,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'kashmir' | 'himachal' | 'kerala' | 'karnataka'>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const [bookmarkedStories, setBookmarkedStories] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    TRAVEL_STORIES.forEach(s => {
      initial[s.id] = s.likesCount;
    });
    return initial;
  });
  const [isTipsDrawerOpen, setIsTipsDrawerOpen] = useState<boolean>(false);
  const [isItineraryPreviewOpen, setIsItineraryPreviewOpen] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [storyTipsMap, setStoryTipsMap] = useState<Record<string, TravelStoryTip[]>>(() => {
    const initial: Record<string, TravelStoryTip[]> = {};
    TRAVEL_STORIES.forEach(s => {
      initial[s.id] = [...s.tips];
    });
    return initial;
  });
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [showCenterPlayIcon, setShowCenterPlayIcon] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Filtered stories list
  const filteredStories = TRAVEL_STORIES.filter(s => {
    if (selectedRegion === 'all') return true;
    return s.region === selectedRegion;
  });

  const activeStory = filteredStories[activeIndex] || filteredStories[0];

  // If initialStoryId is provided, jump to it
  useEffect(() => {
    if (initialStoryId) {
      const idx = filteredStories.findIndex(s => s.id === initialStoryId);
      if (idx !== -1) {
        scrollToIndex(idx);
      }
    }
  }, [initialStoryId]);

  // Scroll to index helper
  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    const target = containerRef.current.children[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Keyboard navigation (Arrow Up / Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIndex < filteredStories.length - 1) {
          scrollToIndex(activeIndex + 1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIndex > 0) {
          scrollToIndex(activeIndex - 1);
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm') {
        e.preventDefault();
        setIsMuted(prev => !prev);
        showToast(!isMuted ? 'Muted' : 'Sound unmuted');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredStories.length, scrollToIndex, isMuted]);

  // Manage video playing & pausing based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.muted = isMuted;
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, isPlaying, isMuted, filteredStories]);

  // Handle scroll snap detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if (clientHeight === 0) return;

    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < filteredStories.length) {
      setActiveIndex(newIndex);
      setIsPlaying(true);
      setVideoProgress(0);
    }
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    setIsPlaying(prev => {
      const next = !prev;
      setShowCenterPlayIcon(true);
      setTimeout(() => setShowCenterPlayIcon(false), 600);
      return next;
    });
  };

  // Toggle Mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => {
      const next = !prev;
      showToast(next ? 'Muted' : 'Sound unmuted');
      return next;
    });
  };

  // Toggle Like
  const handleLike = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    const isLiked = likedStories[storyId];
    setLikedStories(prev => ({ ...prev, [storyId]: !isLiked }));
    setLikesCountMap(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + (isLiked ? -1 : 1),
    }));
  };

  // Toggle Bookmark
  const handleBookmark = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    const isSaved = bookmarkedStories[storyId];
    setBookmarkedStories(prev => ({ ...prev, [storyId]: !isSaved }));
    showToast(isSaved ? 'Removed from saved' : 'Saved to wishlist');
  };

  // Share
  const handleShare = async (e: React.MouseEvent, story: TravelStory) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#story-${story.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bookit: ${story.title}`,
          text: `Check out ${story.destination} on Bookit!`,
          url: shareUrl,
        });
        showToast('Story shared');
        return;
      } catch {
        // Fallback
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard');
    }
  };

  // Plan Trip CTA
  const handlePlanThisTrip = (e: React.MouseEvent, story: TravelStory) => {
    e.stopPropagation();
    showToast(`Loading itinerary for ${story.destination}...`);

    const customItinerary = generateAIItinerary({
      destination: story.destination,
      days: story.daysCount,
      dates: `${story.daysCount} Days · Curated Circuit`,
      travelers: 2,
      budget: story.budgetINR,
      travelStyle: story.region === 'kashmir' ? 'Luxury Heritage' : story.region === 'himachal' ? 'Mountain Escape' : 'Curated Leisure',
      interests: [story.title, 'Scenic Highlights', 'Local Cuisine'],
    });

    customItinerary.title = story.itinerarySummary.title || story.title;
    customItinerary.dates = `${story.daysCount} Days · Inspired by Story`;

    onPlanTripFromStory(customItinerary);
  };

  // Submit comment in tips drawer
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeStory) return;

    const newTip: TravelStoryTip = {
      id: `tip-user-${Date.now()}`,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 1,
    };

    setStoryTipsMap(prev => ({
      ...prev,
      [activeStory.id]: [newTip, ...(prev[activeStory.id] || [])],
    }));

    setNewCommentText('');
    showToast('Tip posted');
  };

  // Progress update from active video
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      setVideoProgress((video.currentTime / video.duration) * 100);
    }
  };

  // Seek video
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo && currentVideo.duration) {
      currentVideo.currentTime = pos * currentVideo.duration;
    }
  };

  const destinationCards = [
    { id: 'all', label: 'All Destinations', count: TRAVEL_STORIES.length, icon: 'public' },
    { id: 'kashmir', label: 'Kashmir Valley', count: 4, icon: 'ac_unit' },
    { id: 'himachal', label: 'Himachal Pradesh', count: 2, icon: 'landscape' },
    { id: 'karnataka', label: 'Karnataka Western Ghats', count: 2, icon: 'forest' },
    { id: 'kerala', label: 'Kerala Backwaters', count: 1, icon: 'sailing' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] flex items-center justify-center select-none font-sans overflow-hidden px-4 py-3 md:py-6">
      <div className="w-full max-w-4xl h-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
        {/* ------------------------------------------------------------- */}
        {/* SIDEBAR: TRAVEL STORIES & DESTINATION FILTER CARDS            */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden lg:flex flex-col w-72 shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">
            Travel Stories
          </h2>

          <div className="flex flex-col gap-2.5">
            {destinationCards.map(item => {
              const isActive = selectedRegion === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedRegion(item.id as any);
                    setActiveIndex(0);
                    scrollToIndex(0);
                  }}
                  className={`w-full flex items-center justify-between p-3 px-3.5 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {item.icon}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-left">
                      {item.label}
                    </span>
                  </div>

                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Header Filter Row */}
        <div className="lg:hidden w-full flex items-center justify-between gap-3 pb-1 shrink-0">
          <h2 className="text-base font-bold text-slate-900">Travel Stories</h2>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {destinationCards.map(item => {
              const isActive = selectedRegion === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedRegion(item.id as any);
                    setActiveIndex(0);
                    scrollToIndex(0);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {item.icon}
                  </span>
                  <span>{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CENTER REEL VIEWPORT                                          */}
        {/* ------------------------------------------------------------- */}
        <div className="relative flex-1 h-full max-h-[calc(100vh-6.5rem)] flex items-center justify-center">
          {/* Main Phone Frame */}
          <div className="relative w-full max-w-[380px] h-full rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-xl shadow-slate-900/10 border border-slate-200/80">
            {/* Scroll Container */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none relative bg-black"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filteredStories.map((story, idx) => {
                const isCurrent = idx === activeIndex;
                const isLiked = likedStories[story.id] || false;
                const isSaved = bookmarkedStories[story.id] || false;
                const currentLikes = likesCountMap[story.id] || story.likesCount;
                const commentsCount = (storyTipsMap[story.id] || []).length;

                return (
                  <div
                    key={story.id}
                    className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-black overflow-hidden"
                  >
                    {/* Video Element */}
                    <video
                      ref={el => {
                        videoRefs.current[idx] = el;
                      }}
                      src={getStoryVideoUrl(story.filename)}
                      className="w-full h-full object-cover cursor-pointer"
                      loop
                      playsInline
                      muted={isMuted}
                      onClick={togglePlayPause}
                      onTimeUpdate={isCurrent ? handleTimeUpdate : undefined}
                    />

                    {/* Top Segmented Story Indicators */}
                    <div className="absolute top-2.5 left-3 right-3 z-20 flex gap-1 items-center pointer-events-none">
                      {filteredStories.map((_, dotIdx) => (
                        <div
                          key={dotIdx}
                          className="h-0.5 flex-1 rounded-full bg-white/25 overflow-hidden"
                        >
                          <div
                            className={`h-full bg-white transition-all duration-150 ${
                              dotIdx < activeIndex
                                ? 'w-full'
                                : dotIdx === activeIndex
                                ? 'w-full'
                                : 'w-0'
                            }`}
                            style={
                              dotIdx === activeIndex
                                ? { width: `${videoProgress}%` }
                                : {}
                            }
                          />
                        </div>
                      ))}
                    </div>

                    {/* Center Play/Pause indicator animation */}
                    {showCenterPlayIcon && isCurrent && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-out fade-out zoom-out duration-500">
                        <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-3xl">
                            {isPlaying ? 'play_arrow' : 'pause'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top Header Overlay: Minimal Location & Audio */}
                    <div className="absolute top-5 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                        <span className="material-symbols-outlined text-xs text-rose-400">
                          location_on
                        </span>
                        <span className="max-w-[180px] truncate">{story.locationBadge}</span>
                      </div>

                      <button
                        onClick={toggleMute}
                        className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center cursor-pointer transition-transform border border-white/10"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        <span className="material-symbols-outlined text-base">
                          {isMuted ? 'volume_off' : 'volume_up'}
                        </span>
                      </button>
                    </div>

                    {/* Right Action Bar */}
                    <div className="absolute right-2.5 bottom-20 z-20 flex flex-col items-center gap-3.5">
                      {/* Creator Avatar */}
                      <div className="relative mb-1">
                        <img
                          src={story.creator.avatar}
                          alt={story.creator.name}
                          className="w-9 h-9 rounded-full border border-white/70 object-cover shadow-sm"
                        />
                      </div>

                      {/* Like */}
                      <button
                        onClick={e => handleLike(e, story.id)}
                        className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                      >
                        <div
                          className={`w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 ${
                            isLiked ? 'text-rose-500 bg-rose-500/20' : ''
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-xl"
                            style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            favorite
                          </span>
                        </div>
                        <span className="text-[10px] font-medium drop-shadow-sm">
                          {currentLikes >= 1000 ? `${(currentLikes / 1000).toFixed(1)}k` : currentLikes}
                        </span>
                      </button>

                      {/* Comments */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setIsTipsDrawerOpen(true);
                        }}
                        className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                          <span className="material-symbols-outlined text-xl">
                            chat_bubble
                          </span>
                        </div>
                        <span className="text-[10px] font-medium drop-shadow-sm">
                          {commentsCount}
                        </span>
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={e => handleBookmark(e, story.id)}
                        className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                      >
                        <div
                          className={`w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 ${
                            isSaved ? 'text-amber-400 bg-amber-400/20' : ''
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-xl"
                            style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            bookmark
                          </span>
                        </div>
                      </button>

                      {/* Share */}
                      <button
                        onClick={e => handleShare(e, story)}
                        className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                          <span className="material-symbols-outlined text-xl">
                            share
                          </span>
                        </div>
                      </button>

                      {/* Quick Itinerary Preview info button */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setIsItineraryPreviewOpen(true);
                        }}
                        className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                        title="Trip details"
                      >
                        <div className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                          <span className="material-symbols-outlined text-xl">
                            info
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Bottom Minimal Info Overlay */}
                    <div className="absolute left-0 right-0 bottom-0 z-20 pt-10 pb-3 px-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col gap-2">
                      {/* Author & Budget Pill */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs drop-shadow-xs">
                          {story.creator.handle}
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="text-[10px] font-semibold text-emerald-300">
                          {story.budgetEstimate.split('(')[0].trim()}
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="text-[10px] text-slate-300">
                          {story.duration.split('/')[0].trim()}
                        </span>
                      </div>

                      {/* Clean Title */}
                      <h3 className="text-white font-bold text-xs leading-snug drop-shadow-sm line-clamp-2">
                        {story.title}
                      </h3>

                      {/* Action: Plan Trip Button */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          onClick={e => handlePlanThisTrip(e, story)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">
                            auto_awesome
                          </span>
                          <span>Plan This Trip</span>
                        </button>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setIsItineraryPreviewOpen(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md cursor-pointer transition-all"
                        >
                          Details
                        </button>
                      </div>

                      {/* Minimal Scrubber Line */}
                      <div
                        onClick={handleScrubberClick}
                        className="relative w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all mt-0.5"
                      >
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-white rounded-full"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Up/Down Navigation Arrows */}
          <div className="hidden lg:flex flex-col gap-2 absolute -right-12 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => {
                if (activeIndex > 0) scrollToIndex(activeIndex - 1);
              }}
              disabled={activeIndex === 0}
              className={`w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center cursor-pointer transition-all hover:bg-slate-50 ${
                activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
              }`}
              title="Previous (Up Arrow)"
            >
              <span className="material-symbols-outlined text-lg">expand_less</span>
            </button>

            <button
              onClick={() => {
                if (activeIndex < filteredStories.length - 1) scrollToIndex(activeIndex + 1);
              }}
              disabled={activeIndex === filteredStories.length - 1}
              className={`w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center cursor-pointer transition-all hover:bg-slate-50 ${
                activeIndex === filteredStories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
              }`}
              title="Next (Down Arrow)"
            >
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MINIMAL LIGHT COMMENTS / TIPS DRAWER                          */}
      {/* ------------------------------------------------------------- */}
      {isTipsDrawerOpen && activeStory && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm h-full bg-white text-slate-900 border-l border-slate-200 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    Traveler Tips
                  </h3>
                  <span className="text-xs text-slate-400">
                    ({(storyTipsMap[activeStory.id] || []).length})
                  </span>
                </div>
                <button
                  onClick={() => setIsTipsDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pt-3 pr-1">
                {(storyTipsMap[activeStory.id] || []).map(tip => (
                  <div
                    key={tip.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={tip.avatar}
                          alt={tip.author}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {tip.author}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{tip.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">
                      {tip.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form at Bottom */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 px-3 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="Add a travel tip..."
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className={`p-1 rounded-lg text-white font-semibold transition-all ${
                    newCommentText.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MINIMAL LIGHT ITINERARY PREVIEW MODAL                         */}
      {/* ------------------------------------------------------------- */}
      {isItineraryPreviewOpen && activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsItineraryPreviewOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {activeStory.duration} · {activeStory.destination}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                  {activeStory.itinerarySummary.title}
                </h3>
              </div>
              <button
                onClick={() => setIsItineraryPreviewOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="py-3 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Estimated Package</span>
                <span className="text-sm font-bold text-slate-900">
                  {activeStory.budgetEstimate}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Highlights
                </span>
                <ul className="space-y-1">
                  {activeStory.itinerarySummary.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-emerald-500 text-sm">
                        check
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsItineraryPreviewOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={e => {
                  setIsItineraryPreviewOpen(false);
                  handlePlanThisTrip(e, activeStory);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  auto_awesome
                </span>
                <span>Open in Builder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
