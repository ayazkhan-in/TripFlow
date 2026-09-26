import React from 'react';

/**
 * Base atomic Skeleton component with shimmering gradient animation
 */
export const Skeleton: React.FC<{
  className?: string;
  variant?: 'light' | 'subtle' | 'dark';
}> = ({ className = '', variant = 'light' }) => {
  const shimmerClass =
    variant === 'dark'
      ? 'skeleton-shimmer-dark'
      : variant === 'subtle'
      ? 'skeleton-shimmer-subtle'
      : 'skeleton-shimmer';

  return <div className={`rounded-md ${shimmerClass} ${className}`} />;
};

/**
 * Text Skeleton line helper
 */
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}> = ({ lines = 2, className = 'h-3.5', lastLineWidth = 'w-3/5' }) => {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${className} ${
            i === lines - 1 ? lastLineWidth : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Questionnaire Skeleton:
 * Accurately mimics InteractiveQuestionnaireCard during AI question calibration
 */
export const QuestionnaireSkeleton: React.FC<{ destination?: string }> = ({
  destination,
}) => {
  return (
    <div className="w-full bg-slate-50/80 border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-20 h-2.5" />
            <Skeleton className="w-24 h-3.5" />
          </div>
        </div>

        {/* Progress track */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Skeleton className="w-10 h-1.5 rounded-full" />
          <Skeleton className="w-6 h-1.5 rounded-full" />
          <Skeleton className="w-6 h-1.5 rounded-full" />
          <Skeleton className="w-6 h-1.5 rounded-full" />
          <Skeleton className="w-6 h-1.5 rounded-full" />
        </div>

        {/* Powered by Gemini badge skeleton */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-28 h-3" />
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Question & Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Bubble greeting skeleton */}
          <div className="flex items-start gap-3">
            <Skeleton className="w-9 h-9 rounded-2xl shrink-0" />
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 w-full max-w-xl">
              <Skeleton className="w-36 h-3" />
              <Skeleton className="w-4/5 h-3" />
            </div>
          </div>

          {/* Question title & subtitle */}
          <div className="space-y-2">
            <Skeleton className="w-3/5 h-6 rounded-lg" />
            <Skeleton className="w-4/5 h-3.5" />
          </div>

          {/* 4 Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {[1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden p-0"
              >
                <Skeleton className="h-28 sm:h-32 w-full rounded-none" />
                <div className="p-3.5 space-y-2">
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-3/4 h-3" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom step navigation buttons */}
          <div className="pt-6 border-t border-slate-200/60 flex items-center justify-between">
            <Skeleton className="w-20 h-9 rounded-xl" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-12 h-3" />
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-3 h-3 rounded-full" />
            </div>
            <Skeleton className="w-32 h-10 rounded-xl" />
          </div>
        </div>

        {/* Right Column: Live Trip Preview Card Skeleton */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            {/* Hero Image placeholder */}
            <div className="relative h-44 sm:h-48 w-full bg-slate-100">
              <Skeleton className="w-full h-full rounded-none" />
              <div className="absolute top-3 left-3 right-3 flex justify-between">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-28 h-5 rounded-full" />
              </div>
              <div className="absolute bottom-3 left-4 space-y-1">
                <Skeleton className="w-32 h-5 bg-slate-300" />
                <Skeleton className="w-40 h-3.5 bg-slate-300" />
              </div>
            </div>

            {/* Selected preferences summary rows */}
            <div className="p-4 space-y-3.5 divide-y divide-slate-100">
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-24 h-3.5" />
                  </div>
                  <Skeleton className="w-12 h-3" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-28 h-3.5" />
                  </div>
                  <Skeleton className="w-12 h-3" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-32 h-3.5" />
                  </div>
                  <Skeleton className="w-12 h-3" />
                </div>
              </div>

              {/* Starting city */}
              <div className="pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="w-16 h-2.5" />
                    <Skeleton className="w-24 h-3.5" />
                  </div>
                </div>
                <Skeleton className="w-6 h-6 rounded-md" />
              </div>

              <div className="pt-3 space-y-2">
                <Skeleton className="w-full h-8 rounded-xl" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Proposal Deck Skeleton:
 * Accurately mimics MultiOptionComparisonDeck during itinerary generation
 */
export const ProposalDeckSkeleton: React.FC<{ destination?: string }> = ({
  destination,
}) => {
  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-32 h-5 rounded-full" />
            <Skeleton className="w-40 h-4" />
          </div>
          <Skeleton className="w-64 sm:w-80 h-6 rounded-lg" />
          <Skeleton className="w-full max-w-lg h-3.5" />
        </div>
        <Skeleton className="w-36 h-8 rounded-lg shrink-0" />
      </div>

      {/* 2. Budget Adherence Meter Card */}
      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="w-36 h-3 rounded bg-slate-700" />
            <Skeleton className="w-48 h-8 rounded-lg bg-slate-800" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-24 h-6 rounded-full bg-slate-800" />
            <Skeleton className="w-28 h-6 rounded-full bg-slate-800" />
          </div>
        </div>
        {/* Shimmer progress track */}
        <Skeleton className="w-full h-2 rounded-full bg-slate-800" />
      </div>

      {/* 3. Flight Section Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="w-48 h-4 font-bold" />
          </div>
          <Skeleton className="w-28 h-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between mb-2">
                  <Skeleton className="w-20 h-4 rounded-full" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                </div>
                <Skeleton className="w-32 h-4 mb-1" />
                <Skeleton className="w-24 h-3 mb-3" />
                <Skeleton className="w-full h-12 rounded-lg" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hotel Section Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="w-44 h-4 font-bold" />
          </div>
          <Skeleton className="w-24 h-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between"
            >
              <div>
                <Skeleton className="h-28 w-full rounded-none" />
                <div className="p-3.5 space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                  <Skeleton className="w-full h-8 rounded-lg" />
                </div>
              </div>
              <div className="p-3.5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Activities Grid Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-lg" />
          <Skeleton className="w-56 h-4 font-bold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3"
            >
              <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="w-4/5 h-3.5" />
                <Skeleton className="w-2/5 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Bottom Sticky Action Bar Skeleton */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-36 h-5" />
          </div>
        </div>
        <Skeleton className="w-full sm:w-56 h-11 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Package Card Skeleton for Discover/Home Screen
 */
export const PackageCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
      {/* Hero Image banner */}
      <div className="relative h-52 w-full bg-slate-100">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-3 left-3">
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-3" />
          </div>
          <Skeleton className="w-4/5 h-5 font-bold" />
          <Skeleton className="w-full h-3.5" />
        </div>

        {/* Inclusions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-3/5 h-3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="w-14 h-2.5" />
            <Skeleton className="w-24 h-5" />
          </div>
          <Skeleton className="w-28 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Table Skeleton for Operator Hub screens (Bookings, Cohorts, Guides, Vendors, Payments)
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
      {/* Table Header */}
      <div className="bg-slate-50/80 px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton key={c} className="h-3.5 w-24" />
        ))}
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="px-4 py-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="w-28 h-3.5" />
                <Skeleton className="w-16 h-2.5" />
              </div>
            </div>

            {Array.from({ length: columns - 2 }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-20 rounded-md" />
            ))}

            <Skeleton className="w-16 h-7 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Chat Session List Skeleton for Assistant Screen Sidebar
 */
export const ChatSessionListSkeleton: React.FC<{ count?: number }> = ({
  count = 4,
}) => {
  return (
    <div className="space-y-1.5 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-2.5 rounded-xl border border-transparent bg-slate-100/60 flex items-center gap-3"
        >
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="space-y-1 flex-1">
            <Skeleton className="w-4/5 h-3.5" />
            <Skeleton className="w-1/3 h-2.5" />
          </div>
        </div>
      ))}
    </div>
  );
};
