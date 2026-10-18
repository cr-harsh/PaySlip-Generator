import { useState } from 'react';
import {
  ChartNoAxesCombined,
  FileText,
  Building2,
  Users,
  LockKeyhole,
  Menu,
  X,
  House,
} from 'lucide-react';

const unavailableItems = [
  { label: 'Clients', Icon: Building2 },
  { label: 'Candidates', Icon: Users },
  { label: 'Reports', Icon: ChartNoAxesCombined },
];

export function WorkflowSidebar({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-[100dvh] w-60 flex-col overflow-hidden border-r border-slate-200 bg-white px-4 py-6 md:flex lg:w-64">
        <SidebarContent onNavigateHome={onNavigateHome} />
      </aside>

      <div className="md:hidden border-b border-slate-200 bg-white px-4 py-2.5">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-workspace-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="flex items-center gap-2"><Menu className="h-4 w-4" aria-hidden="true" /> Workspace navigation</span>
          {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <span className="text-xs text-slate-500">Payslip Generator</span>}
        </button>
        {mobileOpen && (
          <div id="mobile-workspace-navigation" className="pt-3">
            <SidebarContent
              onNavigate={() => setMobileOpen(false)}
              onNavigateHome={onNavigateHome}
            />
          </div>
        )}
      </div>
    </>
  );
}

function SidebarContent({
  onNavigate,
  onNavigateHome,
}: {
  onNavigate?: () => void;
  onNavigateHome: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3162AE] text-white shadow-sm">
          <span className="text-lg font-bold">D</span>
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold text-slate-900">derive</p>
          <p className="truncate text-[10px] font-medium tracking-wide text-slate-500">Management Solutions</p>
        </div>
      </div>

      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
      <nav aria-label="Workspace" className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        <button
          type="button"
          aria-current="page"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-left text-sm font-semibold text-[#28589f] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <FileText className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span>Payslip Generator</span>
        </button>
        {unavailableItems.map(({ label, Icon }) => (
          <div
            key={label}
            aria-disabled="true"
            title="Requires backend integration"
            className="group flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400"
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            <LockKeyhole className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            <span className="sr-only">Unavailable. Requires backend integration.</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto shrink-0 pt-8">
        <button
          type="button"
          onClick={() => {
            onNavigateHome();
            onNavigate?.();
          }}
          className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <House className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span>Home</span>
        </button>
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Demo workspace</p>
          <p className="mt-0.5 text-xs text-slate-500">Frontend demo</p>
        </div>
      </div>
    </div>
  );
}
