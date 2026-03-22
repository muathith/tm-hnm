import React from "react"

interface UnifiedSpinnerProps {
  message?: string
  submessage?: string
}

export function UnifiedSpinner({ 
  message = "جاري المعالجة", 
  submessage = "الرجاء الانتظار...." 
}: UnifiedSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-[#1565c0]/95 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mx-auto mb-6"></div>
        <p className="text-white text-xl font-bold mb-2">{message}</p>
        <p className="text-blue-100 text-lg">{submessage}</p>
      </div>
    </div>
  )
}

export function SimpleSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1976d2] to-[#0d47a1] flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  )
}
