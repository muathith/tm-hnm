import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Globe, Menu } from "lucide-react";

interface StepShellProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  maxWidthClassName?: string;
  cardClassName?: string;
  headerAction?: ReactNode;
}

export function StepShell({
  step,
  totalSteps = 4,
  title,
  subtitle,
  icon,
  children,
  maxWidthClassName = "max-w-md",
  cardClassName,
  headerAction,
}: StepShellProps) {
  const progress = Math.max(
    0,
    Math.min(100, Math.round((step / totalSteps) * 100)),
  );

  return (
    <div
      className="min-h-screen bg-[#f0f4f8] px-3 py-4 sm:px-4 sm:py-6"
      dir="rtl"
    >
      <div className={cn("mx-auto w-full space-y-3", maxWidthClassName)}>
        {/* ── Header ─────────────────────────────── */}
        <header className="flex items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
          {/* Left side: login + globe */}
          <div className="flex items-center gap-2">
            <button className="rounded-xl bg-[#1976d2] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#1565c0] transition-colors">
              تسجيل الدخول
            </button>
            <Globe className="h-4 w-4 text-slate-400" />
          </div>

          {/* Right side: logo + menu */}
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-slate-500" />
            <span className="text-lg font-black text-[#1976d2]">تأميني</span>
            <img src="/tameeni-logo.webp" alt="تأميني" className="h-8 w-8 rounded-xl" />
          </div>
        </header>

        {/* ── Progress tracker ───────────────────── */}
        <section className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="bg-white px-4 py-3.5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1976d2] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1976d2]" />
                </span>
                <p className="text-sm font-black text-[#1565c0]">تتبع الطلب</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400">الخطوة</span>
                <span className="bg-[#1976d2] text-white text-xs font-black px-2 py-0.5 rounded-lg">
                  {step}
                </span>
                <span className="text-xs text-slate-400">من {totalSteps}</span>
              </div>
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-0 mb-3">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const isCompleted = i + 1 < step;
                const isCurrent = i + 1 === step;
                return (
                  <div key={i} className="flex items-center flex-1">
                    <div
                      className={cn(
                        "flex-shrink-0 rounded-full transition-all duration-300",
                        isCurrent
                          ? "w-4 h-4 bg-[#1976d2] shadow-md shadow-blue-200 ring-2 ring-[#1976d2]/30"
                          : isCompleted
                            ? "w-3 h-3 bg-[#1976d2]"
                            : "w-2.5 h-2.5 bg-slate-200",
                      )}
                    />
                    {i < totalSteps - 1 && (
                      <div className="flex-1 h-0.5 mx-0.5 rounded-full overflow-hidden bg-slate-200">
                        {isCompleted && (
                          <div className="h-full w-full bg-[#1976d2] rounded-full" />
                        )}
                        {isCurrent && (
                          <div className="h-full w-1/2 bg-[#1976d2] rounded-full" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="absolute inset-y-0 right-0 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #1565c0, #1976d2 60%, #42a5f5)",
                  left: "auto",
                  right: "unset",
                }}
              />
            </div>

            <div className="flex justify-end mt-1.5">
              <span className="text-[10px] font-black text-[#1976d2]">
                {progress}%
              </span>
            </div>
          </div>
        </section>

        {/* ── Main card ──────────────────────────────── */}
        <section
          className={cn(
            "rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-6 sm:py-7",
            cardClassName,
          )}
        >
          {icon ? (
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e3f2fd] text-[#1976d2] shadow-inner">
                {icon}
              </div>
            </div>
          ) : null}

          <h1 className="text-center text-2xl font-extrabold text-[#1565c0]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-5 space-y-4">{children}</div>
        </section>
      </div>
    </div>
  );
}
