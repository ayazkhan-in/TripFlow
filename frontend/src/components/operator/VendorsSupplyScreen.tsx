import React, { useState, useMemo } from 'react';
import { OPERATOR_VENDORS } from '../../data/operatorSuiteData';
import { VendorSupplyItem } from '../../types/travel';

interface VendorsSupplyScreenProps {
  showToast: (msg: string) => void;
}

export const VendorsSupplyScreen: React.FC<VendorsSupplyScreenProps> = ({ showToast }) => {
  const [vendors, setVendors] = useState<VendorSupplyItem[]>(OPERATOR_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState<VendorSupplyItem['category']>('hotel');
  const [newVendorRegion, setNewVendorRegion] = useState('');

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [vendors, categoryFilter, searchQuery]);

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const newVendor: VendorSupplyItem = {
      id: `vnd-${Date.now()}`,
      name: newVendorName.trim(),
      category: newVendorCategory,
      region: newVendorRegion.trim() || 'Global',
      rating: 4.9,
      slaCompliance: 99.5,
      activeContracts: 1,
      contactPerson: 'Operations Desk',
      phone: '+1 800 555 0199',
      email: 'operations@partner.com',
      status: 'Active',
      contractRenewal: 'Dec 2027',
    };

    setVendors(prev => [newVendor, ...prev]);
    setIsAddVendorOpen(false);
    setNewVendorName('');
    setNewVendorRegion('');
    showToast(`Added new luxury partner: ${newVendor.name}`);
  };

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-purple-600">
              domain
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Vendors & Supply
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Contracted partner hotels, private jet charters, luxury fleets, and real-time SLA metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddVendorOpen(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add Luxury Partner</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Contracted Partners</span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">handshake</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">48</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across 12 luxury destinations</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Average SLA Compliance</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">verified</span>
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">99.4%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Zero contract breaches</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Active Room & Fleet Blocks</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">hotel</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">64 Blocks</div>
          <div className="text-[11px] text-neutral-400 mt-1">Guaranteed VIP availability</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Supplier Payment Terms</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">schedule</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">Net-30 Escrow</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">Protected traveler deposits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search partners by name, region, or contact person..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-purple-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'hotel', label: 'Hotels & Resorts' },
            { id: 'train', label: 'Trains & Rail' },
            { id: 'fleet', label: 'VIP Fleets' },
            { id: 'flight', label: 'Aviation Charters' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                categoryFilter === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map(vendor => (
          <div
            key={vendor.id}
            className="bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-2xl p-5 shadow-2xs flex flex-col justify-between gap-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                    {vendor.category}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-1.5 leading-snug">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    <span>{vendor.region}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-800">
                    ★ {vendor.rating}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {vendor.slaCompliance}% SLA
                  </span>
                </div>
              </div>

              {/* Contact info card */}
              <div className="mt-4 p-3 bg-neutral-50 rounded-xl space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[11px]">Primary Contact:</span>
                  <span className="font-semibold text-neutral-800">{vendor.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[11px]">Phone Line:</span>
                  <span className="font-mono text-neutral-700">{vendor.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[11px]">Active Contracts:</span>
                  <span className="font-bold text-blue-600">{vendor.activeContracts} Contracts</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] text-neutral-400">
                Renewal: {vendor.contractRenewal}
              </span>
              <button
                type="button"
                onClick={() => showToast(`Initiating direct dispatch line to ${vendor.name}...`)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Dispatch Desk
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleAddVendor}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Add Luxury Supply Partner</h3>
              <button
                type="button"
                onClick={() => setIsAddVendorOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={newVendorName}
                  onChange={e => setNewVendorName(e.target.value)}
                  placeholder="e.g. Oberoi Hotels & Resorts"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newVendorCategory}
                  onChange={e => setNewVendorCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-purple-600"
                >
                  <option value="hotel">Hotels & Resorts</option>
                  <option value="flight">Aviation & Charters</option>
                  <option value="train">Railways & Gran Class</option>
                  <option value="fleet">VIP Luxury Fleet</option>
                  <option value="dining">Michelin Dining</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">
                  Region
                </label>
                <input
                  type="text"
                  value={newVendorRegion}
                  onChange={e => setNewVendorRegion(e.target.value)}
                  placeholder="e.g. Rajasthan, India"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddVendorOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs cursor-pointer"
              >
                Create Partner Agreement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
