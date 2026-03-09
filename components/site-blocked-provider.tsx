"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, Firestore } from "firebase/firestore"
import { WifiOff, RefreshCw, ShieldAlert } from "lucide-react"

export function SiteBlockedProvider({ children }: { children: React.ReactNode }) {
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const visitorId = localStorage.getItem("visitor") || localStorage.getItem("visitor_id")
    if (!visitorId || !db) return

    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (snap) => {
        if (snap.exists() && snap.data().isBlocked === true) {
          setIsBlocked(true)
        } else {
          setIsBlocked(false)
        }
      },
      (err) => console.error("[SiteBlockedProvider]", err)
    )

    return () => unsubscribe()
  }, [])

  return (
    <>
      {children}
      {isBlocked && <BlockedOverlay />}
    </>
  )
}

function BlockedOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      dir="rtl"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8edf2 50%, #dce4ec 100%)",
      }}
    >
      {/* Subtle top bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-[#f4ad27] via-[#1a9fd4] to-[#0e3a57]" />

      <div className="w-full max-w-sm px-6 flex flex-col items-center text-center space-y-6">

        {/* Icon cluster */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer faint ring */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-200 animate-pulse" />
          {/* Inner ring */}
          <div className="absolute inset-3 rounded-full border border-slate-200" />
          {/* Center card */}
          <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center">
            <WifiOff className="w-7 h-7 text-slate-400" />
          </div>
        </div>

        {/* Logo */}
        <img src="/logo-0.svg" alt="بي كير" className="h-8 w-auto opacity-70" />

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-800">
            الخدمة غير متاحة حالياً
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            نعتذر، يبدو أن هذه الصفحة غير متاحة في الوقت الحالي.
            <br />
            يرجى المحاولة مجدداً في وقت لاحق.
          </p>
        </div>

        {/* Error code pill */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-400 tracking-wider">
            503 · SERVICE UNAVAILABLE
          </span>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all"
          style={{
            background: "linear-gradient(135deg, #f4ad27, #e09a18)",
            color: "#1a3d52",
            boxShadow: "0 6px 20px rgba(244,173,39,0.3)",
          }}
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>

        {/* Support line */}
        <p className="text-[11px] text-slate-400">
          للمساعدة:{" "}
          <a href="tel:8001180044" className="font-bold text-[#1a5676] hover:underline">
            8001180044
          </a>
        </p>
      </div>

      {/* Bottom subtle decoration */}
      <div className="absolute bottom-6 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full bg-slate-300"
            style={{
              width: i === 1 ? "20px" : "6px",
              height: "6px",
            }}
          />
        ))}
      </div>
    </div>
  )
}
