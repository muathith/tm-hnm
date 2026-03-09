"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { initializeVisitorTracking, updateVisitorPage } from "@/lib/visitor-tracking"

const pageStepMap: Record<string, number> = {
  "/home-new": 1,
  "/insur": 2,
  "/compar": 3,
  "/check": 4,
  "/step2": 5,
  "/step3": 6,
  "/step4": 7,
  "/step5": 8,
  "/step6": 9,
  "/finalOtp": 10,
}

export function useOnlineTracking() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/dashboard") return

    const visitorId =
      (typeof window !== "undefined"
        ? localStorage.getItem("visitor") || localStorage.getItem("visitor_id")
        : null) || ""
    if (!visitorId) return

    const init = async () => {
      await initializeVisitorTracking(visitorId)
      const step = pageStepMap[pathname] || 1
      const pageName = pathname.replace("/", "") || "home"
      await updateVisitorPage(visitorId, pageName, step)
    }

    init()
  }, [pathname])
}
