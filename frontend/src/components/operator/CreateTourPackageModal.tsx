import React, { useState, useEffect } from 'react';
import { useOperator } from '../../context/OperatorContext';
import { formatINR } from '../../utils/pricing';
import { LuxuryCard } from '../common/LuxuryCard';

interface CreateTourPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  onPackageCreated?: (pkgTitle: string) => void;
}

const PRESET_TEMPLATES = [
  {
    name: 'Kerala Backwaters Escape',
    tourType: 'Luxury Escape',
    destination: 'Kerala, India',
    country: 'India',
    isDomestic: true,
    days: 5,
    durationText: '5 Days 4 Nights',
    priceINR: 185000,
    tag: '🌴 Tropical Backwaters',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Immerse in the tranquil waterways of Alleppey and misty tea plantations of Munnar with private luxury houseboats and 5-star heritage retreats.',
    highlights: ['Houseboat Stay', 'Backwater Cruise', 'Local Cuisine', 'Munnar Tea Plantations'],
    stops: ['Cochin', 'Munnar', 'Alleppey'],
    inclusions: [
      'Air India BOM ➔ COK Flight Included',
      'The Brunton Boatyard & Private Luxury Houseboat',
      'Dedicated Chauffeur & Private Innova Crysta',
      'Daily Gourmet Breakfast & Chef Dinners',
      'Kathakali Cultural VIP Passes',
    ],
  },
  {
    name: 'Kashmir Valley of Gold',
    tourType: 'Mountain Adventure',
    destination: 'Kashmir, India',
    country: 'India',
    isDomestic: true,
    days: 6,
    durationText: '6 Days 5 Nights',
    priceINR: 195000,
    tag: '🏔️ High Altitude Escapes',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke valley exploration featuring the Dal Lake shikara luxury, Gulmarg Gondola Phase 2 access, and pine forest retreats.',
    highlights: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Pahalgam Valley', 'Wazwan Dining'],
    stops: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    inclusions: [
      'IndiGo DEL ➔ SXR Flight Included',
      'The Khyber Himalayan Resort & Private Dal Lake Shikara Villa',
      'Dedicated 4x4 Luxury Chauffeur Bashir Ahmed',
      'VIP Gulmarg Gondola Phase 2 Passes & Heritage Permits',
    ],
  },
  {
    name: 'Imperial Rajasthan & Royal Palaces',
    tourType: 'Cultural Heritage',
    destination: 'Rajasthan, India',
    country: 'India',
    isDomestic: true,
    days: 7,
    durationText: '7 Days 6 Nights',
    priceINR: 265000,
    tag: '🏰 Royal Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'Experience majestic forts, royal royal courtyards, and Thar desert luxury glamping with personal palace historians.',
    highlights: ['Palace Stays', 'Amber Fort Safari', 'Thar Glamping', 'Royal Banquets'],
    stops: ['Jaipur', 'Jodhpur', 'Udaipur'],
    inclusions: [
      'SpiceJet DEL ➔ JAI Flight Included',
      'Rambagh Palace & Taj Lake Palace Heritage Suites',
      'Private Vintage Car Chauffeur Transfer',
      'Private Amber Fort Sunset Champagne Tour',
    ],
  },
  {
    name: 'Swiss Alpine Panoramic Rail',
    tourType: 'Luxury Escape',
    destination: 'Swiss Alps, Switzerland',
    country: 'Switzerland',
    isDomestic: false,
    days: 6,
    durationText: '6 Days 5 Nights',
    priceINR: 490000,
    tag: '🚊 Glacier Express & Peaks',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'Traverse the majestic Swiss Alps aboard the Glacier Express Excellence Class with 5-star mountain chalet stays.',
    highlights: ['Glacier Express', 'Matterhorn Views', 'Luxury Chalet', 'Swiss Gastronomy'],
    stops: ['Zürich', 'Zermatt', 'St. Moritz'],
    inclusions: [
      'Swiss International Air Lines BOM ➔ ZRH Business Class',
      'The Omnia Zermatt & Badrutt’s Palace St. Moritz',
      'Glacier Express Excellence Class Luxury Rail Passes',
      'Matterhorn Glacier Paradise Private Alpinist Guide',
    ],
  },
];

const CURATED_PHOTO_PRESETS = [
  { label: 'Kerala Backwaters', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rajasthan Palaces', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kashmir Valley', url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Goa Coastal', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tokyo Heritage', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bali Retreat', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Parisian Grand', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
];

export const CreateTourPackageModal: React.FC<CreateTourPackageModalProps> = ({
  isOpen,
  onClose,
  showToast,
  onPackageCreated,
}) => {
  const { createPackage } = useOperator();

  // Active step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State matching Reference Screenshot
  const [title, setTitle] = useState('Kerala Backwaters Escape');
  const [tourType, setTourType] = useState('Luxury Escape');
  const [destination, setDestination] = useState('Kerala, India');
  const [country, setCountry] = useState('India');
  const [isDomestic, setIsDomestic] = useState(true);
  const [durationText, setDurationText] = useState('5 Days 4 Nights');
  const [days, setDays] = useState<number>(5);
  const [shortDescription, setShortDescription] = useState(
    'Private luxury houseboat journey through tranquil palm-fringed lagoons, colonial spice walks in Fort Kochi, and tea garden boutique estates.'
  );
  const [highlights, setHighlights] = useState<string[]>([
    'Houseboat Stay',
    'Backwater Cruise',
    'Local Cuisine',
  ]);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [isAddingHighlight, setIsAddingHighlight] = useState(false);

  // Step 2 & 3: Itinerary & Pricing
  const [routeStops, setRouteStops] = useState<string[]>(['Cochin', 'Munnar', 'Alleppey']);
  const [newStopInput, setNewStopInput] = useState('');
  const [priceINR, setPriceINR] = useState<number>(185000);
  const [inclusions, setInclusions] = useState<string[]>([
    'Air India BOM ➔ COK Flight Included',
    'The Brunton Boatyard & Private Luxury Houseboat',
    'Dedicated Chauffeur & Private Innova Crysta',
    'Daily Gourmet Breakfast & Chef Dinners',
    'Kathakali Cultural VIP Passes',
  ]);
  const [newInclusionInput, setNewInclusionInput] = useState('');

  // Step 4: Media
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  );
  const [tag, setTag] = useState('🌴 Tropical Backwaters');
  const [directorName, setDirectorName] = useState('Alex Vance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle preset autofill
  const handleApplyPreset = (tmpl: typeof PRESET_TEMPLATES[0]) => {
    setTitle(tmpl.name);
    setTourType(tmpl.tourType);
    setDestination(tmpl.destination);
    setCountry(tmpl.country);
    setIsDomestic(tmpl.isDomestic);
    setDays(tmpl.days);
    setDurationText(tmpl.durationText);
    setShortDescription(tmpl.description);
    setHighlights(tmpl.highlights);
    setRouteStops(tmpl.stops);
    setInclusions(tmpl.inclusions);
    setHeroImage(tmpl.image);
    setTag(tmpl.tag);
    showToast(`Autofilled template: "${tmpl.name}"`);
  };

  // Add / Remove Highlight
  const handleAddHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHighlightInput.trim()) return;
    setHighlights(prev => [...prev, newHighlightInput.trim()]);
    setNewHighlightInput('');
    setIsAddingHighlight(false);
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== idx));
  };

  // Add / Remove Route Stop
  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopInput.trim()) return;
    setRouteStops(prev => [...prev, newStopInput.trim()]);
    setNewStopInput('');
  };

  const handleRemoveStop = (idx: number) => {
    if (routeStops.length <= 1) return;
    setRouteStops(prev => prev.filter((_, i) => i !== idx));
  };

  // Add / Remove Inclusion
  const handleAddInclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInclusionInput.trim()) return;
    setInclusions(prev => [...prev, newInclusionInput.trim()]);
    setNewInclusionInput('');
  };

  const handleRemoveInclusion = (idx: number) => {
    setInclusions(prev => prev.filter((_, i) => i !== idx));
  };

  // Final Submit
  const handleFinalSubmit = () => {
    if (!title.trim() || !destination.trim()) {
      showToast('Please enter Package Name and Destination');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    const newPkg = createPackage({
      title: title.trim(),
      destination: destination.trim(),
      country: country.trim() || 'India',
      isDomestic,
      days: Number(days) || 5,
      totalPriceINR: Number(priceINR) || 180000,
      heroImage: heroImage.trim(),
      tag: tag.trim() || tourType,
      routeStops: routeStops.length > 0 ? routeStops : [destination],
      inclusions: inclusions.length > 0 ? inclusions : ['Flight Included', 'Luxury Hotel', 'Private Chauffeur'],
      operatorDirector: directorName.trim() || 'Alex Vance',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`🚀 Published "${newPkg.title}" live to Discover!`);
      if (onPackageCreated) {
        onPackageCreated(newPkg.title);
      }
      onClose();
    }, 400);
  };

  // Generate dynamic amenities for the live LuxuryCard preview
  const liveAmenities = [
    { icon: 'calendar_today', label: `${days} Days` },
    { icon: 'group', label: '2 Guests' },
    {
      icon: 'route',
      label: routeStops.length > 2
        ? `${routeStops.length} Stops`
        : routeStops.length === 2
        ? `${routeStops[0]} → ${routeStops[1]}`
        : routeStops[0] || destination.split(',')[0] || 'Circuit',
    },
    ...inclusions.slice(0, 3).map(inc => {
      let label = inc;
      if (label.includes('Flight')) label = 'Flight Inc.';
      else if (label.includes('Chauffeur') || label.includes('Transfer') || label.includes('Car')) label = 'Chauffeur';
      else if (
        label.includes('Hotel') ||
        label.includes('Resort') ||
        label.includes('Villa') ||
        label.includes('Boatyard') ||
        label.includes('Palace') ||
        label.includes('Stay')
      )
        label = '5-Star Stay';
      else if (label.includes('Pass') || label.includes('Ticket') || label.includes('Permit')) label = 'VIP Access';
      else if (label.includes('Houseboat') || label.includes('Cruise') || label.includes('Sailing')) label = 'Private Cruise';
      return { icon: 'check_circle', label };
    }),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] text-left animate-in zoom-in-95 duration-200 select-none">
        {/* HEADER matching Reference Image */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Create Tour Package
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Set up a new tour package and publish it to travelers.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* 3-COLUMN CONTENT BODY */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          {/* COLUMN 1: LEFT STEPPER NAVIGATION (Exact style from reference screenshot) */}
          <div className="w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 p-4 lg:p-5 space-y-1.5 bg-slate-50/50">
            {/* Step 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-blue-50/90 text-blue-700'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <div>
                <span className={`text-xs font-bold block leading-tight ${currentStep === 1 ? 'text-blue-700' : 'text-slate-800'}`}>
                  Basic Details
                </span>
                <span className={`text-[10px] block ${currentStep === 1 ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                  Name, type, location
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setCurrentStep(2)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-blue-50/90 text-blue-700'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white shadow-xs'
                    : currentStep > 2
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <div>
                <span className={`text-xs font-bold block leading-tight ${currentStep === 2 ? 'text-blue-700' : 'text-slate-800'}`}>
                  Itinerary
                </span>
                <span className={`text-[10px] block ${currentStep === 2 ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                  Plan your tour
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setCurrentStep(3)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-blue-50/90 text-blue-700'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 3
                    ? 'bg-blue-600 text-white shadow-xs'
                    : currentStep > 3
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {currentStep > 3 ? '✓' : '3'}
              </div>
              <div>
                <span className={`text-xs font-bold block leading-tight ${currentStep === 3 ? 'text-blue-700' : 'text-slate-800'}`}>
                  Pricing
                </span>
                <span className={`text-[10px] block ${currentStep === 3 ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                  Set prices & inclusions
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setCurrentStep(4)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                currentStep === 4
                  ? 'bg-blue-50/90 text-blue-700'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 4
                    ? 'bg-blue-600 text-white shadow-xs'
                    : currentStep > 4
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {currentStep > 4 ? '✓' : '4'}
              </div>
              <div>
                <span className={`text-xs font-bold block leading-tight ${currentStep === 4 ? 'text-blue-700' : 'text-slate-800'}`}>
                  Media
                </span>
                <span className={`text-[10px] block ${currentStep === 4 ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                  Photos & videos
                </span>
              </div>
            </div>

            {/* Step 5 */}
            <div
              onClick={() => setCurrentStep(5)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                currentStep === 5
                  ? 'bg-blue-50/90 text-blue-700'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 5
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-300 text-slate-600 bg-white'
                }`}
              >
                5
              </div>
              <div>
                <span className={`text-xs font-bold block leading-tight ${currentStep === 5 ? 'text-blue-700' : 'text-slate-800'}`}>
                  Review
                </span>
                <span className={`text-[10px] block ${currentStep === 5 ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                  Check and publish
                </span>
              </div>
            </div>

            {/* Quick 1-Click Autofill Presets box */}
            <div className="pt-4 mt-4 border-t border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                ⚡ Quick Presets
              </span>
              <div className="space-y-1.5">
                {PRESET_TEMPLATES.slice(0, 3).map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(tmpl)}
                    className="w-full text-left p-2 rounded-xl bg-white hover:bg-blue-50/70 border border-slate-200/80 transition-all text-slate-700 hover:text-blue-600 cursor-pointer"
                  >
                    <span className="text-[11px] font-bold block truncate">{tmpl.name}</span>
                    <span className="text-[9px] text-slate-400">{tmpl.destination} · {formatINR(tmpl.priceINR)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: ACTIVE STEP FORM CONTENT */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar text-xs">
            {/* STEP 1: BASIC DETAILS (Exact fields from reference screenshot) */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Basic Details
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add the essential information about this tour package.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Package Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Package Name
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Kerala Backwaters Escape"
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Tour Type */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Tour Type
                    </label>
                    <select
                      value={tourType}
                      onChange={e => setTourType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs cursor-pointer"
                    >
                      <option value="Luxury Escape">Luxury Escape</option>
                      <option value="Cultural Heritage">Cultural Heritage</option>
                      <option value="Mountain Adventure">Mountain Adventure</option>
                      <option value="Beach & Coastal">Beach & Coastal</option>
                      <option value="Honeymoon & Romance">Honeymoon & Romance</option>
                      <option value="Wildlife Safari">Wildlife Safari</option>
                      <option value="Wellness & Ayurveda">Wellness & Ayurveda</option>
                      <option value="Family Vacation">Family Vacation</option>
                    </select>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      placeholder="e.g. Kerala, India"
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={durationText}
                      onChange={e => {
                        setDurationText(e.target.value);
                        const match = e.target.value.match(/(\d+)\s*Days?/i);
                        if (match) {
                          setDays(Number(match[1]));
                        }
                      }}
                      placeholder="e.g. 5 Days 4 Nights"
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Short Description
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {shortDescription.length}/300
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                    placeholder="Write a short description about this tour..."
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs resize-none"
                  />
                </div>

                {/* Highlights (optional) */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    Highlights (optional)
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Add Highlight Button & Input */}
                    {isAddingHighlight ? (
                      <form onSubmit={handleAddHighlight} className="inline-flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newHighlightInput}
                          onChange={e => setNewHighlightInput(e.target.value)}
                          placeholder="Highlight name..."
                          autoFocus
                          className="px-3 py-1.5 text-xs bg-white border border-blue-500 rounded-full focus:outline-none w-36 shadow-xs"
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1.5 bg-blue-600 text-white rounded-full text-[11px] font-bold cursor-pointer"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingHighlight(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingHighlight(true)}
                        className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200/80 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Add Highlight</span>
                      </button>
                    )}

                    {/* Highlight Tag Chips */}
                    {highlights.map((tagItem, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <span>{tagItem}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs leading-none"
                          title="Remove highlight"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ITINERARY (Plan your tour) */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Itinerary & Circuit Stops
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define the destinations, waypoints, and geographic scope of this journey.
                  </p>
                </div>

                {/* Scope & Market Toggle */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Scope & Market
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDomestic(true);
                        setCountry('India');
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isDomestic ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Domestic India
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDomestic(false);
                        if (country === 'India') setCountry('Switzerland');
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !isDomestic ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      International
                    </button>
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. India, Japan, Switzerland"
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
                  />
                </div>

                {/* Circuit Stops */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Route Stops & Waypoints
                  </label>
                  <div className="flex items-center gap-2 flex-wrap mb-2.5">
                    {routeStops.map((stop, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{stop}</span>
                        {routeStops.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStop(idx)}
                            className="text-blue-400 hover:text-rose-500 cursor-pointer text-xs ml-0.5"
                          >
                            ✕
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddStop} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newStopInput}
                      onChange={e => setNewStopInput(e.target.value)}
                      placeholder="Add another city or stop (e.g. Thekkady)..."
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      + Add Stop
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* STEP 3: PRICING & INCLUSIONS */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Wholesale Pricing & Inclusions
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set wholesale tariffs in INR and curate premium inclusions for travelers.
                  </p>
                </div>

                {/* Price in INR */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Total Package Price (in INR ₹)
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-600">
                      Per Guest: {formatINR(Math.round(priceINR / 2))} · Daily: {formatINR(Math.round(priceINR / days))}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      step={5000}
                      value={priceINR}
                      onChange={e => setPriceINR(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Quick Tariff Pills */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {[145000, 185000, 195000, 235000, 265000, 350000, 490000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPriceINR(amt)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          priceINR === amt
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {formatINR(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Curated Inclusions (Displayed on Card & Manifest)
                  </label>
                  <div className="space-y-1.5 mb-2.5">
                    {inclusions.map((inc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-emerald-600">
                            check_circle
                          </span>
                          <span className="font-medium text-slate-800">{inc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveInclusion(idx)}
                          className="text-slate-400 hover:text-rose-500 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddInclusion} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newInclusionInput}
                      onChange={e => setNewInclusionInput(e.target.value)}
                      placeholder="Add another inclusion (e.g. VIP Palace Tour)..."
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      + Add Inclusion
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* STEP 4: MEDIA & VISUALS */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Media & Visuals
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select a high-resolution hero image that captivates travelers in Discover.
                  </p>
                </div>

                {/* Hero Image URL */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Hero Photo URL
                  </label>
                  <input
                    type="url"
                    value={heroImage}
                    onChange={e => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                {/* Photo Presets Gallery */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    Quick Choose Curated Photography
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CURATED_PHOTO_PRESETS.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setHeroImage(p.url)}
                        className={`group relative h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          heroImage === p.url
                            ? 'border-blue-600 ring-2 ring-blue-400/40 scale-[1.02]'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[10px] text-white font-bold truncate">
                            {p.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Theme / Discover Badge
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    placeholder="e.g. 🌴 Tropical Backwaters"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & PUBLISH */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Review & Publish Package
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify all circuit specifications before publishing to travelers in Discover.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">{title}</span>
                      <span className="text-xs text-slate-500">{destination} · {durationText}</span>
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {formatINR(priceINR)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Tour Type
                      </span>
                      <span className="font-semibold text-slate-800">{tourType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Target Market
                      </span>
                      <span className="font-semibold text-slate-800">
                        {isDomestic ? 'Domestic India' : 'International'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Circuit Stops ({routeStops.length})
                    </span>
                    <div className="text-xs font-semibold text-slate-700">
                      {routeStops.join(' ➔ ')}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Inclusions ({inclusions.length})
                    </span>
                    <div className="space-y-1">
                      {inclusions.slice(0, 3).map((inc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-blue-600 shrink-0">
                    rocket_launch
                  </span>
                  <div className="text-xs">
                    <span className="font-bold block">Instant Discover Marketplace Sync</span>
                    <span className="text-blue-700/80">
                      This package will be immediately discoverable by travelers for live bookings and AI itinerary customizations.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 3: LIVE CARD PREVIEW */}
          <div className="w-full lg:w-[360px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 p-5 bg-slate-50/60 overflow-y-auto flex items-center justify-center">
            <div className="w-full flex justify-center py-2">
              <LuxuryCard
                id="create-modal-preview-luxury-card"
                title={title || 'Tour Package Title'}
                description={`${days} Days · ${destination || 'Destination'} · Curated by ${directorName}`}
                image={heroImage || CURATED_PHOTO_PRESETS[0].url}
                rating="4.98/5"
                kicker={`${directorName} · ${destination.split(',')[0] || 'Curated Circuit'}`}
                badge={tourType || 'Operator Published'}
                badgeColor={isDomestic ? 'emerald' : 'dark'}
                amenities={liveAmenities}
                price={`₹${(Number(priceINR) || 180000).toLocaleString('en-IN')}`}
                pricePeriod="/package"
                actionVariant="button"
                actionLabel="Reserve Tour"
                theme="light"
                className="w-full max-w-[320px]"
                onActionClick={() => showToast('Preview: This is how travelers will see your card in Discover')}
                onClick={() => showToast('Preview: This is how travelers will see your card in Discover')}
              />
            </div>
          </div>
        </div>

        {/* MODAL FOOTER matching Reference Screenshot */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            {currentStep > 1 ? '← Back' : 'Cancel'}
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <span className="text-sm">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                <span>{isSubmitting ? 'Publishing...' : 'Publish to Discover'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
