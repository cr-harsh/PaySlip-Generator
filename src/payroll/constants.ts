/**
 * Authoritative Payroll Constants as defined in PRD Section 5.
 * Do not duplicate these numeric constants across components.
 */
export const DEFAULT_PT = 200;
export const FIXED_INSURANCE_FUND = 700;
export const FULL_MONTH_EMPLOYEE_PF = 3000;
export const FULL_MONTH_EMPLOYER_PF = 3000;

export const BASIC_PERCENTAGE = 0.40;
export const HRA_PERCENTAGE = 0.20;
export const MEDICAL_PERCENTAGE = 0.10;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
