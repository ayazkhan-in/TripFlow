import React, { useState, useMemo, useEffect } from 'react';
import { TripItinerary } from '../../types/itinerary';
import { BookedTrip, PaymentDetails, PaymentPlanType, GroupMemberPayment } from '../../types/travel';
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

  // Primary payment plan selection: 'full' | 'group_split' | 'installments'
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanType>('full');

  // Payment method: 'card' | 'upi' | 'escrow'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'escrow'>('card');

  // Card details state
  const [cardNumber, setCardNumber] = useState('3782 8224 9012 8842');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Sarah Mehta');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('482');

  // UPI state
  const [upiId, setUpiId] = useState('sarahmehta@okhdfcbank');

  // Group split configuration
  const [groupSize, setGroupSize] = useState<number>(Math.max(2, itinerary.travelers || 4));
  const [groupHostOption, setGroupHostOption] = useState<'pay_host_share' | 'pay_all_shares' | 'simulate_all_paid'>('pay_host_share');
  const [groupCopied, setGroupCopied] = useState<boolean>(false);

  // Group members list
  const [groupMembers, setGroupMembers] = useState<Array<{ id: string; name: string; email: string; phone: string }>>([
    { id: 'gm-1', name: user?.name || 'Sarah Mehta', email: user?.email || 'sarah.mehta@concierge.tripflow.io', phone: '+1 (555) 234-5678' },
    { id: 'gm-2', name: 'Rohan Mehra', email: 'rohan.mehra@gmail.com', phone: '+91 98201 44921' },
    { id: 'gm-3', name: 'Priya Sharma', email: 'priya.sharma@outlook.com', phone: '+91 98402 11094' },
    { id: 'gm-4', name: 'Vikram Patel', email: 'vikram.patel@techcorp.io', phone: '+91 99100 88219' },
  ]);

  // Installment plan choice: 'milestones' (33/33/34) | 'monthly' (3, 6, 12 months)
  const [installmentType, setInstallmentType] = useState<'milestones' | 'monthly'>('milestones');
  const [monthlyTenure, setMonthlyTenure] = useState<3 | 6 | 12>(6);
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [autoDebitAgreed, setAutoDebitAgreed] = useState<boolean>(true);

  // Concierge Preferences & Special Requests
  const [dietary, setDietary] = useState('Strict Vegetarian');
  const [transferPref, setTransferPref] = useState('Toyota Vellfire Executive Lounge');
  const [customRequests, setCustomRequests] = useState('Anniversary trip. Require quiet high-floor suite & English-fluent chauffeur.');

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(3);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');

  // Derived calculations
  const perPersonGroupShare = useMemo(() => {
    return Math.round(totalPrice / Math.max(1, groupSize));
  }, [totalPrice, groupSize]);

  // Milestone schedule
  const milestoneSchedule = useMemo(() => {
    const deposit = Math.round(totalPrice * 0.33);
    const mid = Math.round(totalPrice * 0.33);
    const finalBal = totalPrice - deposit - mid;
    return [
      {
        installmentNumber: 1,
        label: 'Deposit Today (Locks Flights & Hotels)',
        dueDate: 'Due Today (Immediate Confirmation)',
        amount: deposit,
        status: 'PAID' as const,
      },
      {
        installmentNumber: 2,
        label: 'Mid-Circuit Milestone',
        dueDate: '30 Days Before Departure',
        amount: mid,
        status: 'SCHEDULED' as const,
      },
      {
        installmentNumber: 3,
        label: 'Final Balance Clearance',
        dueDate: '7 Days Before Departure',
        amount: finalBal,
        status: 'SCHEDULED' as const,
      },
    ];
  }, [totalPrice]);

  // Monthly EMI calculations
  const monthlyEmiAmount = useMemo(() => {
    return Math.round(totalPrice / monthlyTenure);
  }, [totalPrice, monthlyTenure]);

  // Calculate amount payable today based on selected plan
  const payableToday = useMemo(() => {
    if (selectedPlan === 'full') {
      return totalPrice;
    }
    if (selectedPlan === 'group_split') {
      if (groupHostOption === 'pay_all_shares') return totalPrice;
      return perPersonGroupShare;
    }
    if (selectedPlan === 'installments') {
      if (installmentType === 'milestones') {
        return milestoneSchedule[0].amount;
      }
      return monthlyEmiAmount;
    }
    return totalPrice;
  }, [selectedPlan, totalPrice, groupHostOption, perPersonGroupShare, installmentType, milestoneSchedule, monthlyEmiAmount]);

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Group size change handler
  const handleGroupSizeChange = (delta: number) => {
    const nextSize = Math.max(2, Math.min(10, groupSize + delta));
    setGroupSize(nextSize);
    // Adjust members list length
    if (nextSize > groupMembers.length) {
      const added: typeof groupMembers = [];
      for (let i = groupMembers.length + 1; i <= nextSize; i++) {
        added.push({
          id: `gm-${i}`,
          name: `Travel Companion ${i}`,
          email: `companion${i}@travelgroup.io`,
          phone: `+91 98000 ${10000 + i}`,
        });
      }
      setGroupMembers(prev => [...prev, ...added]);
    } else if (nextSize < groupMembers.length) {
      setGroupMembers(prev => prev.slice(0, nextSize));
    }
  };

  // Copy share link
  const handleCopyShareLink = () => {
    const link = `https://bookit.io/pay/split-${itinerary.id.slice(0, 8)}?amount=${perPersonGroupShare}`;
    navigator.clipboard?.writeText(link);
    setGroupCopied(true);
    setTimeout(() => setGroupCopied(false), 2500);
  };

  // Generate Reference
  const destUpper = (itinerary.destination || 'TRIP').toUpperCase().slice(0, 3);
  const sampleRef = `BK-${destUpper}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Handle Complete Payment
  const handleExecutePayment = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    const stepTimer1 = setTimeout(() => {
      setProcessingStep(2);
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setProcessingStep(3);
    }, 1200);

    const stepTimer3 = setTimeout(() => {
      setProcessingStep(4);
    }, 1800);

    const finalTimer = setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setConfirmedBookingRef(sampleRef);

      // Construct payment details object
      const paymentDetails: PaymentDetails = {
        method: paymentMethod,
        type: selectedPlan,
        status: 'SETTLED',
        amountPaid: payableToday,
        totalAmount: totalPrice,
        currency: itinerary.currency || 'INR',
        transactionRef: `TXN-${sampleRef}-${Date.now().toString().slice(-4)}`,
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
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            amount: perPersonGroupShare,
            status: (groupHostOption === 'simulate_all_paid' || idx === 0) ? 'PAID' : 'INVITED',
            isHost: idx === 0,
            paidAt: (groupHostOption === 'simulate_all_paid' || idx === 0) ? 'Just now' : undefined,
          })),
        } : undefined,
      };

      const customizationDetails = {
        isCustomized: true,
        dietaryRestrictions: dietary,
        transferPreference: transferPref,
        customRequests: customRequests,
        paymentPlan: selectedPlan,
      };

      // Trigger redirect after 2.6s if user doesn't click button
      const redirectTimer = setTimeout(() => {
        onPaymentSuccess(itinerary, totalPrice, paymentDetails, customizationDetails);
        onClose();
      }, 2600);

      return () => clearTimeout(redirectTimer);
    }, 2400);

    return () => {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(finalTimer);
    };
  };

  // Immediate navigate on success click
  const handleInstantViewTrips = () => {
    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      type: selectedPlan,
      status: 'SETTLED',
      amountPaid: payableToday,
      totalAmount: totalPrice,
      currency: itinerary.currency || 'INR',
      transactionRef: `TXN-${confirmedBookingRef || sampleRef}-${Date.now().toString().slice(-4)}`,
      paidAt: 'Just Now',
      cardLast4: cardNumber.replace(/\s/g, '').slice(-4) || '8842',
      cardBrand: 'American Express',
      upiId: paymentMethod === 'upi' ? upiId : undefined,
      installmentsPlan: selectedPlan === 'installments' ? {
        frequency: installmentType,
        totalInstallments: installmentType === 'milestones' ? 3 : monthlyTenure,
        paidInstallments: 1,
        installmentAmount: payableToday,
        schedule: milestoneSchedule,
      } : undefined,
      groupSplit: selectedPlan === 'group_split' ? {
        totalMembers: groupSize,
        perPersonAmount: perPersonGroupShare,
        paidMembersCount: groupHostOption === 'simulate_all_paid' ? groupSize : 1,
        splitLink: `https://bookit.io/pay/split-${itinerary.id.slice(0, 8)}`,
        members: groupMembers.map((m, idx) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          amount: perPersonGroupShare,
          status: (groupHostOption === 'simulate_all_paid' || idx === 0) ? 'PAID' : 'INVITED',
          isHost: idx === 0,
        })),
      } : undefined,
    };

    onPaymentSuccess(itinerary, totalPrice, paymentDetails, {
      isCustomized: true,
      dietaryRestrictions: dietary,
      transferPreference: transferPref,
      customRequests: customRequests,
      paymentPlan: selectedPlan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto animate-in zoom-in-95 duration-200 text-left">
        
        {/* ========================================================= */}
        {/* MODAL HEADER WITH LUXURY GRADIENT & PROGRESS              */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-white/10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <span className="material-symbols-outlined text-2xl">lock</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full font-bold text-blue-200">
                    256-Bit Encrypted Concierge Checkout
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Inventory Held
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                  Confirm & Reserve Tour Package
                </h2>
                <p className="text-xs text-slate-300 truncate max-w-md">
                  {itinerary.title} · {itinerary.days.length} Days · {itinerary.destination}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY: 2-COLUMN LAYOUT (CONTROLS & SUMMARY)          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[76vh] overflow-y-auto custom-scrollbar">
          
          {/* ------------------------------------------------------- */}
          {/* LEFT / MAIN COLUMN: PAYMENT OPTIONS & DETAILS           */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-100">
            
            {/* STEP 1: PAYMENT PLAN SELECTOR TABS */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Choose Payment Structure
                </label>
                <span className="text-[11px] text-slate-500 font-medium">All options include zero extra fees</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Option 1: Pay in Full */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan('full')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedPlan === 'full'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-blue-600 text-xl">payments</span>
                    {selectedPlan === 'full' && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="font-extrabold text-xs mt-1.5">Pay in Full</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    100% upfront · Instant confirm & Lounge perk
                  </div>
                </button>

                {/* Option 2: Group Payment */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan('group_split')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedPlan === 'group_split'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-purple-600 text-xl">groups</span>
                    <span className="text-[9px] font-bold uppercase bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-md">
                      Split Bill
                    </span>
                  </div>
                  <div className="font-extrabold text-xs mt-1.5">Group Payment</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Split among {groupSize} pax · {formatCurrency(perPersonGroupShare)}/each
                  </div>
                </button>

                {/* Option 3: Installments */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan('installments')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedPlan === 'installments'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-600/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-amber-600 text-xl">calendar_month</span>
                    <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md">
                      0% EMI
                    </span>
                  </div>
                  <div className="font-extrabold text-xs mt-1.5">Installments</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Deposit or Monthly · From {formatCurrency(Math.round(totalPrice / 6))}/mo
                  </div>
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------- */}
            {/* DYNAMIC PLAN CUSTOMIZATION DETAILS                    */}
            {/* ----------------------------------------------------- */}

            {/* TAB CONTENT: PAY IN FULL PERKS */}
            {selectedPlan === 'full' && (
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 text-xl mt-0.5">stars</span>
                <div className="text-xs">
                  <span className="font-bold text-blue-950 block">Complimentary Executive Perks Included</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    By confirming in full, your reservation unlocks complimentary airport priority lounge access, instant airline PNR sync, and guaranteed high-floor luxury suite allocation.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: GROUP PAYMENT CONFIGURATION */}
            {selectedPlan === 'group_split' && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-950 block">Group Split Configuration</span>
                    <span className="text-[11px] text-purple-700">Divide tour package equally among travel companions</span>
                  </div>

                  {/* Pax Counter */}
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleGroupSizeChange(-1)}
                      disabled={groupSize <= 2}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-900 w-12 text-center">
                      {groupSize} Pax
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGroupSizeChange(1)}
                      disabled={groupSize >= 10}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Per Person Highlight Box */}
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-purple-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tour Cost</span>
                    <span className="text-sm font-extrabold text-slate-900">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Each Member Pays</span>
                    <span className="text-base font-black text-purple-700">{formatCurrency(perPersonGroupShare)}</span>
                  </div>
                </div>

                {/* Shareable Payment Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block">
                    Invite Companions to Pay Their Share
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-mono text-purple-900 truncate">
                      bookit.io/pay/split-{itinerary.id.slice(0, 8)}?share={perPersonGroupShare}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyShareLink}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {groupCopied ? 'check' : 'content_copy'}
                      </span>
                      <span>{groupCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Companion Members Roster */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Split Status Preview ({groupSize} Members)
                  </span>
                  <div className="max-h-28 overflow-y-auto space-y-1 custom-scrollbar">
                    {groupMembers.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-white/80 rounded-lg border border-purple-100"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            idx === 0 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            {idx === 0 ? `${m.name} (You · Host)` : m.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-slate-600">{formatCurrency(perPersonGroupShare)}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            idx === 0 || groupHostOption === 'simulate_all_paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {idx === 0 || groupHostOption === 'simulate_all_paid' ? 'Paid' : 'Link Sent'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host Payment Option Radio Selector */}
                <div className="space-y-1.5 pt-1 border-t border-purple-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">
                    Select Your Payment Action:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setGroupHostOption('pay_host_share')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        groupHostOption === 'pay_host_share'
                          ? 'border-purple-600 bg-white ring-2 ring-purple-600/20'
                          : 'border-slate-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-purple-950">Pay Host Share Now</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Pay {formatCurrency(perPersonGroupShare)} · Friends pay via link
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupHostOption('simulate_all_paid')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        groupHostOption === 'simulate_all_paid'
                          ? 'border-purple-600 bg-white ring-2 ring-purple-600/20'
                          : 'border-slate-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-purple-950">Simulate All Settled</div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        Demo Mode: Instant 100% Group Clearance
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INSTALLMENTS CONFIGURATION */}
            {selectedPlan === 'installments' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Flexible Installment Options</span>
                    <span className="text-[11px] text-amber-800">Lock reservations with minimal deposit or spread across monthly EMIs</span>
                  </div>
                </div>

                {/* Sub-Switch: Milestones vs Monthly */}
                <div className="grid grid-cols-2 gap-2 bg-amber-100/60 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setInstallmentType('milestones')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      installmentType === 'milestones'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-amber-900 hover:text-slate-900'
                    }`}
                  >
                    3-Stage Milestones (0% Interest)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallmentType('monthly')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      installmentType === 'monthly'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-amber-900 hover:text-slate-900'
                    }`}
                  >
                    Monthly No-Cost EMI
                  </button>
                </div>

                {/* Sub-view: Milestones Schedule */}
                {installmentType === 'milestones' && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase text-amber-900 tracking-wider">
                      Milestone Payment Schedule
                    </div>
                    <div className="space-y-2">
                      {milestoneSchedule.map((m, idx) => (
                        <div
                          key={m.installmentNumber}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            idx === 0
                              ? 'bg-white border-amber-300 ring-2 ring-amber-400/20 shadow-2xs'
                              : 'bg-white/70 border-amber-100 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              idx === 0 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900">{m.label}</div>
                              <div className="text-[10px] text-slate-500">{m.dueDate}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-extrabold text-slate-900">
                              {formatCurrency(m.amount)}
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {idx === 0 ? 'Due Today' : 'Scheduled'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-view: Monthly EMI */}
                {installmentType === 'monthly' && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase text-amber-900 tracking-wider">
                      Select Tenure & Bank Partner
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[3, 6, 12].map(months => {
                        const amount = Math.round(totalPrice / months);
                        const isSelected = monthlyTenure === months;
                        return (
                          <button
                            key={months}
                            type="button"
                            onClick={() => setMonthlyTenure(months as any)}
                            className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-2xs'
                                : 'bg-white/70 border-amber-100 hover:bg-white'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900 block">{months} Months</span>
                            <span className="text-xs font-black text-amber-700 block mt-0.5">
                              {formatCurrency(amount)}/mo
                            </span>
                            <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">
                              0% No-Cost
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                          Issuing Bank / Card Network
                        </label>
                        <select
                          value={selectedBank}
                          onChange={e => setSelectedBank(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                        >
                          <option value="HDFC Bank">HDFC Bank Concierge Card</option>
                          <option value="ICICI Bank">ICICI Bank Emeralde / Sapphiro</option>
                          <option value="American Express">American Express Centurion / Platinum</option>
                          <option value="Axis Bank">Axis Bank Magnus / Reserve</option>
                          <option value="Chase">Chase Sapphire Reserve</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-Debit Guarantee */}
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={autoDebitAgreed}
                    onChange={e => setAutoDebitAgreed(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Authorize automatic debits for downstream installments before departure.</span>
                </label>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD (CARD / UPI / ESCROW) */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Payment Method
              </label>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">credit_card</span>
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">qr_code_2</span>
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('escrow')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'escrow'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">shield</span>
                  <span>Escrow Hold</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  {/* Luxury Digital Card Visual */}
                  <div className="relative h-28 sm:h-32 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 text-white shadow-md flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
                        Bookit Black Metal Concierge
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">contactless</span>
                        AMEX
                      </span>
                    </div>

                    <div className="font-mono text-base tracking-widest font-black text-slate-100">
                      {cardNumber || '•••• •••• •••• 8842'}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                      <span>{cardHolder || 'SARAH MEHTA'}</span>
                      <span>EXP: {cardExpiry || '08/29'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        placeholder="Sarah Mehta"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Inputs */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 shrink-0 flex flex-col items-center justify-center relative shadow-xs">
                      {/* Stylized QR Code placeholder */}
                      <span className="material-symbols-outlined text-4xl text-slate-800">qr_code_2</span>
                      <span className="text-[8px] font-bold text-slate-400 mt-0.5">SCAN & PAY</span>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-900 block">Instant UPI QR Code</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Scan with Google Pay, PhonePe, Paytm, or CRED to approve ₹{payableToday.toLocaleString('en-IN')}.
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">GPay</span>
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">PhonePe</span>
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">Paytm</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      Or Enter Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Escrow Inputs */}
              {paymentMethod === 'escrow' && (
                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">verified_user</span>
                    <span className="font-bold text-emerald-950">Bookit Escrow Protection Guarantee</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Your funds are held securely in institutional trust escrow. Payouts to hotels, airlines, and chauffeurs are verified against GPS milestones and only settled as each leg of your tour is delivered.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 3: CONCIERGE & DIETARY PREFERENCES */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-blue-600">tune</span>
                Concierge Dispatch Preferences
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Dietary</label>
                  <select
                    value={dietary}
                    onChange={e => setDietary(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Strict Vegetarian">Strict Vegetarian (Indian/Global)</option>
                    <option value="Vegan">Vegan (Plant-Based Gourmet)</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Halal">Halal Certified</option>
                    <option value="No Restrictions">No Restrictions</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Chauffeur Fleet</label>
                  <select
                    value={transferPref}
                    onChange={e => setTransferPref(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Toyota Vellfire Executive Lounge">Toyota Vellfire VIP Lounge</option>
                    <option value="Mercedes-Maybach S 680">Mercedes-Maybach Sedan</option>
                    <option value="Range Rover Autobiography">Range Rover Luxury SUV</option>
                    <option value="Electric Luxury EV Sedan">Electric Luxury EV Sedan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT COLUMN: TOUR SUMMARY & PRICE BREAKDOWN            */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50/70 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Tour Card Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group bg-slate-900">
                <div className="h-32 sm:h-36 w-full overflow-hidden">
                  <img
                    src={itinerary.heroImage || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'}
                    alt={itinerary.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold shadow-xs">
                    {itinerary.destination} · {itinerary.days.length} Days
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-sm leading-tight truncate text-white">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                    <span>{itinerary.dates}</span>
                    <span>•</span>
                    <span>{itinerary.travelers} Guests</span>
                  </div>
                </div>
              </div>

              {/* Inclusions Pill Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Synchronized Package Inclusions
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-indigo-600 text-sm">flight</span>
                    <span className="font-bold text-slate-800 truncate">Flights & Instant PNR</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-purple-600 text-sm">hotel</span>
                    <span className="font-bold text-slate-800 truncate">5-Star Boutique Stays</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sky-600 text-sm">directions_car</span>
                    <span className="font-bold text-slate-800 truncate">Dedicated Chauffeur</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
                    <span className="font-bold text-slate-800 truncate">Encrypted Vault Sync</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Ledger */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Cost Breakdown
                </span>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Base Tour Package ({itinerary.days.length} Days)</span>
                    <span className="font-mono font-semibold">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Aviation Telemetry & Chauffeur Fleet</span>
                    <span className="font-mono text-emerald-700 font-semibold">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Emergency Concierge & Travel Vault</span>
                    <span className="font-mono text-emerald-700 font-semibold">Complimentary</span>
                  </div>

                  {selectedPlan === 'group_split' && (
                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-purple-900 font-semibold">
                      <span>Group Bill Split ({groupSize} Persons)</span>
                      <span className="font-mono">÷ {groupSize} Shares</span>
                    </div>
                  )}

                  {selectedPlan === 'installments' && (
                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-amber-900 font-semibold">
                      <span>
                        {installmentType === 'milestones' ? '1st Milestone (33% Deposit)' : `${monthlyTenure}-Mo EMI Schedule`}
                      </span>
                      <span className="font-mono">
                        {installmentType === 'milestones' ? '33% Deposit' : `${monthlyTenure} Installments`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* GRAND TOTAL & TODAY'S DUE CALLOUT */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Grand Total Package Price:</span>
                  <span className="font-mono font-bold text-slate-800">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                      Payable Today
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                      {formatCurrency(payableToday)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      {selectedPlan === 'full'
                        ? '100% Full Payment'
                        : selectedPlan === 'group_split'
                        ? `1 of ${groupSize} Group Shares`
                        : installmentType === 'milestones'
                        ? 'Deposit 1 of 3'
                        : `EMI 1 of ${monthlyTenure}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      All Taxes Included
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl font-black text-white text-xs sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                <span>
                  {selectedPlan === 'full'
                    ? `Pay ${formatCurrency(payableToday)} & Confirm Tour`
                    : selectedPlan === 'group_split'
                    ? groupHostOption === 'pay_all_shares'
                      ? `Pay All Shares (${formatCurrency(totalPrice)}) & Confirm`
                      : `Pay My Share (${formatCurrency(perPersonGroupShare)}) & Reserve`
                    : `Pay Deposit (${formatCurrency(payableToday)}) & Reserve`}
                </span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
                  PCI-DSS Level 1
                </span>
                <span>•</span>
                <span>48h Free Cancellation</span>
                <span>•</span>
                <span>Instant Vault Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROCESSING FULLSCREEN OVERLAY                             */}
        {/* ========================================================= */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-blue-400 animate-pulse">lock</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-white tracking-tight">
              Processing Secure Reservation...
            </h3>
            <p className="text-xs text-blue-200/80 mt-1 max-w-sm">
              Please do not close or refresh this window while we secure your itinerary inventory.
            </p>

            {/* Stepped progress indicators */}
            <div className="mt-6 space-y-2 max-w-xs w-full text-left">
              <div className={`flex items-center gap-2.5 text-xs transition-opacity ${processingStep >= 1 ? 'opacity-100 font-bold text-white' : 'opacity-40 text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${processingStep > 1 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white animate-spin'}`}>
                  {processingStep > 1 ? '✓' : '•'}
                </span>
                <span>Encrypting payment credentials...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-xs transition-opacity ${processingStep >= 2 ? 'opacity-100 font-bold text-white' : 'opacity-40 text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${processingStep > 2 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {processingStep > 2 ? '✓' : '•'}
                </span>
                <span>Locking airline seats & hotel inventory...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-xs transition-opacity ${processingStep >= 3 ? 'opacity-100 font-bold text-white' : 'opacity-40 text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${processingStep > 3 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {processingStep > 3 ? '✓' : '•'}
                </span>
                <span>Generating Travel Vault documents...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-xs transition-opacity ${processingStep >= 4 ? 'opacity-100 font-bold text-white' : 'opacity-40 text-slate-400'}`}>
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>Transmitting dispatch to Operator Hub...</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUCCESS CELEBRATION OVERLAY                               */}
        {/* ========================================================= */}
        {isSuccess && (
          <div className="absolute inset-0 z-40 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            {/* Glowing Success Badge */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <span className="material-symbols-outlined text-3xl text-white">done_all</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold mb-2">
              <span>BOOKING CONFIRMED:</span>
              <span className="text-white font-black">{confirmedBookingRef || sampleRef}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              🎉 Your Tour is Reserved & Active!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md">
              "{itinerary.title}" has been successfully added to your <strong className="text-white">Trips & Bookings</strong> section and synchronized to your Travel Vault.
            </p>

            {/* Plan-specific celebration notice */}
            <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/15 max-w-sm w-full text-xs text-left">
              {selectedPlan === 'full' && (
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Full settlement complete. VIP Airport Lounge access unlocked.</span>
                </div>
              )}
              {selectedPlan === 'group_split' && (
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="material-symbols-outlined text-base">groups</span>
                  <span>
                    {groupHostOption === 'simulate_all_paid'
                      ? `All ${groupSize} group members marked settled!`
                      : `Your share paid. Invitations dispatched to ${groupSize - 1} companions.`}
                  </span>
                </div>
              )}
              {selectedPlan === 'installments' && (
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>Deposit confirmed. Downstream schedule tracked in your booking ledger.</span>
                </div>
              )}
            </div>

            {/* Immediate Action Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleInstantViewTrips}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>View in Trips & Bookings</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 mt-3 block">
              Auto-redirecting to Trips & Bookings in 2 seconds...
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
