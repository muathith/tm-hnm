import React from "react";
import { 
  ShieldCheck, 
  Clock, 
  Building2, 
  Menu, 
  User, 
  Globe, 
  CarFront, 
  FileText, 
  CheckCircle2,
  Headset,
  Phone,
  Mail,
  Shield,
  Star,
  Zap,
  ChevronLeft
} from "lucide-react";

export function FormFirst() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] via-white to-[#f5f7fa] font-sans text-slate-800" dir="rtl">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1565c0] to-[#1976d2] text-white py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span>منصة تأميني مرخصة من البنك المركزي السعودي - ثقة وأمان</span>
      </div>

      {/* Minimal Header with Micro-badges for Stats */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-black text-[#1976d2] tracking-tighter">تأميني</div>
            
            {/* Stats Micro-badges in Header */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600 border-r border-slate-200 pr-4">
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                <span>مضمون 100%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>أقل من 3 دقائق</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <Building2 className="w-3.5 h-3.5" />
                <span>+25 شركة تأمين</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1976d2] transition-colors">
              <User className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#1976d2] transition-colors">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
            <button className="lg:hidden text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Form is the Hero */}
      <main className="container mx-auto px-4 pt-8 pb-32">
        <div className="max-w-4xl mx-auto">
          
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            
            {/* Card Header (Hero Message Condensed) */}
            <div className="bg-gradient-to-r from-[#1976d2] to-[#1e88e5] text-white p-6 md:p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">احصل على أفضل عروض تأمين السيارات</h1>
              <p className="text-blue-100 text-sm md:text-base relative z-10">قارن واشترِ تأمين سيارتك في خطوات بسيطة وموثوقة</p>
              
              {/* Compact Progress Bar */}
              <div className="mt-6 max-w-lg mx-auto relative z-10">
                <div className="flex justify-between text-xs text-blue-100 mb-2 font-medium px-1">
                  <span>البيانات الأساسية</span>
                  <span>المركبة</span>
                  <span>التغطية</span>
                  <span>الدفع</span>
                </div>
                <div className="h-2 bg-black/15 rounded-full overflow-hidden flex">
                  <div className="w-1/4 bg-white h-full rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Insurance Type Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-8 w-full max-w-sm mx-auto">
                <button className="flex-1 bg-white text-[#1976d2] shadow-sm font-bold py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  تأمين شامل
                </button>
                <button className="flex-1 text-slate-600 font-medium py-2.5 rounded-lg text-sm hover:text-slate-900 transition-all flex justify-center items-center gap-2">
                  <FileText className="w-4 h-4" />
                  تأمين ضد الغير
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">اسم المالك</label>
                  <input 
                    type="text" 
                    placeholder="الاسم الرباعي كما في الهوية"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] rounded-xl px-4 py-3 outline-none transition-all text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">رقم الهوية / الإقامة</label>
                  <input 
                    type="text" 
                    placeholder="أدخل رقم الهوية أو الإقامة"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] rounded-xl px-4 py-3 outline-none transition-all text-sm text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">نوع المركبة</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-200 focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] rounded-xl px-4 py-3 outline-none transition-all text-sm appearance-none cursor-pointer">
                      <option value="" disabled selected>اختر نوع المركبة</option>
                      <option value="sedan">سيدان</option>
                      <option value="suv">دفع رباعي</option>
                      <option value="truck">شاحنة</option>
                    </select>
                    <CarFront className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">الرقم التسلسلي</label>
                  <input 
                    type="text" 
                    placeholder="الرقم التسلسلي للمركبة"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] rounded-xl px-4 py-3 outline-none transition-all text-sm text-left"
                    dir="ltr"
                  />
                </div>
                
                <div className="md:col-span-2 mt-2">
                   <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded text-[#1976d2] focus:ring-[#1976d2] accent-[#1976d2]" />
                      <span className="text-sm font-medium text-slate-700">المشتري ليس هو مالك المركبة الحالي (نقل ملكية)</span>
                   </label>
                </div>
              </div>

              {/* Inline Trust Signals (Within Form) */}
              <div className="bg-blue-50/50 rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-around border border-blue-100/50">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium">أكثر من 5 مليون عميل</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium">إصدار فوري للوثيقة</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1976d2]" />
                  <span className="font-medium">معتمد من المرور</span>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group">
                إظهار عروض الأسعار
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
            </div>
          </div>
        </div>
      </main>

      {/* Compact Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-40 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] flex justify-between items-center px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-full hidden sm:block">
            <Headset className="w-5 h-5 text-[#1976d2]" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">تحتاج مساعدة؟</div>
            <div className="text-xs text-slate-500">فريق الدعم متواجد لخدمتك</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">راسلنا</span>
          </button>
          <button className="flex items-center gap-2 bg-[#1976d2] hover:bg-[#1565c0] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Phone className="w-4 h-4" />
            <span dir="ltr">800 123 4567</span>
          </button>
        </div>
      </div>
    </div>
  );
}
