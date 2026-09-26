import React, { useState, useMemo, useEffect } from 'react';
import { OPERATOR_PAYMENTS } from '../../data/operatorSuiteData';
import { PaymentLedgerItem } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';
import { TripFlowApi } from '../../services/api';

interface PaymentsLedgerScreenProps {
  showToast: (msg: string) => void;
}

export const PaymentsLedgerScreen: React.FC<PaymentsLedgerScreenProps> = ({ showToast }) => {
  const [payments, setPayments] = useState<PaymentLedgerItem[]>(OPERATOR_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inbound' | 'disbursement'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Settled' | 'Processing'>('all');
  const [selectedTxn, setSelectedTxn] = useState<PaymentLedgerItem | null>(null);

  useEffect(() => {
    TripFlowApi.getPaymentsLedger().then(backendTxns => {
      if (backendTxns && backendTxns.length > 0) {
        setPayments(backendTxns.map((t: any) => ({
          id: t.id,
          transactionRef: t.transactionRef,
          tourId: t.bookedTripId || '#1024',
          date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          party: t.party,
          type: (t.type === 'outbound' || t.type === 'escrow') ? t.type : 'inbound',
          amount: Number(t.amount || 0),
          currency: t.currency || 'USD',
          status: t.status === 'SETTLED' ? 'Settled' : 'Processing',
          paymentMethod: t.paymentMethod,
          description: t.description,
        })));
      }
    });
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'disbursement' ? p.type === 'outbound' : p.type === typeFilter);
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.party.toLowerCase().includes(q) ||
        p.transactionRef.toLowerCase().includes(q) ||
        p.tourId.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [payments, typeFilter, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    showToast('Exported payments ledger statement to CSV.');
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Payments & Financial Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client balance settlements, supplier payouts, escrow reserves, and financial audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">download</span>
            <span>Export Statement</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Initiating new supplier disbursement wire...')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Disbursement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards - Clean & Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Inbound Volume
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">$342,850</div>
          <div className="text-[11px] text-slate-400 mt-0.5">+18.4% this cycle</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Supplier Disbursements
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">$218,400</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Hotels, charters & fleets</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Escrow Reserve
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">$84,200</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Held for active tours</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Operating Margin
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">36.3%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Net partner margin</div>
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
            placeholder="Search transactions by party, reference, or tour..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            {[
              { id: 'all', label: 'All' },
              { id: 'inbound', label: 'Client Inbound' },
              { id: 'disbursement', label: 'Disbursements' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id as any)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  typeFilter === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-slate-400"
          >
            <option value="all">All Statuses</option>
            <option value="Settled">Settled</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>

      {/* Ledger Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium text-[11px]">
                <th className="py-3 px-4">Txn Ref</th>
                <th className="py-3 px-4">Party / Counterpart</th>
                <th className="py-3 px-4">Tour Code</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No transactions match filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedTxn(p)}
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {p.transactionRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.party}</div>
                      <div className="text-[11px] text-slate-400">{p.type === 'inbound' ? 'Client Payment' : 'Supplier Outflow'}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {p.tourId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="truncate max-w-[220px] inline-block" title={p.description}>
                        {p.description}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {p.date}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {p.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-900">
                      <span className={p.type === 'inbound' ? 'text-emerald-700' : 'text-slate-900'}>
                        {p.type === 'inbound' ? '+' : '-'}{formatCurrency(p.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'Settled'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-medium text-[11px]">{p.status}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => showToast(`Receipt generated for ${p.transactionRef}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-slate-400">
                  {selectedTxn.transactionRef}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedTxn.party}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                <span className="text-slate-500 font-medium">Settled Amount:</span>
                <span className="text-base font-bold text-slate-900">
                  {formatCurrency(selectedTxn.amount)} {selectedTxn.currency}
                </span>
              </div>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tour Code:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedTxn.tourId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Instrument:</span>
                  <span className="font-medium text-slate-800">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Settlement Date:</span>
                  <span className="font-medium text-slate-800">{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-medium text-slate-800">{selectedTxn.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Disbursement statement generated for ${selectedTxn.transactionRef}`);
                  setSelectedTxn(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Download Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
