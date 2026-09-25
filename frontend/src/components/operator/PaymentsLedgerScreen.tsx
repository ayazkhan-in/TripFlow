import React, { useState, useMemo } from 'react';
import { OPERATOR_PAYMENTS } from '../../data/operatorSuiteData';
import { PaymentLedgerItem } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';

interface PaymentsLedgerScreenProps {
  showToast: (msg: string) => void;
}

export const PaymentsLedgerScreen: React.FC<PaymentsLedgerScreenProps> = ({ showToast }) => {
  const [payments] = useState<PaymentLedgerItem[]>(OPERATOR_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inbound' | 'outbound' | 'escrow'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<PaymentLedgerItem | null>(null);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        p.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tourId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [payments, typeFilter, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    const rows = [
      ['Transaction Ref', 'Tour Ref', 'Party', 'Type', 'Amount', 'Currency', 'Status', 'Date', 'Method', 'Description'],
    ];
    filteredPayments.forEach(p => {
      rows.push([
        p.transactionRef,
        p.tourId,
        `"${p.party}"`,
        p.type,
        p.amount.toString(),
        p.currency,
        p.status,
        p.date,
        `"${p.paymentMethod}"`,
        `"${p.description}"`,
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `tripflow_payments_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported payments ledger statement to CSV.');
  };

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-emerald-600">
              payments
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Payments & Financial Ledger
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time client balance settlements, supplier payouts, escrow reserves, and financial audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Statement</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Initiating new supplier disbursement wire...')}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Disbursement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Total Inbound Volume</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">$342,850</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>+18.4% this cycle</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Supplier Disbursements</span>
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">arrow_upward</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">$218,400</div>
          <div className="text-[11px] text-neutral-400 mt-1">Hotels, charters & fleets</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Escrow Contingency Reserve</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">lock</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">$84,200</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Held safely for active tours</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Gross Operating Margin</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">query_stats</span>
            </span>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">36.3%</div>
          <div className="text-[11px] text-neutral-400 mt-1">$124,450 net operating profit</div>
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
            placeholder="Search by transaction reference, tour ID, or counterparty..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'inbound', label: 'Inbound Collections' },
            { id: 'outbound', label: 'Supplier Payouts' },
            { id: 'escrow', label: 'Escrow Reserves' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                typeFilter === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Tour Code</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400">
                    No transactions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedTxn(p)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      {p.transactionRef}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">
                      {p.tourId}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-900">
                      <div>{p.party}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[180px]">
                        {p.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      {p.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-neutral-500">
                      {p.date}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.type === 'inbound'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.type === 'outbound'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-extrabold">
                      <span
                        className={
                          p.type === 'inbound'
                            ? 'text-emerald-600'
                            : p.type === 'outbound'
                            ? 'text-rose-600'
                            : 'text-blue-600'
                        }
                      >
                        {p.type === 'inbound' ? '+' : p.type === 'outbound' ? '-' : ''}
                        {formatCurrency(p.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          p.status === 'Settled'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => showToast(`Voucher receipt generated for ${p.transactionRef}`)}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        View
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  {selectedTxn.transactionRef}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                  {selectedTxn.party}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-neutral-50 p-3.5 rounded-2xl flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Settled Amount:</span>
                <span className="text-lg font-black text-neutral-900">
                  {formatCurrency(selectedTxn.amount)} {selectedTxn.currency}
                </span>
              </div>

              <div className="space-y-2 text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tour Code:</span>
                  <span className="font-semibold text-blue-600 font-mono">{selectedTxn.tourId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment Instrument:</span>
                  <span className="font-medium text-neutral-800">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Settlement Date:</span>
                  <span className="font-medium text-neutral-800">{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Classification:</span>
                  <span className="font-bold capitalize text-neutral-800">{selectedTxn.type}</span>
                </div>
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Description:</span>
                  <p className="text-neutral-800 font-medium">{selectedTxn.description}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Official Tax Invoice PDF downloaded for ${selectedTxn.transactionRef}`);
                  setSelectedTxn(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
