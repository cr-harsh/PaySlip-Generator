# Payslip Generation UI: Handoff

## What I built
- Developed a four-step payslip generation workflow covering client/candidate selection, salary and attendance entry, calculation review with payslip preview, and distribution preparation with confirmation.
- Implemented dynamic salary proration, earnings breakdown, PF calculations, deductions, and net pay according to Section 6 of the assignment.
- Added input validation, month-specific calendar-day calculations, leap-year support, and a locked state after confirmation.
- Used mock client and candidate data. Distribution is simulated; no actual email delivery, upload, or download service is called.

## How to access it
- **Live application:** https://vercel.com/cr-harshs-projects/payslip-gen
- Select a client and candidate, enter or modify the salary and attendance details, and proceed through the four steps.
- The source code and automated tests are available in the accompanying repository.

## Where the calculation lives
- **Calculation and validation:** `src/payroll/calculations.ts` — `calculatePayslip()` and `validateSalaryInputs()`.
- **Constants:** `src/payroll/constants.ts` — PT, fixed IF, PF amounts, and earnings percentages.
- **Automated tests:** `src/payroll/__tests__/calculatePayslip.test.ts`.

## Assumptions
- Working and leave days must be non-negative whole numbers and respect the selected month's calendar-day and attendance limits.
- PT defaults to ₹200 and is editable. IF is fixed at ₹700 and read-only.
- Basic = 40%, HRA = 20%, Medical = 10% of gross; Special is the remainder after rounding the other components.
- Employee and employer PF are prorated by paid days/calendar days when PF is enabled. TDS and advance are deducted in full, without proration.
- PT and IF are accounted for before proration and are not deducted a second time from net pay.
- An additional validation safeguard prevents PT plus IF from exceeding monthly CTC.

- ##Scope note:
- I've intentionally kept the application frontend-only, as specified in the assignment brief. Features such as Google login, authentication, backend APIs, database persistence, and real-user data integration have not been added because they fall outside the requested scope. The application uses mock data and frontend state, with no actual email or file delivery. I'd appreciate the implementation being evaluated against the stated frontend requirements, calculation accuracy, validation, and overall workflow.

## Edge cases tested
- Verified the Section 6 reference calculation and a separate custom scenario: CTC ₹75,000, September 2026, 24 working days, 3 leave days, PF enabled, PT ₹250, TDS ₹2,200, and advance ₹1,250. The displayed gross was ₹51,835.00 and net pay was ₹44,185.00.
- Checked PF enabled versus disabled and full-attendance calculations.
- Checked editable PT, fixed IF, and prevention of double deductions.
- Checked invalid attendance, including working days exceeding the month's length, negative leave, and leave exceeding working days.
- Checked February 2027 (28 days), leap-year February 2028 (29 days), and revalidation after changing the selected month.
- Checked zero paid days and the resulting negative net-pay warning.
- Checked negative/invalid salary inputs and the PT + IF versus CTC safeguard.
- Reviewed payslip preview consistency, back navigation, and post-confirmation input locking.

## Not finished or known issues
- This is a frontend-only prototype with mock data. It does not persist records to a backend or perform actual payroll processing or distribution.
- No other known issues were identified during the reported checks.

## Notes for the reviewer
- The preview uses the calculated result rather than a separately hardcoded payslip total.
- PT changes flow through monthly compensation and the resulting calculations; PT and IF are informational pre-deducted amounts, not additional net-pay deductions.
- Calculation and validation logic is centralized to keep results consistent across the workflow.
