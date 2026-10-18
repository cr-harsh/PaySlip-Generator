import { describe, it, expect } from 'vitest';
import {
  calculatePayslip,
  validateSalaryInputs,
  getDaysInMonth,
  formatINR,
} from '../calculations';

describe('Authoritative Payroll Engine - PRD Automated Tests', () => {
  const baseInputs = {
    monthlyCtc: 60000,
    year: 2026,
    month: 10, // October 2026
    workingDays: 22,
    leaveDays: 2,
    pfApplicable: true,
    pt: 200,
    ifAmount: 700,
    tds: 1500,
    advance: 2000,
  };

  it('Test 1 — Worked example matches PRD exactly to the paisa', () => {
    const result = calculatePayslip(baseInputs);

    expect(result.calendarDays).toBe(31);
    expect(result.paidDays).toBe(20);
    expect(result.payRatio).toBeCloseTo(20 / 31, 10);
    expect(result.monthlyCompensation).toBe(59100.0);
    expect(result.perDayCompensation).toBe(1906.451613);
    expect(result.gross).toBe(38129.03);

    // Earnings breakdown
    expect(result.earnings.basic).toBe(15251.61);
    expect(result.earnings.hra).toBe(7625.81);
    expect(result.earnings.medical).toBe(3812.90);
    expect(result.earnings.special).toBe(11438.71);
    expect(result.earnings.totalEarnings).toBe(38129.03);

    // Provident fund
    expect(result.deductions.employeePF).toBe(1935.48);
    expect(result.deductions.employerPF).toBe(1935.48);

    // Deductions & Net Pay
    expect(result.deductions.totalDeductions).toBe(7370.96);
    expect(result.netPay).toBe(30758.07);

    // PT & IF exclusion verification
    expect(result.deductions.pt).toBe(200);
    expect(result.deductions.ifAmount).toBe(700);
    expect(result.deductionsExceedEarningsWarning).toBe(false);
  });

  it('Test 2 — PF off produces ₹0 PF amounts and updates Net Pay', () => {
    const result = calculatePayslip({
      ...baseInputs,
      pfApplicable: false,
    });

    expect(result.deductions.employeePF).toBe(0.0);
    expect(result.deductions.employerPF).toBe(0.0);
    expect(result.deductions.totalDeductions).toBe(3500.0); // 1500 TDS + 2000 Advance
    expect(result.netPay).toBe(34629.03); // 38129.03 - 3500.00
  });

  it('Test 3 — Full attendance (31 working, 0 leave, TDS 0, Advance 0)', () => {
    const result = calculatePayslip({
      monthlyCtc: 60000,
      year: 2026,
      month: 10,
      workingDays: 31,
      leaveDays: 0,
      pfApplicable: true,
      pt: 200,
      ifAmount: 700,
      tds: 0,
      advance: 0,
    });

    expect(result.gross).toBe(59100.0);
    expect(result.earnings.basic).toBe(23640.0);
    expect(result.earnings.hra).toBe(11820.0);
    expect(result.earnings.medical).toBe(5910.0);
    expect(result.earnings.special).toBe(17730.0);
    expect(result.earnings.totalEarnings).toBe(59100.0);

    expect(result.deductions.employeePF).toBe(3000.0);
    expect(result.deductions.employerPF).toBe(3000.0);
    expect(result.deductions.totalDeductions).toBe(6000.0);
    expect(result.netPay).toBe(53100.0);
  });

  it('Test 4 — PT changed to ₹300 updates per-day compensation, gross, and net pay', () => {
    const result = calculatePayslip({
      ...baseInputs,
      pt: 300,
    });

    expect(result.perDayCompensation).toBe(1903.225806);
    expect(result.gross).toBe(38064.52);
    expect(result.deductions.totalDeductions).toBe(7370.96);
    expect(result.netPay).toBe(30693.56);
  });

  it('Test 5 — Working days exceed calendar days triggers validation error', () => {
    const errors = validateSalaryInputs({
      ...baseInputs,
      workingDays: 32,
    });

    expect(errors.workingDays).toBe(
      'Working days cannot exceed 31 days in October 2026.',
    );
  });

  it('Test 6 — Leave-day validation rejects leave > working days and negative leave', () => {
    const errExceed = validateSalaryInputs({
      ...baseInputs,
      workingDays: 22,
      leaveDays: 23,
    });
    expect(errExceed.leaveDays).toBe('Leave days cannot exceed working days.');

    const errNeg = validateSalaryInputs({
      ...baseInputs,
      workingDays: 22,
      leaveDays: -1,
    });
    expect(errNeg.leaveDays).toBe('Leave days cannot be negative.');
  });

  it('Test 7 — Zero paid days results in ₹0 earnings and negative net pay with warning', () => {
    const result = calculatePayslip({
      ...baseInputs,
      workingDays: 5,
      leaveDays: 5,
      pfApplicable: true,
      tds: 1500,
      advance: 2000,
    });

    expect(result.gross).toBe(0.0);
    expect(result.earnings.basic).toBe(0.0);
    expect(result.earnings.hra).toBe(0.0);
    expect(result.earnings.medical).toBe(0.0);
    expect(result.earnings.special).toBe(0.0);
    expect(result.earnings.totalEarnings).toBe(0.0);

    expect(result.deductions.employeePF).toBe(0.0);
    expect(result.deductions.employerPF).toBe(0.0);
    expect(result.deductions.totalDeductions).toBe(3500.0);
    expect(result.netPay).toBe(-3500.0);
    expect(result.deductionsExceedEarningsWarning).toBe(true);

    expect(formatINR(result.netPay)).toBe('-₹3,500.00');
  });

  it('Test 8 — Short month (February 2027) rejects 29 days and accepts 28 days', () => {
    expect(getDaysInMonth(2027, 2)).toBe(28);

    const err29 = validateSalaryInputs({
      ...baseInputs,
      year: 2027,
      month: 2,
      workingDays: 29,
      leaveDays: 0,
    });
    expect(err29.workingDays).toBe(
      'Working days cannot exceed 28 days in February 2027.',
    );

    const valid28 = validateSalaryInputs({
      ...baseInputs,
      year: 2027,
      month: 2,
      workingDays: 28,
      leaveDays: 0,
    });
    expect(valid28.workingDays).toBeUndefined();
  });

  it('Test 9 — Leap year (February 2028) accepts 29 working days', () => {
    expect(getDaysInMonth(2028, 2)).toBe(29);

    const valid29 = validateSalaryInputs({
      ...baseInputs,
      year: 2028,
      month: 2,
      workingDays: 29,
      leaveDays: 0,
    });
    expect(valid29.workingDays).toBeUndefined();
  });

  it('Test 10 — Month changed after entry invalidates 31 days in November', () => {
    // 31 days is valid in October
    const validOct = validateSalaryInputs({
      ...baseInputs,
      year: 2026,
      month: 10,
      workingDays: 31,
      leaveDays: 0,
    });
    expect(validOct.workingDays).toBeUndefined();

    // Changing month to November (30 days) immediately invalidates 31 days
    const invalidNov = validateSalaryInputs({
      ...baseInputs,
      year: 2026,
      month: 11,
      workingDays: 31,
      leaveDays: 0,
    });
    expect(invalidNov.workingDays).toBe(
      'Working days cannot exceed 30 days in November 2026.',
    );
  });

  it('Additional Safeguard Tests — PT + IF exceeding CTC and negative values', () => {
    const errExceed = validateSalaryInputs({
      ...baseInputs,
      monthlyCtc: 800,
      pt: 200, // 200 + 700 = 900 > 800
    });
    expect(errExceed.pt).toBe('PT and IF together exceed the HR CTC.');

    const errTds = validateSalaryInputs({
      ...baseInputs,
      tds: -100,
    });
    expect(errTds.tds).toBe('Amount cannot be negative.');

    const errAdv = validateSalaryInputs({
      ...baseInputs,
      advance: -50,
    });
    expect(errAdv.advance).toBe('Amount cannot be negative.');

    const errCtc = validateSalaryInputs({
      ...baseInputs,
      monthlyCtc: 0,
    });
    expect(errCtc.monthlyCtc).toBe(
      'Monthly HR CTC must be greater than zero.',
    );
  });

  it('Indian Currency Formatter handles positive, zero, and negative values', () => {
    expect(formatINR(38129.03)).toBe('₹38,129.03');
    expect(formatINR(7370.96)).toBe('₹7,370.96');
    expect(formatINR(30758.07)).toBe('₹30,758.07');
    expect(formatINR(0)).toBe('₹0.00');
    expect(formatINR(-3500)).toBe('-₹3,500.00');
  });

  it('Whole-number attendance validation rejects fractional working and leave days', () => {
    const errFractionalWorking = validateSalaryInputs({
      ...baseInputs,
      workingDays: 21.5,
    });
    expect(errFractionalWorking.workingDays).toBe(
      'Working days must be a whole number.',
    );

    const errFractionalLeave = validateSalaryInputs({
      ...baseInputs,
      leaveDays: 1.5,
    });
    expect(errFractionalLeave.leaveDays).toBe(
      'Leave days must be a whole number.',
    );
  });

  it('Validates numeric inputs against malformed, NaN, and non-finite values', () => {
    const errNaN = validateSalaryInputs({
      ...baseInputs,
      monthlyCtc: Number.NaN,
      workingDays: Number.NaN,
      leaveDays: Number.NaN,
      pt: Number.NaN,
      tds: Number.NaN,
      advance: Number.NaN,
    });
    expect(errNaN.monthlyCtc).toBe('Please enter a valid number.');
    expect(errNaN.workingDays).toBe('Please enter a valid number.');
    expect(errNaN.leaveDays).toBe('Please enter a valid number.');
    expect(errNaN.pt).toBe('Please enter a valid number.');
    expect(errNaN.tds).toBe('Please enter a valid number.');
    expect(errNaN.advance).toBe('Please enter a valid number.');

    const errInfinity = validateSalaryInputs({
      ...baseInputs,
      monthlyCtc: Number.POSITIVE_INFINITY,
      workingDays: Number.POSITIVE_INFINITY,
      leaveDays: Number.POSITIVE_INFINITY,
      pt: Number.POSITIVE_INFINITY,
      tds: Number.POSITIVE_INFINITY,
      advance: Number.POSITIVE_INFINITY,
    });
    expect(errInfinity.monthlyCtc).toBe('Please enter a valid number.');
    expect(errInfinity.workingDays).toBe('Please enter a valid number.');
    expect(errInfinity.leaveDays).toBe('Please enter a valid number.');
    expect(errInfinity.pt).toBe('Please enter a valid number.');
    expect(errInfinity.tds).toBe('Please enter a valid number.');
    expect(errInfinity.advance).toBe('Please enter a valid number.');

    // Malformed string values
    const errString = validateSalaryInputs({
      ...baseInputs,
      monthlyCtc: 'sixty-thousand' as unknown as number,
      workingDays: 'twenty-two' as unknown as number,
      leaveDays: 'two' as unknown as number,
      pt: 'two-hundred' as unknown as number,
      tds: 'none' as unknown as number,
      advance: 'n/a' as unknown as number,
    });
    expect(errString.monthlyCtc).toBe('Please enter a valid number.');
    expect(errString.workingDays).toBe('Please enter a valid number.');
    expect(errString.leaveDays).toBe('Please enter a valid number.');
    expect(errString.pt).toBe('Please enter a valid number.');
    expect(errString.tds).toBe('Please enter a valid number.');
    expect(errString.advance).toBe('Please enter a valid number.');
  });

  it('Insurance Fund remains strictly fixed at ₹700 and cannot be altered', () => {
    // Attempting to pass a tampered ifAmount is overridden by the fixed constant
    const result = calculatePayslip({
      ...baseInputs,
      ifAmount: 1200, // Tampered value
    });

    expect(result.deductions.ifAmount).toBe(700);
    expect(result.monthlyCompensation).toBe(59100.0); // 60000 - 200 - 700
    expect(result.netPay).toBe(30758.07);
  });
});
