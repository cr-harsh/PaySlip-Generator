import {
  FIXED_INSURANCE_FUND,
  FULL_MONTH_EMPLOYEE_PF,
  FULL_MONTH_EMPLOYER_PF,
  BASIC_PERCENTAGE,
  HRA_PERCENTAGE,
  MEDICAL_PERCENTAGE,
  MONTH_NAMES,
} from './constants';
import type {
  SalaryAttendanceInputs,
  CalculationResult,
  FieldValidationErrors,
} from '../types/payroll';

/**
 * Explicit rounding helper to 2 decimal places with epsilon compensation
 */
export function roundTo2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Explicit rounding helper to 6 decimal places with epsilon compensation
 */
export function roundTo6(value: number): number {
  return Math.round((value + Number.EPSILON) * 1e6) / 1e6;
}

/**
 * Real calendar days calculation for a given month and year.
 * Correctly accounts for leap years (e.g. Feb 2028 has 29, Feb 2027 has 28).
 * @param year e.g. 2026
 * @param month 1-indexed (1 for Jan, 12 for Dec)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Formats a monetary value into Indian currency notation (e.g. ₹38,129.03, -₹3,500.00).
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) {
    return '₹0.00';
  }
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

/**
 * Pure calculation function as specified in PRD Section 6.
 * One input state -> one calculation function -> one result object.
 *
 * It does NOT mutate its inputs, does not access browser/component state,
 * and maintains strict calculation and rounding order.
 */
export function calculatePayslip(inputs: {
  monthlyCtc: number;
  year: number;
  month: number;
  workingDays: number;
  leaveDays: number;
  pfApplicable: boolean;
  pt: number;
  ifAmount?: number;
  tds: number;
  advance: number;
}): CalculationResult {
  const calendarDays = getDaysInMonth(inputs.year, inputs.month);
  // Insurance Fund is fixed at ₹700 and cannot be changed per PRD Section 4 & 5
  const ifAmount = FIXED_INSURANCE_FUND;
  const pt = inputs.pt;
  const ctc = inputs.monthlyCtc;
  const workingDays = inputs.workingDays;
  const leaveDays = inputs.leaveDays;
  const tds = inputs.tds;
  const advance = inputs.advance;

  // 1. Paid days
  const paidDays = Math.max(0, workingDays - leaveDays);

  // 2. Pay ratio (Keep full precision for the ratio)
  const payRatio = calendarDays > 0 ? paidDays / calendarDays : 0;

  // 3. Monthly compensation = HR_CTC - PT - IF
  const monthlyCompensation = ctc - pt - ifAmount;

  // 4. Per-day compensation = monthlyCompensation / calendarDaysInMonth (Round to 6 decimal places)
  const perDayCompensation =
    calendarDays > 0 ? roundTo6(monthlyCompensation / calendarDays) : 0;

  // Edge case: if paidDays is 0, gross and earnings are strictly 0.00
  let gross = 0;
  let basic = 0;
  let hra = 0;
  let medical = 0;
  let special = 0;
  let totalEarnings = 0;

  if (paidDays > 0) {
    // 5. Prorated gross = roundTo2(perDayCompensation * paidDays)
    gross = roundTo2(perDayCompensation * paidDays);

    // 6. Earnings
    basic = roundTo2(gross * BASIC_PERCENTAGE);
    hra = roundTo2(gross * HRA_PERCENTAGE);
    medical = roundTo2(gross * MEDICAL_PERCENTAGE);
    special = roundTo2(gross - basic - hra - medical);
    totalEarnings = roundTo2(basic + hra + medical + special);
  }

  // 7. Provident Fund
  let employeePF = 0;
  let employerPF = 0;
  if (inputs.pfApplicable && paidDays > 0) {
    employeePF = roundTo2(FULL_MONTH_EMPLOYEE_PF * payRatio);
    employerPF = roundTo2(FULL_MONTH_EMPLOYER_PF * payRatio);
  }

  // 8. Total deductions = roundTo2(employeePF + employerPF + TDS + advance)
  // TDS and advance are used as entered and are not prorated.
  // PT and IF are excluded from Total Deductions.
  const totalDeductions = roundTo2(employeePF + employerPF + tds + advance);

  // 9. Net pay = roundTo2(gross - totalDeductions)
  // Never subtract PT or IF a second time from Net Pay.
  const netPay = roundTo2(gross - totalDeductions);

  return {
    calendarDays,
    paidDays,
    payRatio,
    monthlyCompensation,
    perDayCompensation,
    gross,
    earnings: {
      basic,
      hra,
      medical,
      special,
      totalEarnings,
    },
    deductions: {
      employeePF,
      employerPF,
      tds,
      advance,
      totalDeductions,
      pt,
      ifAmount,
    },
    netPay,
    deductionsExceedEarningsWarning: totalDeductions > gross,
  };
}

/**
 * Helper to check if a value is a valid finite number
 */
function isFiniteNumber(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return Number.isFinite(num);
  }
  return false;
}

/**
 * Validates salary and attendance inputs according to PRD Section 4 & Section 10.
 */
export function validateSalaryInputs(
  inputs: SalaryAttendanceInputs,
): FieldValidationErrors {
  const errors: FieldValidationErrors = {};
  const calendarDays = getDaysInMonth(inputs.year, inputs.month);
  const monthName = MONTH_NAMES[inputs.month - 1] || 'Month';

  // Monthly HR CTC validation
  if (
    inputs.monthlyCtc === '' ||
    inputs.monthlyCtc === undefined ||
    inputs.monthlyCtc === null
  ) {
    errors.monthlyCtc = 'This field is required.';
  } else if (!isFiniteNumber(inputs.monthlyCtc)) {
    errors.monthlyCtc = 'Please enter a valid number.';
  } else if (Number(inputs.monthlyCtc) <= 0) {
    errors.monthlyCtc = 'Monthly HR CTC must be greater than zero.';
  }

  // Working days validation
  if (
    inputs.workingDays === '' ||
    inputs.workingDays === undefined ||
    inputs.workingDays === null
  ) {
    errors.workingDays = 'This field is required.';
  } else if (!isFiniteNumber(inputs.workingDays)) {
    errors.workingDays = 'Please enter a valid number.';
  } else {
    const wd = Number(inputs.workingDays);
    if (!Number.isInteger(wd)) {
      errors.workingDays = 'Working days must be a whole number.';
    } else if (wd < 0) {
      errors.workingDays = 'Working days cannot be negative.';
    } else if (wd > calendarDays) {
      errors.workingDays = `Working days cannot exceed ${calendarDays} days in ${monthName} ${inputs.year}.`;
    }
  }

  // Leave days validation
  if (
    inputs.leaveDays === '' ||
    inputs.leaveDays === undefined ||
    inputs.leaveDays === null
  ) {
    errors.leaveDays = 'This field is required.';
  } else if (!isFiniteNumber(inputs.leaveDays)) {
    errors.leaveDays = 'Please enter a valid number.';
  } else {
    const ld = Number(inputs.leaveDays);
    if (!Number.isInteger(ld)) {
      errors.leaveDays = 'Leave days must be a whole number.';
    } else if (ld < 0) {
      errors.leaveDays = 'Leave days cannot be negative.';
    } else if (
      inputs.workingDays !== '' &&
      inputs.workingDays !== undefined &&
      inputs.workingDays !== null &&
      isFiniteNumber(inputs.workingDays)
    ) {
      const wd = Number(inputs.workingDays);
      if (ld > wd) {
        errors.leaveDays = 'Leave days cannot exceed working days.';
      }
    }
  }

  // Professional Tax validation
  if (inputs.pt === '' || inputs.pt === undefined || inputs.pt === null) {
    errors.pt = 'This field is required.';
  } else if (!isFiniteNumber(inputs.pt)) {
    errors.pt = 'Please enter a valid number.';
  } else if (Number(inputs.pt) < 0) {
    errors.pt = 'Amount cannot be negative.';
  }

  // TDS validation
  if (inputs.tds !== '' && inputs.tds !== undefined && inputs.tds !== null) {
    if (!isFiniteNumber(inputs.tds)) {
      errors.tds = 'Please enter a valid number.';
    } else if (Number(inputs.tds) < 0) {
      errors.tds = 'Amount cannot be negative.';
    }
  }

  // Advance deduction validation
  if (
    inputs.advance !== '' &&
    inputs.advance !== undefined &&
    inputs.advance !== null
  ) {
    if (!isFiniteNumber(inputs.advance)) {
      errors.advance = 'Please enter a valid number.';
    } else if (Number(inputs.advance) < 0) {
      errors.advance = 'Amount cannot be negative.';
    }
  }

  // Combined safeguard check: PT + IF exceeding HR CTC
  if (
    isFiniteNumber(inputs.monthlyCtc) &&
    isFiniteNumber(inputs.pt)
  ) {
    const ctc = Number(inputs.monthlyCtc);
    const pt = Number(inputs.pt);
    const ifAmount = FIXED_INSURANCE_FUND;
    if (ctc > 0 && pt >= 0 && pt + ifAmount > ctc) {
      errors.pt = 'PT and IF together exceed the HR CTC.';
    }
  }

  return errors;
}
