import React from "react";
import { 
  ShieldCheck, 
  Clock, 
  Building2, 
  Phone, 
  Mail, 
  CarFront, 
  ChevronLeft,
  CheckCircle2,
  ThumbsUp,
  Headset,
  Award,
  CreditCard,
  User,
  Hash,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export function SplitScreen() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#f0f5ff] via-white to-[#f5f7fa] font-sans text-slate-800">
      {/* 1. Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1565c0] to-[#1976d2] text-white py-2 px-4 text-sm text-center font-medium">
        أكثر من 5 ملايين مستخدم يثقون في تأميني لمقارنة وشراء تأمين السيارات
      </div>

      {/* 2. Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-[#1976d2]">تأميني</div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="text-[#1976d2] border-b-2 border-[#1976d2] pb-5 pt-5">تأمين السيارات</a>
              <a href="#" className="hover:text-[#1976d2] transition-colors pb-5 pt-5">تأمين طبي</a>
              <a href="#" className="hover:text-[#1976d2] transition-colors pb-5 pt-5">المدونة</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-[#1976d2] transition-colors">English</button>
            <Button variant="outline" className="border-[#1976d2] text-[#1976d2] hover:bg-[#1976d2] hover:text-white transition-colors">
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* RIGHT COLUMN (Content & Persuasion - Arabic RTL means this is on the right visually) */}
          <div className="w-full lg:w-[45%] flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                احصل على <span className="text-[#1976d2]">أفضل عروض</span> تأمين السيارات
              </h1>
              <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                قارن بين أكثر من 25 شركة تأمين معتمدة واشترِ وثيقتك في دقائق معدودة.
              </p>
            </div>

            {/* Stats Integrated into Hero */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2">
                <div className="bg-blue-50 text-[#1976d2] p-2 rounded-full">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-xl font-bold text-slate-800">100%</div>
                <div className="text-xs text-slate-500 font-medium">مضمون وموثوق</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2">
                <div className="bg-blue-50 text-[#1976d2] p-2 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-xl font-bold text-slate-800">3 دقائق</div>
                <div className="text-xs text-slate-500 font-medium">لإصدار الوثيقة</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2">
                <div className="bg-blue-50 text-[#1976d2] p-2 rounded-full">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-xl font-bold text-slate-800">+25</div>
                <div className="text-xs text-slate-500 font-medium">شركة تأمين</div>
              </div>
            </div>

            {/* Compact Trust Signals */}
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">لماذا تأميني؟</h3>
              
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-50 text-green-600 p-2 rounded-md">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">الأفضل تقييماً</h4>
                  <p className="text-xs text-slate-500">منصة مقارنة التأمين الأولى في المملكة</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-50 text-purple-600 p-2 rounded-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">مرخص ومعتمد</h4>
                  <p className="text-xs text-slate-500">مرخص من البنك المركزي السعودي (ساما)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-orange-50 text-orange-600 p-2 rounded-md">
                  <Headset className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">دعم متواصل</h4>
                  <p className="text-xs text-slate-500">فريق خدمة عملاء جاهز لمساعدتك دائماً</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">تجربة سهلة</h4>
                  <p className="text-xs text-slate-500">خطوات بسيطة وواضحة لإصدار وثيقتك</p>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT COLUMN (Form Area - takes ~55% width) */}
          <div className="w-full lg:w-[55%] relative">
            {/* Background accent block behind form */}
            <div className="absolute -inset-4 bg-[#1976d2]/5 rounded-[2rem] transform rotate-1 -z-10 hidden lg:block"></div>
            
            <Card className="border-0 shadow-2xl shadow-blue-900/5 bg-white overflow-hidden rounded-2xl relative z-10">
              <div className="h-2 w-full bg-gradient-to-r from-[#1976d2] to-[#42a5f5]"></div>
              
              {/* Form Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-[#1976d2] p-2 rounded-lg text-white">
                    <CarFront className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">تسعير التأمين</h2>
                    <p className="text-xs text-slate-500">ادخل بياناتك للحصول على التسعيرة</p>
                  </div>
                </div>
                
                {/* Step Indicator */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 rounded-full ${step === 1 ? 'w-6 bg-[#1976d2]' : 'w-2 bg-slate-200'}`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-[#1976d2] mr-2">الخطوة 1 من 7</span>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-8">
                {/* Insurance Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">نوع التأمين المطلوب</Label>
                  <RadioGroup defaultValue="third-party" className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <RadioGroupItem value="third-party" id="third-party" className="peer sr-only" />
                      <Label
                        htmlFor="third-party"
                        className="flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer bg-white border-slate-200 hover:bg-slate-50 peer-data-[state=checked]:border-[#1976d2] peer-data-[state=checked]:bg-blue-50/50 transition-all"
                      >
                        <ShieldCheck className="w-6 h-6 mb-2 text-slate-500 peer-data-[state=checked]:text-[#1976d2]" />
                        <span className="font-semibold text-slate-700">تأمين ضد الغير</span>
                      </Label>
                      <div className="absolute top-3 right-3 hidden peer-data-[state=checked]:block">
                        <CheckCircle2 className="w-4 h-4 text-[#1976d2]" />
                      </div>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="comprehensive" id="comprehensive" className="peer sr-only" />
                      <Label
                        htmlFor="comprehensive"
                        className="flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer bg-white border-slate-200 hover:bg-slate-50 peer-data-[state=checked]:border-[#1976d2] peer-data-[state=checked]:bg-blue-50/50 transition-all"
                      >
                        <Award className="w-6 h-6 mb-2 text-slate-500 peer-data-[state=checked]:text-[#1976d2]" />
                        <span className="font-semibold text-slate-700">تأمين شامل</span>
                      </Label>
                      <div className="absolute top-3 right-3 hidden peer-data-[state=checked]:block">
                        <CheckCircle2 className="w-4 h-4 text-[#1976d2]" />
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-6">
                  {/* Owner Type Tabs */}
                  <Tabs defaultValue="national" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-4 h-12 bg-slate-100/80 p-1 rounded-xl">
                      <TabsTrigger value="national" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1976d2] data-[state=active]:shadow-sm text-sm font-medium">
                        هوية وطنية / إقامة
                      </TabsTrigger>
                      <TabsTrigger value="company" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1976d2] data-[state=active]:shadow-sm text-sm font-medium">
                        رقم 700 / شركة
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* ID Input */}
                  <div className="space-y-2">
                    <Label htmlFor="identity" className="text-sm font-semibold text-slate-700 flex justify-between">
                      <span>رقم الهوية / الإقامة</span>
                      <span className="text-xs text-slate-400 font-normal">مالك المركبة</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      </div>
                      <Input 
                        id="identity" 
                        placeholder="1xxxxxxxxx أو 2xxxxxxxxx" 
                        className="pl-3 pr-10 h-12 text-lg text-left dir-ltr bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2]"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Vehicle Registration Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">نوع التسجيل</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-12 border-[#1976d2] bg-blue-50/50 text-[#1976d2] hover:bg-blue-50 font-medium justify-start px-3">
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                          استمارة
                        </Button>
                        <Button variant="outline" className="h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">
                          بطاقة جمركية
                        </Button>
                      </div>
                    </div>

                    {/* Serial Number */}
                    <div className="space-y-2">
                      <Label htmlFor="serial" className="text-sm font-semibold text-slate-700 flex justify-between">
                        <span>الرقم التسلسلي</span>
                        <Info className="w-4 h-4 text-slate-400 cursor-pointer hover:text-[#1976d2]" />
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Hash className="w-5 h-5 text-slate-400" />
                        </div>
                        <Input 
                          id="serial" 
                          placeholder="الرقم التسلسلي للمركبة" 
                          className="pl-3 pr-10 h-12 text-lg text-left dir-ltr bg-slate-50 border-slate-200 focus:bg-white"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button className="w-full h-14 text-lg font-bold bg-[#1976d2] hover:bg-[#1565c0] shadow-lg shadow-blue-500/30 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <span>أظهر العروض</span>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  بياناتك محمية ومشفرة بأعلى معايير الأمان
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 7. Help CTA (Full Width Bottom) */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 text-white mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <h2 className="text-2xl font-bold">هل تحتاج إلى مساعدة؟</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                فريق خدمة العملاء لدينا جاهز للرد على استفساراتك ومساعدتك في اختيار التأمين الأنسب لك على مدار الساعة.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Button className="w-full sm:w-auto h-12 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 rounded-xl flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#1976d2]" />
                <span dir="ltr">800 118 4040</span>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-12 border-slate-600 text-white hover:bg-slate-700/50 font-semibold px-6 rounded-xl flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>راسلنا</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
