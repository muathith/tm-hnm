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
      className="min-h-screen bg-gradient-to-b from-[#e8f0fe] via-[#f0f4f8] to-[#f5f7fa] px-3 py-4 sm:px-4 sm:py-6"
      dir="rtl"
    >
      <div className={cn("mx-auto w-full space-y-3 sm:space-y-4", maxWidthClassName)}>
        {/* ── Header ─────────────────────────────── */}
        <header className="flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 px-4 py-3 shadow-[0_2px_16px_rgba(25,118,210,0.08)]">
          <div className="flex items-center gap-2">
            <button className="rounded-xl bg-[#1976d2] text-white px-3.5 py-1.5 text-xs font-bold hover:bg-[#1565c0] transition-all shadow-sm hover:shadow-md">
              تسجيل الدخول
            </button>
            {headerAction || <Globe className="h-4 w-4 text-slate-400" />}
          </div>

          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-slate-400" />
            <span className="text-lg font-black text-[#1976d2]">تأميني</span>
            <img src="/tameeni-logo.webp" alt="تأميني" className="h-8 w-8 rounded-xl" />
          </div>
        </header>

        {/* ── Progress tracker ───────────────────── */}
        <section className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-white/80 bg-white/90 backdrop-blur-sm">
          <div className="px-4 py-3.5">
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
                <span className="bg-[#1976d2] text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-sm">
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
                        "flex-shrink-0 rounded-full transition-all duration-500",
                        isCurrent
                          ? "w-4 h-4 bg-[#1976d2] shadow-[0_0_0_4px_rgba(25,118,210,0.15)] ring-2 ring-[#1976d2]/30"
                          : isCompleted
                            ? "w-3 h-3 bg-[#1976d2]"
                            : "w-2.5 h-2.5 bg-slate-200",
                      )}
                    />
                    {i < totalSteps - 1 && (
                      <div className="flex-1 h-0.5 mx-0.5 rounded-full overflow-hidden bg-slate-100">
                        {isCompleted && (
                          <div className="h-full w-full bg-gradient-to-l from-[#42a5f5] to-[#1976d2] rounded-full" />
                        )}
                        {isCurrent && (
                          <div className="h-full w-1/2 bg-gradient-to-l from-[#42a5f5] to-[#1976d2] rounded-full" />
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
            "rounded-2xl border border-white/80 bg-white px-5 py-6 sm:px-6 sm:py-7",
            "shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]",
            cardClassName,
          )}
        >
          {icon ? (
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] text-[#1976d2] shadow-[0_4px_12px_rgba(25,118,210,0.12)]">
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

          <div className="mt-6 space-y-4">{children}</div>
        </section>
      </div>
    </div>
  );
}
