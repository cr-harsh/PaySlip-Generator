import React from 'react';
import {
  Sliders,
  Calendar,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  AlertTriangle,
  LockKeyhole,
} from 'lucide-react';
import type {
  SalaryAttendanceInputs,
  CalculationResult,
  FieldValidationErrors,
  Candidate,
  Client,
} from '../types/payroll';
import {
  MONTH_NAMES,
  FIXED_INSURANCE_FUND,
} from '../payroll/constants';
import { getDaysInMonth, formatINR } from '../payroll/calculations';

interface Step2Props {
  inputs: SalaryAttendanceInputs;
  errors: FieldValidationErrors;
  calculationResult: CalculationResult | null;
  selectedCandidate: Candidate;
  selectedClient: Client;
  isPrepared?: boolean;
  onInputChange: (field: keyof SalaryAttendanceInputs, value: unknown) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Step2SalaryAttendance: React.FC<Step2Props> = ({
  inputs,
  errors,
  calculationResult,
  selectedCandidate,
  selectedClient,
  isPrepared = false,
  onInputChange,
  onBack,
  onContinue,
}) => {
  const calendarDays = getDaysInMonth(inputs.year, inputs.month);
  const currentMonthName = MONTH_NAMES[inputs.month - 1];

  // Derived paid days calculation for UI display
  const workingDaysNum =
    inputs.workingDays === '' ? 0 : Number(inputs.workingDays);
  const leaveDaysNum = inputs.leaveDays === '' ? 0 : Number(inputs.leaveDays);
  const derivedPaidDays = Math.max(0, workingDaysNum - leaveDaysNum);
  const attendancePercentage =
    calendarDays > 0
      ? Math.min(100, Math.round((derivedPaidDays / calendarDays) * 1000) / 10)
      : 0;

  const hasErrors = Object.keys(errors).length > 0;
  const isFormFilled =
    inputs.monthlyCtc !== '' &&
    inputs.workingDays !== '' &&
    inputs.leaveDays !== '' &&
    inputs.pt !== '';
  const canContinue = isFormFilled && !hasErrors && calculationResult !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Operational Header Notice Strip */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-on-surface">
              Compensation & Attendance Setup
            </div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
              CYCLE: IN-{currentMonthName.slice(0, 3).toUpperCase()}-{inputs.year} • {selectedCandidate.employeeId} ({selectedCandidate.name})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-outline-variant/40 text-primary font-mono text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span>CALC: DYNAMIC ({calendarDays}-DAY DIVISOR)</span>
        </div>
      </div>

      {/* Locked Notice Banner (Only after confirmation) */}
      {isPrepared && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <LockKeyhole className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Locked after confirmation:</strong> This payslip has been finalized and prepared. Inputs are read-only to preserve the financial audit record.
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
            Read-Only Audit
          </span>
        </div>
      )}

      {/* Main Grid: Form Inputs (8 cols) + Live Estimation Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Sections (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* SECTION 1: Salary & Period Configuration */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-bold text-on-surface">
                  1. Salary and Period Configuration
                </h3>
                {isPrepared && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/40">
                    <LockKeyhole className="w-3 h-3 text-primary" />
                    <span>Locked after confirmation</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                FORM 16 BASELINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly HR CTC Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="monthly-ctc"
                    className="text-xs font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span>Monthly HR CTC (Base Cost)</span>
                    {!isPrepared && <span className="text-error">*</span>}
                    {isPrepared && (
                      <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                    )}
                  </label>
                  <span className="font-mono text-xs text-primary font-semibold">
                    ₹ INR
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 font-mono text-sm text-on-surface-variant font-bold pointer-events-none">
                    ₹
                  </div>
                  <input
                    id="monthly-ctc"
                    type="number"
                    min="1"
                    step="any"
                    readOnly={isPrepared}
                    placeholder="e.g. 60000"
                    value={inputs.monthlyCtc}
                    onChange={(e) =>
                      onInputChange(
                        'monthlyCtc',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className={`w-full h-11 pl-8 pr-3.5 border rounded-xl font-mono text-sm text-on-surface transition-all focus:outline-none focus:ring-2 ${
                      isPrepared
                        ? 'bg-surface-container-low cursor-not-allowed select-none border-outline-variant/50'
                        : errors.monthlyCtc
                        ? 'bg-white border-error focus:ring-error/40'
                        : 'bg-white border-outline-variant/60 focus:ring-primary/40'
                    }`}
                  />
                </div>
                {errors.monthlyCtc ? (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.monthlyCtc}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Total certified Cost to Company before pre-deductions.
                  </p>
                )}
              </div>

              {/* Payslip Month / Year Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span>Payslip Month / Year</span>
                  {!isPrepared && <span className="text-error">*</span>}
                  {isPrepared && (
                    <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Month Dropdown */}
                  <div className="relative">
                    <select
                      value={inputs.month}
                      disabled={isPrepared}
                      onChange={(e) => onInputChange('month', Number(e.target.value))}
                      className={`w-full h-11 px-3 border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isPrepared
                          ? 'bg-surface-container-low cursor-not-allowed opacity-90'
                          : 'bg-white cursor-pointer'
                      }`}
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={m} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Dropdown */}
                  <div className="relative">
                    <select
                      value={inputs.year}
                      disabled={isPrepared}
                      onChange={(e) => onInputChange('year', Number(e.target.value))}
                      className={`w-full h-11 px-3 border border-outline-variant/60 rounded-xl font-mono text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isPrepared
                          ? 'bg-surface-container-low cursor-not-allowed opacity-90'
                          : 'bg-white cursor-pointer'
                      }`}
                    >
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                      <option value={2028}>2028 (Leap Year)</option>
                      <option value={2029}>2029</option>
                    </select>
                  </div>
                </div>

                {/* Calendar Days Badge */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface-container-high text-primary text-[11px] font-semibold border border-outline-variant/40">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {calendarDays} calendar days in {currentMonthName} {inputs.year}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Attendance & Proration Schedule */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-bold text-on-surface">
                  2. Attendance & Proration Schedule
                </h3>
                {isPrepared && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/40">
                    <LockKeyhole className="w-3 h-3 text-primary" />
                    <span>Locked after confirmation</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                ACCORDING TO CALENDAR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Working Days */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-working-days"
                    className="text-xs font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span>Working Days</span>
                    {!isPrepared && <span className="text-error">*</span>}
                    {isPrepared && (
                      <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                    )}
                  </label>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    MAX: {calendarDays}
                  </span>
                </div>

                <div className="relative flex items-center">
                  <input
                    id="input-working-days"
                    type="number"
                    min="0"
                    max={calendarDays}
                    step="1"
                    readOnly={isPrepared}
                    placeholder={`0 - ${calendarDays}`}
                    value={inputs.workingDays}
                    onChange={(e) =>
                      onInputChange(
                        'workingDays',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className={`w-full h-11 px-3.5 pr-12 border rounded-xl font-mono text-sm text-on-surface transition-all focus:outline-none focus:ring-2 ${
                      isPrepared
                        ? 'bg-surface-container-low cursor-not-allowed select-none border-outline-variant/50'
                        : errors.workingDays
                        ? 'bg-white border-error focus:ring-error/40'
                        : 'bg-white border-outline-variant/60 focus:ring-primary/40'
                    }`}
                  />
                  <span className="absolute right-3.5 font-mono text-[11px] text-on-surface-variant font-medium pointer-events-none">
                    DAYS
                  </span>
                </div>
                {errors.workingDays ? (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.workingDays}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Must be 0 to {calendarDays} days.
                  </p>
                )}
              </div>

              {/* Leave Days */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-leave-days"
                    className="text-xs font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span>Leave Days (LOP)</span>
                    {!isPrepared && <span className="text-error">*</span>}
                    {isPrepared && (
                      <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                    )}
                  </label>
                  <span className="text-[10px] font-bold text-error">UNPAID</span>
                </div>

                <div className="relative flex items-center">
                  <input
                    id="input-leave-days"
                    type="number"
                    min="0"
                    max={workingDaysNum || calendarDays}
                    step="1"
                    readOnly={isPrepared}
                    placeholder="0"
                    value={inputs.leaveDays}
                    onChange={(e) =>
                      onInputChange(
                        'leaveDays',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className={`w-full h-11 px-3.5 pr-12 border rounded-xl font-mono text-sm text-on-surface transition-all focus:outline-none focus:ring-2 ${
                      isPrepared
                        ? 'bg-surface-container-low cursor-not-allowed select-none border-outline-variant/50'
                        : errors.leaveDays
                        ? 'bg-white border-error focus:ring-error/40'
                        : 'bg-white border-outline-variant/60 focus:ring-primary/40'
                    }`}
                  />
                  <span className="absolute right-3.5 font-mono text-[11px] text-on-surface-variant font-medium pointer-events-none">
                    DAYS
                  </span>
                </div>
                {errors.leaveDays ? (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.leaveDays}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Loss-of-pay unapproved leaves.
                  </p>
                )}
              </div>

              {/* Derived Paid Days Summary Pill Card */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Derived Paid Days
                </span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="font-mono text-lg font-bold text-primary">
                    {derivedPaidDays}
                    <span className="font-mono text-xs text-on-surface-variant font-normal">
                      {' '}
                      / {calendarDays} days
                    </span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface">
                    {attendancePercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden my-1">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-on-surface-variant">
                  {workingDaysNum} working − {leaveDaysNum} LOP = {derivedPaidDays} paid shifts
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: Payroll Statutory & Custom Deductions Settings */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-bold text-on-surface">
                  3. Payroll Settings & Statutories
                </h3>
                {isPrepared && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/40">
                    <LockKeyhole className="w-3 h-3 text-primary" />
                    <span>Locked after confirmation</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                STATUTORY ACT COMPLIANT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PF Applicable Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                      <span>PF Applicable (EPF Act)</span>
                      {isPrepared && (
                        <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                      )}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed">
                      12% RULE
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    Statutory Employee & Employer PF
                  </span>
                </div>

                {/* Switch Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={inputs.pfApplicable}
                  disabled={isPrepared}
                  onClick={() => onInputChange('pfApplicable', !inputs.pfApplicable)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    isPrepared ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                  } ${
                    inputs.pfApplicable ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      inputs.pfApplicable ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Professional Tax (PT) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-pt"
                    className="text-xs font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span>Professional Tax (PT)</span>
                    {!isPrepared && <span className="text-error">*</span>}
                    {isPrepared && (
                      <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                    )}
                  </label>
                  <span className="text-[10px] font-bold uppercase text-primary">
                    STATE MANDATE
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 font-mono text-sm text-on-surface-variant font-bold pointer-events-none">
                    ₹
                  </div>
                  <input
                    id="input-pt"
                    type="number"
                    min="0"
                    step="any"
                    readOnly={isPrepared}
                    value={inputs.pt}
                    onChange={(e) =>
                      onInputChange(
                        'pt',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className={`w-full h-11 pl-8 pr-3.5 border rounded-xl font-mono text-sm text-on-surface transition-all focus:outline-none focus:ring-2 ${
                      isPrepared
                        ? 'bg-surface-container-low cursor-not-allowed select-none border-outline-variant/50'
                        : errors.pt
                        ? 'bg-white border-error focus:ring-error/40'
                        : 'bg-white border-outline-variant/60 focus:ring-primary/40'
                    }`}
                  />
                </div>
                {errors.pt ? (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.pt}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Editable statutory slab deduction (Default ₹200).
                  </p>
                )}
              </div>

              {/* Insurance Fund (IF) Read Only */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-if"
                    className="text-xs font-bold text-on-surface"
                  >
                    Insurance Fund (IF)
                  </label>
                  <span className="text-[10px] font-mono uppercase text-on-surface-variant">
                    FIXED POLICY
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 font-mono text-sm text-on-surface-variant font-bold pointer-events-none">
                    ₹
                  </div>
                  <input
                    id="input-if"
                    type="text"
                    readOnly
                    value={FIXED_INSURANCE_FUND}
                    className="w-full h-11 pl-8 pr-3.5 bg-surface-container-low border border-outline-variant/50 rounded-xl font-mono text-sm text-on-surface cursor-not-allowed select-none font-bold"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Fixed institutional benefit deduction (₹700 read-only).
                </p>
              </div>

              {/* TDS (Income Tax) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-tds"
                    className="text-xs font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span>TDS (Income Tax)</span>
                    {isPrepared && (
                      <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                    )}
                  </label>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    SECTION 192
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 font-mono text-sm text-on-surface-variant font-bold pointer-events-none">
                    ₹
                  </div>
                  <input
                    id="input-tds"
                    type="number"
                    min="0"
                    step="any"
                    readOnly={isPrepared}
                    placeholder="0"
                    value={inputs.tds}
                    onChange={(e) =>
                      onInputChange(
                        'tds',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className={`w-full h-11 pl-8 pr-3.5 border rounded-xl font-mono text-sm text-on-surface transition-all focus:outline-none focus:ring-2 ${
                      isPrepared
                        ? 'bg-surface-container-low cursor-not-allowed select-none border-outline-variant/50'
                        : errors.tds
                        ? 'bg-white border-error focus:ring-error/40'
                        : 'bg-white border-outline-variant/60 focus:ring-primary/40'
                    }`}
                  />
                </div>
                {errors.tds ? (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.tds}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Flat monthly tax withholding. Never prorated.
                  </p>
                )}
              </div>

              {/* Advance Deduction */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-advance"
                    className="text-xs font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span>Advance Deduction / Recovery</span>
                    {isPrepared && (
                      <LockKeyhole className="w-3 h-3 text-on-surface-variant" title="Locked after confirmation" />
                    )}
                  </label>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    CUSTOM OFFSET
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 font-mono text-sm text-on-surface-variant font-bold pointer-events-none">
                    ₹
                  </div>
                  <input
                    id="input-advance"
                    type="number"
                    min="0"
                    step="any"
                    readOnly={isPrepared}
                    placeholder="0"
                    value={inputs.advance}
                    onChange={(e) =>
                      onInputChange(
                        'advance',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className={`w-full h-11 pl-8 pr-3.5 border rounded-xl font-mono text-sm text-on-surface transition-all focus:outline-none focus:ring-2 ${
                      isPrepared
                        ? 'bg-surface-container-low cursor-not-allowed select-none border-outline-variant/50'
                        : errors.advance
                        ? 'bg-white border-error focus:ring-error/40'
                        : 'bg-white border-outline-variant/60 focus:ring-primary/40'
                    }`}
                  />
                </div>
                {errors.advance ? (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.advance}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Prior salary advance recovery. Never prorated.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Computation Preview Card (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex flex-col gap-4 sticky top-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                <span>Live Computation Preview</span>
                {isPrepared && (
                  <LockKeyhole className="w-3.5 h-3.5 text-primary" title="Locked after confirmation" />
                )}
              </span>
              {isPrepared ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-container text-primary border border-outline-variant/40">
                  <LockKeyhole className="w-2.5 h-2.5" />
                  <span>Locked</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-container text-primary">
                  DYNAMIC
                </span>
              )}
            </div>

            {/* Candidate Identity Pill */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-container text-white font-bold text-xs flex items-center justify-center shrink-0">
                {selectedCandidate.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">
                  {selectedCandidate.name}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate">
                  {selectedClient.name} • {selectedCandidate.employeeId}
                </span>
              </div>
            </div>

            {/* Calculation Status or Preview */}
            {hasErrors ? (
              /* Validation Error Active Box */
              <div className="p-4 rounded-xl bg-error-container/60 border border-error/30 text-on-error-container flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-xs text-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Validation Error Active</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Per PRD Section 4: If any validation error is active, the calculation result is unavailable and progression is blocked.
                </p>
                <div className="text-[11px] font-medium text-error list-disc pl-4 space-y-0.5">
                  {Object.values(errors).map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              </div>
            ) : calculationResult ? (
              /* Valid Calculation Summary Numbers */
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Pay Period</span>
                  <span className="font-semibold text-on-surface">
                    {currentMonthName} {inputs.year}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Paid / Calendar Days</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {calculationResult.paidDays} / {calculationResult.calendarDays}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Monthly Compensation</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {formatINR(calculationResult.monthlyCompensation)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Prorated Gross</span>
                  <span className="font-mono font-bold text-primary">
                    {formatINR(calculationResult.gross)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Total Deductions</span>
                  <span className="font-mono font-bold text-error">
                    {formatINR(calculationResult.deductions.totalDeductions)}
                  </span>
                </div>

                {/* Net Pay Callout */}
                <div className="mt-1 p-3.5 rounded-xl bg-primary text-white shadow-xs flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary-fixed">
                    Estimated Net Take-Home
                  </span>
                  <span className="font-mono text-xl font-bold tracking-tight">
                    {formatINR(calculationResult.netPay)}
                  </span>
                  <span className="text-[10px] text-white/80">
                    Gross ({formatINR(calculationResult.gross)}) − Deductions (
                    {formatINR(calculationResult.deductions.totalDeductions)})
                  </span>
                </div>

                {calculationResult.deductionsExceedEarningsWarning && (
                  <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-start gap-2 border border-error/30">
                    <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span>
                      Deductions exceed earnings for this period. Net pay is negative.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Incomplete Inputs Placeholder */
              <div className="p-6 text-center text-on-surface-variant flex flex-col items-center gap-2">
                <HelpCircle className="w-6 h-6 text-on-surface-variant/50" />
                <p className="text-xs">
                  Complete required inputs above to see live financial computation.
                </p>
              </div>
            )}

            {/* Note on PT/IF Exclusion */}
            <div className="p-3 rounded-xl bg-surface-container-low text-[11px] text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-on-surface">PRD Safeguard: </span>
              PT ({formatINR(Number(inputs.pt) || 0)}) and IF (₹700) are subtracted from CTC before proration and are excluded from Total Deductions.
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
          <span>Back to Candidate Selection</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Next Action
            </span>
            <span className="text-xs font-semibold text-on-surface">
              Step 3: Review Payslip & Breakdown
            </span>
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
              canContinue
                ? 'bg-primary text-white hover:bg-primary-container cursor-pointer'
                : 'bg-surface-container-high text-on-surface-variant/60 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Continue to Review Payslip</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
