"use client";

import Link from "next/link";

export function LegalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600" dir="rtl">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-black text-[#1976d2]">تأميني</span>
          <img src="/tameeni-logo.webp" alt="تأميني" className="h-8 w-8 rounded-xl" />
        </div>

        {/* Social icons row */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs text-slate-500">تابع تأميني</span>
          {/* YouTube */}
          <a href="#" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
            </svg>
          </a>
          {/* Snapchat */}
          <a href="#" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.007 2C8.3 2 5.24 5.06 5.24 8.77v.45c-.48.14-.97.2-1.47.2-.36 0-.73-.04-1.08-.1l-.22-.04-.07.22c-.09.27-.13.55-.13.83 0 .8.37 1.52.97 2.01-.1.06-.19.13-.27.21-.28.27-.43.63-.43 1.02 0 .68.4 1.29 1.03 1.58-.03.14-.05.28-.05.43 0 1.1.67 2.06 1.67 2.46-.4.6-.98 1.01-1.66 1.19l-.35.09.11.34c.15.46.55.78 1.03.82.18.02.36.02.54.01-.37.5-.55 1.1-.55 1.7v.16h.16c.82 0 1.6-.18 2.32-.53.55.16 1.12.24 1.7.24 1.04 0 2.04-.26 2.9-.73.86.47 1.86.73 2.9.73.58 0 1.15-.08 1.7-.24.72.35 1.5.53 2.32.53h.16v-.16c0-.6-.18-1.2-.55-1.7.18.01.36.01.54-.01.48-.04.88-.36 1.03-.82l.11-.34-.35-.09c-.68-.18-1.26-.59-1.66-1.19 1-.4 1.67-1.36 1.67-2.46 0-.15-.02-.29-.05-.43.63-.29 1.03-.9 1.03-1.58 0-.39-.15-.75-.43-1.02-.08-.08-.17-.15-.27-.21.6-.49.97-1.21.97-2.01 0-.28-.04-.56-.13-.83l-.07-.22-.22.04c-.35.06-.72.1-1.08.1-.5 0-.99-.06-1.47-.2v-.45C18.76 5.06 15.7 2 12.007 2z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* X/Twitter */}
          <a href="#" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        {/* Developer credit */}
        <div className="text-center">
          <span className="text-xs text-slate-400">تطوير وتشغيل: </span>
          <span className="text-xs font-bold text-slate-500">rasan</span>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <Link href="/privacy" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            الخصوصية
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/terms" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            الشروط
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/cookies" className="text-slate-400 hover:text-[#1976d2] transition-colors">
            الكوكيز
          </Link>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => {
              localStorage.removeItem("cookie_consent");
              window.location.reload();
            }}
            className="text-slate-400 hover:text-[#1976d2] transition-colors"
          >
            إعدادات الكوكيز
          </button>
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] text-slate-400 leading-relaxed">
          © تأميني {currentYear}. جميع الحقوق محفوظة لوساطة تأميني لوساطة التأمين شركة شخص واحد
        </p>
      </div>
    </footer>
  );
}
