import React from 'react';
import {
  ArrowRight,
  Briefcase,
  Calculator,
  ClipboardCheck,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { MOCK_CANDIDATES, MOCK_CLIENTS } from '../data/mockData';
import {
  DEFAULT_PT,
  FIXED_INSURANCE_FUND,
  MONTH_NAMES,
} from '../payroll/constants';
import { calculatePayslip, formatINR } from '../payroll/calculations';

interface HomePageProps {
  onGeneratePayslip: () => void;
}

const PREVIEW_INPUTS = {
  monthlyCtc: 60000,
  year: 2026,
  month: 10,
  workingDays: 22,
  leaveDays: 2,
  pfApplicable: true,
  pt: DEFAULT_PT,
  ifAmount: FIXED_INSURANCE_FUND,
  tds: 1500,
  advance: 2000,
} as const;

export const HomePage: React.FC<HomePageProps> = ({ onGeneratePayslip }) => {
  const previewResult = calculatePayslip(PREVIEW_INPUTS);
  const previewCandidate = MOCK_CANDIDATES[0];
  const previewClient = MOCK_CLIENTS[0];
  const periodLabel = `${MONTH_NAMES[PREVIEW_INPUTS.month - 1]} ${PREVIEW_INPUTS.year}`;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-derive antialiased flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex flex-col leading-none">
              <span className="text-[1.65rem] font-bold tracking-tight text-[#3162AE] lowercase">
                derive
              </span>
              <span className="text-[10px] font-medium text-[#3162AE]/70 tracking-wide">
                Management Solutions
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md bg-[#3162AE]/10 text-[#3162AE] text-[10px] font-semibold uppercase tracking-[0.14em]">
              Payroll Management
            </span>
          </div>

          <button
            type="button"
            onClick={onGeneratePayslip}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#3162AE] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3162AE]"
          >
            Generate Payslip
          </button>
        </div>
      </header>

      <div className="bg-[#3162AE] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium leading-snug">
            Payslip preparation tool for the Derive assignment — a frontend workflow prototype, not a live payroll product.
          </p>
        </div>
      </div>

      <main className="flex-1">
        <section className="relative bg-white py-10 sm:py-14 lg:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3162AE]">
                    Payroll Management
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold leading-[1.12] text-gray-900">
                    Simplifying Payroll.{' '}
                    <span className="text-[#3162AE]">Clarifying Every Payslip.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                    Prepare, review, and validate employee payslips through a
                    streamlined workflow with transparent salary calculations.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <button
                    type="button"
                    onClick={onGeneratePayslip}
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#3162AE] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3162AE]"
                  >
                    <Briefcase className="mr-2 h-5 w-5" aria-hidden="true" />
                    Generate Payslip
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 sm:p-8 overflow-hidden">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[#3162AE] text-white flex items-center justify-center shadow-lg mb-4">
                      <FileSpreadsheet className="w-9 h-9" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Salary summary
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 max-w-xs">
                      Preview from the same calculation engine used in the workflow.
                    </p>
                  </div>

                  <div className="relative mt-8 grid gap-3 sm:grid-cols-2 sm:items-end">
                    <article className="bg-white rounded-xl shadow-lg border border-gray-100 p-3.5 text-left home-float-card">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3162AE]">
                        Preview
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                        {previewCandidate.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {previewCandidate.designation}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {previewClient.name}
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-gray-500">{periodLabel}</p>
                          <p className="text-[10px] text-gray-500">
                            {previewResult.paidDays} of {previewResult.calendarDays} paid days
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#3162AE] tabular-nums">
                          {formatINR(previewResult.netPay)}
                        </p>
                      </div>
                    </article>

                    <article className="bg-white rounded-xl shadow-lg border border-gray-100 p-3.5 text-left home-float-card-delayed sm:mb-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Earnings snapshot
                      </p>
                      <dl className="mt-2 space-y-1.5 text-xs">
                        <div className="flex justify-between gap-3">
                          <dt className="text-gray-500">Gross</dt>
                          <dd className="font-semibold text-gray-900 tabular-nums">
                            {formatINR(previewResult.gross)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-gray-500">Deductions</dt>
                          <dd className="font-semibold text-gray-900 tabular-nums">
                            {formatINR(previewResult.deductions.totalDeductions)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3 pt-1 border-t border-gray-100">
                          <dt className="text-gray-600 font-medium">Net pay</dt>
                          <dd className="font-bold text-[#3162AE] tabular-nums">
                            {formatINR(previewResult.netPay)}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <FeatureCard
                icon={Layers}
                title="Structured salary breakdowns"
                description="Basic, HRA, allowances, and deductions are presented from a single calculation result."
              />
              <FeatureCard
                icon={Calculator}
                title="Attendance-aware calculations"
                description="Working days, leave, and calendar days drive proration before net pay is prepared."
              />
              <FeatureCard
                icon={ClipboardCheck}
                title="Review before preparation"
                description="Confirm identity, amounts, and recipient details before marking a payslip as prepared."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            Derive Management Solutions — payslip generation prototype for assignment
            review. No payroll is processed and nothing is delivered.
          </p>
          <p className="shrink-0">Frontend simulation</p>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 sm:p-6">
      <div className="w-10 h-10 rounded-lg bg-white text-[#3162AE] flex items-center justify-center border border-blue-200 mb-4">
        <Icon className="w-5 h-5" aria-hidden={true} />
      </div>
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
