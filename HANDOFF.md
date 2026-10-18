# Project Handoff Note — Standalone Payslip Generator

**Project:** Standalone Payslip Generation UI  
**Repository:** `payslip-generator`  
**Date:** 18 October 2026  
**Status:** Production-Ready Frontend Workflow  

---

## 1. What was built

A standalone, four-step payslip generation application built with React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, and Vitest. The UI faithfully preserves the four Google Stitch HTML reference designs (`step1.html` through `step4.html`) and connects them into a cohesive workflow:

1. **Step 1 — Identity & Affiliation:**
   - Searchable client dropdown with rich organization metadata (GSTIN, staff count, code).
   - Filtered candidate dropdown displaying records belonging only to the selected client.
   - Rich identity dossier displaying Candidate Name, Employee ID, Designation, Department, Date of Joining, Tenure, PAN, PF UAN, and Work Email.
   - Missing statutory data handling displaying **“Not provided”** for absent PAN or PF UAN.
   - Interactive quick-preset buttons (*Verified Record*, *Missing PAN/UAN*, *Blank State*) for rapid evaluation.

2. **Step 2 — Salary & Attendance:**
   - Base Monthly HR CTC input with inline validation (> ₹0).
   - Dynamic Month / Year cycle selector with real-time calendar day divisor calculation (e.g. 31 days in Oct 2026, 30 days in Nov 2026, 28 days in Feb 2027, 29 days in Feb 2028 leap year).
   - Working days (0 to calendar days) and Leave days (0 to working days) with instant cross-validation and derived paid days progress meter.
   - Statutory controls: PF toggle switch (default off, 12% rule), editable Professional Tax (PT, default ₹200), fixed read-only Insurance Fund (IF, ₹700), flat TDS, and flat Advance deduction.
   - Live sidebar computation card updating in real time as inputs change.

3. **Step 3 — Calculation Breakdown & Payslip Preview:**
   - Audit ref header and full contract proration breakdown.
   - Detailed Earnings Table: Basic Pay (40%), HRA (20%), Medical Allowance (10%), Special Allowance (balancing pool), Gross Earnings.
   - Deductions Ledger: Employee PF, Employer PF, TDS, Advance Recovery, and informational lines for PT & IF.
   - Authoritative accounting note: *“PT and IF are already deducted from CTC before proration and are not counted again in Total Deductions or Net Pay.”*
   - Printable Executive A4 Payslip card with company header, watermark, balanced 2-column matrix, spelled-out net take-home in words, and HR signatory block.
   - Browser print trigger (`window.print()`).

4. **Step 4 — Prepare Distribution & Confirm:**
   - **Review State:** Authorization review showing recipient, email, pay period, and net pay. If email is missing, distribution preparation is disabled.
   - **Confirmation Modal:** Explicit confirmation modal dialog repeating recipient and net pay details.
   - **Done / Success State:** Certified “Prepared for distribution” badge with queue token (`#DISP-9941`), read-only locked parameter snapshot, clear simulation banner, and actions to review or start another payslip.

---

## 2. Source of Truth & Architecture

The application adheres strictly to the PRD product principle:
**One input state → one calculation function → one result object → every financial display.**

- **Calculation Engine:** [`src/payroll/calculations.ts`](file:///c:/PayDraft/payslip-generator/src/payroll/calculations.ts)
  - Pure function `calculatePayslip(inputs)` independent of React.
  - Exact PRD formula order: Paid Days $\rightarrow$ Pay Ratio $\rightarrow$ Monthly Comp ($\text{CTC} - \text{PT} - \text{IF}$) $\rightarrow$ Per-day Comp (6 decimals) $\rightarrow$ Prorated Gross $\rightarrow$ Basic / HRA / Medical / Special $\rightarrow$ PF $\rightarrow$ Deductions $\rightarrow$ Net Pay.
  - Indian currency formatter `formatINR()`.
  - Date helper `getDaysInMonth()`.
- **Constants Module:** [`src/payroll/constants.ts`](file:///c:/PayDraft/payslip-generator/src/payroll/constants.ts)
  - Fixed Insurance Fund: ₹700.
  - Default Professional Tax: ₹200.
  - Full-month Employee & Employer PF: ₹3,000 each.
  - Statutory percentages: Basic (40%), HRA (20%), Medical (10%).
- **Mock Data:** [`src/data/mockData.ts`](file:///c:/PayDraft/payslip-generator/src/data/mockData.ts)
- **TypeScript Types:** [`src/types/payroll.ts`](file:///c:/PayDraft/payslip-generator/src/types/payroll.ts)

---

## 3. How to install, run, and test

All commands must be executed within `payslip-generator`:

```bash
# Install dependencies (already pre-installed)
npm install

# Run the local development server
npm run dev
# -> Opens http://localhost:5173/

# Run the automated Vitest test suite (PRD Tests 1-10 + edge cases)
npm test

# Run the code linter (Oxlint)
npm run lint

# Build production bundle
npm run build
```

---

## 4. Test Results & Worked Example Verification

Running `npm test` executes 12 automated unit tests covering all 10 PRD scenarios:

- **Worked Example (Test 1):**
  - **Inputs:** CTC ₹60,000, Oct 2026, 22 working days, 2 leave days, PF Yes, PT ₹200, IF ₹700, TDS ₹1,500, Advance ₹2,000.
  - **Calendar Days:** 31 | **Paid Days:** 20 | **Pay Ratio:** 20/31
  - **Monthly Compensation:** ₹59,100.00
  - **Per-day Compensation:** ₹1,906.451613
  - **Prorated Gross:** ₹38,129.03
  - **Basic Pay (40%):** ₹15,251.61
  - **HRA (20%):** ₹7,625.81
  - **Medical Allowance (10%):** ₹3,812.90
  - **Special Allowance (remainder):** ₹11,438.71
  - **Total Earnings:** ₹38,129.03 (strictly equals Gross to the paisa)
  - **Employee PF:** ₹1,935.48 | **Employer PF:** ₹1,935.48
  - **Total Deductions:** ₹7,370.96
  - **Net Take-Home Pay:** ₹30,758.07
- **Tests 2–10:** All verified (PF off, full attendance, PT changed to ₹300, calendar day overflow, leave > working days, zero paid days with negative net pay `-₹3,500.00`, short month Feb 2027 rejection of 29 days, leap year Feb 2028 acceptance of 29 days, and immediate month switch revalidation).

---

## 5. Assumptions & Constraints

- Client portfolios and candidate records are stored in memory via realistic mock datasets.
- PT and IF are subtracted prior to proration and excluded from Total Deductions as instructed by PRD Section 6.
- Candidate email absence correctly prevents entering the distribution confirmation step.
- Navigation backward preserves all entered parameters.

---

## 6. Real Delivery Confirmation

**No real email, file upload, remote database, or third-party delivery service was added or executed.** All distribution preparation occurs purely in client-side state as a demonstration of the administrative payroll workflow.
