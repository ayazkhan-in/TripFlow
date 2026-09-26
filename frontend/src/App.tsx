/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConsumerTab, OperatorTab, SavedJourney, ViewMode, BookedTrip } from './types/travel';
import { TripItinerary } from './types/itinerary';
import { VaultDocument } from './types/vault';
import { INITIAL_VAULT_DOCUMENTS } from './data/vaultData';
import {
  PREMADE_KERALA_ITINERARY,
  generateAIItinerary,
  convertItineraryToBookedTrip,
  generateVaultDocsForTrip,
  AIGenerateParams,
} from './data/premadeItineraries';
import { TripFlowApi } from './services/api';
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
import { BookingsInventoryScreen } from './components/operator/BookingsInventoryScreen';
import { TravelerBookingsManagerScreen } from './components/operator/TravelerBookingsManagerScreen';
import { VendorsSupplyScreen } from './components/operator/VendorsSupplyScreen';
import { TourCohortsScreen } from './components/operator/TourCohortsScreen';
import { TourGuidesScreen } from './components/operator/TourGuidesScreen';
import { ItineraryAlertsScreen } from './components/operator/ItineraryAlertsScreen';
import { PaymentsLedgerScreen } from './components/operator/PaymentsLedgerScreen';
import { GlobalCalendarScreen } from './components/operator/GlobalCalendarScreen';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal, AuthUser } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { TravelVaultScreen } from './components/consumer/TravelVaultScreen';
import { AssistantScreen } from './components/consumer/AssistantScreen';
import { ItineraryBuilderScreen } from './components/itinerary/ItineraryBuilderScreen';
import {
  JourneyDetailsModal,
  NewDispatchModal,
  PreferencesModal,
  WhatsAppModal,
} from './components/common/Modals';
import { OperatorProvider, useOperator } from './context/OperatorContext';
import { CreateTourPackageModal } from './components/operator/CreateTourPackageModal';
import { OperatorPackagesScreen } from './components/operator/OperatorPackagesScreen';

function TripFlowApp() {
  // Navigation & Route State ('landing' is the default route on "/")
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'auth' | 'app'>('landing');
  const [viewMode, setViewMode] = useState<ViewMode>('consumer');
  const [consumerTab, setConsumerTab] = useState<ConsumerTab>('home');
  const [operatorTab, setOperatorTab] = useState<OperatorTab>('overview');
  const [operatorTourId, setOperatorTourId] = useState<string | null>(null);
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState<boolean>(false);

  const { addTravelerBooking, pendingCustomizedCount } = useOperator();

  // Unified End-to-End Traveler Trip & Itinerary State
  const initialBookedTrip = convertItineraryToBookedTrip(PREMADE_KERALA_ITINERARY, 2450);
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>([initialBookedTrip]);
  const [activeBookedTripId, setActiveBookedTripId] = useState<string>(initialBookedTrip.id);
  const [currentItinerary, setCurrentItinerary] = useState<TripItinerary>(PREMADE_KERALA_ITINERARY);
  const [modifyingTripId, setModifyingTripId] = useState<string | null>(null);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => [
    ...generateVaultDocsForTrip(initialBookedTrip),
    ...INITIAL_VAULT_DOCUMENTS,
  ]);
  const [vaultSelectedTripId, setVaultSelectedTripId] = useState<string>('all');
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string | null>(null);

  // Sync with live Neon PostgreSQL backend
  useEffect(() => {
    // Restore session if user token exists
    TripFlowApi.getMe().then(user => {
      if (user) {
        const isOp = user.role?.toUpperCase() === 'OPERATOR';
        setAuthUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: isOp ? 'operator' : 'traveler',
          avatar: user.avatarUrl || (isOp ? ALEX_DISPATCH_AVATAR : USER_AVATAR),
          membership: user.membershipTier || (isOp ? 'Chief Dispatch Controller' : 'Concierge Member'),
          agencyName: user.agencyName,
          agencyCode: user.agencyCode,
        });
      }
    });

    TripFlowApi.getMyTrips().then(trips => {
      if (trips && trips.length > 0) {
        setBookedTrips(trips);
        setActiveBookedTripId(trips[0].id);
        if (trips[0].itinerary) {
          setCurrentItinerary(trips[0].itinerary);
        }
      }
    });
    TripFlowApi.getVaultDocuments().then(docs => {
      if (docs && docs.length > 0) {
        setVaultDocuments(docs);
      }
    });
  }, []);

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
    TripFlowApi.logout();
    setAuthUser(null);
    setCurrentRoute('landing');
    showToast('Signed out of TripFlow.');
  };

  // Quick Explorers from Landing Page
  const handleExploreTravelerDemo = async () => {
    try {
      const res = await TripFlowApi.login('sarah.mehta@concierge.tripflow.io', 'password123');
      setAuthUser({
        id: res.user.id || 'user-sarah-1024',
        name: res.user.name || 'Sarah Mehta',
        email: res.user.email || 'sarah.mehta@concierge.tripflow.io',
        role: 'traveler',
        avatar: res.user.avatarUrl || USER_AVATAR,
        membership: res.user.membershipTier || 'Concierge Elite Member',
      });
    } catch {
      setAuthUser({
        id: 'user-sarah-1024',
        name: 'Sarah Mehta',
        email: 'sarah.mehta@concierge.tripflow.io',
        role: 'traveler',
        avatar: USER_AVATAR,
        membership: 'Concierge Elite Member',
      });
    }
    setViewMode('consumer');
    setConsumerTab('home');
    setCurrentRoute('app');
    showToast('Welcome back, Sarah Mehta! Live telemetry active.');
  };

  const handleExploreOpsDemo = async () => {
    try {
      const res = await TripFlowApi.login('alex.vance@ops.tripflow.io', 'password123');
      setAuthUser({
        id: res.user.id || 'user-alex-007',
        name: res.user.name || 'Alex Vance',
        email: res.user.email || 'alex.vance@ops.tripflow.io',
        role: 'operator',
        avatar: res.user.avatarUrl || ALEX_DISPATCH_AVATAR,
        membership: res.user.membershipTier || 'Chief Dispatch Controller',
        agencyName: res.user.agencyName || 'Alpine & Beyond Expeditions',
        agencyCode: res.user.agencyCode || 'OP-ALPS-2026',
      });
    } catch {
      setAuthUser({
        id: 'user-alex-007',
        name: 'Alex Vance',
        email: 'alex.vance@ops.tripflow.io',
        role: 'operator',
        avatar: ALEX_DISPATCH_AVATAR,
        membership: 'Chief Dispatch Controller',
        agencyName: 'Alpine & Beyond Expeditions',
        agencyCode: 'OP-ALPS-2026',
      });
    }
    setViewMode('operator');
    setOperatorTab('overview');
    setOperatorTourId(null);
    setCurrentRoute('app');
    showToast('Alex Vance logged in to Alpine & Beyond Operations Hub.');
  };

  const handleOpenItineraryBuilder = () => {
    setAuthUser({
      id: 'user-sarah-1024',
      name: 'Sarah Mehta',
      email: 'sarah.mehta@concierge.tripflow.io',
      role: 'traveler',
      avatar: USER_AVATAR,
      membership: 'Concierge Elite Member',
    });
    setViewMode('consumer');
    setModifyingTripId(null);
    setCurrentItinerary(PREMADE_KERALA_ITINERARY);
    setConsumerTab('builder');
    setCurrentRoute('app');
    showToast('✨ Opened TripFlow Itinerary Builder!');
  };

  // Itinerary & Booking Flow Handlers
  const handleSelectPremadeTrip = (itinerary: TripItinerary) => {
    setCurrentItinerary(itinerary);
    setModifyingTripId(null);
    setConsumerTab('builder');
    showToast(`Loaded "${itinerary.title}"! Customize activities, then proceed to booking.`);
  };

  const handleGenerateAITrip = async (params: AIGenerateParams) => {
    const backendItinerary = await TripFlowApi.generateAIItinerary(params);
    const generated = backendItinerary || generateAIItinerary(params);
    setCurrentItinerary(generated);
    setModifyingTripId(null);
    setConsumerTab('builder');
    showToast(`✨ Generated ${generated.days.length}-Day Itinerary for ${params.destination}! Ready to personalize.`);
  };

  const handleProceedToBooking = async (
    itinerary: TripItinerary,
    totalPrice: number,
    customizationDetails?: any
  ) => {
    const backendTrip = await TripFlowApi.checkoutBooking(itinerary, totalPrice);
    const newTrip = backendTrip || convertItineraryToBookedTrip(itinerary, totalPrice);
    setBookedTrips(prev => [newTrip, ...prev.filter(t => t.id !== newTrip.id)]);
    setActiveBookedTripId(newTrip.id);
    const newDocs = generateVaultDocsForTrip(newTrip);
    setVaultDocuments(prev => [...newDocs, ...prev]);
    setModifyingTripId(null);
    setConsumerTab('trips');

    // Transmit to Operator Store as a Customized Booking!
    addTravelerBooking(newTrip, customizationDetails);

    showToast(`🎉 Payment Confirmed! "${newTrip.title}" is now active in Trips & Bookings and transmitted to Operator Desk.`);
  };

  const handleModifyTrip = (trip: BookedTrip) => {
    setCurrentItinerary(trip.itinerary);
    setModifyingTripId(trip.id);
    setConsumerTab('builder');
    showToast(`Opened "${trip.title}" in Builder. Changes will dynamically adjust package price.`);
  };

  const handleSaveModifications = async (itinerary: TripItinerary, newTotal: number) => {
    if (!modifyingTripId) {
      handleProceedToBooking(itinerary, newTotal);
      return;
    }
    const targetId = modifyingTripId;
    await TripFlowApi.modifyTrip(targetId, itinerary, newTotal);
    setBookedTrips(prev =>
      prev.map(trip => {
        if (trip.id === targetId) {
          return {
            ...trip,
            title: itinerary.title,
            destination: itinerary.destination,
            dates: `${itinerary.days.length} Days · Personalized Circuit`,
            totalPrice: newTotal,
            itinerary: itinerary,
          };
        }
        return trip;
      })
    );
    const updatedTrip = bookedTrips.find(t => t.id === targetId);
    if (updatedTrip) {
      const updatedDocs = generateVaultDocsForTrip({
        ...updatedTrip,
        title: itinerary.title,
        destination: itinerary.destination,
        totalPrice: newTotal,
        itinerary: itinerary,
      });
      setVaultDocuments(prev => [
        ...updatedDocs,
        ...prev.filter(d => d.tripId !== targetId),
      ]);
    }
    setModifyingTripId(null);
    setActiveBookedTripId(targetId);
    setConsumerTab('trips');
    showToast(`✅ Trip modifications saved! Package price updated to $${newTotal.toLocaleString()}.`);
  };

  const handleViewInVault = (tripId?: string) => {
    if (tripId) {
      setVaultSelectedTripId(tripId);
    }
    setConsumerTab('vault');
    showToast('Filtered Travel Vault to your synchronized trip documents.');
  };

  const handleConsumerTabChange = (tab: ConsumerTab) => {
    if (tab === 'profile') {
      setIsProfileOpen(true);
      return;
    }
    setConsumerTab(tab);
  };

  return (
    <div className={`bg-[#F7F8FA] text-[#151c27] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white ${consumerTab === 'builder' || consumerTab === 'assistant' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
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
          onOpenBuilder={handleOpenItineraryBuilder}
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
            <div className={`flex-1 min-h-0 flex flex-col ${consumerTab === 'builder' || consumerTab === 'assistant' ? 'h-screen max-h-screen overflow-hidden' : ''}`}>
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

              <main className={`flex-1 min-h-0 flex flex-col ${consumerTab === 'builder' || consumerTab === 'assistant' ? 'h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] overflow-hidden' : ''}`}>
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
                    bookedTrips={bookedTrips}
                    activeTripId={activeBookedTripId}
                    onSelectTrip={id => setActiveBookedTripId(id)}
                    onModifyTrip={handleModifyTrip}
                    onViewInVault={handleViewInVault}
                    isDisruptionResolved={isDisruptionResolved}
                    onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                    onOpenCallConcierge={() =>
                      showToast('Connecting priority voice line to Concierge Arun V...')
                    }
                    onDownloadPDF={() =>
                      showToast('Itinerary voucher PDF downloaded!')
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
                    documents={vaultDocuments}
                    selectedTripId={vaultSelectedTripId}
                    bookedTrips={bookedTrips}
                  />
                )}

                {consumerTab === 'discover' && (
                  <DiscoverScreen
                    onNavigateTab={handleConsumerTabChange}
                    onSelectPremadeTrip={handleSelectPremadeTrip}
                    onGenerateAITrip={handleGenerateAITrip}
                    onOpenAssistantWithPrompt={(prompt) => {
                      setAssistantInitialPrompt(prompt);
                      setConsumerTab('assistant');
                    }}
                    userName={authUser?.name || 'Sarah Mehta'}
                    userAvatar={authUser?.avatar || USER_AVATAR}
                  />
                )}

                {consumerTab === 'assistant' && (
                  <AssistantScreen
                    onNavigateTab={handleConsumerTabChange}
                    onOpenItineraryInBuilder={(itinerary) => {
                      setCurrentItinerary(itinerary);
                      setModifyingTripId(null);
                      setConsumerTab('builder');
                      showToast(`✨ Loaded "${itinerary.title}" in Itinerary Builder!`);
                    }}
                    initialPrompt={assistantInitialPrompt}
                    onClearInitialPrompt={() => setAssistantInitialPrompt(null)}
                  />
                )}

                {consumerTab === 'builder' && (
                  <ItineraryBuilderScreen
                    initialItinerary={currentItinerary}
                    isModifyingBookedTrip={Boolean(modifyingTripId)}
                    originalBookedPrice={modifyingTripId ? bookedTrips.find(t => t.id === modifyingTripId)?.totalPrice : undefined}
                    onBackToHome={() => handleConsumerTabChange('discover')}
                    onProceedToBooking={handleProceedToBooking}
                    onSaveModifications={handleSaveModifications}
                    showToast={showToast}
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
                user={authUser}
                activeTab={operatorTab}
                onTabChange={tab => {
                  setOperatorTab(tab);
                  setOperatorTourId(null);
                }}
                onOpenNewDispatch={() => setIsCreatePackageOpen(true)}
                onOpenCreatePackage={() => setIsCreatePackageOpen(true)}
                onSwitchMode={mode => setViewMode(mode)}
                openIssuesCount={isDisruptionResolved ? 2 : 3}
                pendingCustomizedCount={pendingCustomizedCount}
                onGoToLanding={() => setCurrentRoute('landing')}
                onSignOut={handleSignOut}
              />

              <div className="flex-1 ml-64 flex flex-col min-w-0">
                {operatorTourId ? (
                  <TourDetailScreen
                    onBackToOverview={() => setOperatorTourId(null)}
                    onSwitchMode={mode => setViewMode(mode)}
                    isDisruptionResolved={isDisruptionResolved}
                    onResolveDisruption={handleResolveDisruption}
                  />
                ) : (
                  <>
                    {(operatorTab === 'hub' || operatorTab === 'overview' || operatorTab === 'operations') && (
                      <OpsCommandHub
                        onInspectTour={tourId => setOperatorTourId(tourId)}
                        onOpenNewTour={() => setIsCreatePackageOpen(true)}
                        onOpenCreatePackage={() => setIsCreatePackageOpen(true)}
                        onNavigateToTab={tab => setOperatorTab(tab)}
                        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                        isDisruptionResolved={isDisruptionResolved}
                        onResolveDisruption={handleResolveDisruption}
                      />
                    )}

                    {operatorTab === 'packages' && (
                      <OperatorPackagesScreen
                        showToast={showToast}
                        onNavigateToDiscover={() => {
                          setViewMode('consumer');
                          setConsumerTab('discover');
                          setCurrentRoute('app');
                        }}
                        onOpenCreatePackageModal={() => setIsCreatePackageOpen(true)}
                      />
                    )}

                    {(operatorTab === 'flight_bookings' ||
                      operatorTab === 'stay_bookings' ||
                      operatorTab === 'transfer_bookings' ||
                      operatorTab === 'activity_bookings') && (
                      <TravelerBookingsManagerScreen
                        activeTab={operatorTab}
                        onTabChange={tab => setOperatorTab(tab)}
                        showToast={showToast}
                      />
                    )}

                    {(operatorTab === 'bookings' || operatorTab === 'customers') && (
                      <BookingsInventoryScreen
                        activeCategory="all"
                        onInspectTour={tourId => setOperatorTourId(tourId)}
                        onNavigateToTab={tab => setOperatorTab(tab)}
                        showToast={showToast}
                      />
                    )}

                    {operatorTab === 'vendors' && (
                      <VendorsSupplyScreen showToast={showToast} />
                    )}

                    {(operatorTab === 'cohorts' || operatorTab === 'tours') && (
                      <TourCohortsScreen
                        onInspectTour={tourId => setOperatorTourId(tourId)}
                        showToast={showToast}
                      />
                    )}

                    {operatorTab === 'guides' && (
                      <TourGuidesScreen showToast={showToast} />
                    )}

                    {operatorTab === 'alerts' && (
                      <ItineraryAlertsScreen
                        onInspectTour={tourId => setOperatorTourId(tourId)}
                        showToast={showToast}
                        onResolveDisruption={handleResolveDisruption}
                      />
                    )}

                    {operatorTab === 'payments' && (
                      <PaymentsLedgerScreen showToast={showToast} />
                    )}

                    {operatorTab === 'calendar' && (
                      <GlobalCalendarScreen
                        onInspectTour={tourId => setOperatorTourId(tourId)}
                        showToast={showToast}
                      />
                    )}
                  </>
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

      {/* Operator Tour Package Creator Modal */}
      <CreateTourPackageModal
        isOpen={isCreatePackageOpen}
        onClose={() => setIsCreatePackageOpen(false)}
        showToast={showToast}
        onPackageCreated={pkgTitle => {
          showToast(`🚀 "${pkgTitle}" published live to Discover!`);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <OperatorProvider>
      <TripFlowApp />
    </OperatorProvider>
  );
}
