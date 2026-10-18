# Payslip Generation UI — Product Requirements Document

**Project:** Standalone Payslip Generation UI  
**Product type:** Frontend-only payroll workflow  
**Primary users:** HR/recruitment operations staff preparing candidate payslips  
**Status:** Implementation specification  
**Source of truth:** Recruiter-provided Payslip Generation UI (ATS) assignment PDF, dated 13 October 2026

---

## 1. Product overview

Build a polished, responsive web application that allows an HR user to select a client and candidate, enter salary and attendance details, calculate a payslip, review its breakdown, and confirm that it is prepared for distribution.

The recruiter has confirmed that the implementation may be standalone rather than integrated into the existing ATS.

All data must be mock data, and all state must remain on the frontend. No backend, database, real email delivery, file delivery, or payroll integration is required.

### Product principle

**One input state → one calculation function → one result object → every financial display.**

The salary form, calculation breakdown, payslip preview, and distribution summary must never calculate financial figures independently.

## 2. Technology and constraints

Use the existing project setup:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React for icons
- Vitest for calculation tests

Reuse dependencies already installed. Do not introduce unnecessary UI libraries, state-management packages, backend frameworks, authentication, database clients, tax engines, or external services.

The project must run locally using `npm run dev` and provide a working test command.

## 3. Design direction

Create a premium modern SaaS interface with:

- A restrained navy/indigo palette and subtle gradients.
- Clean light surfaces, rounded cards, subtle borders and soft shadows.
- Clear typography, strong spacing and consistent alignment.
- A prominent four-step progress indicator.
- Professional salary summary cards and readable financial tables.
- Clear Draft, Ready to prepare and Prepared for distribution status indicators.
- Accessible form labels, keyboard navigation, focus states and inline validation.
- Responsive layouts for mobile, tablet and desktop.

The interface should feel production-quality, not like a generic form demo. Avoid excessive gradients, distracting animations, oversized decorative elements and unnecessary dashboard widgets.

Visual polish must never compromise readability or financial accuracy.

## 4. User workflow

Implement these four steps. Users must be able to navigate backwards without losing entered values.

### Step 1 — Select client and candidate

- Start with an empty state.
- Allow the user to select a client/company.
- Populate the candidate/application selector using the selected client's mock records.
- Selecting a candidate automatically populates their identity information.
- Show client/company name, candidate name, employee ID, designation, date of joining, PAN and PF UAN.
- If PAN or PF UAN is absent, display “Not provided”.
- Show the selected pay period, working days and leave days as read-back values when available.
- Do not allow progression until the required client and candidate are selected.

### Step 2 — Salary and attendance

Required fields and defaults:

| Field | Initial value | Rules |
|---|---|---|
| Monthly HR CTC | Empty | Required; greater than zero |
| Payslip month/year | Current month | Required; determines calendar days |
| Working days | Empty | Required; whole number from zero to calendar days |
| Leave days | 0 | Whole number, non-negative, no greater than working days |
| PF applicable | No | Yes/No toggle; default No |
| TDS | 0 | Non-negative amount; never prorated |
| Advance deduction | 0 | Non-negative amount; never prorated |
| Professional Tax (PT) | ₹200 | Editable; non-negative |
| Insurance Fund (IF) | ₹700 | Fixed, read-only |

Display the calculated number of calendar days for the selected month.

Validate fields on change, after touch, and when the user attempts to continue. Revalidate working and leave days immediately whenever the month changes.

Suggested error messages:

- “This field is required.”
- “Working days cannot exceed {days} days in {month} {year}.”
- “Leave days cannot be negative.”
- “Leave days cannot exceed working days.”
- “Amount cannot be negative.”
- “PT and IF together exceed the HR CTC.”

The PT + IF check is an allowed additional safeguard. Do not introduce any other payroll rules not supported by the assignment.

If any validation error is active, the calculation result must be unavailable and the user cannot continue.

### Step 3 — Calculation breakdown and payslip preview

Display the financial breakdown and a payslip preview derived from the same calculation result.

The preview must show:

**Identity**
- Client/company name
- Candidate name
- Employee ID
- Designation
- Date of joining
- PAN
- PF UAN
- Pay period
- Paid days and calendar days

**Earnings**
- Basic Pay
- HRA
- Medical Allowance
- Special Allowance
- Total Earnings

**Payslip information/deduction lines**
- PT
- Employee PF
- Employer PF
- Insurance Fund (IF)
- TDS
- Advance
- Total Deductions
- Net Pay

Always display all specified lines, including ₹0.00 for non-applicable PF or zero-valued TDS/advance.

Show a small explanatory note:

“PT and IF are already deducted from CTC before proration and are not counted again in Total Deductions or Net Pay.”

Before valid inputs are available, display a helpful placeholder such as “Complete the inputs to see the payslip”. Never display NaN, undefined or misleading calculated zeros.

On small screens, stack the earnings and deduction tables vertically.

### Step 4 — Prepare distribution and confirm

Implement three states:

**A. Review**
- Show recipient name and email from mock data.
- Show pay period, paid days and net pay.
- Show the current preparation status.
- If email is missing, show a warning and disable the preparation action.

**B. Confirmation**
- Open a confirmation dialog when the user clicks “Prepare for distribution”.
- Repeat the recipient and net pay.
- Provide Confirm and Cancel actions.
- Cancel returns to review without changing the payslip.

**C. Done**
- Only after explicit confirmation, display “Prepared for distribution”.
- Show recipient, pay period and net pay.
- Offer “Start another payslip” and “Back to review”.
- Make it clear that nothing has been emailed, uploaded or delivered.
- Lock the inputs or display them as read-only after confirmation so the prepared payslip cannot silently change.

Do not integrate with any email, upload, download or delivery service.

## 5. Constants

Keep all fixed payroll values in a single constants module.

- Default PT: ₹200, editable by the user.
- IF: ₹700, fixed.
- Full-month employee PF: ₹3,000.
- Full-month employer PF: ₹3,000.
- Basic: 40% of prorated gross.
- HRA: 20% of prorated gross.
- Medical Allowance: 10% of prorated gross.
- Special Allowance: remainder after rounding Basic, HRA and Medical.

Do not duplicate these numeric constants across components.

## 6. Authoritative calculation rules

Implement a pure function:

`calculatePayslip(inputs)`

The function must be independent of React and must return one consistent result object. It must not mutate its inputs or access browser state, network services or component state.

Use this exact calculation order:

1. **Paid days**

   `paidDays = workingDays - leaveDays`

2. **Pay ratio**

   `payRatio = paidDays / calendarDaysInMonth`

   Keep full precision for the ratio.

3. **Monthly compensation**

   `monthlyCompensation = HR_CTC - PT - IF`

4. **Per-day compensation**

   `perDayCompensation = monthlyCompensation / calendarDaysInMonth`

   Round to six decimal places.

5. **Prorated gross**

   `gross = roundTo2(perDayCompensation × paidDays)`

6. **Earnings**

   - `basic = roundTo2(gross × 0.40)`
   - `hra = roundTo2(gross × 0.20)`
   - `medical = roundTo2(gross × 0.10)`
   - `special = roundTo2(gross - basic - hra - medical)`

   `totalEarnings` is the sum of the four already-rounded earning components, rounded to two decimal places.

7. **Provident fund**

   If PF is enabled:

   - `employeePF = roundTo2(3000 × payRatio)`
   - `employerPF = roundTo2(3000 × payRatio)`

   If PF is disabled, both are zero. Still display both lines in the UI.

8. **Total deductions**

   `totalDeductions = roundTo2(employeePF + employerPF + TDS + advance)`

   TDS and advance are used as entered and are not prorated.

9. **Net pay**

   `netPay = roundTo2(gross - totalDeductions)`

### Critical accounting rules

- PT and IF are subtracted from HR CTC before proration.
- PT and IF are displayed as information lines on the payslip, but are excluded from Total Deductions.
- Never subtract PT or IF a second time from Net Pay.
- Special Allowance must use the already-rounded Basic, HRA and Medical values.
- Total Earnings must equal Prorated Gross to the paisa.
- Use a consistent, explicit rounding strategy for monetary values. Avoid accidental floating-point inconsistencies and do not round the pay ratio prematurely.

Use a real calendar-date calculation for the selected month and year. February 2028 has 29 days; February 2027 has 28 days.

## 7. Financial formatting

Use Indian currency formatting with two decimal places and Indian digit grouping.

Examples:
- ₹38,129.03
- ₹7,370.96
- ₹30,758.07

Ensure negative net pay remains visible and correctly formatted. Do not hide or clamp negative results.

## 8. Edge cases

- Paid days are zero: gross, all earnings and both PF amounts are zero. Net pay equals zero minus TDS and advance. Show a warning if deductions exceed earnings.
- PF disabled: employee and employer PF lines remain visible as ₹0.00.
- TDS and advance are not prorated.
- February 2027: 29 working days is invalid; 28 is accepted.
- February 2028: 29 working days is accepted.
- Changing October to November must immediately invalidate 31 working days because November has only 30 calendar days.
- Missing PAN/UAN: display “Not provided”.
- Missing email: block distribution preparation.
- Invalid input: no calculated result and no progression.
- Going backwards between steps must preserve inputs.
- After confirmation, prevent silent changes to the prepared payslip.

## 9. Mock data

Create several clients with multiple candidate/application records per client.

Each candidate record should include:
- Candidate name
- Employee ID
- Designation
- Date of joining
- PAN (optional)
- PF UAN (optional)
- Email (optional)
- Associated client identifier

Include at least:
- One candidate with PAN and PF UAN missing.
- One candidate with an email address missing.
- Enough distinct records to demonstrate that candidate options change when the client changes.

Use realistic but clearly fictional details. Do not use actual personal information.

## 10. Mandatory automated tests

Use Vitest to test `calculatePayslip()` independently of the UI.

Unless stated otherwise, use HR CTC ₹60,000, October 2026, PT ₹200, IF ₹700, TDS ₹1,500 and advance ₹2,000.

### Test 1 — Worked example

Inputs: working days 22, leave days 2, PF Yes.

Expected:
- Calendar days: 31
- Paid days: 20
- Pay ratio: 20/31
- Monthly compensation: ₹59,100.00
- Per-day compensation: ₹1,906.451613
- Gross: ₹38,129.03
- Basic: ₹15,251.61
- HRA: ₹7,625.81
- Medical: ₹3,812.90
- Special: ₹11,438.71
- Total earnings: ₹38,129.03
- Employee PF: ₹1,935.48
- Employer PF: ₹1,935.48
- Total deductions: ₹7,370.96
- Net pay: ₹30,758.07

### Test 2 — PF off

Use the same inputs as Test 1 but PF No.

Expected:
- Both PF lines: ₹0.00
- Total deductions: ₹3,500.00
- Net pay: ₹34,629.03

### Test 3 — Full attendance

Inputs: October 2026, working days 31, leave 0, PF Yes, TDS 0, advance 0.

Expected:
- Gross: ₹59,100.00
- Basic: ₹23,640.00
- HRA: ₹11,820.00
- Medical: ₹5,910.00
- Special: ₹17,730.00
- Employee PF: ₹3,000.00
- Employer PF: ₹3,000.00
- Total deductions: ₹6,000.00
- Net pay: ₹53,100.00

### Test 4 — PT changed

Use Test 1 inputs but PT ₹300.

Expected:
- Per-day compensation: ₹1,903.225806
- Gross: ₹38,064.52
- Total deductions: ₹7,370.96
- Net pay: ₹30,693.56

### Test 5 — Working days exceed calendar days

October 2026, working days 32.

Expected: validation error, no calculated result, and no progression.

### Test 6 — Leave-day validation

Working days 22, leave days 23; then leave days -1.

Expected: each input is rejected with the corresponding validation error.

### Test 7 — Zero paid days

Inputs: working days 5, leave days 5, PF Yes, TDS ₹1,500, advance ₹2,000.

Expected:
- Gross: ₹0.00
- Earnings: ₹0.00
- Both PF amounts: ₹0.00
- Total deductions: ₹3,500.00
- Net pay: -₹3,500.00
- A warning is displayed.

### Test 8 — Short month

February 2027, working days 29.

Expected: validation error. Working days 28 is accepted.

### Test 9 — Leap year

February 2028, working days 29.

Expected: accepted, with 29 calendar days.

### Test 10 — Month changed after entry

Enter 31 working days in October 2026 and change the month to November 2026.

Expected: an immediate validation error because November has 30 calendar days.

Also test negative TDS, negative advance, negative PT, missing required values, PT + IF exceeding CTC, missing recipient email, and input preservation when navigating backwards.

## 11. Acceptance criteria

The implementation is complete only when:

- All four steps are usable and navigable.
- Client and candidate selections populate identity details.
- All inputs follow the stated validation rules.
- One calculation result powers all financial displays.
- The four mandatory numerical test scenarios and all specified edge cases pass.
- Changing PT immediately updates every dependent financial display.
- PT and IF are not counted twice.
- All payslip lines remain visible, including zero-value PF lines.
- The distribution confirmation has review, confirm and done states.
- No real delivery or backend operation occurs.
- The layout works on mobile, tablet and desktop.
- Forms have visible labels, clear inline errors and keyboard-accessible controls.
- The project runs with documented commands.
- A handoff note of no more than one page is included.

## 12. Implementation sequence

1. Inspect the existing project, dependencies and folders.
2. Finish project configuration without replacing working setup unnecessarily.
3. Create TypeScript types, mock data and constants.
4. Implement the date helper and pure calculation function.
5. Write and run the automated tests.
6. Implement validation and input state.
7. Build client/candidate selection and the empty state.
8. Build salary and attendance inputs.
9. Build the breakdown and payslip preview using the single calculation result.
10. Build distribution review, confirmation and completion.
11. Polish responsive layout, accessibility and status states.
12. Run all tests, verify the worked example, and write the handoff note.

## 13. Handoff note

Include a maximum one-page `HANDOFF.md` covering:
- What was built.
- How to install, run and test it.
- Where `calculatePayslip()` and the constants live.
- Any assumptions made.
- Known limitations or unfinished items.
- Confirmation that no real email or file was sent.
