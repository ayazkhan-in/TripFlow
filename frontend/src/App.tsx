/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConsumerTab, OperatorTab, SavedJourney, ViewMode, BookedTrip, PaymentDetails } from './types/travel';
import { TripItinerary } from './types/itinerary';
import { VaultDocument } from './types/vault';
import { INITIAL_VAULT_DOCUMENTS } from './data/vaultData';
import { INITIAL_OPERATOR_PACKAGES } from './data/operatorPackagesData';
import { PaymentOverlayModal } from './components/consumer/PaymentOverlayModal';
import {
  PREMADE_KERALA_ITINERARY,
  generateAIItinerary,
  convertItineraryToBookedTrip,
  generateVaultDocsForTrip,
  AIGenerateParams,
} from './data/premadeItineraries';
import { JAPAN_5DAY_ITINERARY } from './data/itineraryData';
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
import { DigitalTwinScreen } from './components/operator/DigitalTwinScreen';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal, AuthUser } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { TravelVaultScreen } from './components/consumer/TravelVaultScreen';
import { AssistantScreen } from './components/consumer/AssistantScreen';
import { StoryScreen } from './components/consumer/StoryScreen';
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
import { ThemedToast } from './components/common/ThemedToast';
import { SplashScreen } from './components/common/SplashScreen';
import { parseUrlPath, formatUrlPath } from './utils/router';

function BookitApp() {
  // Navigation & Route State (initialized from current browser URL)
  const initialRouteState = parseUrlPath(window.location.pathname);

  const [currentRoute, setCurrentRoute] = useState<'landing' | 'auth' | 'app'>(initialRouteState.currentRoute);
  const [viewMode, setViewMode] = useState<ViewMode>(initialRouteState.viewMode);
  const [consumerTab, setConsumerTab] = useState<ConsumerTab>(initialRouteState.consumerTab);
  const [operatorTab, setOperatorTab] = useState<OperatorTab>(initialRouteState.operatorTab);
  const [operatorTourId, setOperatorTourId] = useState<string | null>(initialRouteState.operatorTourId);
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState<boolean>(false);

  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'traveler' | 'operator'>(initialRouteState.authRole || 'traveler');

  // Push URL changes to window history without page reload
  const navigateTo = (options: {
    route?: 'landing' | 'auth' | 'app';
    mode?: ViewMode;
    consumerTab?: ConsumerTab;
    operatorTab?: OperatorTab;
    tourId?: string | null;
    authRole?: 'traveler' | 'operator';
  }) => {
    const nextRoute = options.route !== undefined ? options.route : currentRoute;
    const nextMode = options.mode !== undefined ? options.mode : viewMode;
    const nextConsumerTab = options.consumerTab !== undefined ? options.consumerTab : consumerTab;
    const nextOperatorTab = options.operatorTab !== undefined ? options.operatorTab : operatorTab;
    const nextTourId = options.tourId !== undefined ? options.tourId : (options.operatorTab !== undefined ? null : operatorTourId);
    const nextAuthRole = options.authRole !== undefined ? options.authRole : authModalRole;

    if (options.route !== undefined) setCurrentRoute(nextRoute);
    if (options.mode !== undefined) setViewMode(nextMode);
    if (options.consumerTab !== undefined) setConsumerTab(nextConsumerTab);
    if (options.operatorTab !== undefined) {
      setOperatorTab(nextOperatorTab);
      setOperatorTourId(nextTourId);
    }
    if (options.tourId !== undefined) setOperatorTourId(nextTourId);
    if (options.authRole !== undefined) setAuthModalRole(nextAuthRole);

    const targetUrl = formatUrlPath({
      currentRoute: nextRoute,
      viewMode: nextMode,
      consumerTab: nextConsumerTab,
      operatorTab: nextOperatorTab,
      operatorTourId: nextTourId,
      authRole: nextAuthRole,
    });

    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

  // Sync state when browser back/forward buttons are pressed
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseUrlPath(window.location.pathname);
      setCurrentRoute(parsed.currentRoute);
      setViewMode(parsed.viewMode);
      setConsumerTab(parsed.consumerTab);
      setOperatorTab(parsed.operatorTab);
      setOperatorTourId(parsed.operatorTourId);
      if (parsed.authRole) {
        setAuthModalRole(parsed.authRole);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial URL on mount if browser had an empty or redirect path
  useEffect(() => {
    const initialUrl = formatUrlPath({
      currentRoute,
      viewMode,
      consumerTab,
      operatorTab,
      operatorTourId,
      authRole: authModalRole,
    });
    if (window.location.pathname !== initialUrl && window.location.pathname === '/') {
      // Keep '/' as root landing page
    } else if (window.location.pathname !== initialUrl && window.location.pathname !== '/') {
      window.history.replaceState({}, '', initialUrl);
    }
  }, []);

  const { addTravelerBooking, pendingCustomizedCount } = useOperator();

  // Unified End-to-End Traveler Trip & Itinerary State
  // Start with empty trips — populated from backend after login or after booking
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>([]);
  const [isTripsLoading, setIsTripsLoading] = useState<boolean>(true);
  const [activeBookedTripId, setActiveBookedTripId] = useState<string | null>(null);
  const [currentItinerary, setCurrentItinerary] = useState<TripItinerary>(PREMADE_KERALA_ITINERARY);
  const [modifyingTripId, setModifyingTripId] = useState<string | null>(null);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>([]);
  const [vaultSelectedTripId, setVaultSelectedTripId] = useState<string>('all');
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string | null>(null);
  const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState<boolean>(false);
  const [paymentOverlayItinerary, setPaymentOverlayItinerary] = useState<TripItinerary | null>(null);
  const [paymentOverlayPrice, setPaymentOverlayPrice] = useState<number>(0);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Splash Screen & Background Loading State
  const [splashProgress, setSplashProgress] = useState<number>(18);
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(true);

  // Sync with live Neon PostgreSQL backend and preload background resources
  useEffect(() => {
    let isCancelled = false;

    // Smooth incremental progress while background promises are in flight
    const progressInterval = setInterval(() => {
      setSplashProgress(prev => {
        if (prev < 88) {
          const next = prev + (88 - prev) * 0.14;
          return next;
        }
        return prev;
      });
    }, 60);

    const minSplashDuration = 900; // ensures smooth and visible bar progression
    const startTime = Date.now();

    const loadBackgroundData = async () => {
      try {
        // Run parallel tasks: Fonts/Logo readiness, Hero Video buffering, Auth check, Catalog items
        const assetPromise = Promise.allSettled([
          document.fonts ? document.fonts.ready : Promise.resolve(),
          new Promise(res => {
            const img = new Image();
            img.onload = img.onerror = res;
            img.src = '/bookit.png';
          }),
        ]);

        // Preload hero video buffer so it plays seamlessly right after splash screen
        const heroVideoPromise = new Promise(resolve => {
          try {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.playsInline = true;
            const canWebm = Boolean(video.canPlayType && video.canPlayType('video/webm'));
            video.src = canWebm ? '/hero2.webm' : '/hero4k.mp4';

            let finished = false;
            const onReady = () => {
              if (!finished) {
                finished = true;
                video.removeEventListener('canplay', onReady);
                video.removeEventListener('canplaythrough', onReady);
                video.removeEventListener('loadeddata', onReady);
                video.removeEventListener('error', onReady);
                resolve(true);
              }
            };

            video.addEventListener('canplay', onReady);
            video.addEventListener('canplaythrough', onReady);
            video.addEventListener('loadeddata', onReady);
            video.addEventListener('error', onReady);

            // Timeout so slow connections don't block the splash screen
            setTimeout(onReady, 2200);
            video.load();
          } catch {
            resolve(true);
          }
        });

        const catalogPromise = TripFlowApi.getCatalogItems().catch(() => []);
        const authUserPromise = TripFlowApi.getMe().catch(() => null);

        const [, , user] = await Promise.all([
          assetPromise,
          catalogPromise,
          authUserPromise,
          heroVideoPromise,
        ]);

        if (user && !isCancelled) {
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

          // Concurrently fetch user's trips and vault
          const [trips, docs] = await Promise.all([
            TripFlowApi.getMyTrips().catch(() => []),
            TripFlowApi.getVaultDocuments().catch(() => []),
          ]);

          if (!isCancelled) {
            if (trips && trips.length > 0) {
              setBookedTrips(trips);
              setActiveBookedTripId(trips[0].id);
              if (trips[0].itinerary) {
                setCurrentItinerary(trips[0].itinerary);
              }
            } else {
              setBookedTrips([]);
              setActiveBookedTripId(null);
            }

            if (docs && docs.length > 0) {
              setVaultDocuments(docs);
            }
          }
        }
      } catch (err) {
        console.error('Splash background initialization error:', err);
      } finally {
        setIsTripsLoading(false);
        clearInterval(progressInterval);

        // Ensure minimum visual duration for smooth loading bar completion
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minSplashDuration - elapsed);

        setTimeout(() => {
          if (!isCancelled) {
            setSplashProgress(100);
            setTimeout(() => {
              if (!isCancelled) {
                setIsSplashVisible(false);
              }
            }, 250);
          }
        }, remainingDelay);
      }
    };

    loadBackgroundData();

    return () => {
      isCancelled = true;
      clearInterval(progressInterval);
    };
  }, []);

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
    navigateTo({ route: 'auth', authRole: role });
  };

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    if (user.role === 'operator') {
      navigateTo({ route: 'app', mode: 'operator', operatorTab: 'overview', tourId: null });
    } else {
      navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'home' });

      // Load their trips after login
      setIsTripsLoading(true);
      TripFlowApi.getMyTrips().then(trips => {
        if (trips && trips.length > 0) {
          setBookedTrips(trips);
          setActiveBookedTripId(trips[0].id);
          if (trips[0].itinerary) setCurrentItinerary(trips[0].itinerary);
        } else {
          setBookedTrips([]);
          setActiveBookedTripId(null);
        }
      }).finally(() => {
        setIsTripsLoading(false);
      });
      TripFlowApi.getVaultDocuments().then(docs => {
        if (docs && docs.length > 0) setVaultDocuments(docs);
      });
    }
    showToast(`Welcome, ${user.name}!`);
  };

  const handleSignOut = () => {
    TripFlowApi.logout();
    setAuthUser(null);
    // Clear all user-specific data so next login starts fresh
    setBookedTrips([]);
    setActiveBookedTripId(null);
    setVaultDocuments([]);
    navigateTo({ route: 'landing' });
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
      // Load Sarah's trips after demo login
      TripFlowApi.getMyTrips().then(trips => {
        if (trips && trips.length > 0) {
          setBookedTrips(trips);
          setActiveBookedTripId(trips[0].id);
          if (trips[0].itinerary) setCurrentItinerary(trips[0].itinerary);
        }
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
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'home' });
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
    navigateTo({ route: 'app', mode: 'operator', operatorTab: 'overview', tourId: null });
    showToast('Alex Vance logged in to Alpine & Beyond Operations Hub.');
  };

  const handleOpenItineraryBuilder = () => {
    setAuthUser({
      id: 'user-umme-1024',
      name: 'Umme hani Shaikh',
      email: 'ummeh@tripflow.io',
      role: 'traveler',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      membership: 'Standard Concierge Member',
    });
    setModifyingTripId(null);
    setCurrentItinerary(JAPAN_5DAY_ITINERARY);
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
    showToast('✨ Opened TripFlow Itinerary Builder!');
  };

  // Itinerary & Booking Flow Handlers
  const handleSelectPremadeTrip = (itinerary: TripItinerary) => {
    setCurrentItinerary(itinerary);
    setModifyingTripId(null);
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
    showToast(`Loaded "${itinerary.title}"! Customize activities, then proceed to booking.`);
  };

  const handleGenerateAITrip = async (params: AIGenerateParams) => {
    const backendItinerary = await TripFlowApi.generateAIItinerary(params);
    const generated = backendItinerary || generateAIItinerary(params);
    setCurrentItinerary(generated);
    setModifyingTripId(null);
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
    showToast(`✨ Generated ${generated.days.length}-Day Itinerary for ${params.destination}! Ready to personalize.`);
  };

  const handleOpenPayment = (
    itinerary: TripItinerary,
    totalPrice: number,
    _customization?: any
  ) => {
    setPaymentOverlayItinerary(itinerary);
    setPaymentOverlayPrice(totalPrice);
    setIsPaymentOverlayOpen(true);
  };

  const handlePaymentSuccess = async (
    itinerary: TripItinerary,
    totalPrice: number,
    paymentDetails: PaymentDetails,
    customizationDetails?: any
  ) => {
    const paymentMethodLabel = paymentDetails.cardLast4
      ? `Amex Concierge Card ending in ••${paymentDetails.cardLast4}`
      : paymentDetails.method === 'upi'
      ? `UPI (${paymentDetails.upiId || 'sarah@upi'})`
      : 'TripFlow Escrow Hold';

    const backendTrip = await TripFlowApi.checkoutBooking(
      itinerary,
      totalPrice,
      paymentMethodLabel,
      paymentDetails
    );

    const newTrip = backendTrip || convertItineraryToBookedTrip(itinerary, totalPrice, paymentDetails);
    newTrip.paymentDetails = paymentDetails;

    setBookedTrips(prev => [newTrip, ...prev.filter(t => t.id !== newTrip.id)]);
    setActiveBookedTripId(newTrip.id);
    setCurrentItinerary(itinerary);

    const newDocs = generateVaultDocsForTrip(newTrip);
    setVaultDocuments(prev => [...newDocs, ...prev]);
    setModifyingTripId(null);

    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'home' });

    addTravelerBooking(newTrip, customizationDetails);
    showToast(`🎉 Booking Confirmed! "${newTrip.title}" is now your active itinerary.`);
  };

  const handleProceedToBooking = async (
    itinerary: TripItinerary,
    totalPrice: number,
    customizationDetails?: any,
    paymentDetails?: PaymentDetails
  ) => {
    if (!paymentDetails) {
      handleOpenPayment(itinerary, totalPrice, customizationDetails);
      return;
    }
    await handlePaymentSuccess(itinerary, totalPrice, paymentDetails, customizationDetails);
  };

  const handleModifyTrip = (trip: BookedTrip) => {
    setCurrentItinerary(trip.itinerary);
    setModifyingTripId(trip.id);
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
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
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'trips' });
    showToast(`✅ Trip modifications saved! Package price updated to ₹${newTotal.toLocaleString('en-IN')}.`);
  };

  const handleViewInVault = (tripId?: string) => {
    if (tripId) {
      setVaultSelectedTripId(tripId);
    }
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'vault' });
    showToast('Filtered Travel Vault to your synchronized trip documents.');
  };

  const handleConsumerTabChange = (tab: ConsumerTab) => {
    if (tab === 'profile') {
      setIsProfileOpen(true);
      return;
    }
    navigateTo({ route: 'app', mode: 'consumer', consumerTab: tab });
  };

  return (
    <div className={`bg-[#F7F8FA] text-[#151c27] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white ${consumerTab === 'builder' || consumerTab === 'assistant' || consumerTab === 'story' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
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
          animateHero={!isSplashVisible}
        />
      )}

      {/* ========================================================= */}
      {/* ROUTE 2: SIMPLE ROLE AUTH SCREEN                          */}
      {/* ========================================================= */}
      {currentRoute === 'auth' && (
        <AuthScreen
          onLogin={handleLogin}
          onBackToLanding={() => navigateTo({ route: 'landing' })}
          initialRole={authModalRole}
          initialMode={authModalRole === 'operator' ? 'signup' : 'signin'}
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
            <div className={`flex-1 min-h-0 flex flex-col ${consumerTab === 'builder' || consumerTab === 'assistant' || consumerTab === 'story' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
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
                onGoToLanding={() => navigateTo({ route: 'landing' })}
                vaultCount={vaultDocuments.length}
              />

              <main className={`flex-1 min-h-0 flex flex-col ${
                consumerTab === 'builder'
                  ? 'h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden'
                  : consumerTab === 'assistant' || consumerTab === 'story'
                  ? 'h-[calc(100dvh-3.5rem-3.75rem)] md:h-[calc(100vh-3.5rem)] max-h-[calc(100dvh-3.5rem-3.75rem)] md:max-h-[calc(100vh-3.5rem)] overflow-hidden'
                  : 'pb-20 md:pb-8'
              }`}>
                {consumerTab === 'home' && (
                  <HomeScreen
                    onNavigateTab={handleConsumerTabChange}
                    onOpenPreferences={() => setIsPreferencesOpen(true)}
                    onOpenDirections={() =>
                      showToast('Navigation routes sent to your offline GPS map.')
                    }
                    onOpenContactDriver={() => setIsWhatsAppOpen(true)}
                    onSelectJourneyDetails={journey => setSelectedJourney(journey)}
                    onSelectPremadeTrip={handleSelectPremadeTrip}
                    onOpenPayment={handleOpenPayment}
                    bookedTrips={bookedTrips}
                    activeBookedTripId={activeBookedTripId}
                    userName={authUser?.name || 'Traveler'}
                    vaultCount={vaultDocuments.length}
                  />
                )}

                {/* Merged Trips and Bookings Section */}
                {(consumerTab === 'trips' || consumerTab === 'bookings') && (
                  <TripsAndBookingsScreen
                    initialView={consumerTab === 'bookings' ? 'bookings' : 'timeline'}
                    bookedTrips={bookedTrips}
                    isLoadingTrips={isTripsLoading}
                    activeTripId={activeBookedTripId ?? undefined}
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
                    onNavigateTab={handleConsumerTabChange}
                    onOpenItineraryInBuilder={(itinerary) => {
                      setCurrentItinerary(itinerary);
                      setModifyingTripId(null);
                      navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
                      showToast(`✨ Loaded "${itinerary.title}" in Itinerary Builder!`);
                    }}
                    onOpenPayment={(itinerary) => handleOpenPayment(itinerary, itinerary.totalPrice ?? 0)}
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
                    userName={authUser?.name || 'Traveler'}
                  />
                )}

                {consumerTab === 'discover' && (
                  <DiscoverScreen
                    onNavigateTab={handleConsumerTabChange}
                    onSelectPremadeTrip={handleSelectPremadeTrip}
                    onGenerateAITrip={handleGenerateAITrip}
                    onOpenAssistantWithPrompt={(prompt) => {
                      setAssistantInitialPrompt(prompt);
                      navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'assistant' });
                    }}
                    onOpenPayment={handleOpenPayment}
                    userName={authUser?.name || 'Traveler'}
                    userAvatar={authUser?.avatar || USER_AVATAR}
                  />
                )}

                {consumerTab === 'assistant' && (
                  <AssistantScreen
                    onNavigateTab={handleConsumerTabChange}
                    onOpenItineraryInBuilder={(itinerary) => {
                      setCurrentItinerary(itinerary);
                      setModifyingTripId(null);
                      navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
                      showToast(`✨ Loaded "${itinerary.title}" in Itinerary Builder!`);
                    }}
                    initialPrompt={assistantInitialPrompt}
                    onClearInitialPrompt={() => setAssistantInitialPrompt(null)}
                    currentUser={authUser}
                  />
                )}

                {consumerTab === 'story' && (
                  <StoryScreen
                    initialStoryId={selectedStoryId}
                    onPlanTripFromStory={(itinerary) => {
                      setCurrentItinerary(itinerary);
                      setModifyingTripId(null);
                      navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'builder' });
                      showToast(`✨ Loaded "${itinerary.title}" in Itinerary Builder!`);
                    }}
                    showToast={showToast}
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
                    onOpenPayment={handleOpenPayment}
                    showToast={showToast}
                    user={authUser}
                  />
                )}
              </main>

              {/* Mobile Bottom Navigation Bar */}
              {consumerTab !== 'builder' && (
                <MobileBottomNav
                  activeTab={consumerTab}
                  onTabChange={handleConsumerTabChange}
                />
              )}
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
                  navigateTo({ route: 'app', mode: 'operator', operatorTab: tab, tourId: null });
                }}
                onOpenNewDispatch={() => setIsCreatePackageOpen(true)}
                onOpenCreatePackage={() => setIsCreatePackageOpen(true)}
                onSwitchMode={mode => {
                  navigateTo({ route: 'app', mode });
                }}
                openIssuesCount={isDisruptionResolved ? 2 : 3}
                pendingCustomizedCount={pendingCustomizedCount}
                onGoToLanding={() => navigateTo({ route: 'landing' })}
                onSignOut={handleSignOut}
              />

              <div className="flex-1 ml-64 flex flex-col min-w-0">
                {operatorTourId ? (
                  <TourDetailScreen
                    onBackToOverview={() => {
                      navigateTo({ route: 'app', mode: 'operator', operatorTab: 'overview', tourId: null });
                    }}
                    onSwitchMode={mode => {
                      navigateTo({ route: 'app', mode });
                    }}
                    isDisruptionResolved={isDisruptionResolved}
                    onResolveDisruption={handleResolveDisruption}
                  />
                ) : (
                  <>
                    {(operatorTab === 'hub' || operatorTab === 'overview' || operatorTab === 'operations') && (
                      <OpsCommandHub
                        onInspectTour={tourId => {
                          navigateTo({ route: 'app', mode: 'operator', tourId });
                        }}
                        onOpenNewTour={() => setIsCreatePackageOpen(true)}
                        onOpenCreatePackage={() => setIsCreatePackageOpen(true)}
                        onNavigateToTab={tab => {
                          navigateTo({ route: 'app', mode: 'operator', operatorTab: tab, tourId: null });
                        }}
                        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                        isDisruptionResolved={isDisruptionResolved}
                        onResolveDisruption={handleResolveDisruption}
                      />
                    )}

                    {operatorTab === 'digital_twin' && (
                      <DigitalTwinScreen
                        showToast={showToast}
                        onNavigateTab={tab => {
                          navigateTo({ route: 'app', mode: 'operator', operatorTab: tab, tourId: null });
                        }}
                      />
                    )}

                    {operatorTab === 'packages' && (
                      <OperatorPackagesScreen
                        showToast={showToast}
                        onNavigateToDiscover={() => {
                          navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'discover' });
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
                        onTabChange={tab => {
                          navigateTo({ route: 'app', mode: 'operator', operatorTab: tab, tourId: null });
                        }}
                        showToast={showToast}
                      />
                    )}

                    {(operatorTab === 'bookings' || operatorTab === 'customers') && (
                      <BookingsInventoryScreen
                        activeCategory="all"
                        onInspectTour={tourId => {
                          navigateTo({ route: 'app', mode: 'operator', tourId });
                        }}
                        onNavigateToTab={tab => {
                          navigateTo({ route: 'app', mode: 'operator', operatorTab: tab, tourId: null });
                        }}
                        showToast={showToast}
                      />
                    )}

                    {operatorTab === 'vendors' && (
                      <VendorsSupplyScreen showToast={showToast} />
                    )}

                    {(operatorTab === 'cohorts' || operatorTab === 'tours') && (
                      <TourCohortsScreen
                        onInspectTour={tourId => {
                          navigateTo({ route: 'app', mode: 'operator', tourId });
                        }}
                        showToast={showToast}
                      />
                    )}

                    {operatorTab === 'guides' && (
                      <TourGuidesScreen showToast={showToast} />
                    )}

                    {operatorTab === 'alerts' && (
                      <ItineraryAlertsScreen
                        onInspectTour={tourId => {
                          navigateTo({ route: 'app', mode: 'operator', tourId });
                        }}
                        showToast={showToast}
                        onResolveDisruption={handleResolveDisruption}
                      />
                    )}

                    {operatorTab === 'payments' && (
                      <PaymentsLedgerScreen showToast={showToast} />
                    )}

                    {operatorTab === 'calendar' && (
                      <GlobalCalendarScreen
                        onInspectTour={tourId => {
                          navigateTo({ route: 'app', mode: 'operator', tourId });
                        }}
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
          navigateTo({ route: 'app', mode });
          setIsProfileOpen(false);
        }}
        onOpenPreferences={() => {
          setIsProfileOpen(false);
          setIsPreferencesOpen(true);
        }}
        onOpenVault={() => {
          setIsProfileOpen(false);
          handleViewInVault();
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
          navigateTo({ route: 'app', mode: 'consumer', consumerTab: tab });
        }}
        onNavigateOperator={tourId => {
          if (tourId) {
            navigateTo({ route: 'app', mode: 'operator', tourId });
          } else {
            navigateTo({ route: 'app', mode: 'operator', operatorTab: 'overview', tourId: null });
          }
        }}
        onSwitchMode={mode => {
          navigateTo({ route: 'app', mode });
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
          navigateTo({ route: 'app', mode: 'consumer', consumerTab: 'trips' });
        }}
        onReserveTour={journey => {
          setSelectedJourney(null);
          const matchedPkg = INITIAL_OPERATOR_PACKAGES.find(
            p => p.id === journey.id || p.title === journey.title || p.destination.toLowerCase() === journey.destination.toLowerCase()
          );
          const targetItinerary = matchedPkg?.itineraryTemplate || PREMADE_KERALA_ITINERARY;
          const priceNumeric = parseInt(journey.price.replace(/[^\d]/g, ''), 10) || matchedPkg?.totalPriceINR || 185000;
          handleOpenPayment(targetItinerary, priceNumeric);
        }}
      />

      {/* Global Payment & Tour Reservation Overlay Modal */}
      <PaymentOverlayModal
        isOpen={isPaymentOverlayOpen}
        onClose={() => setIsPaymentOverlayOpen(false)}
        itinerary={paymentOverlayItinerary}
        totalPrice={paymentOverlayPrice}
        onPaymentSuccess={handlePaymentSuccess}
        user={authUser}
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

      {/* Global Bookit Themed Toast Notification */}
      <ThemedToast
        message={toastNotification}
        onClose={() => setToastNotification(null)}
      />

      {/* Minimal Splash Screen with Logo and Loading Bar (No text) */}
      <SplashScreen isVisible={isSplashVisible} progress={splashProgress} />
    </div>
  );
}

export default function App() {
  return (
    <OperatorProvider>
      <BookitApp />
    </OperatorProvider>
  );
}
