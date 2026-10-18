export interface Client {
  id: string;
  name: string;
  code: string;
  location: string;
  staffCount: number;
  gstin: string;
}

export interface Candidate {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string; // e.g., '15 Jun 2025'
  tenure: string; // e.g., '1 yr 4 mos'
  pan?: string; // Optional: missing if undefined / empty
  pfUan?: string; // Optional: missing if undefined / empty
  email?: string; // Optional: missing if undefined / empty
  clientId: string;
  bankAccount?: string; // e.g., '•••• 8192 (HDFC)'
  status?: 'verified' | 'probation' | 'attention_needed';
}

export interface SalaryAttendanceInputs {
  monthlyCtc: number | '';
  year: number;
  month: number; // 1 to 12
  workingDays: number | '';
  leaveDays: number | '';
  pfApplicable: boolean;
  pt: number | '';
  ifAmount: number; // Fixed at 700
  tds: number | '';
  advance: number | '';
}

export interface EarningsBreakdown {
  basic: number;
  hra: number;
  medical: number;
  special: number;
  totalEarnings: number;
}

export interface DeductionsBreakdown {
  employeePF: number;
  employerPF: number;
  tds: number;
  advance: number;
  totalDeductions: number;
  pt: number; // Informational line: not part of totalDeductions
  ifAmount: number; // Informational line: not part of totalDeductions
}

export interface CalculationResult {
  calendarDays: number;
  paidDays: number;
  payRatio: number; // Full precision
  monthlyCompensation: number; // CTC - PT - IF
  perDayCompensation: number; // Rounded to 6 decimal places
  gross: number; // roundTo2(perDayCompensation * paidDays)
  earnings: EarningsBreakdown;
  deductions: DeductionsBreakdown;
  netPay: number; // roundTo2(gross - totalDeductions)
  deductionsExceedEarningsWarning: boolean;
}

export type FieldValidationErrors = Partial<Record<keyof SalaryAttendanceInputs, string>>;

export type WorkflowStep = 1 | 2 | 3 | 4;

export type DistributionStatus = 'review' | 'confirm_modal' | 'success';
