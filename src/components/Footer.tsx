import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-outline-variant/40 mt-12 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-tertiary" />
          <span>
            Certified institutional audit ledger format (Form 16 / Payment of Wages Act ready)
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>Standalone Payroll Studio</span>
          <span className="text-outline-variant">•</span>
          <span>Single Calculation Source of Truth</span>
          <span className="text-outline-variant">•</span>
          <span className="text-primary font-semibold">Frontend Simulation</span>
        </div>
      </div>
    </footer>
  );
};
