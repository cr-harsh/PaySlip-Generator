import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  User,
  ChevronDown,
  Search,
  Check,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Briefcase,
  Calendar,
  CreditCard,
  Mail,
  Scale,
  TrendingUp,
} from 'lucide-react';
import type { Client, Candidate } from '../types/payroll';

interface Step1Props {
  clients: Client[];
  candidates: Candidate[];
  selectedClient: Client | null;
  selectedCandidate: Candidate | null;
  onSelectClient: (client: Client | null) => void;
  onSelectCandidate: (candidate: Candidate | null) => void;
  onContinue: () => void;
}

export const Step1ClientCandidate: React.FC<Step1Props> = ({
  clients,
  candidates,
  selectedClient,
  selectedCandidate,
  onSelectClient,
  onSelectCandidate,
  onContinue,
}) => {
  const [clientSearch, setClientSearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [isCandidateOpen, setIsCandidateOpen] = useState(false);

  const clientRef = useRef<HTMLDivElement>(null);
  const candidateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientRef.current && !clientRef.current.contains(event.target as Node)) {
        setIsClientOpen(false);
      }
      if (
        candidateRef.current &&
        !candidateRef.current.contains(event.target as Node)
      ) {
        setIsCandidateOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered lists
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.gstin.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const availableCandidates = selectedClient
    ? candidates.filter((c) => c.clientId === selectedClient.id)
    : [];

  const filteredCandidates = availableCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.employeeId.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.designation.toLowerCase().includes(candidateSearch.toLowerCase()),
  );

  // Quick Scenario Preset Switcher
  const handleSetScenario = (scenario: 'verified' | 'missing' | 'empty') => {
    if (scenario === 'empty') {
      onSelectClient(null);
      onSelectCandidate(null);
      return;
    }

    const northstar = clients.find((c) => c.id === 'CL-8802') || clients[0];
    onSelectClient(northstar);

    if (scenario === 'verified') {
      const aarav =
        candidates.find((c) => c.id === 'cand-1' && c.clientId === northstar.id) ||
        availableCandidates[0];
      onSelectCandidate(aarav);
    } else if (scenario === 'missing') {
      const meera =
        candidates.find((c) => c.id === 'cand-2' && c.clientId === northstar.id) ||
        availableCandidates[1];
      onSelectCandidate(meera);
    }
  };

  const isComplete = selectedClient !== null && selectedCandidate !== null;
  const isMissingStatutory =
    selectedCandidate && (!selectedCandidate.pan || !selectedCandidate.pfUan);

  return (
    <div className="flex flex-col gap-6">
      {/* Active Phase Notice Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
                Active Phase
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-sm font-semibold text-on-surface">
                Step 1: Identity & Affiliation
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Select client organization and candidate to initialize payroll preparation and legal tax baseline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              Statutory Ledger Rule
            </span>
            <span className="font-mono text-xs font-semibold text-on-surface">
              Sec 192 (IT Act, 1961)
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface text-[11px] font-semibold flex items-center gap-1.5 border border-outline-variant/40">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
            <span>Auto-Sync Active</span>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selectors & Controls (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Selection Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex flex-col gap-5">
            {/* 1. Client Selector */}
            <div className="relative" ref={clientRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                  <span>Client / Organization</span>
                  <span className="text-error font-bold">*</span>
                </label>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {clients.length} Active Portfolios
                </span>
              </div>

              {/* Client Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsClientOpen(!isClientOpen)}
                className="w-full text-left p-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-xs flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {selectedClient ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-on-surface truncate">
                          {selectedClient.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[11px]">
                          {selectedClient.code}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant truncate">
                        {selectedClient.location} • GSTIN {selectedClient.gstin}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Choose client organization...
                      </span>
                      <p className="text-xs text-on-surface-variant/70">
                        Click to expand client directory
                      </p>
                    </div>
                  </div>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-on-surface-variant transition-transform ${
                    isClientOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Client Dropdown Menu */}
              {isClientOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-40 p-2 bg-white rounded-xl shadow-xl border border-outline-variant/60 flex flex-col gap-1 max-h-72 overflow-y-auto">
                  <div className="p-2 bg-surface-container-low rounded-lg mb-1 flex items-center gap-2">
                    <Search className="w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      className="bg-transparent text-xs w-full outline-none text-on-surface placeholder:text-on-surface-variant font-medium"
                      placeholder="Search by client name, code, or GSTIN..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {filteredClients.map((client) => {
                    const isSelected = selectedClient?.id === client.id;
                    return (
                      <div
                        key={client.id}
                        onClick={() => {
                          onSelectClient(client);
                          onSelectCandidate(null); // Reset candidate when client changes
                          setIsClientOpen(false);
                          setClientSearch('');
                        }}
                        className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-on-surface truncate">
                              {client.name}
                            </span>
                            <span className="text-[10px] font-mono text-on-surface-variant">
                              {client.code}
                            </span>
                          </div>
                          <span className="text-[11px] text-on-surface-variant truncate">
                            {client.location}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Candidate Selector (Dependent on Client) */}
            <div className="relative" ref={candidateRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                  <span>Candidate / Application</span>
                  <span className="text-error font-bold">*</span>
                </label>
                <span className="text-[11px] font-medium text-secondary">
                  {selectedClient
                    ? `${availableCandidates.length} Candidates Available`
                    : 'Select a client first'}
                </span>
              </div>

              {/* Candidate Dropdown Button */}
              <button
                type="button"
                disabled={!selectedClient}
                onClick={() => setIsCandidateOpen(!isCandidateOpen)}
                className={`w-full text-left p-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest transition-colors shadow-xs flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  !selectedClient
                    ? 'opacity-60 cursor-not-allowed bg-surface-container-low/50'
                    : 'hover:bg-surface-container-low cursor-pointer'
                }`}
              >
                {selectedCandidate ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {selectedCandidate.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-on-surface truncate">
                          {selectedCandidate.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">
                          {selectedCandidate.employeeId}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant truncate">
                        {selectedCandidate.designation} • {selectedCandidate.department}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {selectedClient
                          ? 'Select candidate record...'
                          : 'Select a client above to view candidates'}
                      </span>
                      <p className="text-xs text-on-surface-variant/70">
                        {selectedClient
                          ? 'Choose candidate to load verified employment details'
                          : 'Candidate options depend on chosen client'}
                      </p>
                    </div>
                  </div>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-on-surface-variant transition-transform ${
                    isCandidateOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Candidate Dropdown Menu */}
              {isCandidateOpen && selectedClient && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-40 p-2 bg-white rounded-xl shadow-xl border border-outline-variant/60 flex flex-col gap-1 max-h-72 overflow-y-auto">
                  <div className="p-2 bg-surface-container-low rounded-lg mb-1 flex items-center gap-2">
                    <Search className="w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      className="bg-transparent text-xs w-full outline-none text-on-surface placeholder:text-on-surface-variant font-medium"
                      placeholder="Search candidate name, ID, or designation..."
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {filteredCandidates.map((candidate) => {
                    const isSelected = selectedCandidate?.id === candidate.id;
                    const isMissing = !candidate.pan || !candidate.pfUan;
                    return (
                      <div
                        key={candidate.id}
                        onClick={() => {
                          onSelectCandidate(candidate);
                          setIsCandidateOpen(false);
                          setCandidateSearch('');
                        }}
                        className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                              isMissing
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-primary-container text-white'
                            }`}
                          >
                            {candidate.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-on-surface truncate">
                                {candidate.name}
                              </span>
                              <span className="text-[10px] font-mono text-on-surface-variant">
                                {candidate.employeeId}
                              </span>
                            </div>
                            <span
                              className={`text-[11px] truncate ${
                                isMissing ? 'text-error' : 'text-on-surface-variant'
                              }`}
                            >
                              {candidate.designation}{' '}
                              {isMissing && '• (Missing PAN/UAN)'}
                            </span>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        ) : isMissing ? (
                          <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container text-[10px] font-bold">
                            Edge case
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Scenario Preset Helper Bar */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-on-surface">Test Scenarios:</span>
              </div>
              <div className="inline-flex rounded-lg bg-surface-container p-0.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSetScenario('verified')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    selectedCandidate?.id === 'cand-1'
                      ? 'bg-white text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Verified Record
                </button>
                <button
                  type="button"
                  onClick={() => handleSetScenario('missing')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    selectedCandidate?.id === 'cand-2'
                      ? 'bg-white text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Missing PAN/UAN
                </button>
                <button
                  type="button"
                  onClick={() => handleSetScenario('empty')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    !selectedCandidate && !selectedClient
                      ? 'bg-white text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Blank State
                </button>
              </div>
            </div>
          </div>

          {/* Statutory Compliance Notice Box */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-on-surface">
                Income Tax Deductions & Statutory Compliance
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Candidate PAN ensures proper Form 16 reconciliation. If PAN or PF UAN is absent,
                the system displays <span className="font-semibold">“Not provided”</span> as mandated by PRD Section 4.
              </p>
            </div>
          </div>

          {/* Mini Portfolio Analytics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-outline-variant/40 shadow-xs flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Client Ledger
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-on-surface mt-1">
                ₹42,80,500
              </span>
              <div className="flex items-center gap-1 mt-1 text-tertiary text-[10px] font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>Allocated OCT-26</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-outline-variant/40 shadow-xs flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Cycle Cutoff
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-on-surface mt-1">
                25th Month
              </span>
              <span className="text-[10px] text-on-surface-variant mt-1">Monthly cycle</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-outline-variant/40 shadow-xs flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                PF Circle
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-on-surface mt-1">
                KR / BNG / 04
              </span>
              <span className="text-[10px] text-on-surface-variant mt-1">EPFO Certified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Rich Identity Dossier (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {selectedCandidate && selectedClient ? (
            /* Populated Candidate Dossier Card */
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/40 shadow-sm flex flex-col gap-5 relative overflow-hidden transition-all duration-300">
              {/* Header Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isMissingStatutory ? 'bg-error' : 'bg-tertiary'
                    }`}
                  />
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {isMissingStatutory
                      ? 'Compliance Attention Needed'
                      : 'Profile Verification Active'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isMissingStatutory
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed'
                  }`}
                >
                  {isMissingStatutory ? 'Incomplete Baseline' : 'Verified Record'}
                </span>
              </div>

              {/* Candidate Info Profile Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs ${
                    isMissingStatutory
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-primary text-white ring-2 ring-primary/20'
                  }`}
                >
                  {selectedCandidate.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-base text-on-surface truncate">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {selectedCandidate.designation}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-on-surface-variant">ID:</span>
                    <span className="font-mono text-xs font-bold text-primary">
                      {selectedCandidate.employeeId}
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-[11px] text-on-surface-variant">
                      {selectedCandidate.tenure}
                    </span>
                  </div>
                </div>
              </div>

              {/* Identity Details Grid */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Employment Metadata
                  </span>
                  <span className="text-[11px] text-primary font-semibold">
                    {selectedClient.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-white border border-outline-variant/30 flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Date of Joining
                    </span>
                    <span className="font-semibold text-on-surface mt-0.5">
                      {selectedCandidate.dateOfJoining}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white border border-outline-variant/30 flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Department
                    </span>
                    <span className="font-semibold text-on-surface mt-0.5 truncate">
                      {selectedCandidate.department.split('•')[0]}
                    </span>
                  </div>

                  {/* PAN Card */}
                  <div className="p-2 rounded-lg bg-white border border-outline-variant/30 flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> PAN Identifier
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      {selectedCandidate.pan ? (
                        <span className="font-mono font-bold text-on-surface">
                          {selectedCandidate.pan}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container text-[10px] font-bold">
                          Not provided
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PF UAN Card */}
                  <div className="p-2 rounded-lg bg-white border border-outline-variant/30 flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> EPF UAN
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      {selectedCandidate.pfUan ? (
                        <span className="font-mono font-bold text-on-surface">
                          {selectedCandidate.pfUan}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
                          Not provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="p-2 rounded-lg bg-white border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                    <span className="text-xs truncate">
                      {selectedCandidate.email ? (
                        <span className="font-medium text-on-surface">
                          {selectedCandidate.email}
                        </span>
                      ) : (
                        <span className="text-error font-semibold">
                          Missing Email (Distribution will be blocked)
                        </span>
                      )}
                    </span>
                  </div>
                  {selectedCandidate.email ? (
                    <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold shrink-0">
                      Verified
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container text-[10px] font-bold shrink-0">
                      Action Required
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Data Warning if applicable */}
              {isMissingStatutory && (
                <div className="p-3 rounded-xl bg-error-container/60 border border-error/30 text-on-error-container flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                  <p>
                    PAN or PF UAN is absent. Per PRD Section 4 & 8, values are marked as{' '}
                    <strong className="underline">“Not provided”</strong>. Payslip generation can proceed with this status.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty State Placeholder Card */
            <div className="p-8 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex flex-col items-center justify-center text-center gap-3 py-16">
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-xs">
                <h4 className="font-bold text-sm text-on-surface">
                  No client or candidate selected
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Choose a client organization and candidate above to view identity dossier and proceed with salary computation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSetScenario('verified')}
                className="mt-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
              >
                Auto-Select Northstar Demo
              </button>
            </div>
          )}

          {/* Encryption & Security Footnote */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-tertiary" />
              <span>Encrypted via AES-256 for Form 16 Compliance</span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-primary">
              ATS-SEC-1024
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => handleSetScenario('empty')}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
          >
            Clear Selection
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Next Action
            </span>
            <span className="text-xs font-semibold text-on-surface">
              Step 2: Salary & Attendance
            </span>
          </div>

          <button
            type="button"
            disabled={!isComplete}
            onClick={onContinue}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
              isComplete
                ? 'bg-primary text-white hover:bg-primary-container cursor-pointer'
                : 'bg-surface-container-high text-on-surface-variant/60 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Save & Continue to Salary</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
