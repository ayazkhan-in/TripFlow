import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TripItinerary } from '../../types/itinerary';
import { PaymentDetails, PaymentPlanType } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';

interface PaymentOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: TripItinerary | null;
  totalPrice: number;
  onPaymentSuccess: (
    itinerary: TripItinerary,
    totalPrice: number,
    paymentDetails: PaymentDetails,
    customizationDetails?: any
  ) => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}

export const PaymentOverlayModal: React.FC<PaymentOverlayModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  totalPrice,
  onPaymentSuccess,
  user,
}) => {
  if (!isOpen || !itinerary) return null;

  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanType>('full');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'escrow'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('3782 8224 9012 8842');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Sarah Mehta');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('482');

  // UPI
  const [upiId, setUpiId] = useState('sarahmehta@okhdfcbank');

  // Group split
  const [groupSize, setGroupSize] = useState<number>(Math.max(2, itinerary.travelers || 4));
  const [groupHostOption, setGroupHostOption] = useState<'pay_host_share' | 'pay_all_shares' | 'simulate_all_paid'>('pay_host_share');
  const [groupCopied, setGroupCopied] = useState(false);
  const [groupMembers, setGroupMembers] = useState([
    { id: 'gm-1', name: user?.name || 'Sarah Mehta', email: user?.email || 'sarah.mehta@concierge.tripflow.io', phone: '+1 (555) 234-5678' },
    { id: 'gm-2', name: 'Rohan Mehra', email: 'rohan.mehra@gmail.com', phone: '+91 98201 44921' },
    { id: 'gm-3', name: 'Priya Sharma', email: 'priya.sharma@outlook.com', phone: '+91 98402 11094' },
    { id: 'gm-4', name: 'Vikram Patel', email: 'vikram.patel@techcorp.io', phone: '+91 99100 88219' },
  ]);

  // Installments
  const [installmentType, setInstallmentType] = useState<'milestones' | 'monthly'>('milestones');
  const [monthlyTenure, setMonthlyTenure] = useState<3 | 6 | 12>(6);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [autoDebitAgreed, setAutoDebitAgreed] = useState(true);

  // Preferences
  const [dietary, setDietary] = useState('Strict Vegetarian');
  const [transferPref, setTransferPref] = useState('Toyota Vellfire Executive Lounge');
  const [customRequests, setCustomRequests] = useState('Anniversary trip. Require quiet high-floor suite & English-fluent chauffeur.');

  // Processing & Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');

  // Derived
  const perPersonGroupShare = useMemo(() => Math.round(totalPrice / Math.max(1, groupSize)), [totalPrice, groupSize]);

  const milestoneSchedule = useMemo(() => {
    const deposit = Math.round(totalPrice * 0.33);
    const mid = Math.round(totalPrice * 0.33);
    const finalBal = totalPrice - deposit - mid;
    return [
      { installmentNumber: 1, label: 'Deposit (Locks Flights & Hotels)', dueDate: 'Due Today', amount: deposit, status: 'PAID' as const },
      { installmentNumber: 2, label: 'Mid-Circuit Milestone', dueDate: '30 Days Before Departure', amount: mid, status: 'SCHEDULED' as const },
      { installmentNumber: 3, label: 'Final Balance', dueDate: '7 Days Before Departure', amount: finalBal, status: 'SCHEDULED' as const },
    ];
  }, [totalPrice]);

  const monthlyEmiAmount = useMemo(() => Math.round(totalPrice / monthlyTenure), [totalPrice, monthlyTenure]);

  const payableToday = useMemo(() => {
    if (selectedPlan === 'full') return totalPrice;
    if (selectedPlan === 'group_split') {
      return groupHostOption === 'pay_all_shares' ? totalPrice : perPersonGroupShare;
    }
    if (selectedPlan === 'installments') {
      return installmentType === 'milestones' ? milestoneSchedule[0].amount : monthlyEmiAmount;
    }
    return totalPrice;
  }, [selectedPlan, totalPrice, groupHostOption, perPersonGroupShare, installmentType, milestoneSchedule, monthlyEmiAmount]);

  // Handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardExpiry(val);
  };

  const handleGroupSizeChange = (delta: number) => {
    const nextSize = Math.max(2, Math.min(10, groupSize + delta));
    setGroupSize(nextSize);
    if (nextSize > groupMembers.length) {
      const added = [];
      for (let i = groupMembers.length + 1; i <= nextSize; i++) {
        added.push({ id: `gm-${i}`, name: `Companion ${i}`, email: `companion${i}@travelgroup.io`, phone: `+91 98000 ${10000 + i}` });
      }
      setGroupMembers(prev => [...prev, ...added]);
    } else if (nextSize < groupMembers.length) {
      setGroupMembers(prev => prev.slice(0, nextSize));
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(`https://bookit.io/pay/split-${itinerary.id.slice(0, 8)}?amount=${perPersonGroupShare}`);
    setGroupCopied(true);
    setTimeout(() => setGroupCopied(false), 2500);
  };

  const destUpper = (itinerary.destination || 'TRIP').toUpperCase().slice(0, 3);
  const sampleRef = `BK-${destUpper}-${Math.floor(1000 + Math.random() * 9000)}`;

  const buildPaymentDetails = (ref: string): PaymentDetails => ({
    method: paymentMethod,
    type: selectedPlan,
    status: 'SETTLED',
    amountPaid: payableToday,
    totalAmount: totalPrice,
    currency: itinerary.currency || 'INR',
    transactionRef: `TXN-${ref}-${Date.now().toString().slice(-4)}`,
    paidAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    cardLast4: paymentMethod === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) || '8842' : undefined,
    cardBrand: 'American Express',
    upiId: paymentMethod === 'upi' ? upiId : undefined,
    notes: `Confirmed via ${selectedPlan === 'full' ? 'Full Settlement' : selectedPlan === 'group_split' ? 'Group Split' : 'Installments Plan'}.`,
    installmentsPlan: selectedPlan === 'installments' ? {
      frequency: installmentType,
      tenureMonths: installmentType === 'monthly' ? monthlyTenure : undefined,
      totalInstallments: installmentType === 'milestones' ? 3 : monthlyTenure,
      paidInstallments: 1,
      installmentAmount: installmentType === 'milestones' ? milestoneSchedule[0].amount : monthlyEmiAmount,
      schedule: installmentType === 'milestones' ? milestoneSchedule : Array.from({ length: monthlyTenure }).map((_, idx) => ({
        installmentNumber: idx + 1,
        label: `Month ${idx + 1} EMI`,
        dueDate: idx === 0 ? 'Paid Today' : `Month +${idx} Auto-Debit`,
        amount: monthlyEmiAmount,
        status: idx === 0 ? 'PAID' : 'SCHEDULED',
      })),
    } : undefined,
    groupSplit: selectedPlan === 'group_split' ? {
      totalMembers: groupSize,
      perPersonAmount: perPersonGroupShare,
      paidMembersCount: groupHostOption === 'simulate_all_paid' ? groupSize : 1,
      splitLink: `https://bookit.io/pay/split-${itinerary.id.slice(0, 8)}`,
      members: groupMembers.map((m, idx) => ({
        id: m.id, name: m.name, email: m.email, phone: m.phone,
        amount: perPersonGroupShare,
        status: (groupHostOption === 'simulate_all_paid' || idx === 0) ? 'PAID' : 'INVITED',
        isHost: idx === 0,
        paidAt: (groupHostOption === 'simulate_all_paid' || idx === 0) ? 'Just now' : undefined,
      })),
    } : undefined,
  });

  const customizationDetails = {
    isCustomized: true,
    dietaryRestrictions: dietary,
    transferPreference: transferPref,
    customRequests,
    paymentPlan: selectedPlan,
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setProcessingStep(1);
    setTimeout(() => setProcessingStep(2), 600);
    setTimeout(() => setProcessingStep(3), 1200);
    setTimeout(() => setProcessingStep(4), 1800);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setConfirmedBookingRef(sampleRef);
      const redirectTimer = setTimeout(() => {
        onPaymentSuccess(itinerary, totalPrice, buildPaymentDetails(sampleRef), customizationDetails);
        onClose();
      }, 2600);
      return () => clearTimeout(redirectTimer);
    }, 2400);
  };

  const handleInstantViewTrips = () => {
    onPaymentSuccess(itinerary, totalPrice, buildPaymentDetails(confirmedBookingRef || sampleRef), customizationDetails);
    onClose();
  };

  // Shared input class
  const inputCls = 'w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-3xl max-h-[92dvh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              Confirm & Pay
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              {itinerary.title} · {itinerary.destination} · {itinerary.days.length} Days
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">

          {/* Trip Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 py-2.5 px-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destination</span>
              <span className="font-bold text-slate-800">{itinerary.destination}</span>
            </div>
            <div className="sm:text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
              <span className="font-bold text-slate-800">{itinerary.days.length} Days</span>
            </div>
            <div className="sm:text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travelers</span>
              <span className="font-bold text-slate-800">{itinerary.travelers} Guests</span>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
              <span className="font-bold text-slate-800 font-mono">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Payment Structure */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Payment Structure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([
                { id: 'full', label: 'Pay in Full', sub: '100% upfront', icon: 'payments' },
                { id: 'group_split', label: 'Group Split', sub: `Split with ${groupSize}`, icon: 'groups' },
                { id: 'installments', label: 'Installments', sub: 'Deposit or EMI', icon: 'calendar_month' },
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedPlan(opt.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedPlan === opt.id
                      ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                      : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-slate-600 text-lg">{opt.icon}</span>
                    {selectedPlan === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </div>
                  <div className="font-bold text-xs mt-1.5 text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Split Config */}
          {selectedPlan === 'group_split' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Group Split</span>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                  <button type="button" onClick={() => handleGroupSizeChange(-1)} disabled={groupSize <= 2}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer">-</button>
                  <span className="text-xs font-bold text-slate-900 w-10 text-center">{groupSize} Pax</span>
                  <button type="button" onClick={() => handleGroupSizeChange(1)} disabled={groupSize >= 10}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer">+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total</span>
                  <span className="text-sm font-extrabold text-slate-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-600 block">Per Person</span>
                  <span className="text-base font-black text-blue-700">{formatCurrency(perPersonGroupShare)}</span>
                </div>
              </div>

              {/* Share Link */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate">
                  bookit.io/pay/split-{itinerary.id.slice(0, 8)}
                </div>
                <button type="button" onClick={handleCopyShareLink}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                  <span className="material-symbols-outlined text-sm">{groupCopied ? 'check' : 'content_copy'}</span>
                  <span>{groupCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Members */}
              <div className="max-h-28 overflow-y-auto space-y-1 custom-scrollbar">
                {groupMembers.map((m, idx) => (
                  <div key={m.id} className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-white rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{idx + 1}</span>
                      <span className="font-medium text-slate-800 truncate">{idx === 0 ? `${m.name} (You)` : m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-slate-500">{formatCurrency(perPersonGroupShare)}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        idx === 0 || groupHostOption === 'simulate_all_paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>{idx === 0 || groupHostOption === 'simulate_all_paid' ? 'Paid' : 'Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Host Option */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <button type="button" onClick={() => setGroupHostOption('pay_host_share')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all text-xs ${
                    groupHostOption === 'pay_host_share' ? 'border-slate-900 bg-white ring-1 ring-slate-900/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}>
                  <div className="font-bold text-slate-900">Pay My Share</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{formatCurrency(perPersonGroupShare)}</div>
                </button>
                <button type="button" onClick={() => setGroupHostOption('simulate_all_paid')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all text-xs ${
                    groupHostOption === 'simulate_all_paid' ? 'border-slate-900 bg-white ring-1 ring-slate-900/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}>
                  <div className="font-bold text-slate-900">Simulate All Paid</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Demo: Full clearance</div>
                </button>
              </div>
            </div>
          )}

          {/* Installments Config */}
          {selectedPlan === 'installments' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Installment Plan</span>
              </div>

              {/* Toggle */}
              <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-1 rounded-xl">
                <button type="button" onClick={() => setInstallmentType('milestones')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    installmentType === 'milestones' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}>3-Stage Milestones</button>
                <button type="button" onClick={() => setInstallmentType('monthly')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    installmentType === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}>Monthly EMI</button>
              </div>

              {/* Milestones */}
              {installmentType === 'milestones' && (
                <div className="space-y-1.5">
                  {milestoneSchedule.map((m, idx) => (
                    <div key={m.installmentNumber}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        idx === 0 ? 'bg-white border-slate-300 shadow-2xs' : 'bg-white/70 border-slate-100'
                      }`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>{idx + 1}</span>
                        <div>
                          <div className="font-semibold text-slate-900">{m.label}</div>
                          <div className="text-[10px] text-slate-500">{m.dueDate}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">{formatCurrency(m.amount)}</div>
                        <span className={`text-[10px] font-semibold ${idx === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                          {idx === 0 ? 'Due Today' : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Monthly EMI */}
              {installmentType === 'monthly' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {([3, 6, 12] as const).map(months => (
                      <button key={months} type="button" onClick={() => setMonthlyTenure(months)}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                          monthlyTenure === months ? 'bg-white border-slate-900 shadow-2xs' : 'bg-white/70 border-slate-200 hover:bg-white'
                        }`}>
                        <span className="text-xs font-bold text-slate-900 block">{months} Months</span>
                        <span className="text-xs font-black text-blue-700 block mt-0.5">{formatCurrency(Math.round(totalPrice / months))}/mo</span>
                        <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">0% Interest</span>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Bank</label>
                    <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className={inputCls}>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="American Express">American Express</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Chase">Chase Sapphire</option>
                    </select>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input type="checkbox" checked={autoDebitAgreed} onChange={e => setAutoDebitAgreed(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600" />
                <span>Authorize automatic debits for future installments</span>
              </label>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Payment Method
            </h4>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {([
                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
                { id: 'upi', label: 'UPI / QR', icon: 'qr_code_2' },
                { id: 'escrow', label: 'Escrow', icon: 'shield' },
              ] as const).map(opt => (
                <button key={opt.id} type="button" onClick={() => setPaymentMethod(opt.id)}
                  className={`py-2 px-2 sm:px-3 rounded-xl border flex items-center justify-center gap-1 sm:gap-1.5 font-medium text-[11px] sm:text-xs transition-all cursor-pointer ${
                    paymentMethod === opt.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}>
                  <span className="material-symbols-outlined text-[15px]">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Inputs */}
          {paymentMethod === 'card' && (
            <div className="space-y-2.5">
              {/* Card Visual */}
              <div className="relative h-28 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 text-white flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-bold">Bookit Concierge</span>
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">contactless</span>AMEX
                  </span>
                </div>
                <div className="font-mono text-sm tracking-widest font-bold text-slate-100">{cardNumber || '•••• •••• •••• 8842'}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>{cardHolder || 'SARAH MEHTA'}</span>
                  <span>EXP: {cardExpiry || '08/29'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Card Number</label>
                  <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="1234 5678 9012 3456" className={`${inputCls} font-mono`} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Cardholder</label>
                  <input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} placeholder="Full Name" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Expiry</label>
                  <input type="text" value={cardExpiry} onChange={handleExpiryChange} placeholder="MM/YY" className={`${inputCls} font-mono`} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">CVV</label>
                  <input type="password" maxLength={4} value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="•••" className={`${inputCls} font-mono`} />
                </div>
              </div>
            </div>
          )}

          {/* UPI */}
          {paymentMethod === 'upi' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-200 shrink-0 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-slate-800">qr_code_2</span>
                  <span className="text-[8px] font-bold text-slate-400 mt-0.5">SCAN & PAY</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 block">UPI Payment</span>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Scan with GPay, PhonePe, or Paytm
                  </p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">UPI ID</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="username@bank" className={`${inputCls} font-mono`} />
              </div>
            </div>
          )}

          {/* Escrow */}
          {paymentMethod === 'escrow' && (
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">verified_user</span>
                <span className="font-bold text-emerald-950">Escrow Protection</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Funds held in trust escrow. Payouts to vendors verified against delivery milestones.
              </p>
            </div>
          )}

          {/* Preferences */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preferences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Dietary</label>
                <select value={dietary} onChange={e => setDietary(e.target.value)} className={inputCls}>
                  <option value="Strict Vegetarian">Strict Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Halal">Halal Certified</option>
                  <option value="No Restrictions">No Restrictions</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Chauffeur</label>
                <select value={transferPref} onChange={e => setTransferPref(e.target.value)} className={inputCls}>
                  <option value="Toyota Vellfire Executive Lounge">Toyota Vellfire</option>
                  <option value="Mercedes-Maybach S 680">Mercedes-Maybach</option>
                  <option value="Range Rover Autobiography">Range Rover</option>
                  <option value="Electric Luxury EV Sedan">Electric Luxury EV</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/80 border-t border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payable Today</span>
              <div className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                {formatCurrency(payableToday)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">
                {selectedPlan === 'full' ? 'Full Payment'
                  : selectedPlan === 'group_split' ? `1 of ${groupSize} Shares`
                  : installmentType === 'milestones' ? 'Deposit 1 of 3'
                  : `EMI 1 of ${monthlyTenure}`}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                All Taxes Included
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl font-bold text-white text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-[0.99] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            <span>
              {selectedPlan === 'full'
                ? `Pay ${formatCurrency(payableToday)} & Confirm`
                : selectedPlan === 'group_split'
                ? groupHostOption === 'pay_all_shares'
                  ? `Pay All (${formatCurrency(totalPrice)})`
                  : `Pay My Share (${formatCurrency(perPersonGroupShare)})`
                : `Pay Deposit (${formatCurrency(payableToday)})`}
            </span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-emerald-600">lock</span>
              PCI-DSS Level 1
            </span>
            <span>•</span>
            <span>48h Free Cancellation</span>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200">
            <div className="relative mb-5">
              <div className="w-14 h-14 rounded-full border-[3px] border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-blue-400 animate-pulse">lock</span>
              </div>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Processing Payment...</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">Please don't close this window</p>

            <div className="mt-5 space-y-2 max-w-xs w-full text-left">
              {[
                { step: 1, label: 'Encrypting credentials' },
                { step: 2, label: 'Locking seats & inventory' },
                { step: 3, label: 'Generating documents' },
                { step: 4, label: 'Confirming reservation' },
              ].map(s => (
                <div key={s.step} className={`flex items-center gap-2.5 text-xs transition-opacity ${processingStep >= s.step ? 'opacity-100 text-white' : 'opacity-30 text-slate-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${processingStep > s.step ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {processingStep > s.step ? '✓' : '•'}
                  </span>
                  <span className={processingStep >= s.step ? 'font-medium' : ''}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 z-40 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center ring-8 ring-emerald-500/10">
                <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <span className="material-symbols-outlined text-2xl text-white">done_all</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold mb-2">
              <span>{confirmedBookingRef || sampleRef}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Booking Confirmed!
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-sm">
              "{itinerary.title}" has been added to your <strong className="text-white">Trips & Bookings</strong>.
            </p>

            {/* Plan-specific notice */}
            <div className="mt-3 p-3 bg-white/10 rounded-xl border border-white/10 max-w-sm w-full text-xs text-left">
              {selectedPlan === 'full' && (
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Full settlement complete.</span>
                </div>
              )}
              {selectedPlan === 'group_split' && (
                <div className="flex items-center gap-2 text-blue-300">
                  <span className="material-symbols-outlined text-base">groups</span>
                  <span>{groupHostOption === 'simulate_all_paid' ? `All ${groupSize} members settled` : `Invitations sent to ${groupSize - 1} companions`}</span>
                </div>
              )}
              {selectedPlan === 'installments' && (
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>Deposit confirmed. Schedule tracked in your bookings.</span>
                </div>
              )}
            </div>

            <button type="button" onClick={handleInstantViewTrips}
              className="mt-5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95">
              <span>View in Trips & Bookings</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <span className="text-[10px] text-slate-500 mt-2 block">Auto-redirecting in 2s...</span>
          </div>
        )}

      </motion.div>
    </div>
  );
};
