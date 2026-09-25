import React, { useState } from 'react';
import { useOperator } from '../../context/OperatorContext';
import { formatINR } from '../../utils/pricing';

interface CreateTourPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  onPackageCreated?: (pkgTitle: string) => void;
}

const PRESET_TEMPLATES = [
  {
    name: 'Kashmir Valley of Gold',
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
      'The Khyber Himalayan Resort & Private Dal Lake Shikara Villa',
      'Dedicated 4x4 Luxury Chauffeur Bashir Ahmed',
      'VIP Gulmarg Gondola Phase 2 Passes & Heritage Permits',
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
      'The Grand Dragon Ladakh & Luxury Glamping Yurt at Nubra',
      'Oxygen-Equipped Toyota Fortuner Chauffeur Tundup Dorje',
      'Thiksey & Hemis Monastery Private Lama Blessings',
    ],
  },
  {
    name: 'Swiss Alpine Panoramic Rail',
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
      'Glacier Express Excellence Class Luxury Rail Passes',
      'Matterhorn Glacier Paradise Private Alpinist Guide',
    ],
  },
];

export const CreateTourPackageModal: React.FC<CreateTourPackageModalProps> = ({
  isOpen,
  onClose,
  showToast,
  onPackageCreated,
}) => {
  const { createPackage } = useOperator();

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
    'IndiGo DEL ➔ SXR Flight Included\nThe Khyber Himalayan Resort & Private Houseboat\nDedicated 4x4 Chauffeur\nVIP Gulmarg Gondola Passes'
  );
  const [directorName, setDirectorName] = useState('Alex Vance');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim()) return;

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

    showToast(`🚀 Published "${newPkg.title}" to Discover! Travelers can now book and customize it.`);
    if (onPackageCreated) {
      onPackageCreated(newPkg.title);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-left animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">add_business</span>
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                Operator Package Creator
              </span>
              <h3 className="text-base font-bold tracking-tight">Create & Publish Tour Package</h3>
              <p className="text-xs text-slate-400">
                Created package will be instantly published to travelers in the Discover section.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
          {/* 1-Click Quick Preset Templates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ⚡ 1-Click Preset Circuits (Quick Autofill)
              </label>
              <span className="text-[10px] text-blue-600 font-medium">Click to populate fields</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(tmpl)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="font-bold text-slate-900 text-xs group-hover:text-blue-700">
                    {tmpl.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{tmpl.destination} · {tmpl.days}D</span>
                    <span className="font-bold text-blue-700 font-mono">{formatINR(tmpl.priceINR)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Tour Package Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Kashmir Valley of Gold & Dal Lake Heritage"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Primary Destination *
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Kashmir / Ladakh / Tokyo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. India, Japan, Switzerland"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Scope (Domestic / International) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Scope & Market
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDomestic(true)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    isDomestic
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Domestic India
                </button>
                <button
                  type="button"
                  onClick={() => setIsDomestic(false)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    !isDomestic
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  International
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                min={2}
                max={14}
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Price (INR) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  Base Package Price (INR) *
                </label>
                <span className="text-[11px] font-mono font-bold text-blue-600">
                  {formatINR(priceINR)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step={5000}
                  required
                  value={priceINR}
                  onChange={e => setPriceINR(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors font-mono"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {[145000, 185000, 195000, 235000, 265000, 490000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPriceINR(amt)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                      priceINR === amt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag / Category */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Curated Tag / Badge
              </label>
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="e.g. 🏔️ High Altitude Escapes"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Route Stops */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Route Stops (Comma separated)
              </label>
              <input
                type="text"
                value={routeStopsInput}
                onChange={e => setRouteStopsInput(e.target.value)}
                placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                These stops will automatically generate the circuit stops and daily legs.
              </p>
            </div>

            {/* Hero Image URL */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Hero Image URL
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={e => setHeroImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Inclusions */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Key Inclusions (One per line)
              </label>
              <textarea
                rows={3}
                value={inclusionsInput}
                onChange={e => setInclusionsInput(e.target.value)}
                placeholder="Flight Included&#10;5-Star Boutique Stay&#10;Dedicated Chauffeur"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Lead Director */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Assigned Lead Operator Director
              </label>
              <input
                type="text"
                value={directorName}
                onChange={e => setDirectorName(e.target.value)}
                placeholder="Alex Vance"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-base">publish</span>
              <span>Publish ({formatINR(priceINR)}) to Discover</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
