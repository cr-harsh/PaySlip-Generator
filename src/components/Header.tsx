import React from 'react';
import { Cloud, HelpCircle, Bell, UserCheck, LockKeyhole } from 'lucide-react';
import type { Candidate } from '../types/payroll';

interface HeaderProps {
  selectedCandidate: Candidate | null;
  periodLabel: string;
  isPrepared: boolean;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCandidate,
  periodLabel,
  isPrepared,
  onNavigateHome,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 pt-[env(safe-area-inset-top)] md:left-60 lg:left-64 z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant/40 shadow-xs">
      <div className="h-16 w-full min-w-0 max-w-7xl mx-auto px-3 min-[390px]:px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand & Context */}
        <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 shrink-0 rounded-lg text-left hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Back to homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm ring-2 ring-primary/20">
              <span className="font-bold text-lg tracking-tight">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-on-surface tracking-tight leading-tight">
                Payslip Studio
              </span>
              <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">
                ATS Payroll
              </span>
            </div>
          </button>

          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold tracking-wide border border-outline-variant/60 uppercase">
            Frontend demo
          </span>

          {selectedCandidate ? (
            <>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-medium shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPrepared ? 'bg-tertiary' : 'bg-secondary-container animate-pulse'
                }`}
              />
              {isPrepared && <LockKeyhole className="w-3 h-3 text-tertiary shrink-0" />}
              <span className="truncate max-w-[150px] sm:max-w-[220px]">
                {isPrepared ? 'Prepared' : 'Draft'}: {selectedCandidate.employeeId} ({periodLabel})
              </span>
            </div>
            <span
              className="sm:hidden inline-flex h-2 w-2 shrink-0 rounded-full bg-secondary-container min-[360px]:h-auto min-[360px]:w-auto min-[360px]:items-center min-[360px]:gap-1.5 min-[360px]:rounded-lg min-[360px]:px-2 min-[360px]:py-1 min-[360px]:text-[10px] min-[360px]:font-semibold min-[360px]:text-on-surface min-[360px]:bg-surface-container"
              title={`${isPrepared ? 'Prepared' : 'Draft'}: ${selectedCandidate.employeeId} (${periodLabel})`}
              aria-label={`${isPrepared ? 'Prepared' : 'Draft'}: ${selectedCandidate.employeeId}, ${periodLabel}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPrepared ? 'bg-tertiary' : 'bg-secondary-container animate-pulse'
                }`}
                aria-hidden="true"
              />
              <span className="hidden min-[360px]:inline">{isPrepared ? 'Prepared' : 'Draft'}</span>
            </span>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <span>Draft: No candidate selected</span>
            </div>
          )}
        </div>

        {/* Right Tools & User Info */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-on-surface-variant text-xs">
            <Cloud className="w-3.5 h-3.5 text-primary" />
            <span>State in memory</span>
          </div>

          <button
            type="button"
            className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-xs transition-colors px-2 py-1 rounded-md hover:bg-surface-container"
            title="Standalone ATS Assignment Interface"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          <button
            type="button"
            className="relative shrink-0 p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          </button>

          <div className="flex shrink-0 items-center gap-2 pl-2 sm:pl-3 border-l border-outline-variant/50">
            <div className="w-8 h-8 shrink-0 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
              PN
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-on-surface leading-tight">
                  Priya Nair
                </span>
                <UserCheck className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium leading-none">
                HR Ops Lead
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
