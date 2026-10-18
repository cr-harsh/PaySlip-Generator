import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Stepper } from './components/Stepper';
import { Step1ClientCandidate } from './components/Step1ClientCandidate';
import { Step2SalaryAttendance } from './components/Step2SalaryAttendance';
import { Step3BreakdownPreview } from './components/Step3BreakdownPreview';
import { Step4DistributionConfirm } from './components/Step4DistributionConfirm';
import { Footer } from './components/Footer';
import { WorkflowSidebar } from './components/WorkflowSidebar';

import { MOCK_CLIENTS, MOCK_CANDIDATES } from './data/mockData';
import {
  DEFAULT_PT,
  FIXED_INSURANCE_FUND,
  MONTH_NAMES,
} from './payroll/constants';
import {
  calculatePayslip,
  validateSalaryInputs,
} from './payroll/calculations';
import type {
  Client,
  Candidate,
  SalaryAttendanceInputs,
  WorkflowStep,
} from './types/payroll';

export function App() {
  const [screen, setScreen] = useState<'home' | 'workflow'>('home');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);

  // Step 1 State: Selected Client and Candidate
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    MOCK_CLIENTS[0], // Northstar Technologies pre-selected for smooth immediate demo
  );
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    MOCK_CANDIDATES[0], // Aarav Sharma pre-selected
  );

  // Step 2 State: Inputs with PRD Table defaults
  const [inputs, setInputs] = useState<SalaryAttendanceInputs>({
    monthlyCtc: 60000, // Pre-populated with PRD Worked Example baseline
    year: 2026,
    month: 10, // October 2026
    workingDays: 22,
    leaveDays: 2,
    pfApplicable: true,
    pt: DEFAULT_PT,
    ifAmount: FIXED_INSURANCE_FUND,
    tds: 1500,
    advance: 2000,
  });

  // Step 4 State: Lock flag once confirmed
  const [isPrepared, setIsPrepared] = useState<boolean>(false);

  // Handle Input Changes with immediate re-validation
  const handleInputChange = (field: keyof SalaryAttendanceInputs, value: unknown) => {
    if (isPrepared) return; // Prevent silent modification when locked

    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Field validation computed strictly according to PRD rules
  const validationErrors = useMemo(() => {
    return validateSalaryInputs(inputs);
  }, [inputs]);

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  // Authoritative single-source calculation result
  // If invalid or missing required fields, result is null (no misleading fake zeros)
  const calculationResult = useMemo(() => {
    if (
      hasValidationErrors ||
      inputs.monthlyCtc === '' ||
      inputs.workingDays === '' ||
      inputs.leaveDays === '' ||
      inputs.pt === ''
    ) {
      return null;
    }

    return calculatePayslip({
      monthlyCtc: Number(inputs.monthlyCtc),
      year: inputs.year,
      month: inputs.month,
      workingDays: Number(inputs.workingDays),
      leaveDays: Number(inputs.leaveDays),
      pfApplicable: inputs.pfApplicable,
      pt: Number(inputs.pt),
      ifAmount: inputs.ifAmount,
      tds: Number(inputs.tds) || 0,
      advance: Number(inputs.advance) || 0,
    });
  }, [inputs, hasValidationErrors]);

  // Stepper navigation permissions
  const canNavigateToStep = (step: WorkflowStep): boolean => {
    if (step === 1) return true;
    if (step === 2) return selectedClient !== null && selectedCandidate !== null;
    if (step === 3) return calculationResult !== null && !hasValidationErrors;
    if (step === 4) return calculationResult !== null && !hasValidationErrors;
    return false;
  };

  const handleStepClick = (step: WorkflowStep) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const handleResetWorkflow = () => {
    setIsPrepared(false);
    setCurrentStep(1);
    setSelectedCandidate(MOCK_CANDIDATES[0]);
    setInputs({
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
    });
  };

  const periodLabel = `${MONTH_NAMES[inputs.month - 1]} ${inputs.year}`;

  if (screen === 'home') {
    return (
      <HomePage
        onGeneratePayslip={() => {
          setCurrentStep(1);
          setScreen('workflow');
        }}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col text-on-surface antialiased font-sans">
      {/* Top Application Header */}
      <Header
        selectedCandidate={selectedCandidate}
        periodLabel={periodLabel}
        isPrepared={isPrepared}
        onNavigateHome={() => setScreen('home')}
      />

      {/* Main Content Area with Header offset */}
      <div className="min-h-[100dvh] md:ml-60 lg:ml-64 md:h-[100dvh] md:overflow-y-auto md:overscroll-contain">
        <WorkflowSidebar onNavigateHome={() => setScreen('home')} />
        <div className="min-w-0 flex min-h-[100dvh] flex-col pt-[calc(4rem+env(safe-area-inset-top))] md:min-h-full">
        {/* Sub-header Hero & Stepper Shell */}
        <div className="bg-white border-b border-outline-variant/40 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                  Generate payslip
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Prepare, review and confirm a candidate payslip with mathematical precision.
                </p>
              </div>

              {/* Quick Preset Buttons for Reviewers */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClient(MOCK_CLIENTS[0]);
                    setSelectedCandidate(MOCK_CANDIDATES[0]);
                    setInputs({
                      monthlyCtc: 60000,
                      year: 2026,
                      month: 10,
                      workingDays: 22,
                      leaveDays: 2,
                      pfApplicable: true,
                      pt: 200,
                      ifAmount: 700,
                      tds: 1500,
                      advance: 2000,
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors border border-outline-variant/30"
                  title="Resets to PRD Worked Example (₹60,000 CTC, Oct 2026, 22 working, 2 leave, Net ₹30,758.07)"
                >
                  ⚡ Load PRD Worked Example
                </button>
              </div>
            </div>

            {/* Stepper Component */}
            <Stepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
              canNavigateToStep={canNavigateToStep}
            />
          </div>
        </div>

        {/* Dynamic Workflow Step Content */}
        <main className="max-w-7xl w-full min-w-0 mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:pb-8 flex-1">
          {currentStep === 1 && (
            <Step1ClientCandidate
              clients={MOCK_CLIENTS}
              candidates={MOCK_CANDIDATES}
              selectedClient={selectedClient}
              selectedCandidate={selectedCandidate}
              onSelectClient={(client) => {
                setSelectedClient(client);
                setSelectedCandidate(null);
              }}
              onSelectCandidate={(candidate) => setSelectedCandidate(candidate)}
              onContinue={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && selectedCandidate && selectedClient && (
            <Step2SalaryAttendance
              inputs={inputs}
              errors={validationErrors}
              calculationResult={calculationResult}
              selectedCandidate={selectedCandidate}
              selectedClient={selectedClient}
              isPrepared={isPrepared}
              onInputChange={handleInputChange}
              onBack={() => setCurrentStep(1)}
              onContinue={() => {
                if (calculationResult && !hasValidationErrors) {
                  setCurrentStep(3);
                }
              }}
            />
          )}

          {currentStep === 3 &&
            calculationResult &&
            selectedCandidate &&
            selectedClient && (
              <Step3BreakdownPreview
                calculationResult={calculationResult}
                inputs={inputs}
                selectedCandidate={selectedCandidate}
                selectedClient={selectedClient}
                isPrepared={isPrepared}
                onBack={() => setCurrentStep(2)}
                onContinue={() => setCurrentStep(4)}
              />
            )}

          {currentStep === 4 &&
            calculationResult &&
            selectedCandidate &&
            selectedClient && (
              <Step4DistributionConfirm
                calculationResult={calculationResult}
                inputs={inputs}
                selectedCandidate={selectedCandidate}
                selectedClient={selectedClient}
                isPrepared={isPrepared}
                onConfirmPreparation={() => setIsPrepared(true)}
                onResetWorkflow={handleResetWorkflow}
                onBackToReviewStep={() => setCurrentStep(3)}
              />
            )}
        </main>

        {/* Certified Footer */}
        <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
