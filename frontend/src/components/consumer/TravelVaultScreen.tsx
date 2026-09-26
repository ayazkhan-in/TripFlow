import React, { useState, useEffect } from 'react';
import { VaultDocument, VaultCategory } from '../../types/vault';
import { BookedTrip } from '../../types/travel';
import { INITIAL_VAULT_DOCUMENTS, EMERGENCY_CONTACTS } from '../../data/vaultData';
import { DocumentScannerModal } from './DocumentScannerModal';
import { TripFlowApi } from '../../services/api';
import { BlurFadeCard } from '../ui/MotionComponents';

interface TravelVaultScreenProps {
  onOpenWhatsApp?: () => void;
  showToast?: (message: string) => void;
  documents?: VaultDocument[];
  selectedTripId?: string;
  bookedTrips?: BookedTrip[];
  userName?: string;
}

export const TravelVaultScreen: React.FC<TravelVaultScreenProps> = ({
  onOpenWhatsApp,
  showToast = () => {},
  documents: externalDocuments,
  selectedTripId: externalTripId,
  bookedTrips = [],
  userName = 'Traveler',
}) => {
  const [documents, setDocuments] = useState<VaultDocument[]>(externalDocuments || []);
  const [selectedTrip, setSelectedTrip] = useState<string>(externalTripId || 'all');

  useEffect(() => {
    if (externalDocuments !== undefined) {
      setDocuments(externalDocuments);
    }
  }, [externalDocuments]);

  useEffect(() => {
    if (externalTripId) {
      setSelectedTrip(externalTripId);
    }
  }, [externalTripId]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<VaultDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [copiedContactId, setCopiedContactId] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VaultCategory>('passport');
  const [newTripId, setNewTripId] = useState('trip-1');
  const [newTravelerName, setNewTravelerName] = useState(userName);
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newFileName, setNewFileName] = useState('');

  const [emergencyContacts, setEmergencyContacts] = useState(EMERGENCY_CONTACTS);

  useEffect(() => {
    TripFlowApi.getEmergencyContacts().then(contacts => {
      if (contacts && contacts.length > 0) {
        setEmergencyContacts(contacts);
      }
    });
  }, []);

  // Category counts
  const getCategoryCount = (categoryKey: string) => {
    if (categoryKey === 'all') return documents.length;
    if (categoryKey === 'emergency') return emergencyContacts.length;
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
    showToast(`Downloading encrypted copy: "${doc.title}" (${doc.fileType.toUpperCase()})`);
  };

  const handleShareDoc = (doc: VaultDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Secure 24-hr guest link for "${doc.title}" copied to clipboard.`);
  };

  const handleDeleteDoc = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDocument?.id === id) setSelectedDocument(null);
    TripFlowApi.deleteVaultDocument(id).catch(console.warn);
    showToast('Document securely purged from Travel Vault.');
  };

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedContactId(id);
    showToast(`Emergency line ${phone} copied to clipboard!`);
    setTimeout(() => setCopiedContactId(null), 2500);
  };

  const handleCopyDocNumber = (id: string, num: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(num);
    setCopiedDocId(id);
    showToast(`Credential #${num} copied to clipboard!`);
    setTimeout(() => setCopiedDocId(null), 2500);
  };

  const handleExportVaultBundle = () => {
    showToast('Encrypted Trip Vault Bundle (12 Documents · AES-256 Offline) downloaded.');
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
      notes: newNotes.trim() || 'Custom uploaded credential stored in offline encrypted vault.',
    };

    setDocuments(prev => [newDoc, ...prev]);
    TripFlowApi.uploadVaultDocument(newDoc).catch(console.warn);
    setIsUploadModalOpen(false);
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
    TripFlowApi.uploadVaultDocument(newDoc).catch(console.warn);
    showToast(`AI Optical Scan Verified: "${newDoc.title}" saved to your Travel Vault!`);
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
        return 'fingerprint';
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
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER & ACTIONS                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Encrypted Digital Safe</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AES-256 Encrypted & 100% Offline Ready
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Travel Vault
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Your high-security offline credential repository. Instant one-tap access to passports, e-visas,
            IndiGo boarding passes, Brunton Boatyard vouchers, and medical insurance without cellular connection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleExportVaultBundle}
            className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            title="Download encrypted ZIP bundle"
          >
            <span className="material-symbols-outlined text-base text-blue-600">
              folder_zip
            </span>
            <span>Export Offline Bundle</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-slate-600">upload_file</span>
            <span>Manual Add</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer ring-2 ring-blue-300/40"
          >
            <span className="material-symbols-outlined text-base">document_scanner</span>
            <span>AI Camera Scanner</span>
            <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-full font-bold">
              Gemini
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* AI CAMERA DOCUMENT SCANNER HERO BANNER                        */}
      {/* ------------------------------------------------------------- */}
      <BlurFadeCard index={0} className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Optical Character Recognition & Auto-Classification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Have a physical boarding pass, passport or hotel slip?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Point your device camera at any travel credential. Our on-device vision model extracts flight PNRs, MRZ zones, hotel reservation codes, and policy numbers, saving them directly to your offline vault.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="px-5 py-3 rounded-full bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base text-blue-600 group-hover:scale-110 transition-transform">
              document_scanner
            </span>
            <span>Launch Camera Scanner</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 w-80 h-full bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </BlurFadeCard>

      {/* ------------------------------------------------------------- */}
      {/* SECURITY TELEMETRY BENTO STRIP                                */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <BlurFadeCard index={0} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Encryption Protocol</span>
            <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">AES-256 Bit Local</div>
          <div className="text-[11px] text-slate-500">Zero-knowledge device sandbox</div>
        </BlurFadeCard>

        {/* Metric 2 */}
        <BlurFadeCard index={1} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Offline Cache</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-base font-extrabold text-emerald-700">100% Synchronized</div>
          <div className="text-[11px] text-slate-500">12 of 12 documents cached offline</div>
        </BlurFadeCard>

        {/* Metric 3 */}
        <BlurFadeCard index={2} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Credential Validity</span>
            <span className="material-symbols-outlined text-blue-600 text-base">task_alt</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">All Credentials Valid</div>
          <div className="text-[11px] text-slate-500">Next renewal: Nov 2032 (Passport)</div>
        </BlurFadeCard>

        {/* Metric 4 */}
        <BlurFadeCard index={3} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Emergency Hotlines</span>
            <span className="material-symbols-outlined text-rose-600 text-base">emergency</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">4 Fast-Dials Verified</div>
          <div className="text-[11px] text-slate-500">Kerala circuit lead doctor on duty</div>
        </BlurFadeCard>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LINKED CIRCUIT SELECTOR                                       */}
      {/* ------------------------------------------------------------- */}
      <BlurFadeCard index={4} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <span className="material-symbols-outlined text-xl">luggage</span>
          </span>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Linked Itinerary Filter
            </div>
            <div className="text-sm font-bold text-slate-900">
              {selectedTrip === 'all'
                ? 'All Documents Across All Circuits'
                : bookedTrips.find(t => t.id === selectedTrip)?.title ||
                  (selectedTrip === 'kerala-escape'
                    ? 'Kerala 6-Day Luxury Escape (Active Tour)'
                    : selectedTrip === 'dubai-stopover'
                    ? 'Dubai Luxury Transit & Stopover'
                    : 'Active Trip Vault')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTrip}
            onChange={e => setSelectedTrip(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="all">📁 All Circuits ({documents.length} docs)</option>
            {bookedTrips.map(bt => (
              <option key={bt.id} value={bt.id}>
                📍 {bt.title} ({documents.filter(d => d.tripId === bt.id).length} docs)
              </option>
            ))}
            {!bookedTrips.some(t => t.id === 'kerala-escape') && (
              <option value="kerala-escape">🌴 Kerala Luxury Escape</option>
            )}
            {!bookedTrips.some(t => t.id === 'dubai-stopover') && (
              <option value="dubai-stopover">🏙️ Dubai Stopover</option>
            )}
          </select>
        </div>
      </BlurFadeCard>

      {/* ------------------------------------------------------------- */}
      {/* FAST-DIAL EMERGENCY & TRIP CONTACTS RIBBON                    */}
      {/* ------------------------------------------------------------- */}
      <BlurFadeCard index={5} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-lg">
              emergency
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Fast-Dial Emergency & Concierge Hotlines
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Verified for Kerala Circuit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EMERGENCY_CONTACTS.slice(0, 4).map(contact => (
            <div
              key={contact.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between hover:border-blue-400 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900 truncate">{contact.name}</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full font-bold border border-emerald-200">
                    {contact.id === 'em-concierge' ? 'WhatsApp' : '24/7'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {contact.role}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">
                  {contact.phone}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(contact.id, contact.phone)}
                    className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    title="Copy phone number"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedContactId === contact.id ? 'check' : 'content_copy'}
                    </span>
                  </button>
                  {contact.id === 'em-concierge' && onOpenWhatsApp && (
                    <button
                      type="button"
                      onClick={onOpenWhatsApp}
                      className="p-1.5 rounded-full text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer bg-emerald-50 border border-emerald-200"
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
      </BlurFadeCard>

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY FILTER TABS & INSTANT SEARCH BAR                     */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'all', label: 'All Documents', icon: 'folder' },
            { id: 'passport', label: 'Passports & IDs', icon: 'badge' },
            { id: 'flight', label: 'Flight Tickets', icon: 'flight_takeoff' },
            { id: 'hotel', label: 'Hotel Confirmations', icon: 'hotel' },
            { id: 'permit', label: 'Visas & Permits', icon: 'verified' },
            { id: 'insurance', label: 'Travel Insurance', icon: 'health_and_safety' },
            { id: 'activity', label: 'Activity & Transit', icon: 'confirmation_number' },
            { id: 'emergency', label: 'Emergency Hotlines', icon: 'emergency' },
          ].map(tab => {
            const count = getCategoryCount(tab.id);
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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
            <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, document #, traveler, PNR..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400 shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
            Showing <span className="font-bold text-slate-900">{filteredDocuments.length}</span>{' '}
            encrypted documents
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EMERGENCY HOTLINES EXPANDED VIEW                              */}
      {/* ------------------------------------------------------------- */}
      {activeCategory === 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
          {emergencyContacts.map((contact, idx) => (
            <BlurFadeCard
              key={contact.id}
              index={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {contact.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {contact.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">{contact.role}</div>
                </div>
                <span className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <span className="material-symbols-outlined text-xl">contact_phone</span>
                </span>
              </div>

              {contact.location && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-slate-400">
                    location_on
                  </span>
                  <span>{contact.location}</span>
                </div>
              )}

              {contact.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200 leading-relaxed">
                  {contact.notes}
                </p>
              )}

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Direct Line</div>
                  <div className="text-sm font-mono font-bold text-blue-600">
                    {contact.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(contact.id, contact.phone)}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedContactId === contact.id ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedContactId === contact.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>Dial Direct</span>
                  </a>
                </div>
              </div>
            </BlurFadeCard>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOCUMENT GRID                                                 */}
      {/* ------------------------------------------------------------- */}
      {activeCategory !== 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
          {filteredDocuments.map((doc, idx) => {
            const catColor = getCategoryColor(doc.category);
            const catIcon = getCategoryIcon(doc.category);

            return (
              <BlurFadeCard
                key={doc.id}
                index={idx}
                onClick={() => setSelectedDocument(doc)}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-500/80 shadow-2xs hover:shadow-md transition-all cursor-pointer p-5 flex flex-col justify-between space-y-4 text-left"
              >
                <div className="space-y-3">
                  {/* Card top badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catColor}`}
                    >
                      <span className="material-symbols-outlined text-sm">{catIcon}</span>
                      <span className="capitalize">{doc.category}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {doc.offlineReady && (
                        <span
                          className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1"
                          title="Available offline without data"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Offline
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                        {doc.fileType}
                      </span>
                    </div>
                  </div>

                  {/* Title & traveler */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-xs text-slate-400">
                        person
                      </span>
                      <span>{doc.travelerName}</span>
                    </div>
                  </div>

                  {/* Reference Number & Expiry metadata */}
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-200/80">
                    {doc.documentNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px] font-medium">Ref / Doc #:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-slate-900 text-[11px]">
                            {doc.documentNumber}
                          </span>
                          <button
                            type="button"
                            onClick={e => handleCopyDocNumber(doc.id, doc.documentNumber!, e)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title="Copy Ref"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {copiedDocId === doc.id ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {doc.expiryDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px] font-medium">Validity / Expiry:</span>
                        <span className="text-slate-900 font-bold text-[11px]">
                          {doc.expiryDate}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] font-medium">Circuit:</span>
                      <span className="text-blue-600 font-bold text-[11px] truncate max-w-[140px]">
                        {doc.tripName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-medium">
                    {doc.fileSize} · {doc.uploadedAt}
                  </div>

                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={e => handleDownloadDoc(doc, e)}
                      className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                    </button>
                    <button
                      type="button"
                      onClick={e => handleShareDoc(doc, e)}
                      className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Share 24-hr link"
                    >
                      <span className="material-symbols-outlined text-base">share</span>
                    </button>
                    <button
                      type="button"
                      onClick={e => handleDeleteDoc(doc.id, e)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              </BlurFadeCard>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOCUMENT PREVIEW MODAL                                        */}
      {/* ------------------------------------------------------------- */}
      {selectedDocument && (
        <div
          onClick={() => setSelectedDocument(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                    selectedDocument.category
                  )}`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {getCategoryIcon(selectedDocument.category)}
                  </span>
                  <span className="capitalize">{selectedDocument.category}</span>
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {selectedDocument.title}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedDocument.tripName} · {selectedDocument.travelerName}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Document Details Metadata Strip */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              {selectedDocument.documentNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Document / Reference #:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {selectedDocument.documentNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyDocNumber(selectedDocument.id, selectedDocument.documentNumber!)}
                      className="text-blue-600 hover:text-blue-800 p-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedDocument.expiryDate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Valid Thru:</span>
                  <span className="text-slate-900 font-bold">{selectedDocument.expiryDate}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Verification Stamp:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  {selectedDocument.verifiedBy}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Format & Size:</span>
                <span className="text-slate-700 font-mono">
                  {selectedDocument.fileType.toUpperCase()} ({selectedDocument.fileSize})
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedDocument.notes && (
              <div className="text-xs space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  Concierge & Compliance Notes
                </span>
                <p className="text-slate-600 leading-relaxed bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                  {selectedDocument.notes}
                </p>
              </div>
            )}

            {/* Simulated Encrypted Barcode / QR Preview */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                  AES-256 Offline Token
                </div>
                <div className="font-mono text-xs text-blue-300 font-bold">
                  SEC-VAULT-{selectedDocument.id.toUpperCase()}
                </div>
              </div>
              <span className="material-symbols-outlined text-3xl text-white/90">
                qr_code_2
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDeleteDoc(selectedDocument.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
              >
                Delete from Vault
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareDoc(selectedDocument)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  Share Link
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(selectedDocument)}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANUAL UPLOAD MODAL                                           */}
      {/* ------------------------------------------------------------- */}
      {isUploadModalOpen && (
        <div
          onClick={() => setIsUploadModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <span className="material-symbols-outlined text-base">upload_file</span>
                </span>
                <h3 className="font-extrabold text-base text-slate-900">Add Document to Vault</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Mehta — US Passport Scan"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as VaultCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
                  >
                    <option value="passport">Passport</option>
                    <option value="visa">Visa</option>
                    <option value="flight">Flight Ticket</option>
                    <option value="hotel">Hotel Voucher</option>
                    <option value="insurance">Insurance Policy</option>
                    <option value="id">Identity Card</option>
                    <option value="permit">Special Permit</option>
                    <option value="activity">Activity Ticket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Linked Circuit</label>
                  <select
                    value={newTripId}
                    onChange={e => setNewTripId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
                  >
                    <option value="kerala-escape">Kerala Escape (Active)</option>
                    <option value="dubai-stopover">Dubai Stopover</option>
                    <option value="rajasthan-heritage">Rajasthan Heritage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Document / Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. Z8294104"
                    value={newDocNumber}
                    onChange={e => setNewDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 14, 2032"
                    value={newExpiryDate}
                    onChange={e => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional compliance remarks or verification notes"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* AI OPTICAL CAMERA SCANNER MODAL                               */}
      {/* ------------------------------------------------------------- */}
      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSaveDocument={handleSaveScannedDocument}
      />
    </div>
  );
};
