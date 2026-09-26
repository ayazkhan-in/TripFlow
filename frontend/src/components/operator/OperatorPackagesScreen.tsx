import React, { useState, useMemo } from 'react';
import { useOperator } from '../../context/OperatorContext';
import { formatINR } from '../../utils/pricing';
import { OperatorCuratedPackage, getPackageAmenities } from '../../data/operatorPackagesData';
import { CreateTourPackageModal } from './CreateTourPackageModal';
import { LuxuryCard } from '../common/LuxuryCard';

interface OperatorPackagesScreenProps {
  showToast: (msg: string) => void;
  onNavigateToDiscover?: () => void;
  onOpenCreatePackageModal?: () => void;
}

const PRESET_QUICK_CIRCUITS = [
  {
    name: 'Kashmir Valley of Gold & Dal Lake Heritage',
    destination: 'Kashmir',
    country: 'India',
    isDomestic: true,
    days: 6,
    priceINR: 195000,
    tag: '🏔️ High Altitude Escapes',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    stops: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    inclusions: [
      'IndiGo DEL ➔ SXR Flight Included',
      'The Khyber Himalayan Resort & Private Shikara Villa',
      'Dedicated 4x4 Luxury Chauffeur Bashir Ahmed',
      'VIP Gulmarg Gondola Phase 2 Passes',
    ],
  },
  {
    name: 'Ladakh High Passes & Monasteries',
    destination: 'Ladakh',
    country: 'India',
    isDomestic: true,
    days: 7,
    priceINR: 235000,
    tag: '🛕 Buddhist Heritage',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    stops: ['Leh', 'Nubra Valley', 'Pangong Tso'],
    inclusions: [
      'Air India DEL ➔ IXL Non-stop Flight',
      'The Grand Dragon Ladakh & Luxury Glamping Yurt',
      'Toyota Fortuner Chauffeur Tundup Dorje',
      'Private Monastery Lama Blessings',
    ],
  },
  {
    name: 'Swiss Alpine Panoramic Rail & Glacier Express',
    destination: 'Swiss Alps',
    country: 'Switzerland',
    isDomestic: false,
    days: 6,
    priceINR: 490000,
    tag: '🚊 Glacier Express & Peaks',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    stops: ['Zürich', 'Zermatt', 'St. Moritz'],
    inclusions: [
      'Swiss International Air Lines BOM ➔ ZRH Business Class',
      'The Omnia Zermatt & Badrutt’s Palace St. Moritz',
      'Glacier Express Excellence Class Rail Passes',
      'Matterhorn Glacier Paradise Private Alpinist',
    ],
  },
  {
    name: 'Kerala Monsoon Whispers & Backwaters',
    destination: 'Kerala',
    country: 'India',
    isDomestic: true,
    days: 6,
    priceINR: 185000,
    tag: '🌴 Backwaters & Hills',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPNN2qoyEfvyOtZqIr504qTiJEZNQBFvkTNvnO1WbRHP3yVW547MfCw_uDAhSKK1GiCdNjUe-aRn8-L_63RS7R5Mwy4YqnpRnqP57KQq_CU-YFBVffy0PLU7ZdcbMNrxFCo6iB6Avjx862fxPTlkaaqd3BGyUp-55-M5LzxAfFv7qHZZE61cBMvjceJO4nQcz_Dorwpv3LBbNmV9TuAEfTYveWHC3LBVHpfXmUBrAgH70wL-s9i3orMA',
    stops: ['Cochin', 'Munnar', 'Alleppey'],
    inclusions: [
      'Air India BOM ➔ COK Flight Included',
      'Brunton Boatyard & Private Teak Houseboat',
      'Dedicated Chauffeur Arun V. (Innova Crysta)',
      'Kathakali Private Performance & Spice Walk',
    ],
  },
  {
    name: 'Imperial Rajasthan & Royal Palaces',
    destination: 'Rajasthan',
    country: 'India',
    isDomestic: true,
    days: 7,
    priceINR: 265000,
    tag: '🏰 Royal Palaces',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    stops: ['Jaipur', 'Jodhpur', 'Udaipur'],
    inclusions: [
      'IndiGo DEL ➔ JAI Flight Included',
      'Rambagh Palace & Taj Lake Palace Udaipur',
      'Private Chauffeur & Royal Historian Mahaveer Singh',
      'VIP Amber Fort Elephant & Palace Passes',
    ],
  },
  {
    name: 'Goa Coastal Luxury & Catamaran Charter',
    destination: 'Goa',
    country: 'India',
    isDomestic: true,
    days: 5,
    priceINR: 145000,
    tag: '🏖️ Coastal Indulgence',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    stops: ['Panaji', 'Candolim', 'Palolem'],
    inclusions: [
      'IndiGo Direct Flight to GOI / GOX Included',
      'Taj Fort Aguada & Luxury Catamaran Sunset Cruise',
      'Private Luxury Sedan & Airport Porter',
      'Chef-Curated Portuguese Tasting Dinner',
    ],
  },
];

const PRESET_IMAGE_OPTIONS = [
  { label: 'Kashmir', url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ladakh', url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kerala', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rajasthan', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
  { label: 'Goa', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
];

export const OperatorPackagesScreen: React.FC<OperatorPackagesScreenProps> = ({
  showToast,
  onNavigateToDiscover,
  onOpenCreatePackageModal,
}) => {
  const { packages, createPackage, packageBookings, pendingCustomizedCount } = useOperator();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'studio' | 'insights'>('catalog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterScope, setFilterScope] = useState<'all' | 'domestic' | 'international'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Inline Quick Creator State
  const [title, setTitle] = useState('Kashmir Valley of Gold & Dal Lake Heritage');
  const [destination, setDestination] = useState('Kashmir');
  const [country, setCountry] = useState('India');
  const [isDomestic, setIsDomestic] = useState(true);
  const [days, setDays] = useState<number>(6);
  const [priceINR, setPriceINR] = useState<number>(195000);
  const [tag, setTag] = useState('🏔️ High Altitude Escapes');
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'
  );
  const [routeStopsInput, setRouteStopsInput] = useState('Srinagar, Gulmarg, Pahalgam');
  const [inclusionsInput, setInclusionsInput] = useState(
    'IndiGo DEL ➔ SXR Flight Included\nThe Khyber Himalayan Resort & Dal Lake Houseboat\nDedicated 4x4 Chauffeur Bashir Ahmed\nVIP Gulmarg Gondola Passes'
  );
  const [directorName, setDirectorName] = useState('Alex Vance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      if (filterScope === 'domestic' && !pkg.isDomestic) return false;
      if (filterScope === 'international' && pkg.isDomestic) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = pkg.title.toLowerCase().includes(q);
        const inDest = pkg.destination.toLowerCase().includes(q);
        const inCountry = pkg.country.toLowerCase().includes(q);
        return inTitle || inDest || inCountry;
      }
      return true;
    });
  }, [packages, filterScope, searchQuery]);

  const handleApplyPreset = (preset: typeof PRESET_QUICK_CIRCUITS[0]) => {
    setTitle(preset.name);
    setDestination(preset.destination);
    setCountry(preset.country);
    setIsDomestic(preset.isDomestic);
    setDays(preset.days);
    setPriceINR(preset.priceINR);
    setTag(preset.tag);
    setHeroImage(preset.image);
    setRouteStopsInput(preset.stops.join(', '));
    setInclusionsInput(preset.inclusions.join('\n'));
    setActiveSubTab('studio');
    showToast(`Loaded preset "${preset.name}" into Studio in INR (₹)`);
  };

  const handlePublishFromStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim()) return;

    setIsSubmitting(true);

    const stops = routeStopsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const inclusions = inclusionsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newPkg = createPackage({
      title: title.trim(),
      destination: destination.trim(),
      country: country.trim() || 'India',
      isDomestic,
      days: Number(days) || 5,
      totalPriceINR: Number(priceINR) || 180000,
      heroImage: heroImage.trim(),
      tag: tag.trim(),
      routeStops: stops.length > 0 ? stops : [destination],
      inclusions: inclusions.length > 0 ? inclusions : ['Flight Included', 'Luxury Hotel', 'Private Chauffeur'],
      operatorDirector: directorName.trim() || 'Alex Vance',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`🚀 Published "${newPkg.title}" at ${formatINR(newPkg.totalPriceINR)} live to Discover!`);
      setActiveSubTab('catalog');
    }, 400);
  };

  const totalWholesaleValue = packages.reduce((sum, p) => sum + p.totalPriceINR, 0);
  const avgPackagePrice = Math.round(totalWholesaleValue / (packages.length || 1));

  return (
    <div className="flex-1 bg-slate-50/60 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* LUXURY SCENIC FROSTED OPERATOR HEADER */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/5 border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        {/* Scenic Mountain Background Silhouette with Soft Frosted Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
            alt="Misty Mountain Scenic Landscape"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Frosted White & Sky Gradient Overlay that preserves mountain visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/70 to-white/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            {/* Tag */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>TOUR PACKAGE ENGINE</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Tour Packages & Creator Studio
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
              Curate multi-day circuits, set wholesale tariffs in INR, and publish directly to travelers in the Discover marketplace.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {onNavigateToDiscover && (
              <button
                type="button"
                onClick={onNavigateToDiscover}
                className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-base text-slate-700">visibility</span>
                <span>Preview Discover Feed</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/25 border border-blue-400/40 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Create Tour Package</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-200/80">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              PUBLISHED CIRCUITS
            </span>
            <div className="text-2xl font-black text-slate-900">{packages.length} Packages</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>100% Discover Active</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              WHOLESALE VALUATION
            </span>
            <div className="text-2xl font-black text-slate-900">{formatINR(totalWholesaleValue)}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Total catalog inventory</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              AVERAGE CIRCUIT RATE
            </span>
            <div className="text-2xl font-black text-slate-900">{formatINR(avgPackagePrice)}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">All-inclusive per package</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              TRAVELER BOOKINGS
            </span>
            <div className="text-2xl font-black text-slate-900">{packageBookings.length} Manifests</div>
            <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>
                {pendingCustomizedCount > 0 ? `${pendingCustomizedCount} customized awaiting dispatch` : 'All dispatched'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl w-fit text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubTab('catalog')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            <span>Live Packages Catalog ({packages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('studio')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'studio'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base text-blue-600">tune</span>
            <span>Package Creator Studio</span>
            <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold">
              Author
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('insights')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'insights'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">insights</span>
            <span>Customizations & Analytics</span>
            {pendingCustomizedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                {pendingCustomizedCount}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'catalog' && (
          <div className="flex items-center gap-2">
            <div className="flex bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-semibold shadow-2xs">
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-[16px] block">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-[16px] block">format_list_bulleted</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Create New Package</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LIVE PACKAGES CATALOG                              */}
      {/* ========================================================= */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          {/* Preset Circuits Quick Carousel Strip */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  ⚡ 1-Click Signature Circuit Templates
                </span>
                <span className="text-[11px] text-slate-500">
                  Pre-configured high-conversion circuits with wholesale INR tariffs ready to populate in Studio.
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-600">All prices in INR (₹)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
              {PRESET_QUICK_CIRCUITS.map((tmpl, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(tmpl)}
                  className="p-3 bg-slate-50 hover:bg-blue-50/80 hover:border-blue-400 border border-slate-200/80 rounded-xl transition-all cursor-pointer group flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">
                        {tmpl.isDomestic ? 'Domestic' : 'Global'} · {tmpl.days}D
                      </span>
                      <span className="text-[11px] font-extrabold text-blue-700 font-mono">
                        {formatINR(tmpl.priceINR)}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700">
                      {tmpl.name}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{tmpl.destination}</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      Load ➔
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-semibold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFilterScope('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterScope === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({packages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterScope('domestic')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterScope === 'domestic' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Domestic India ({packages.filter(p => p.isDomestic).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterScope('international')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterScope === 'international' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  International ({packages.filter(p => !p.isDomestic).length})
                </button>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search packages, cities, director..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
              <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-2.5 top-2">
                search
              </span>
            </div>
          </div>

          {/* VIEW: GRID LAYOUT (Matches Traveler Discover Page with tight, clean gaps) */}
          {viewLayout === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,320px))] gap-4 sm:gap-5 justify-items-center sm:justify-items-start">
              {filteredPackages.map(pkg => (
                <div key={pkg.id} className="relative group w-full max-w-[320px]">
                  <LuxuryCard
                    id={pkg.id}
                    title={pkg.title}
                    description={`${pkg.days} Days · ${pkg.destination} · Curated by ${pkg.operator.name}`}
                    image={pkg.heroImage}
                    rating={`${pkg.operator.rating}/5`}
                    kicker={`${pkg.operator.name} · ${pkg.destination}`}
                    badge={pkg.isNewlyCreated ? 'Operator Published' : pkg.badgeText}
                    badgeColor={pkg.isDomestic ? 'emerald' : 'dark'}
                    amenities={getPackageAmenities(pkg)}
                    price={`₹${pkg.totalPriceINR.toLocaleString('en-IN')}`}
                    pricePeriod="/package"
                    actionVariant="button"
                    actionLabel="Reserve Tour"
                    theme="light"
                    className="w-full max-w-[320px]"
                    onActionClick={(e) => {
                      e.stopPropagation();
                      if (onNavigateToDiscover) {
                        onNavigateToDiscover();
                      } else {
                        showToast(`Package "${pkg.title}" is published on Discover`);
                      }
                    }}
                    onClick={() => {
                      if (onNavigateToDiscover) {
                        onNavigateToDiscover();
                      } else {
                        showToast(`Package "${pkg.title}" is published on Discover`);
                      }
                    }}
                  />

                  {/* Operator Quick Edit Overlay Button */}
                  <div className="absolute top-3.5 right-12 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTitle(pkg.title);
                        setDestination(pkg.destination);
                        setCountry(pkg.country);
                        setIsDomestic(pkg.isDomestic);
                        setDays(pkg.days);
                        setPriceINR(pkg.totalPriceINR);
                        setHeroImage(pkg.heroImage);
                        setTag(pkg.tag);
                        setRouteStopsInput(pkg.routeStops.map(s => s.city).join(', '));
                        setInclusionsInput(pkg.inclusions.map(i => i.text).join('\n'));
                        setDirectorName(pkg.operator.leadDirector);
                        setActiveSubTab('studio');
                        showToast(`Loaded "${pkg.title}" into Studio for editing`);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/95 hover:bg-white text-slate-800 text-[10px] font-bold shadow-md border border-slate-200/90 backdrop-blur-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      title="Load into Studio"
                    >
                      <span className="material-symbols-outlined text-xs text-blue-600">edit</span>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: TABLE LAYOUT */}
          {viewLayout === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Package Title & Circuit</th>
                    <th className="p-4">Scope</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Wholesale Rate (INR)</th>
                    <th className="p-4">Lead Director</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPackages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.heroImage}
                            alt={pkg.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm line-clamp-1">{pkg.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {pkg.destination}, {pkg.country} · {pkg.routeStops.map(s => s.city).join(' ➔ ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {pkg.isDomestic ? 'Domestic India' : 'International'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        {pkg.days} Days / {pkg.days - 1} Nights
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                        {formatINR(pkg.totalPriceINR)}
                      </td>
                      <td className="p-4 text-slate-700 font-medium">
                        {pkg.operator.leadDirector}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Live on Discover
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {onNavigateToDiscover && (
                          <button
                            type="button"
                            onClick={onNavigateToDiscover}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PACKAGE CREATOR STUDIO                             */}
      {/* ========================================================= */}
      {activeSubTab === 'studio' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-bold">
                Tour Authoring Canvas
              </span>
              <h2 className="text-lg font-bold tracking-tight mt-1">
                Design & Publish New Tour Circuit (INR Pricing)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure itinerary parameters in Indian Rupees. When published, this package immediately appears on traveler Discover feeds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Discover Sync Active</span>
              </span>
            </div>
          </div>

          <form onSubmit={handlePublishFromStudio} className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT 7 COLS: FORM CONTROLS */}
            <div className="lg:col-span-7 space-y-6 text-xs">
              {/* Section 1: Core Package Identity */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-600">badge</span>
                    <span>1. Circuit Identity & Destination</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">* Required</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Tour Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Kashmir Valley of Gold & Dal Lake Heritage"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Primary Destination *
                    </label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      placeholder="e.g. Kashmir"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="e.g. India"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Scope / Market
                    </label>
                    <div className="flex bg-slate-200/70 p-0.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsDomestic(true)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isDomestic ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Domestic India
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDomestic(false)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !isDomestic ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        International
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Theme Tag
                    </label>
                    <input
                      type="text"
                      value={tag}
                      onChange={e => setTag(e.target.value)}
                      placeholder="e.g. 🏔️ High Altitude Escapes"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Duration & INR Pricing */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-600">currency_rupee</span>
                    <span>2. Duration & INR Wholesale Tariff</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    Calculated: {formatINR(Math.round(priceINR / Math.max(1, days)))} / day
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Duration (Days)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={days}
                        onChange={e => setDays(Number(e.target.value))}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                      <span className="text-xs text-slate-500 font-medium">
                        ({days - 1} Nights Itinerary)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Base Package Price (in INR ₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        step={5000}
                        required
                        value={priceINR}
                        onChange={e => setPriceINR(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick INR Stepper Chips */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick INR Stepper Adjustments
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[145000, 185000, 195000, 235000, 265000, 350000, 490000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPriceINR(amt)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          priceINR === amt
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {formatINR(amt)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Route Stops & Inclusions */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">route</span>
                  <span>3. Route Itinerary & Wholesale Inclusions</span>
                </h3>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Route Stops & Waypoints (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={routeStopsInput}
                    onChange={e => setRouteStopsInput(e.target.value)}
                    placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Travelers will see these stops linked with high-speed rail/chauffeur waypoints.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Wholesale Inclusions (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={inclusionsInput}
                    onChange={e => setInclusionsInput(e.target.value)}
                    placeholder="Air India DEL ➔ SXR Flights&#10;The Khyber Himalayan Resort & Spa&#10;Dedicated 4x4 Chauffeur&#10;VIP Gondola Passes"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 font-mono shadow-2xs"
                  />
                </div>
              </div>

              {/* Section 4: Imagery & Signature */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">photo_library</span>
                  <span>4. Imagery & Lead Director Signature</span>
                </h3>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Hero Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={heroImage}
                    onChange={e => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                {/* Quick Photo Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Photo Presets:</span>
                  {PRESET_IMAGE_OPTIONS.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHeroImage(img.url)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        heroImage === img.url
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Lead Dispatch Director Attribution
                  </label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={e => setDirectorName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setDestination('');
                    setCountry('');
                    setRouteStopsInput('');
                    setInclusionsInput('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Clear Fields
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  <span>{isSubmitting ? 'Publishing...' : `Publish to Discover (${formatINR(priceINR)})`}</span>
                </button>
              </div>
            </div>

            {/* RIGHT 5 COLS: LIVE DISCOVER SIMULATOR */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Live Traveler Discover Simulator Card (Exact LuxuryCard from Discover) */}
                <div className="flex justify-center">
                  <LuxuryCard
                    id="studio-live-preview"
                    title={title || 'Tour Package Title'}
                    description={`${days} Days · ${destination || 'Destination'} · Curated by ${directorName || 'Bookit Concierge'}`}
                    image={heroImage || PRESET_IMAGE_OPTIONS[0].url}
                    rating="4.9/5"
                    kicker={`${directorName || 'Bookit Concierge'} · ${destination || 'Signature Circuit'}`}
                    badge="Operator Published"
                    badgeColor={isDomestic ? 'emerald' : 'dark'}
                    amenities={[
                      { icon: 'calendar_today', label: `${days} Days` },
                      { icon: 'group', label: '2 Guests' },
                      { icon: 'route', label: routeStopsInput.split(',')[0]?.trim() || destination || 'Circuit' },
                      ...inclusionsInput
                        .split('\n')
                        .map(s => s.trim())
                        .filter(Boolean)
                        .slice(0, 3)
                        .map(inc => {
                          let label = inc;
                          if (label.includes('Flight')) label = 'Flight Inc.';
                          else if (label.includes('Chauffeur')) label = 'Chauffeur';
                          else if (label.includes('Hotel') || label.includes('Resort') || label.includes('Villa') || label.includes('Palace')) label = '5-Star Stay';
                          else if (label.includes('Pass') || label.includes('Ticket')) label = 'VIP Access';
                          return { icon: 'check_circle', label };
                        }),
                    ]}
                    price={`₹${(Number(priceINR) || 180000).toLocaleString('en-IN')}`}
                    pricePeriod="/package"
                    actionVariant="button"
                    actionLabel="Reserve Tour"
                    theme="light"
                    className="w-full max-w-[340px]"
                    onActionClick={() => showToast('Simulator: Displays live Discover traveler card')}
                    onClick={() => showToast('Simulator: Displays live Discover traveler card')}
                  />
                </div>

                {/* Day-by-Day Route Itinerary preview */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="font-bold text-slate-800 text-xs">
                    📅 Generated Circuit Schedule ({days} Days)
                  </div>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>Arrival at {destination} · Airport Tarmac Meet & Chauffeur Transfer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>Private Heritage & Guided Circuit Exploration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {days}
                      </span>
                      <span>Farewell Breakfast & Return VIP Transfer</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">sync_alt</span>
                  <span>End-to-End Traveler Customization Guarantee</span>
                </div>
                <p className="text-blue-800/80">
                  When a traveler browses this package in Discover, clicks "Customize & Book", adds extra activities or upgrades stays, their customized order will appear in your <strong>Package Bookings</strong> manifest with full fulfillment dispatch controls.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CUSTOMIZATIONS & ANALYTICS                         */}
      {/* ========================================================= */}
      {activeSubTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Customization Rate
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">82%</div>
              <p className="text-xs text-slate-500 mt-1">
                Travelers modifying stays or chauffeur preferences before confirming booking.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Avg Upgrade Value (INR)
              </span>
              <div className="text-3xl font-black text-blue-600 mt-1 font-mono">
                +₹38,500
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Added revenue per booking from hotel suite upgrades & private guides.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Fulfillment Health
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">99.4%</div>
              <p className="text-xs text-slate-500 mt-1">
                Vouchers generated and chauffeur rosters confirmed on schedule.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Top Requested Traveler Modifications Across Packages
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Private Teak Houseboat Upgrade (Kerala)', count: '14 Travelers', pct: 78 },
                { label: 'Chauffeur Vehicle Upgrade to Innova Crysta / Fortuner', count: '12 Travelers', pct: 64 },
                { label: 'Private Royal Historian & Palace Evening Pass (Rajasthan)', count: '9 Travelers', pct: 51 },
                { label: 'Matterhorn Helicopter Flight & Champagne Tasting (Swiss Alps)', count: '5 Travelers', pct: 38 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-slate-500">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Tour Package Modal */}
      <CreateTourPackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showToast={showToast}
        onPackageCreated={pkgTitle => {
          setActiveSubTab('catalog');
          setFilterScope('all');
          setSearchQuery('');
        }}
      />
    </div>
  );
};
