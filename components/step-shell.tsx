import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UserCircle2 } from "lucide-react";

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
        <header className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
          <button className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-[#1a5676] hover:bg-slate-100 transition-colors">
            EN
          </button>

          <img src="/logo-0.svg" alt="بي كير" className="h-9 w-auto" />

          <div className="w-8 h-8 rounded-full bg-[#1a5676]/10 flex items-center justify-center">
            <UserCircle2 className="h-4.5 w-4.5 text-[#1a5676]" />
          </div>
        </header>

        {/* ── Progress tracker ───────────────────── */}
        <section className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/80">
          {/* Top gradient strip */}
          <div className="h-1 bg-gradient-to-l from-[#f4ad27] via-[#1a9fd4] to-[#0e3a57]" />

          <div className="bg-white px-4 py-3.5">
            {/* Row: label + percentage */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Animated pulsing dot */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4ad27] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f4ad27]" />
                </span>
                <p className="text-sm font-black text-[#0e3a57]">تتبع الطلب</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400">
                  الخطوة
                </span>
                <span className="bg-[#0e3a57] text-white text-xs font-black px-2 py-0.5 rounded-lg">
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
                    {/* Dot */}
                    <div
                      className={cn(
                        "flex-shrink-0 rounded-full transition-all duration-300",
                        isCurrent
                          ? "w-4 h-4 bg-[#f4ad27] shadow-md shadow-amber-200 ring-2 ring-[#f4ad27]/30"
                          : isCompleted
                            ? "w-3 h-3 bg-[#1a5676]"
                            : "w-2.5 h-2.5 bg-slate-200",
                      )}
                    />
                    {/* Connector line (not after last dot) */}
                    {i < totalSteps - 1 && (
                      <div className="flex-1 h-0.5 mx-0.5 rounded-full overflow-hidden bg-slate-200">
                        {isCompleted && (
                          <div className="h-full w-full bg-[#1a5676] rounded-full" />
                        )}
                        {isCurrent && (
                          <div className="h-full w-1/2 bg-[#f4ad27] rounded-full" />
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
                  background:
                    "linear-gradient(90deg, #0e3a57, #1a9fd4 50%, #f4ad27)",
                  left: "auto",
                  right: "unset",
                }}
              />
              {/* Shimmer */}
              <div
                className="absolute inset-y-0 rounded-full opacity-40"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>

            {/* Percentage label */}
            <div className="flex justify-end mt-1.5">
              <span className="text-[10px] font-black text-[#f4ad27]">
                {progress}%
              </span>
            </div>
          </div>
        </section>

        {/* ── Main card ──────────────────────────────── */}
        <section
          className={cn(
            "rounded-3xl border border-slate-200/70 bg-white px-5 py-6 shadow-[0_20px_45px_-28px_rgba(14,58,87,0.35)] sm:px-6 sm:py-7",
            cardClassName,
          )}
        >
          {icon ? (
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f3fc] to-[#d4eaf8] text-[#1a5676] shadow-inner">
                {icon}
              </div>
            </div>
          ) : null}

          <h1 className="text-center text-2xl font-extrabold text-[#0e3a57]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-center text-sm leading-relaxed text-[#6b8396]">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-5 space-y-4">{children}</div>
        </section>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
}
