import React, { useState } from 'react';
import {
  Mail,
  Lock,
  LockKeyhole,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Send,
  ShieldAlert,
  Key,
  FileCheck,
  Check,
  Loader2,
} from 'lucide-react';
import type {
  CalculationResult,
  SalaryAttendanceInputs,
  Candidate,
  Client,
} from '../types/payroll';
import { MONTH_NAMES } from '../payroll/constants';
import { formatINR } from '../payroll/calculations';

interface Step4Props {
  calculationResult: CalculationResult;
  inputs: SalaryAttendanceInputs;
  selectedCandidate: Candidate;
  selectedClient: Client;
  isPrepared: boolean;
  onConfirmPreparation: () => void;
  onResetWorkflow: () => void;
  onBackToReviewStep: () => void;
}

export const Step4DistributionConfirm: React.FC<Step4Props> = ({
  calculationResult,
  inputs,
  selectedCandidate,
  selectedClient,
  isPrepared,
  onConfirmPreparation,
  onResetWorkflow,
  onBackToReviewStep,
}) => {
  const [viewState, setViewState] = useState<'review' | 'success'>(
    isPrepared ? 'success' : 'review',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const currentMonthName = MONTH_NAMES[inputs.month - 1];
  const hasEmail = Boolean(selectedCandidate.email && selectedCandidate.email.trim() !== '');

  const handleOpenModal = () => {
    if (!hasEmail) return;
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsPreparing(true);
    setTimeout(() => {
      setIsPreparing(false);
      setIsModalOpen(false);
      onConfirmPreparation();
      setViewState('success');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Flow State Switcher & Simulation Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-outline uppercase tracking-wider">
              Step 4 Workflow Staging
            </div>
            <div className="text-sm font-bold text-on-surface">
              {viewState === 'success'
                ? 'Certified Staging & Distribution Receipt'
                : 'Final Dispatch & Distribution Review'}
            </div>
          </div>
        </div>

        {/* State Toggle Tabs for Reviewers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container border border-outline-variant/30">
          <button
            type="button"
            onClick={() => setViewState('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewState === 'review'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            1. Review State
          </button>
          <button
            type="button"
            onClick={() => {
              if (isPrepared) {
                setViewState('success');
              } else {
                handleOpenModal();
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewState === 'success'
                ? 'bg-white text-tertiary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            2. {isPrepared ? 'Success State' : 'Confirm Modal'}
          </button>
        </div>
      </div>

      {/* Main Grid: Dynamic State View (7 Cols) + Slip Snapshot (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Dynamic State View */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {viewState === 'review' ? (
            /* STATE A: ACTIVE REVIEW VIEW */
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-sm flex flex-col gap-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      Final Dispatch Stage
                    </span>
                    {isPrepared && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-bold border border-outline-variant/40">
                        <LockKeyhole className="w-3 h-3 text-primary" />
                        <span>Locked after confirmation</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-on-surface mt-0.5">
                    Distribution Review & Recipient Authorization
                  </h3>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      isPrepared
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : 'bg-surface-container-high text-primary'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPrepared ? 'bg-tertiary' : 'bg-primary-container animate-pulse'
                      }`}
                    />
                    {isPrepared ? 'Prepared for distribution' : 'Ready to prepare'}
                  </span>
                </div>
              </div>

              {/* Recipient Ledger Card */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary font-bold text-base flex items-center justify-center shrink-0">
                      {selectedCandidate.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">
                          {selectedCandidate.name}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                          {selectedCandidate.employeeId}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {hasEmail ? (
                          <span className="font-mono text-on-surface font-medium">
                            {selectedCandidate.email}
                          </span>
                        ) : (
                          <span className="text-error font-bold">
                            Missing Email Address
                          </span>
                        )}
                        {hasEmail && (
                          <span className="inline-flex items-center gap-0.5 px-1 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-outline">
                      Designation
                    </span>
                    <span className="text-xs font-semibold text-on-surface">
                      {selectedCandidate.designation}
                    </span>
                  </div>
                </div>

                {/* Parameters Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-outline-variant/30 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-outline uppercase font-bold block">
                        Pay Period
                      </span>
                      {isPrepared && (
                        <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                      )}
                    </div>
                    <span className="font-semibold text-on-surface">
                      {currentMonthName} {inputs.year}
                    </span>
                    <span className="text-[10px] text-on-surface-variant block mt-0.5">
                      Calendar: {calculationResult.calendarDays} Days
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-outline uppercase font-bold block">
                        Paid Attendance
                      </span>
                      {isPrepared && (
                        <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                      )}
                    </div>
                    <span className="font-mono font-bold text-on-surface">
                      {calculationResult.paidDays} / {calculationResult.calendarDays} Days
                    </span>
                    <span className="text-[10px] text-on-surface-variant block mt-0.5">
                      {Number(inputs.workingDays) - calculationResult.paidDays} LOP Days
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-surface-container-highest p-2.5 rounded-lg border border-outline-variant/30 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase block">
                        Net Calculated Pay
                      </span>
                      {isPrepared && (
                        <LockKeyhole className="w-3 h-3 text-primary" title="Locked after confirmation" />
                      )}
                    </div>
                    <span className="font-mono font-bold text-sm sm:text-base text-primary">
                      {formatINR(calculationResult.netPay)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant block">
                      Form 16 Balanced
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Security Protocol Box */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2.5">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Delivery Channel & PDF Encryption Simulation</span>
                </span>
                <div className="p-3 bg-white rounded-lg border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-on-surface">
                      Password-Protected Candidate Attachment
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Standard AES-256 HR Encrypted Envelope
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] bg-surface-container px-2.5 py-1 rounded-md text-on-surface">
                    <Key className="w-3.5 h-3.5 text-secondary" />
                    <span>PAN[First4] + DDMM</span>
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  When confirmed, candidate file archive{' '}
                  <code className="font-mono px-1 py-0.5 rounded bg-surface-container text-primary font-bold">
                    PS-{inputs.year}{String(inputs.month).padStart(2, '0')}-{selectedCandidate.employeeId}.pdf
                  </code>{' '}
                  will be prepared in memory.
                </p>
              </div>

              {/* Missing Email Alert (Blocks Distribution) */}
              {!hasEmail ? (
                <div className="p-4 rounded-xl bg-error-container/70 border border-error/40 text-on-error-container flex items-start gap-3 text-xs">
                  <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-error">
                      Recipient Email Missing — Preparation Blocked
                    </span>
                    <p>
                      Per PRD Section 4 & 8: If the candidate email is missing, distribution preparation is disabled. Please select a candidate with a verified email to proceed with preparation.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Prepare Action Trigger */}
              <div className="pt-3 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <CheckCircle className="w-4 h-4 text-tertiary" />
                  <span>Ledger balance verified against payroll register</span>
                </div>

                <button
                  type="button"
                  disabled={!hasEmail || isPrepared}
                  onClick={handleOpenModal}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    !hasEmail
                      ? 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed shadow-none'
                      : isPrepared
                      ? 'bg-tertiary text-white cursor-default'
                      : 'bg-primary text-white hover:bg-primary-container cursor-pointer'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isPrepared ? 'Prepared for distribution' : 'Prepare for distribution'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE C: DONE / SUCCESS STATE */
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-outline-variant/40 shadow-md flex flex-col items-center text-center gap-4 relative overflow-hidden">
              {/* Restrained Emerald Success Icon */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-tertiary text-white shadow-md my-2">
                <Check className="w-8 h-8 stroke-[3]" />
                <span className="absolute inset-0 rounded-full bg-tertiary animate-ping opacity-20 pointer-events-none" />
              </div>

              <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[11px] font-bold tracking-wider uppercase">
                Stage Completed
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                Prepared for distribution
              </h3>

              <p className="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
                The payslip document ledger for{' '}
                <strong className="text-on-surface">{selectedCandidate.name}</strong> has been
                compiled, checksummed, and entered into the dispatch queue.
              </p>

              {/* Mandatory Simulation Mode Notice Banner (PRD Section 4 & Section 11) */}
              <div className="w-full bg-surface-container-high p-4 rounded-xl text-left flex items-start gap-3 border border-outline-variant/40 shadow-xs">
                <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-on-surface">
                    Simulation Mode Only
                  </p>
                  <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                    Nothing was emailed, uploaded, or delivered. This is a frontend-only confirmation demonstrating the administrative payroll workflow as mandated by the assignment PRD.
                  </p>
                </div>
              </div>

              {/* Staged Ledger Details Card */}
              <div className="w-full bg-surface-container-low p-4 rounded-xl text-left border border-outline-variant/30">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/30 text-xs">
                  <span className="font-mono text-on-surface-variant font-bold uppercase">
                    Queue Token: #DISP-9941
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tertiary text-white font-mono text-[10px] font-bold">
                    Prepared & Staged
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">
                      Candidate
                    </span>
                    <span className="font-semibold text-on-surface">
                      {selectedCandidate.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">
                      Cycle
                    </span>
                    <span className="font-semibold text-on-surface">
                      {currentMonthName} {inputs.year}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">
                      Net Amount
                    </span>
                    <span className="font-mono font-bold text-primary">
                      {formatINR(calculationResult.netPay)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Actions for Completion */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewState('review')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-all"
                >
                  Back to review
                </button>
                <button
                  type="button"
                  onClick={onResetWorkflow}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start another payslip</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Slip Snapshot & Read-Only Staging Info */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-primary" />
                <span>Prepared Payslip Summary</span>
                {isPrepared && (
                  <LockKeyhole className="w-3.5 h-3.5 text-primary" title="Locked after confirmation" />
                )}
              </span>
              {isPrepared ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-mono text-[10px] font-bold text-primary uppercase border border-outline-variant/40">
                  <LockKeyhole className="w-2.5 h-2.5" />
                  <span>Locked after confirmation</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] font-bold text-outline uppercase">
                  FORM 16A READY
                </span>
              )}
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 text-xs flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-on-surface-variant" />}
                  <span>Client Org:</span>
                </span>
                <span className="font-semibold text-on-surface">
                  {selectedClient.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-on-surface-variant" />}
                  <span>Candidate:</span>
                </span>
                <span className="font-semibold text-on-surface">
                  {selectedCandidate.name} ({selectedCandidate.employeeId})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-on-surface-variant" />}
                  <span>Pay Period:</span>
                </span>
                <span className="font-semibold text-on-surface">
                  {currentMonthName} {inputs.year}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-on-surface-variant" />}
                  <span>Paid Days:</span>
                </span>
                <span className="font-mono font-bold text-primary">
                  {calculationResult.paidDays} / {calculationResult.calendarDays}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-on-surface-variant" />}
                  <span>Gross Earnings:</span>
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {formatINR(calculationResult.gross)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-on-surface-variant" />}
                  <span>Total Deductions:</span>
                </span>
                <span className="font-mono font-bold text-error">
                  {formatINR(calculationResult.deductions.totalDeductions)}
                </span>
              </div>
              <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="font-bold text-on-surface flex items-center gap-1">
                  {isPrepared && <LockKeyhole className="w-3 h-3 text-primary" />}
                  <span>Net Take-Home:</span>
                </span>
                <span className="font-mono font-bold text-sm text-primary">
                  {formatINR(calculationResult.netPay)}
                </span>
              </div>
            </div>

            {/* Read-Only State Assurance */}
            <div className="p-3 rounded-xl bg-surface-container text-[11px] text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Locking policy: </span>
              Once prepared, salary parameters are locked in read-only state to prevent silent modifications to the prepared audit trail.
            </div>
          </div>
        </div>
      </div>

      {/* STATE B: CONFIRMATION MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-base text-on-surface">
                  Confirm Payslip Preparation
                </h4>
              </div>
              <button
                type="button"
                disabled={isPreparing}
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface text-lg leading-none p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Loader State or Summary */}
            {isPreparing ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3.5 text-center my-3">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-fixed text-primary">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div className="flex flex-col gap-1 max-w-xs">
                  <h5 className="font-bold text-sm text-on-surface">
                    Preparing payslip for distribution…
                  </h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Compiling Form 16 ledger and staging candidate document in memory…
                  </p>
                </div>
                <div className="w-48 bg-surface-container rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="bg-primary h-1.5 rounded-full animate-pulse w-full" />
                </div>
              </div>
            ) : (
              <div className="p-5 flex flex-col gap-4 text-xs">
                <p className="text-on-surface-variant leading-relaxed">
                  You are about to prepare and stage the candidate payslip for distribution:
                </p>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Recipient:</span>
                    <span className="font-bold text-on-surface">
                      {selectedCandidate.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Recipient Email:</span>
                    <span className="font-mono text-on-surface">
                      {selectedCandidate.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Pay Period:</span>
                    <span className="font-semibold text-on-surface">
                      {currentMonthName} {inputs.year}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-outline-variant/30 pt-2 font-bold">
                    <span className="text-primary">Net Pay:</span>
                    <span className="font-mono text-sm text-primary">
                      {formatINR(calculationResult.netPay)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-on-surface">Notice: </span>
                  This is a frontend demonstration. No real email, network request, or file delivery will occur.
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isPreparing}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors border border-outline-variant/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPreparing}
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isPreparing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing payslip for distribution…</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Prepare</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToReviewStep}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Payslip</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="hidden md:inline-flex text-[11px] font-mono text-on-surface-variant">
            Dispatches queue in-memory
          </span>

          {!isPrepared && (
            <button
              type="button"
              disabled={!hasEmail}
              onClick={handleOpenModal}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                hasEmail
                  ? 'bg-primary text-white hover:bg-primary-container cursor-pointer'
                  : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Prepare for distribution</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
