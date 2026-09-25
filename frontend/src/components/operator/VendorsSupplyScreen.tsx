import React, { useState, useMemo } from 'react';
import { VendorSupplyItem } from '../../types/travel';
import { useOperator } from '../../context/OperatorContext';

interface VendorsSupplyScreenProps {
  showToast: (msg: string) => void;
}

export const VendorsSupplyScreen: React.FC<VendorsSupplyScreenProps> = ({ showToast }) => {
  const { vendors, addVendor } = useOperator();
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

    addVendor(newVendor);
    setIsAddVendorOpen(false);
    setNewVendorName('');
    setNewVendorRegion('');
    showToast(`Added partner: ${newVendor.name}`);
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Vendors & Supply
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Partner hotels, charters, luxury fleets, and real-time SLA metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddVendorOpen(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add Partner</span>
        </button>
      </div>

      {/* KPI Cards - Clean & Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Contracted Partners
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">48</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 12 destinations</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Average SLA Compliance
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">99.4%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero contract breaches</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Active Blocks
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">64 Blocks</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Guaranteed VIP availability</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Supplier Terms
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">Net-30 Escrow</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Protected traveler deposits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search partners by name, region, or contact..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
          {[
            { id: 'all', label: 'All' },
            { id: 'hotel', label: 'Hotels & Resorts' },
            { id: 'train', label: 'Rail' },
            { id: 'fleet', label: 'Fleets' },
            { id: 'flight', label: 'Aviation' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === tab.id
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
            className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {vendor.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                    {vendor.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {vendor.region}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-800">
                    ★ {vendor.rating}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {vendor.slaCompliance}% SLA
                  </span>
                </div>
              </div>

              {/* Contact info box */}
              <div className="mt-4 p-3 bg-slate-50/70 rounded-lg space-y-1.5 text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Primary Contact:</span>
                  <span className="font-medium text-slate-800">{vendor.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Phone:</span>
                  <span className="font-mono text-slate-700">{vendor.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Active Contracts:</span>
                  <span className="font-medium text-slate-800">{vendor.activeContracts} Contracts</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Renewal: {vendor.contractRenewal}
              </span>
              <button
                type="button"
                onClick={() => showToast(`Initiating direct dispatch line to ${vendor.name}`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors"
              >
                Dispatch Desk
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleAddVendor}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Supply Partner</h3>
              <button
                type="button"
                onClick={() => setIsAddVendorOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={newVendorName}
                  onChange={e => setNewVendorName(e.target.value)}
                  placeholder="e.g. Mandarin Oriental Tokyo"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Category
                </label>
                <select
                  value={newVendorCategory}
                  onChange={e => setNewVendorCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                >
                  <option value="hotel">Hotels & Resorts</option>
                  <option value="flight">Aviation & Charters</option>
                  <option value="fleet">VIP Fleets</option>
                  <option value="train">Trains & Rail</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Region
                </label>
                <input
                  type="text"
                  value={newVendorRegion}
                  onChange={e => setNewVendorRegion(e.target.value)}
                  placeholder="e.g. Tokyo, Japan"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddVendorOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Save Partner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
