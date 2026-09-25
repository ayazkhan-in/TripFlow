import React, { useState } from 'react';
import { VaultDocument, VaultCategory } from '../../types/vault';
import { INITIAL_VAULT_DOCUMENTS, EMERGENCY_CONTACTS } from '../../data/vaultData';
import { DocumentScannerModal } from './DocumentScannerModal';

interface TravelVaultScreenProps {
  onOpenWhatsApp?: () => void;
  showToast?: (message: string) => void;
}

export const TravelVaultScreen: React.FC<TravelVaultScreenProps> = ({
  onOpenWhatsApp,
  showToast = () => {},
}) => {
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_VAULT_DOCUMENTS);
  const [selectedTrip, setSelectedTrip] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<VaultDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [copiedContactId, setCopiedContactId] = useState<string | null>(null);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VaultCategory>('passport');
  const [newTripId, setNewTripId] = useState('kerala-escape');
  const [newTravelerName, setNewTravelerName] = useState('Sarah Mehta');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newFileName, setNewFileName] = useState('');

  // Category counts
  const getCategoryCount = (categoryKey: string) => {
    if (categoryKey === 'all') return documents.length;
    if (categoryKey === 'emergency') return EMERGENCY_CONTACTS.length;
    return documents.filter(d => d.category === categoryKey).length;
  };

  // Filtered documents
  const filteredDocuments = documents.filter(doc => {
    // Trip filter
    if (selectedTrip !== 'all' && doc.tripId !== selectedTrip) return false;

    // Category filter
    if (activeCategory !== 'all' && activeCategory !== 'emergency') {
      if (doc.category !== activeCategory) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchTraveler = doc.travelerName.toLowerCase().includes(q);
      const matchDocNum = doc.documentNumber?.toLowerCase().includes(q);
      const matchCategory = doc.category.toLowerCase().includes(q);
      if (!matchTitle && !matchTraveler && !matchDocNum && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  const handleDownloadDoc = (doc: VaultDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Downloading secure copy: "${doc.title}" (${doc.fileType.toUpperCase()})`);
  };

  const handleShareDoc = (doc: VaultDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Secure 24-hr link for "${doc.title}" copied to clipboard.`);
  };

  const handleDeleteDoc = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDocument?.id === id) setSelectedDocument(null);
    showToast('Document removed from Travel Vault.');
  };

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedContactId(id);
    showToast(`Phone number ${phone} copied to clipboard!`);
    setTimeout(() => setCopiedContactId(null), 2500);
  };

  const handleExportVaultBundle = () => {
    showToast('Encrypted Trip Vault Bundle (12 Documents · 256-Bit AES) downloaded for offline use.');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tripNameMap: Record<string, string> = {
      'kerala-escape': 'Kerala 6-Day Luxury Escape',
      'dubai-stopover': 'Dubai Luxury Transit & Stopover',
      'rajasthan-heritage': 'Rajasthan Royal Heritage Circuit',
    };

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      tripId: newTripId,
      tripName: tripNameMap[newTripId] || 'Kerala 6-Day Luxury Escape',
      category: newCategory,
      title: newTitle.trim(),
      travelerName: newTravelerName.trim() || 'Sarah Mehta',
      documentNumber: newDocNumber.trim() || undefined,
      expiryDate: newExpiryDate.trim() || undefined,
      issueDate: 'Today',
      status: 'verified',
      fileType: newFileName.endsWith('.png') ? 'png' : 'pdf',
      fileSize: '1.8 MB',
      uploadedAt: 'Just now',
      offlineReady: true,
      verifiedBy: 'Client Uploaded & Verified',
      notes: newNotes.trim() || 'Custom uploaded document stored in offline encrypted vault.',
    };

    setDocuments(prev => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDocNumber('');
    setNewExpiryDate('');
    setNewNotes('');
    setNewFileName('');
    showToast(`"${newDoc.title}" added to your Travel Vault!`);
  };

  const handleSaveScannedDocument = (newDoc: VaultDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    showToast(`AI Scanned & Verified: "${newDoc.title}" added to your Travel Vault!`);
  };

  const getCategoryIcon = (category: VaultCategory | string) => {
    switch (category) {
      case 'passport':
        return 'badge';
      case 'visa':
        return 'travel_explore';
      case 'flight':
        return 'flight_takeoff';
      case 'hotel':
        return 'hotel';
      case 'insurance':
        return 'health_and_safety';
      case 'id':
        return 'badge';
      case 'activity':
        return 'confirmation_number';
      case 'transit':
        return 'directions_car';
      case 'permit':
        return 'verified';
      case 'emergency':
        return 'emergency';
      default:
        return 'description';
    }
  };

  const getCategoryColor = (category: VaultCategory | string) => {
    switch (category) {
      case 'passport':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'visa':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'flight':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'hotel':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'insurance':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'id':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'activity':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'transit':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'permit':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'emergency':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER & ACTIONS                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1FF] border border-[#BFDBFE] text-[#1E40AF] text-xs font-semibold shadow-2xs">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Secure Travel Wallet</span>
            </span>
            <span className="text-[#737686] text-xs">•</span>
            <span className="text-emerald-700 text-xs font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              256-Bit Encrypted & Offline Available
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
            Travel Vault
          </h1>
          <p className="text-sm md:text-base text-[#4B5563] mt-1 max-w-2xl">
            Your encrypted document repository connected to each itinerary. Instant offline access to
            passports, visas, flight boarding passes, hotel vouchers, activity tickets, permits, and
            emergency contacts without requiring cellular data.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportVaultBundle}
            className="px-4 py-2.5 rounded-full border border-[#D1D5DB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            title="Download all trip documents in an encrypted ZIP bundle"
          >
            <span className="material-symbols-outlined text-base text-[#2563EB]">
              folder_zip
            </span>
            <span className="hidden sm:inline">Export Offline Bundle</span>
            <span className="sm:hidden">Export</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-full border border-[#D1D5DB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#4B5563]">upload_file</span>
            <span>Manual Add</span>
          </button>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-5 py-2.5 rounded-full bg-linear-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer ring-2 ring-blue-300/40"
          >
            <span className="material-symbols-outlined text-base">document_scanner</span>
            <span>Scan Document</span>
            <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-full font-bold">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* AI CAMERA DOCUMENT SCANNER HERO BANNER                        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-linear-to-r from-blue-900 via-[#1E3A8A] to-[#0F172A] rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Device Camera Optical Scanner & AI Classifier</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Have a paper boarding pass, passport or hotel voucher?
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Point your device camera at any travel credential. Our optical Gemini AI extracts flight PNRs, MRZ zones, hotel reservation codes, and insurance numbers, then automatically classifies and saves them to your encrypted offline vault.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-5 py-3 rounded-full bg-white text-[#004AC6] hover:bg-blue-50 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base text-[#2563EB] group-hover:scale-110 transition-transform">
              document_scanner
            </span>
            <span>Launch Camera Scanner</span>
          </button>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECURITY TELEMETRY & TRIP SCOPE BAR                           */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Trip Selector Widget */}
        <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#F0F3FF] text-[#004AC6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">luggage</span>
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
                Linked Journey Vault
              </div>
              <div className="text-sm font-bold text-[#111827]">
                {selectedTrip === 'all'
                  ? 'All Documents Across Journeys'
                  : selectedTrip === 'kerala-escape'
                  ? 'Kerala 6-Day Luxury Escape (Active Tour)'
                  : 'Dubai Luxury Transit & Stopover'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTrip}
              onChange={e => setSelectedTrip(e.target.value)}
              className="text-xs font-semibold bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
            >
              <option value="all">📁 All Journeys (12 docs)</option>
              <option value="kerala-escape">🌴 Kerala Luxury Escape (Active)</option>
              <option value="dubai-stopover">🏙️ Dubai Stopover (1 doc)</option>
            </select>
          </div>
        </div>

        {/* Security & Offline Indicator Widget */}
        <div className="lg:col-span-4 bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">offline_pin</span>
          </span>
          <div className="min-w-0">
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <span>Offline Sync Status: Ready</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
              All documents cached locally. You can open them in flight mode or in remote areas.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EMERGENCY ASSISTANCE CONTACTS RIBBON                          */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-lg">
              emergency
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Fast-Dial Emergency & Trip Contacts
            </h2>
          </div>
          <span className="text-[11px] text-[#6B7280]">
            Verified for Kerala Circuit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EMERGENCY_CONTACTS.slice(0, 4).map(contact => (
            <div
              key={contact.id}
              className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col justify-between hover:border-[#2563EB] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#111827] truncate">{contact.name}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
                    {contact.id === 'em-concierge' ? 'WhatsApp' : '24/7'}
                  </span>
                </div>
                <div className="text-[10px] text-[#6B7280] truncate mt-0.5">
                  {contact.role}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#004AC6]">
                  {contact.phone}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyPhone(contact.id, contact.phone)}
                    className="p-1.5 rounded-full text-[#6B7280] hover:text-[#111827] hover:bg-white transition-colors cursor-pointer"
                    title="Copy phone number"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedContactId === contact.id ? 'check' : 'content_copy'}
                    </span>
                  </button>
                  {contact.id === 'em-concierge' && onOpenWhatsApp && (
                    <button
                      onClick={onOpenWhatsApp}
                      className="p-1.5 rounded-full text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Open WhatsApp Concierge"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY FILTER TABS & SEARCH BAR                             */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Documents', icon: 'folder' },
            { id: 'passport', label: 'Passports & IDs', icon: 'badge' },
            { id: 'flight', label: 'Flight Tickets', icon: 'flight_takeoff' },
            { id: 'hotel', label: 'Hotel Confirmations', icon: 'hotel' },
            { id: 'permit', label: 'Visas & Permits', icon: 'verified' },
            { id: 'insurance', label: 'Travel Insurance', icon: 'health_and_safety' },
            { id: 'activity', label: 'Activity & Transit', icon: 'confirmation_number' },
            { id: 'emergency', label: 'Emergency Contacts', icon: 'emergency' },
          ].map(tab => {
            const count = getCategoryCount(tab.id);
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-gray-50 hover:text-[#111827]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#4B5563]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input and view counters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined text-[#9CA3AF] text-lg absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, document #, traveler, PNR..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#D1D5DB] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] placeholder:text-[#9CA3AF]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <div className="text-xs text-[#6B7280] font-medium self-end sm:self-center">
            Showing <span className="font-bold text-[#111827]">{filteredDocuments.length}</span>{' '}
            documents
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EMERGENCY CONTACTS SPECIAL VIEW (IF TAB ACTIVE)               */}
      {/* ------------------------------------------------------------- */}
      {activeCategory === 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_CONTACTS.map(contact => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {contact.badge}
                  </span>
                  <h3 className="text-base font-bold text-[#111827] mt-1.5">
                    {contact.name}
                  </h3>
                  <div className="text-xs text-[#4B5563]">{contact.role}</div>
                </div>
                <span className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">contact_phone</span>
                </span>
              </div>

              {contact.location && (
                <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#9CA3AF]">
                    location_on
                  </span>
                  <span>{contact.location}</span>
                </div>
              )}

              {contact.notes && (
                <p className="text-xs text-[#4B5563] bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB]">
                  {contact.notes}
                </p>
              )}

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#6B7280]">Direct Line</div>
                  <div className="text-sm font-mono font-bold text-[#004AC6]">
                    {contact.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPhone(contact.id, contact.phone)}
                    className="px-3.5 py-1.5 rounded-full border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-gray-50 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedContactId === contact.id ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedContactId === contact.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>Dial</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOCUMENT GRID                                                 */}
      {/* ------------------------------------------------------------- */}
      {activeCategory !== 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map(doc => {
            const catColor = getCategoryColor(doc.category);
            const catIcon = getCategoryIcon(doc.category);

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all cursor-pointer p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card top badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catColor}`}
                    >
                      <span className="material-symbols-outlined text-sm">{catIcon}</span>
                      <span className="capitalize">{doc.category}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {doc.offlineReady && (
                        <span
                          className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium flex items-center gap-0.5"
                          title="Available offline without data"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Offline
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 text-[#4B5563]">
                        {doc.fileType}
                      </span>
                    </div>
                  </div>

                  {/* Title & traveler */}
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#004AC6] transition-colors line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <div className="text-[11px] text-[#6B7280] mt-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-[#9CA3AF]">
                        person
                      </span>
                      <span>{doc.travelerName}</span>
                    </div>
                  </div>

                  {/* Reference Number & Expiry metadata */}
                  <div className="p-3 bg-[#F9FAFB] rounded-xl text-xs space-y-1.5 border border-[#E5E7EB]/60">
                    {doc.documentNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280] text-[11px]">Ref / Doc #:</span>
                        <span className="font-mono font-bold text-[#111827] text-[11px]">
                          {doc.documentNumber}
                        </span>
                      </div>
                    )}

                    {doc.expiryDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280] text-[11px]">Validity / Expiry:</span>
                        <span className="text-[#111827] font-medium text-[11px]">
                          {doc.expiryDate}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280] text-[11px]">Linked Trip:</span>
                      <span className="text-[#004AC6] font-medium text-[11px] truncate max-w-[140px]">
                        {doc.tripName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="text-[10px] text-[#9CA3AF]">
                    {doc.fileSize} · {doc.uploadedAt}
                  </div>

                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => handleDownloadDoc(doc, e)}
                      className="p-1.5 rounded-full text-[#6B7280] hover:text-[#004AC6] hover:bg-[#F0F3FF] transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                    </button>

                    <button
                      onClick={e => handleShareDoc(doc, e)}
                      className="p-1.5 rounded-full text-[#6B7280] hover:text-[#004AC6] hover:bg-[#F0F3FF] transition-colors cursor-pointer"
                      title="Share link"
                    >
                      <span className="material-symbols-outlined text-base">share</span>
                    </button>

                    <button
                      onClick={e => handleDeleteDoc(doc.id, e)}
                      className="p-1.5 rounded-full text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove document"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {activeCategory !== 'emergency' && filteredDocuments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#004AC6] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">folder_off</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]">No documents found</h3>
            <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any documents matching your current filters. Try resetting the search or category filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setSelectedTrip('all');
            }}
            className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOCUMENT INSPECTION MODAL                                     */}
      {/* ------------------------------------------------------------- */}
      {selectedDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#F0F3FF] p-6 border-b border-[#E5E7EB] flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-xl">
                    {getCategoryIcon(selectedDocument.category)}
                  </span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#004AC6] border border-[#BFDBFE]">
                      {selectedDocument.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified Active
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#111827] mt-1">
                    {selectedDocument.title}
                  </h2>
                  <div className="text-xs text-[#6B7280]">
                    Holder: <span className="font-semibold text-[#111827]">{selectedDocument.travelerName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDocument(null)}
                className="w-8 h-8 rounded-full text-[#6B7280] hover:bg-white hover:text-[#111827] flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Document Body & Simulated Digital Certificate */}
            <div className="p-6 space-y-6">
              {/* Official Credential Preview Card */}
              <div className="rounded-2xl border-2 border-[#E5E7EB] bg-linear-to-b from-white to-[#F9FAFB] p-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl pointer-events-none -z-10" />

                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-lg">
                      verified_user
                    </span>
                    <span className="text-xs font-bold text-[#111827] tracking-tight">
                      TripFlow Vault Verified Credential
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#004AC6]">
                    {selectedDocument.documentNumber || 'REF #TF-9421'}
                  </span>
                </div>

                {/* Specific Fields Grid */}
                {selectedDocument.fields && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
                    {Object.entries(selectedDocument.fields).map(([label, value]) => (
                      <div key={label} className="p-2.5 rounded-xl bg-white border border-[#E5E7EB]">
                        <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
                          {label}
                        </div>
                        <div className="font-bold text-[#111827] mt-0.5">{value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Simulated Barcode / QR Section for Boarding passes & tickets */}
                <div className="mt-4 pt-4 border-t border-dashed border-[#D1D5DB] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold">
                      Digital Security Hash
                    </div>
                    <div className="text-xs font-mono text-[#374151] mt-0.5">
                      SHA256: 8a4f9...e271 (Encrypted locally)
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1 justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Offline Ready · No roaming required</span>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-[#E5E7EB] shadow-2xs">
                    <span className="material-symbols-outlined text-3xl text-[#111827]">
                      qr_code_2
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes block */}
              {selectedDocument.notes && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#111827]">Concierge Notes</div>
                  <p className="text-xs text-[#4B5563] bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed">
                    {selectedDocument.notes}
                  </p>
                </div>
              )}

              {/* Verification & Audit Footer */}
              <div className="text-[11px] text-[#6B7280] flex items-center justify-between bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                <span className="flex items-center gap-1 text-[#004AC6]">
                  <span className="material-symbols-outlined text-sm">security</span>
                  <span>{selectedDocument.verifiedBy || 'TripFlow Verified'}</span>
                </span>
                <span>Uploaded: {selectedDocument.uploadedAt}</span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 bg-gray-50 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteDoc(selectedDocument.id)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Remove</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareDoc(selectedDocument)}
                  className="px-4 py-2 rounded-full border border-[#D1D5DB] hover:bg-white text-xs font-bold text-[#374151] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  <span>Share Link</span>
                </button>

                <button
                  onClick={() => handleDownloadDoc(selectedDocument)}
                  className="px-5 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* UPLOAD / ADD DOCUMENT MODAL                                   */}
      {/* ------------------------------------------------------------- */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#F0F3FF] p-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#004AC6]">
                    Add Document to Travel Vault
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Securely upload credentials for offline access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full text-[#6B7280] hover:bg-white hover:text-[#111827] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Sarah Mehta — Medical Fitness Certificate"
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111827] mb-1">
                    Document Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as VaultCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB] cursor-pointer"
                  >
                    <option value="passport">Passport</option>
                    <option value="visa">Visa</option>
                    <option value="flight">Flight Ticket / Boarding Pass</option>
                    <option value="hotel">Hotel Confirmation Voucher</option>
                    <option value="insurance">Travel Insurance</option>
                    <option value="id">ID Proof</option>
                    <option value="activity">Activity Ticket</option>
                    <option value="transit">Train / Bus / Chauffeur Ticket</option>
                    <option value="permit">Permit / Wildlife Pass</option>
                    <option value="emergency">Emergency Contact Sheet</option>
                    <option value="other">Other PDF / Image</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#111827] mb-1">
                    Linked Journey *
                  </label>
                  <select
                    value={newTripId}
                    onChange={e => setNewTripId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB] cursor-pointer"
                  >
                    <option value="kerala-escape">Kerala 6-Day Luxury Escape</option>
                    <option value="dubai-stopover">Dubai Luxury Transit</option>
                    <option value="rajasthan-heritage">Rajasthan Royal Heritage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111827] mb-1">
                    Traveler Name
                  </label>
                  <input
                    type="text"
                    value={newTravelerName}
                    onChange={e => setNewTravelerName(e.target.value)}
                    placeholder="Sarah Mehta"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111827] mb-1">
                    Document / Ref #
                  </label>
                  <input
                    type="text"
                    value={newDocNumber}
                    onChange={e => setNewDocNumber(e.target.value)}
                    placeholder="e.g. DOC-99410"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Validity / Expiry Date (Optional)
                </label>
                <input
                  type="text"
                  value={newExpiryDate}
                  onChange={e => setNewExpiryDate(e.target.value)}
                  placeholder="e.g. 15 Oct 2026 or Valid for Trip Duration"
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB]"
                />
              </div>

              {/* Dropzone Simulation */}
              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Upload File (PDF, PNG, JPG)
                </label>
                <div
                  onClick={() => setNewFileName('sarah_mehta_verified_document.pdf')}
                  className="border-2 border-dashed border-[#D1D5DB] hover:border-[#2563EB] rounded-2xl p-4 text-center bg-[#F9FAFB] cursor-pointer transition-colors group"
                >
                  <span className="material-symbols-outlined text-2xl text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors">
                    cloud_upload
                  </span>
                  <div className="text-xs font-semibold text-[#374151] mt-1">
                    {newFileName ? (
                      <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {newFileName} (Selected)
                      </span>
                    ) : (
                      'Click to attach file or drag & drop here'
                    )}
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                    Supports PDF, scanned images up to 25MB (256-bit encrypted)
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Notes / Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Any special remarks or concierge instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] bg-[#F9FAFB]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D1D5DB] text-xs font-semibold text-[#4B5563] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>Save to Encrypted Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* AI DOCUMENT SCANNER MODAL                                     */}
      {/* ------------------------------------------------------------- */}
      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSaveDocument={handleSaveScannedDocument}
        defaultTripId={selectedTrip !== 'all' ? selectedTrip : 'kerala-escape'}
        defaultTripName={
          selectedTrip === 'dubai-stopover'
            ? 'Dubai Luxury Transit & Stopover'
            : 'Kerala 6-Day Luxury Escape'
        }
      />
    </div>
  );
};
