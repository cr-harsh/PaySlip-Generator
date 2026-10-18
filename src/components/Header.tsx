import React from 'react';
import { Cloud, HelpCircle, Bell, UserCheck, LockKeyhole } from 'lucide-react';
import type { Candidate } from '../types/payroll';

interface HeaderProps {
  selectedCandidate: Candidate | null;
  periodLabel: string;
  isPrepared: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCandidate,
  periodLabel,
  isPrepared,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant/40 shadow-xs">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
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
          </div>

          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold tracking-wide border border-outline-variant/60 uppercase">
            Frontend demo
          </span>

          {selectedCandidate ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-medium">
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
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <span>Draft: No candidate selected</span>
            </div>
          )}
        </div>

        {/* Right Tools & User Info */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
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
            className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          </button>

          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-outline-variant/50">
            <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
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
