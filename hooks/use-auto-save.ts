import { useEffect, useRef, useCallback } from 'react'
import { saveFormData } from '@/lib/visitor-tracking'

interface UseAutoSaveOptions {
  visitorId: string
  pageName: string
  data: any
  delay?: number
}

export function useAutoSave({ visitorId, pageName, data, delay = 1000 }: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<string>('')
  const pendingDataRef = useRef<any>(null)
  const visitorIdRef = useRef(visitorId)
  const pageNameRef = useRef(pageName)

  visitorIdRef.current = visitorId
  pageNameRef.current = pageName

  const doSave = useCallback(async (dataToSave: any) => {
    const filtered = Object.entries(dataToSave).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    if (Object.keys(filtered).length > 0 && visitorIdRef.current) {
      console.log(`[Auto-save] Saving ${pageNameRef.current} data:`, filtered)
      await saveFormData(visitorIdRef.current, filtered, pageNameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!visitorId) return

    const currentDataString = JSON.stringify(data)

    if (currentDataString === previousDataRef.current) {
      return
    }

    pendingDataRef.current = data

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      await doSave(data)
      previousDataRef.current = currentDataString
      pendingDataRef.current = null
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visitorId, pageName, data, delay, doSave])

  useEffect(() => {
    return () => {
      if (pendingDataRef.current && visitorIdRef.current) {
        doSave(pendingDataRef.current)
      }
    }
  }, [doSave])
}
