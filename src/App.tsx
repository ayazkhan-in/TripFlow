/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConsumerTab, OperatorTab, SavedJourney, ViewMode } from './types/travel';
import { USER_AVATAR, ALEX_DISPATCH_AVATAR } from './data/mockData';
import { TopNav } from './components/navigation/TopNav';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { CommandPalette } from './components/navigation/CommandPalette';
import { OpsSidebar } from './components/navigation/OpsSidebar';
import { HomeScreen } from './components/consumer/HomeScreen';
import { DiscoverScreen } from './components/consumer/DiscoverScreen';
import { TripsAndBookingsScreen } from './components/consumer/TripsAndBookingsScreen';
import { ProfileModal } from './components/consumer/ProfileModal';
import { OpsCommandHub } from './components/operator/OpsCommandHub';
import { TourDetailScreen } from './components/operator/TourDetailScreen';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal, AuthUser } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { TravelVaultScreen } from './components/consumer/TravelVaultScreen';
import {
  JourneyDetailsModal,
  NewDispatchModal,
  PreferencesModal,
  WhatsAppModal,
} from './components/common/Modals';

export default function App() {
  // Navigation & Route State ('landing' is the default route on "/")
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'auth' | 'app'>('landing');
  const [viewMode, setViewMode] = useState<ViewMode>('consumer');
  const [consumerTab, setConsumerTab] = useState<ConsumerTab>('home');
  const [operatorTab, setOperatorTab] = useState<OperatorTab>('overview');
  const [operatorTourId, setOperatorTourId] = useState<string | null>(null);

  // Dummy Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'traveler' | 'operator'>('traveler');

  // Global Interactive Disruption State (Synchronized across Consumer & Operator)
  const [isDisruptionResolved, setIsDisruptionResolved] = useState<boolean>(false);

  // Modals & Drawers
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState<boolean>(false);
  const [selectedJourney, setSelectedJourney] = useState<SavedJourney | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  const handleResolveDisruption = () => {
    setIsDisruptionResolved(true);
    showToast('Disruption resolved! Telemetry pushed to Sarah Mehta & Chauffeur.');
  };

  // Auth Handlers
  const handleOpenAuth = (role: 'traveler' | 'operator' = 'traveler') => {
    setAuthModalRole(role);
    setCurrentRoute('auth');
  };

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    if (user.role === 'operator') {
      setViewMode('operator');
      setOperatorTab('overview');
    } else {
      setViewMode('consumer');
      setConsumerTab('home');
    }
    setCurrentRoute('app');
    showToast(`Welcome, ${user.name}!`);
  };

  const handleSignOut = () => {
    setAuthUser(null);
    setCurrentRoute('landing');
    showToast('Signed out of TripFlow.');
  };

  // Quick Explorers from Landing Page
  const handleExploreTravelerDemo = () => {
    setAuthUser({
      id: 'user-sarah-1024',
      name: 'Sarah Mehta',
      email: 'sarah.mehta@concierge.tripflow.io',
      role: 'traveler',
      avatar: USER_AVATAR,
      membership: 'Concierge Elite Member',
    });
    setViewMode('consumer');
    setConsumerTab('home');
    setCurrentRoute('app');
    showToast('Welcome back, Sarah Mehta! Live telemetry active.');
  };

  const handleExploreOpsDemo = () => {
    setAuthUser({
      id: 'user-alex-007',
      name: 'Alex Vance',
      email: 'alex.vance@ops.tripflow.io',
      role: 'operator',
      avatar: ALEX_DISPATCH_AVATAR,
      membership: 'Chief Dispatch Controller',
    });
    setViewMode('operator');
    setOperatorTab('overview');
    setOperatorTourId(null);
    setCurrentRoute('app');
    showToast('Alex Vance logged in to Operations Command Hub.');
  };

  const handleConsumerTabChange = (tab: ConsumerTab) => {
    if (tab === 'profile') {
      setIsProfileOpen(true);
      return;
    }
    setConsumerTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#151c27] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Global Toast */}
      {toastNotification && (
        <div className="fixed top-16 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg border border-white/10 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-sm">
            check_circle
          </span>
          <span>{toastNotification}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* ROUTE 1: LANDING PAGE                                     */}
      {/* ========================================================= */}
      {currentRoute === 'landing' && (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onExploreDemo={handleExploreTravelerDemo}
          onExploreOps={handleExploreOpsDemo}
        />
      )}

      {/* ========================================================= */}
      {/* ROUTE 2: SIMPLE ROLE AUTH SCREEN                          */}
      {/* ========================================================= */}
      {currentRoute === 'auth' && (
        <AuthScreen
          onLogin={handleLogin}
          onBackToLanding={() => setCurrentRoute('landing')}
        />
      )}

      {/* ========================================================= */}
      {/* ROUTE 3: LOGGED IN DUAL-SURFACE APP                       */}
      {/* ========================================================= */}
      {currentRoute === 'app' && (
        <>
          {/* ========================================================= */}
          {/* CONSUMER SURFACE: HOME, TRIPS & BOOKINGS, VAULT, DISCOVER */}
          {/* ========================================================= */}
          {viewMode === 'consumer' && (
            <div className="flex-1 flex flex-col">
              <TopNav
                activeTab={consumerTab}
                onTabChange={handleConsumerTabChange}
                onOpenNotifications={() =>
                  showToast(
                    'Live flight telemetry sync active. No pending delays on current leg.'
                  )
                }
                user={authUser}
                onOpenProfile={() => setIsProfileOpen(true)}
                onSignOut={handleSignOut}
                onGoToLanding={() => setCurrentRoute('landing')}
              />

              <main className="flex-1 flex flex-col">
                {consumerTab === 'home' && (
                  <HomeScreen
                    onNavigateTab={handleConsumerTabChange}
                    onOpenPreferences={() => setIsPreferencesOpen(true)}
                    onOpenDirections={() =>
                      showToast('Navigation routes sent to your offline GPS map.')
                    }
                    onOpenContactDriver={() => setIsWhatsAppOpen(true)}
                    onSelectJourneyDetails={journey => setSelectedJourney(journey)}
                  />
                )}

                {/* Merged Trips and Bookings Section */}
                {(consumerTab === 'trips' || consumerTab === 'bookings') && (
                  <TripsAndBookingsScreen
                    initialView={consumerTab === 'bookings' ? 'bookings' : 'timeline'}
                    isDisruptionResolved={isDisruptionResolved}
                    onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                    onOpenCallConcierge={() =>
                      showToast('Connecting priority voice line to Concierge Arun V...')
                    }
                    onDownloadPDF={() =>
                      showToast('Kerala Escape PDF itinerary voucher downloaded!')
                    }
                    onShareItinerary={() =>
                      showToast('Itinerary share link copied to clipboard.')
                    }
                    onOpenTripAssistant={() => setIsWhatsAppOpen(true)}
                    showToast={showToast}
                  />
                )}

                {consumerTab === 'vault' && (
                  <TravelVaultScreen
                    onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                    showToast={showToast}
                  />
                )}

                {consumerTab === 'discover' && (
                  <DiscoverScreen
                    onNavigateTab={handleConsumerTabChange}
                    onBuildTrip={params => {
                      showToast(
                        `Generated customized 5-day living itinerary for ${params.destination}!`
                      );
                    }}
                  />
                )}
              </main>

              {/* Mobile Bottom Navigation Bar */}
              <MobileBottomNav
                activeTab={consumerTab}
                onTabChange={handleConsumerTabChange}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* OPERATOR SURFACE: COMMAND HUB & TOUR DISRUPTION RESOLVER  */}
          {/* ========================================================= */}
          {viewMode === 'operator' && (
            <div className="flex-1 flex min-h-screen">
              <OpsSidebar
                activeTab={operatorTab}
                onTabChange={tab => {
                  setOperatorTab(tab);
                  if (tab === 'overview') setOperatorTourId(null);
                }}
                onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
                onSwitchMode={mode => setViewMode(mode)}
                openIssuesCount={isDisruptionResolved ? 2 : 3}
                onGoToLanding={() => setCurrentRoute('landing')}
                onSignOut={handleSignOut}
              />

              <div className="flex-1 ml-60 flex flex-col min-w-0">
                {operatorTourId ? (
                  <TourDetailScreen
                    onBackToOverview={() => setOperatorTourId(null)}
                    onSwitchMode={mode => setViewMode(mode)}
                    isDisruptionResolved={isDisruptionResolved}
                    onResolveDisruption={handleResolveDisruption}
                  />
                ) : (
                  <OpsCommandHub
                    onInspectTour={tourId => setOperatorTourId(tourId)}
                    onOpenNewTour={() => setIsNewDispatchOpen(true)}
                    onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                    isDisruptionResolved={isDisruptionResolved}
                    onResolveDisruption={handleResolveDisruption}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* TRAVELER PROFILE MODAL (Accessed from navbar user icon)   */}
      {/* ========================================================= */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={authUser}
        onSwitchMode={mode => {
          setViewMode(mode);
          setIsProfileOpen(false);
        }}
        onOpenPreferences={() => {
          setIsProfileOpen(false);
          setIsPreferencesOpen(true);
        }}
        onOpenVault={() => {
          setIsProfileOpen(false);
          setConsumerTab('vault');
        }}
        onOpenWhatsApp={() => {
          setIsProfileOpen(false);
          setIsWhatsAppOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* ========================================================= */}
      {/* DUMMY AUTH MODAL                                          */}
      {/* ========================================================= */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        defaultRole={authModalRole}
      />

      {/* ========================================================= */}
      {/* GLOBAL MODALS & DIALOGS                                   */}
      {/* ========================================================= */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateConsumer={tab => {
          setViewMode('consumer');
          handleConsumerTabChange(tab);
          setCurrentRoute('app');
        }}
        onNavigateOperator={tourId => {
          setViewMode('operator');
          if (tourId) setOperatorTourId(tourId);
          else setOperatorTourId(null);
          setCurrentRoute('app');
        }}
        onSwitchMode={mode => {
          setViewMode(mode);
          setCurrentRoute('app');
        }}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      <NewDispatchModal
        isOpen={isNewDispatchOpen}
        onClose={() => setIsNewDispatchOpen(false)}
        onCreate={title => {
          showToast(`New tour dispatch created: "${title}"`);
        }}
      />

      <JourneyDetailsModal
        journey={selectedJourney}
        onClose={() => setSelectedJourney(null)}
        onBookNow={() => {
          setViewMode('consumer');
          setConsumerTab('trips');
          setCurrentRoute('app');
        }}
      />
    </div>
  );
}
