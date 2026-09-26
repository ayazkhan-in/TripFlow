/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsumerTab, OperatorTab, ViewMode } from '../types/travel';

export type AppRoute = 'landing' | 'auth' | 'app';

export interface RouteState {
  currentRoute: AppRoute;
  viewMode: ViewMode;
  consumerTab: ConsumerTab;
  operatorTab: OperatorTab;
  operatorTourId: string | null;
  authRole?: 'traveler' | 'operator';
}

/**
 * Maps current URL pathname to internal application state.
 */
export function parseUrlPath(pathname: string): RouteState {
  // Normalize path by stripping trailing slash
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  // Root / Landing
  if (!cleanPath || cleanPath === '/' || cleanPath === '/landing') {
    return {
      currentRoute: 'landing',
      viewMode: 'consumer',
      consumerTab: 'home',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  // Auth routes
  if (cleanPath === '/auth' || cleanPath === '/login' || cleanPath === '/signin') {
    return {
      currentRoute: 'auth',
      viewMode: 'consumer',
      consumerTab: 'home',
      operatorTab: 'overview',
      operatorTourId: null,
      authRole: 'traveler',
    };
  }

  if (cleanPath === '/auth/operator' || cleanPath === '/operator/login' || cleanPath === '/operator/register') {
    return {
      currentRoute: 'auth',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'overview',
      operatorTourId: null,
      authRole: 'operator',
    };
  }

  // Operator tour detail route: /operator/tour/:tourId
  if (cleanPath.startsWith('/operator/tour/')) {
    const tourId = cleanPath.replace('/operator/tour/', '');
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'overview',
      operatorTourId: decodeURIComponent(tourId),
    };
  }

  // Specific Operator tabs
  if (cleanPath === '/operator' || cleanPath === '/operator/hub' || cleanPath === '/operator/overview') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'hub',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/packages') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'packages',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/bookings' || cleanPath === '/operator/package-bookings') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'bookings',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/bookings/flights' || cleanPath === '/operator/flight-bookings') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'flight_bookings',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/bookings/stays' || cleanPath === '/operator/stay-bookings') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'stay_bookings',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/bookings/transfers' || cleanPath === '/operator/transfer-bookings') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'transfer_bookings',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/bookings/activities' || cleanPath === '/operator/activity-bookings') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'activity_bookings',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/vendors') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'vendors',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/cohorts' || cleanPath === '/operator/tours') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'cohorts',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/guides') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'guides',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/alerts') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'alerts',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/payments') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'payments',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/operator/calendar') {
    return {
      currentRoute: 'app',
      viewMode: 'operator',
      consumerTab: 'home',
      operatorTab: 'calendar',
      operatorTourId: null,
    };
  }

  // Consumer / Traveler routes
  if (cleanPath === '/home') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'home',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/discover' || cleanPath === '/explore') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'discover',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/story' || cleanPath === '/stories') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'story',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/assistant' || cleanPath === '/ai') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'assistant',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/builder' || cleanPath === '/itinerary-builder') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'builder',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/trips' || cleanPath === '/my-trips') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'trips',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/bookings') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'bookings',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  if (cleanPath === '/vault') {
    return {
      currentRoute: 'app',
      viewMode: 'consumer',
      consumerTab: 'vault',
      operatorTab: 'overview',
      operatorTourId: null,
    };
  }

  // Fallback: Default to landing
  return {
    currentRoute: 'landing',
    viewMode: 'consumer',
    consumerTab: 'home',
    operatorTab: 'overview',
    operatorTourId: null,
  };
}

/**
 * Formats state back to a canonical URL path.
 */
export function formatUrlPath(state: {
  currentRoute: AppRoute;
  viewMode: ViewMode;
  consumerTab: ConsumerTab;
  operatorTab: OperatorTab;
  operatorTourId?: string | null;
  authRole?: 'traveler' | 'operator';
}): string {
  if (state.currentRoute === 'landing') {
    return '/';
  }

  if (state.currentRoute === 'auth') {
    return state.authRole === 'operator' ? '/auth/operator' : '/auth';
  }

  if (state.viewMode === 'operator') {
    if (state.operatorTourId) {
      return `/operator/tour/${encodeURIComponent(state.operatorTourId)}`;
    }
    switch (state.operatorTab) {
      case 'hub':
      case 'overview':
      case 'operations':
        return '/operator';
      case 'packages':
        return '/operator/packages';
      case 'bookings':
      case 'customers':
        return '/operator/bookings';
      case 'flight_bookings':
        return '/operator/bookings/flights';
      case 'stay_bookings':
        return '/operator/bookings/stays';
      case 'transfer_bookings':
        return '/operator/bookings/transfers';
      case 'activity_bookings':
        return '/operator/bookings/activities';
      case 'vendors':
        return '/operator/vendors';
      case 'cohorts':
      case 'tours':
        return '/operator/cohorts';
      case 'guides':
        return '/operator/guides';
      case 'alerts':
        return '/operator/alerts';
      case 'payments':
        return '/operator/payments';
      case 'calendar':
        return '/operator/calendar';
      default:
        return '/operator';
    }
  }

  // Consumer view
  switch (state.consumerTab) {
    case 'home':
      return '/home';
    case 'discover':
      return '/discover';
    case 'story':
      return '/story';
    case 'assistant':
      return '/assistant';
    case 'builder':
      return '/builder';
    case 'trips':
      return '/trips';
    case 'bookings':
      return '/bookings';
    case 'vault':
      return '/vault';
    default:
      return '/home';
  }
}
