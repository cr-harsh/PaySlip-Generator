import React from 'react';
import {
  Printer,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Info,
  FileText,
  LockKeyhole,
} from 'lucide-react';
import type {
  CalculationResult,
  SalaryAttendanceInputs,
  Candidate,
  Client,
} from '../types/payroll';
import { MONTH_NAMES } from '../payroll/constants';
import { formatINR } from '../payroll/calculations';
import { numberToWordsINR } from '../payroll/numberToWords';

interface Step3Props {
  calculationResult: CalculationResult;
  inputs: SalaryAttendanceInputs;
  selectedCandidate: Candidate;
  selectedClient: Client;
  isPrepared?: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export const Step3BreakdownPreview: React.FC<Step3Props> = ({
  calculationResult,
  inputs,
  selectedCandidate,
  selectedClient,
  isPrepared = false,
  onBack,
  onContinue,
}) => {
  const currentMonthName = MONTH_NAMES[inputs.month - 1];
  const netPayInWords = numberToWordsINR(calculationResult.netPay);

  return (
    <div className="flex flex-col gap-6">
      {/* Flow Status & Audit Metadata Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-outline-variant/40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">
                Financial Ledger Breakdown & Audit
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[10px] font-bold">
                VERIFIED FORMULA
              </span>
              {isPrepared && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-mono text-[10px] font-bold text-primary border border-outline-variant/40">
                  <LockKeyhole className="w-2.5 h-2.5" />
                  <span>Locked after confirmation</span>
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Prorated {calculationResult.paidDays} of {calculationResult.calendarDays} days calendar accrual. CTC {formatINR(Number(inputs.monthlyCtc) || 0)} baseline with statutory reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Audit Ref:
          </span>
          <span className="font-mono text-xs font-bold text-on-surface">
            PS-AUD-{inputs.year}{String(inputs.month).padStart(2, '0')}-{selectedCandidate.employeeId}
          </span>
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
        </div>
      </div>

      {/* Main 12-Column Grid: Left Column Audit Breakdown (7 Cols) | Right Column Printable A4 Document (5 Cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Calculation & Ledger Breakdown (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          {/* 1. Contract & Proration Profile Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-bold text-on-surface">
                  Contract & Proration Profile
                </h3>
                {isPrepared && (
                  <span title="Locked after confirmation" className="inline-flex items-center">
                    <LockKeyhole className="w-3.5 h-3.5 text-on-surface-variant" />
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-secondary">
                MONTHLY PAYROLL SYNC
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Employee
                </span>
                <span className="font-bold text-on-surface mt-0.5 truncate">
                  {selectedCandidate.name}
                </span>
                <span className="font-mono text-[11px] text-primary">
                  {selectedCandidate.employeeId}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Designation
                </span>
                <span className="font-semibold text-on-surface mt-0.5 truncate">
                  {selectedCandidate.designation}
                </span>
                <span className="text-[11px] text-on-surface-variant truncate">
                  {selectedCandidate.department.split('•')[0]}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Client Org
                </span>
                <span className="font-semibold text-on-surface mt-0.5 truncate">
                  {selectedClient.name}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Joined {selectedCandidate.dateOfJoining}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Pay Period
                </span>
                <span className="font-semibold text-on-surface mt-0.5">
                  {currentMonthName} {inputs.year}
                </span>
                <span className="font-mono text-[11px] text-primary font-semibold">
                  {calculationResult.calendarDays} Days
                </span>
              </div>
            </div>

            {/* Proration Formula Math Card */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-bold text-on-surface">Proration Math Breakdown</span>
                <span className="font-mono text-[11px] text-primary font-semibold">
                  PRD Section 6 Rules
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[11px]">
                    1. Monthly Compensation
                  </span>
                  <span className="font-mono font-bold text-on-surface">
                    {formatINR(calculationResult.monthlyCompensation)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    CTC − PT ({formatINR(calculationResult.deductions.pt)}) − IF ({formatINR(calculationResult.deductions.ifAmount)})
                  </span>
                </div>

                <div>
                  <span className="text-on-surface-variant block text-[11px]">
                    2. Per-day Compensation
                  </span>
                  <span className="font-mono font-bold text-on-surface">
                    ₹{calculationResult.perDayCompensation.toFixed(6)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    Monthly Comp / {calculationResult.calendarDays} (6 decimals)
                  </span>
                </div>

                <div>
                  <span className="text-on-surface-variant block text-[11px]">
                    3. Prorated Gross
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {formatINR(calculationResult.gross)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    Per-day Comp × {calculationResult.paidDays} Paid Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Earnings Breakdown Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-tertiary rounded-full" />
                <h3 className="text-sm font-bold text-on-surface">
                  Earnings Breakdown Schedule
                </h3>
                {isPrepared && (
                  <span title="Locked after confirmation" className="inline-flex items-center">
                    <LockKeyhole className="w-3.5 h-3.5 text-on-surface-variant" />
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-tertiary">
                GROSS COMPONENT ACCRUAL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">Component</th>
                    <th className="py-2.5 px-3">Statutory Basis</th>
                    <th className="py-2.5 px-3 text-right">Full Month Eq.</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Prorated Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">Basic Pay</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">40% of Prorated Gross</td>
                    <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant">
                      {formatINR(roundTo2(calculationResult.monthlyCompensation * 0.4))}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.earnings.basic)}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">
                      House Rent Allowance (HRA)
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">20% of Prorated Gross</td>
                    <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant">
                      {formatINR(roundTo2(calculationResult.monthlyCompensation * 0.2))}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.earnings.hra)}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">
                      Medical Allowance
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">10% of Prorated Gross</td>
                    <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant">
                      {formatINR(roundTo2(calculationResult.monthlyCompensation * 0.1))}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.earnings.medical)}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">
                      Special Allowance
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      Remainder (Gross − Basic − HRA − Medical)
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant">
                      {formatINR(
                        roundTo2(
                          calculationResult.monthlyCompensation -
                            roundTo2(calculationResult.monthlyCompensation * 0.4) -
                            roundTo2(calculationResult.monthlyCompensation * 0.2) -
                            roundTo2(calculationResult.monthlyCompensation * 0.1),
                        ),
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.earnings.special)}
                    </td>
                  </tr>

                  {/* Total Earnings Summary Row */}
                  <tr className="bg-surface-container-high font-bold text-on-surface">
                    <td colSpan={3} className="py-3 px-3 rounded-l-lg text-sm">
                      Total Earnings (Gross)
                    </td>
                    <td className="py-3 px-3 text-right rounded-r-lg font-mono text-sm sm:text-base text-primary">
                      {formatINR(calculationResult.earnings.totalEarnings)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Deductions Ledger & Informational PT/IF Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-error rounded-full" />
                <h3 className="text-sm font-bold text-on-surface">
                  Deductions Ledger & Statutory Reconciliation
                </h3>
                {isPrepared && (
                  <span title="Locked after confirmation" className="inline-flex items-center">
                    <LockKeyhole className="w-3.5 h-3.5 text-on-surface-variant" />
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-error">
                AUDIT CLASSIFICATION
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">Component</th>
                    <th className="py-2.5 px-3">Status / Nature</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">Employee PF</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      {inputs.pfApplicable
                        ? '12% of Basic (Prorated via Pay Ratio)'
                        : 'PF Exemption Active (₹0.00)'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-semibold">
                        Active Deductible
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.deductions.employeePF)}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">Employer PF</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      {inputs.pfApplicable
                        ? 'Statutory Match (Prorated via Pay Ratio)'
                        : 'PF Exemption Active (₹0.00)'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-semibold">
                        Active Deductible
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.deductions.employerPF)}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">
                      TDS (Income Tax)
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      Section 192 Monthly Withholding (Flat)
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-semibold">
                        Active Deductible
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.deductions.tds)}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">
                      Advance Recovery
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      Prior Advance Settlement (Flat)
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-semibold">
                        Active Deductible
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {formatINR(calculationResult.deductions.advance)}
                    </td>
                  </tr>

                  {/* Informational Lines: PT and IF (Explicitly Not Counted Again in Deductions) */}
                  <tr className="bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                    <td className="py-2.5 px-3 text-on-surface-variant font-medium flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>Professional Tax (PT)</span>
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      Pre-deducted from CTC before proration
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px] font-bold">
                        Informational Line
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant line-through opacity-75">
                      {formatINR(calculationResult.deductions.pt)}
                    </td>
                  </tr>

                  <tr className="bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                    <td className="py-2.5 px-3 text-on-surface-variant font-medium flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>Insurance Fund (IF)</span>
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      Pre-deducted from CTC before proration
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px] font-bold">
                        Informational Line
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant line-through opacity-75">
                      {formatINR(calculationResult.deductions.ifAmount)}
                    </td>
                  </tr>

                  {/* Total Deductions Summary Row */}
                  <tr className="bg-surface-container-high font-bold text-on-surface">
                    <td colSpan={3} className="py-3 px-3 rounded-l-lg text-sm">
                      Total Deductions (Net Active Deductible Sum)
                    </td>
                    <td className="py-3 px-3 text-right rounded-r-lg font-mono text-sm sm:text-base text-error">
                      {formatINR(calculationResult.deductions.totalDeductions)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CRITICAL ACCOUNTING DISCLOSURE NOTE (Mandated by PRD Section 4 & 6) */}
            <div className="p-4 rounded-xl bg-surface-container-high text-on-surface flex items-start gap-3 border border-outline-variant/40 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-bold text-primary uppercase tracking-wide text-[10px]">
                  Critical Statutory Accounting Disclosure
                </span>
                <p className="font-semibold text-on-surface leading-snug">
                  PT and IF are already deducted from CTC before proration and are not counted again in Total Deductions or Net Pay.
                </p>
                <p className="text-on-surface-variant leading-relaxed">
                  Reconciliation check: Total Deductions is strictly{' '}
                  <strong className="font-mono text-on-surface">
                    {formatINR(calculationResult.deductions.totalDeductions)}
                  </strong>
                  , composed of Employee PF ({formatINR(calculationResult.deductions.employeePF)}) + Employer PF ({formatINR(calculationResult.deductions.employerPF)}) + TDS ({formatINR(calculationResult.deductions.tds)}) + Advance ({formatINR(calculationResult.deductions.advance)}).
                </p>
              </div>
            </div>

            {/* Net Reconciliation Banner */}
            <div className="bg-inverse-surface text-inverse-on-surface rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-inverse-primary">
                  Calculated Final Disbursement
                </span>
                <span className="text-xs text-inverse-on-surface font-medium mt-0.5">
                  Gross ({formatINR(calculationResult.gross)}) − Total Deductions ({formatINR(calculationResult.deductions.totalDeductions)})
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <span className="text-xs font-bold text-inverse-primary uppercase tracking-wider">
                  Net Pay:
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-white">
                  {formatINR(calculationResult.netPay)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Printable Executive A4 Payslip Document (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Viewport Control Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Live Printable Document Viewport (A4)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-bold text-on-surface uppercase">
                Original Draft
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                title="Print candidate payslip"
                className="p-1.5 rounded-lg border border-outline-variant/40 bg-white hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EXECUTIVE PAYSLIP PHYSICAL CARD */}
          <div
            id="payslip-printable-document"
            className="relative bg-white rounded-2xl border border-outline-variant/60 shadow-lg p-5 sm:p-6 text-on-surface overflow-hidden flex flex-col gap-4"
          >
            {/* Watermark Background Emblem */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-[90px] font-black tracking-widest text-on-surface uppercase">
                {selectedClient.name.split(' ')[0]}
              </span>
            </div>

            {/* Corporate Header */}
            <div className="relative flex items-start justify-between pb-4 border-b border-outline-variant/40">
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-on-surface tracking-tight truncate">
                  {selectedClient.name}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {selectedClient.location}
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  CIN: U72200KA2021PTC148920 • GSTIN: {selectedClient.gstin}
                </span>
              </div>
              <div className="text-right flex flex-col items-end shrink-0">
                <span className="px-2.5 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold tracking-wider uppercase">
                  PAYSLIP
                </span>
                <span className="font-mono text-xs font-bold text-on-surface mt-1">
                  {currentMonthName} {inputs.year}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  Confidential
                </span>
              </div>
            </div>

            {/* Candidate & Period Metadata Grid */}
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 text-xs">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Employee Name</span>
                  <span className="font-semibold text-on-surface truncate">
                    {selectedCandidate.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Employee Code</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {selectedCandidate.employeeId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Designation</span>
                  <span className="font-medium text-on-surface truncate">
                    {selectedCandidate.designation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Joining Date</span>
                  <span className="font-medium text-on-surface">
                    {selectedCandidate.dateOfJoining}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Calendar Days</span>
                  <span className="font-mono font-medium text-on-surface">
                    {calculationResult.calendarDays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Paid Days</span>
                  <span className="font-mono font-bold text-primary">
                    {calculationResult.paidDays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">PAN Number</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {selectedCandidate.pan || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">PF UAN</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {selectedCandidate.pfUan || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Balanced 2-Column Ledger: Earnings (Left) & Deductions (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Column 1: Earnings */}
              <div className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30">
                <div className="bg-surface-container-high px-3 py-1.5 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-on-surface uppercase tracking-wider">EARNINGS</span>
                  <span className="font-mono text-on-surface-variant">INR (₹)</span>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1 gap-2 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-on-surface">Basic Pay</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.earnings.basic)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface">HRA</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.earnings.hra)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface">Medical Allow.</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.earnings.medical)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface">Special Allow.</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.earnings.special)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center bg-white p-2 rounded-lg">
                    <span className="text-[11px] font-bold text-on-surface">
                      Gross Earnings
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-primary">
                      {formatINR(calculationResult.earnings.totalEarnings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Deductions */}
              <div className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30">
                <div className="bg-surface-container-high px-3 py-1.5 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-on-surface uppercase tracking-wider">DEDUCTIONS</span>
                  <span className="font-mono text-on-surface-variant">INR (₹)</span>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1 gap-2 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-on-surface">Employee PF</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.deductions.employeePF)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface">Employer PF</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.deductions.employerPF)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface">TDS</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.deductions.tds)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface">Advance</span>
                      <span className="font-mono font-medium text-on-surface">
                        {formatINR(calculationResult.deductions.advance)}
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant text-[11px] italic">
                      <span>PT (Pre-deducted)*</span>
                      <span className="font-mono">{formatINR(calculationResult.deductions.pt)}</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant text-[11px] italic">
                      <span>IF (Pre-deducted)*</span>
                      <span className="font-mono">{formatINR(calculationResult.deductions.ifAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center bg-white p-2 rounded-lg">
                    <span className="text-[11px] font-bold text-on-surface">
                      Total Deductions
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-error">
                      {formatINR(calculationResult.deductions.totalDeductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Payable Banner */}
            <div className="bg-primary-container text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-primary-fixed">
                  NET TAKE-HOME PAYABLE
                </span>
                <p className="text-xs text-white/90 italic font-medium mt-0.5 max-w-sm">
                  {netPayInWords}
                </p>
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold bg-primary px-3 py-1 rounded-lg shrink-0">
                {formatINR(calculationResult.netPay)}
              </div>
            </div>

            {/* Footnote on PT & IF pre-deduction */}
            <p className="text-[10px] text-on-surface-variant bg-surface-container-low p-2 rounded-lg leading-relaxed">
              * Note: PT ({formatINR(calculationResult.deductions.pt)}) and IF ({formatINR(calculationResult.deductions.ifAmount)}) are accounted in the Gross CTC schedule before proration and excluded from direct deduction netting.
            </p>

            {/* Official Signatory Block */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-outline-variant/40 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Prepared & Verified By:
                </span>
                <span className="font-semibold text-on-surface mt-1">Priya Nair</span>
                <span className="text-[10px] text-on-surface-variant">HR Operations Lead</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Candidate Signature / Ack:
                </span>
                <span className="font-semibold text-on-surface mt-1">
                  {selectedCandidate.name}
                </span>
                <span className="text-[10px] text-on-surface-variant">System Generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Salary Inputs</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Next Action
            </span>
            <span className="text-xs font-semibold text-on-surface">
              Step 4: Prepare Distribution & Confirm
            </span>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Distribution</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

function roundTo2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
