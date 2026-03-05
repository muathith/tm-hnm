export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#062338] via-[#0e3a57] to-[#1a5676]">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[#f4ad27]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Spinner rings + logo */}
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Outer slow ring */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ animation: "spin-slow 3s linear infinite" }}
            viewBox="0 0 128 128"
          >
            <circle
              cx="64" cy="64" r="60"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />
            <circle
              cx="64" cy="64" r="60"
              fill="none"
              stroke="url(#ringOuter)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 318"
            />
            <defs>
              <linearGradient id="ringOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4ad27" stopOpacity="1" />
                <stop offset="100%" stopColor="#f4ad27" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner faster ring */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ animation: "spin-rev 1.8s linear infinite", inset: "12px", width: "calc(100% - 24px)", height: "calc(100% - 24px)" }}
            viewBox="0 0 104 104"
          >
            <circle
              cx="52" cy="52" r="48"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />
            <circle
              cx="52" cy="52" r="48"
              fill="none"
              stroke="url(#ringInner)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="40 262"
            />
            <defs>
              <linearGradient id="ringInner" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a9fd4" />
                <stop offset="100%" stopColor="#1a9fd4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Logo center card */}
          <div
            className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <img
              src="/logo-0.svg"
              alt="بي كير"
              className="w-14 h-auto brightness-0 invert"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Orbiting dot */}
          <div
            className="absolute w-3 h-3"
            style={{ animation: "orbit 2s linear infinite", transformOrigin: "64px 64px" }}
          >
            <div className="w-3 h-3 rounded-full bg-[#f4ad27] shadow-lg shadow-amber-500/50" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p
            className="text-white text-base font-black tracking-wide"
            style={{ animation: "pulse-text 2s ease-in-out infinite" }}
          >
            جاري التحميل...
          </p>

          {/* Animated dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === 1 || i === 2 ? "6px" : "4px",
                  height: i === 1 || i === 2 ? "6px" : "4px",
                  backgroundColor: "#f4ad27",
                  animation: `bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-44 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #1a9fd4, #f4ad27)",
              animation: "progress-sweep 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes progress-sweep {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 65%;  margin-left: 0; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
