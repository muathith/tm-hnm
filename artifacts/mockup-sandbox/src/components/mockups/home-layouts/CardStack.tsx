import React from "react";
import { 
  Shield, 
  Clock, 
  Building2, 
  CarFront, 
  User, 
  CreditCard, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Star,
  Menu,
  ChevronDown
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

export function CardStack() {
  return (
    <div className="min-h-screen bg-[#f0f5ff] text-slate-800 font-sans" dir="rtl">
      {/* Hero Background Layer */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-[#1565c0] via-[#1976d2] to-[#42a5f5] rounded-b-[40px] shadow-lg -z-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1565c0]/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-white/10 backdrop-blur-md text-white py-2 text-center text-sm font-medium border-b border-white/10">
        <p>المنصة الأولى المعتمدة لمقارنة أسعار التأمين في المملكة</p>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#1565c0]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">تأميني</span>
            </div>
            
            <nav className="hidden md:flex gap-8 text-white/90 font-medium">
              <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-white transition-colors">عن تأميني</a>
              <a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
              <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-white/90 hover:text-white font-medium flex items-center gap-1 transition-colors">
                English
              </button>
              <Button variant="outline" className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white border-transparent">
                <User className="w-4 h-4 ml-2" />
                تسجيل الدخول
              </Button>
              <button className="md:hidden text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero Content */}
        <div className="pt-16 pb-12 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-md">
            احصل على أفضل عروض<br />تأمين السيارات
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-sm mb-10">
            قارن واشترِ تأمين سيارتك في دقائق من أكثر من 25 شركة تأمين معتمدة
          </p>

          {/* Stats Ribbon inside Hero */}
          <div className="flex flex-wrap justify-center gap-8 text-white/90 backdrop-blur-sm bg-white/10 py-4 px-8 rounded-full inline-flex mx-auto border border-white/10 shadow-inner">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#42a5f5]" />
              <span className="font-semibold">موثوقية 100%</span>
            </div>
            <div className="w-px h-6 bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#42a5f5]" />
              <span className="font-semibold">يصدر في 3 دقائق</span>
            </div>
            <div className="w-px h-6 bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#42a5f5]" />
              <span className="font-semibold">+25 شركة تأمين</span>
            </div>
          </div>
        </div>

        {/* Main Form Card - Overlapping Hero */}
        <Card className="mt-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-0 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xl">
          {/* Progress Steps */}
          <div className="bg-slate-50 border-b flex overflow-x-auto no-scrollbar">
            {[
              { num: 1, label: "البيانات الأساسية", active: true },
              { num: 2, label: "المركبة", active: false },
              { num: 3, label: "السائقين", active: false },
              { num: 4, label: "التغطيات", active: false },
              { num: 5, label: "العروض", active: false },
              { num: 6, label: "الملخص", active: false },
              { num: 7, label: "الدفع", active: false },
            ].map((step) => (
              <div 
                key={step.num} 
                className={`flex-1 min-w-[120px] py-4 px-2 text-center border-b-2 transition-colors
                  ${step.active 
                    ? 'border-[#1976d2] bg-white text-[#1976d2]' 
                    : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
              >
                <div className="text-xs font-semibold mb-1">خطوة {step.num}</div>
                <div className="text-sm font-medium whitespace-nowrap">{step.label}</div>
              </div>
            ))}
          </div>

          <CardContent className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              {/* Form content */}
              <div className="grid gap-10">
                
                {/* Insurance Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#1976d2]" />
                    نوع التأمين
                  </h3>
                  <RadioGroup defaultValue="third-party" className="flex flex-col sm:flex-row gap-4">
                    <Label
                      htmlFor="third-party"
                      className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-[#1976d2] hover:bg-blue-50/50 transition-all [&:has([data-state=checked])]:border-[#1976d2] [&:has([data-state=checked])]:bg-blue-50/50"
                    >
                      <RadioGroupItem value="third-party" id="third-party" className="sr-only" />
                      <Shield className="w-8 h-8 mb-3 text-[#1976d2]" />
                      <span className="font-bold text-lg">ضد الغير</span>
                      <span className="text-sm text-slate-500 mt-1">تغطية الأضرار للطرف الثالث</span>
                    </Label>
                    <Label
                      htmlFor="comprehensive"
                      className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-[#1976d2] hover:bg-blue-50/50 transition-all [&:has([data-state=checked])]:border-[#1976d2] [&:has([data-state=checked])]:bg-blue-50/50"
                    >
                      <RadioGroupItem value="comprehensive" id="comprehensive" className="sr-only" />
                      <CarFront className="w-8 h-8 mb-3 text-[#1976d2]" />
                      <span className="font-bold text-lg">شامل</span>
                      <span className="text-sm text-slate-500 mt-1">تغطية كاملة للمركبتين</span>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Personal Info */}
                  <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#1976d2]" />
                      بيانات المالك
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="id-number" className="font-semibold">رقم الهوية / الإقامة</Label>
                      <Input 
                        id="id-number" 
                        placeholder="أدخل رقم الهوية المكون من 10 أرقام" 
                        className="h-12 bg-white rounded-xl border-slate-200 focus:border-[#1976d2] focus:ring-[#1976d2]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="font-semibold">تاريخ الميلاد</Label>
                      <div className="flex gap-2">
                        <select className="flex-1 h-12 rounded-xl border-slate-200 border bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] focus:border-transparent">
                          <option>السنة</option>
                        </select>
                        <select className="flex-1 h-12 rounded-xl border-slate-200 border bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] focus:border-transparent">
                          <option>الشهر</option>
                        </select>
                        <select className="flex-1 h-12 rounded-xl border-slate-200 border bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] focus:border-transparent">
                          <option>اليوم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <CarFront className="w-5 h-5 text-[#1976d2]" />
                      بيانات المركبة
                    </h3>
                    
                    <div className="space-y-4">
                      <Label className="font-semibold">تسجيل المركبة</Label>
                      <RadioGroup defaultValue="registered" className="flex gap-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="registered" id="registered" />
                          <Label htmlFor="registered" className="cursor-pointer">بطاقة جمركية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="customs" id="customs" />
                          <Label htmlFor="customs" className="cursor-pointer">نقل ملكية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <Label htmlFor="transfer" className="cursor-pointer">تجديد</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serial" className="font-semibold">الرقم التسلسلي للمركبة</Label>
                      <Input 
                        id="serial" 
                        placeholder="أدخل الرقم التسلسلي" 
                        className="h-12 bg-white rounded-xl border-slate-200 focus:border-[#1976d2] focus:ring-[#1976d2]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t flex justify-end">
                  <Button className="h-14 px-12 text-lg font-bold bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1">
                    إظهار عروض الأسعار
                  </Button>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Section - Single Wide Card */}
        <Card className="mt-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-0 rounded-3xl overflow-hidden bg-white p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x md:divide-x-reverse divide-slate-100">
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-blue-50 text-[#1976d2] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Star className="w-8 h-8 fill-current" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">4.9/5</h4>
              <p className="text-slate-500 font-medium">تقييم العملاء</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-blue-50 text-[#1976d2] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">مرخص ومعتمد</h4>
              <p className="text-slate-500 font-medium">من البنك المركزي السعودي</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-blue-50 text-[#1976d2] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">+5 مليون</h4>
              <p className="text-slate-500 font-medium">وثيقة مصدرة</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-blue-50 text-[#1976d2] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <CreditCard className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">دفع آمن</h4>
              <p className="text-slate-500 font-medium">خيارات دفع متعددة وموثوقة</p>
            </div>
          </div>
        </Card>

        {/* Help CTA Card */}
        <Card className="mt-8 shadow-xl shadow-blue-900/5 border-0 rounded-3xl overflow-hidden bg-gradient-to-r from-[#1976d2] to-[#42a5f5] text-white">
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-right flex-1">
              <h3 className="text-3xl font-bold mb-3">تحتاج مساعدة؟</h3>
              <p className="text-white/90 text-lg">فريق خدمة العملاء متواجد على مدار الساعة لمساعدتك والإجابة على استفساراتك.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button variant="secondary" className="bg-white text-[#1976d2] hover:bg-slate-50 h-14 px-8 rounded-xl font-bold text-lg shadow-md">
                <Phone className="w-5 h-5 ml-2" />
                800 123 4567
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-xl font-bold text-lg bg-transparent">
                <Mail className="w-5 h-5 ml-2" />
                راسلنا
              </Button>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
