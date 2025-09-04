// Utilities to fix Next.js hydration issues

import React, { useEffect, useState } from 'react'

// Hook to safely use browser-only APIs
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

// Hook to safely get window dimensions
export function useWindowSize() {
  const isClient = useIsClient()
  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (!isClient) return

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [isClient])

  return windowSize
}

// Hook to safely use localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const isClient = useIsClient()
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

// Hook to safely use performance API
export function usePerformance() {
  const isClient = useIsClient()
  const [performance, setPerformance] = useState<Performance | null>(null)

  useEffect(() => {
    if (isClient && window.performance) {
      setPerformance(window.performance)
    }
  }, [isClient])

  return performance
}

// Utility function to create hydration-safe wrapper (use in React components)
export function createHydrationSafeWrapper() {
  // This would be used in React components, not in utility files
  return null
}

// Utility to safely execute code that might cause hydration mismatches
export function safeClientSideExecution<T>(
  clientCode: () => T,
  serverFallback: T
): T {
  if (typeof window === 'undefined') {
    return serverFallback
  }

  try {
    return clientCode()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.warn('Error in client-side code execution:', errorMessage)
    return serverFallback
  }
}

// Hook to detect hydration mismatches
export function useHydrationSafeState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  const safeSetState = (value: T | ((prev: T) => T)) => {
    if (hasHydrated) {
      setState(value)
    }
  }

  return [state, safeSetState, hasHydrated] as const
}

// Utility to create stable IDs for components to prevent hydration mismatches
let idCounter = 0
export function useStableId(prefix = 'id') {
  const [id] = useState(() => `${prefix}-${++idCounter}`)
  return id
}

// Hook to safely handle SVG elements that might cause hydration issues
export function useSafeSvg() {
  const isClient = useIsClient()
  const [svgSupported, setSvgSupported] = useState(false)

  useEffect(() => {
    if (isClient) {
      // Check if SVG is supported
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      setSvgSupported(!!svg.createSVGRect)
    }
  }, [isClient])

  return svgSupported
}

// Utility to handle dynamic imports safely
export function safeDynamicImport<T>(
  importFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (typeof window === 'undefined') {
    return Promise.resolve(fallback)
  }

  return importFn().catch((error) => {
    console.warn('Dynamic import failed:', error)
    return fallback
  })
}

// Hook to handle intersection observer safely
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const isClient = useIsClient()
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!isClient || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [isClient, ref, options])

  return isIntersecting
}

// Utility to create a stable reference that doesn't cause hydration mismatches
export function useStableCallback<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const callbackRef = React.useRef<T>(callback)
  const stableCallback = React.useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, [])

  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return stableCallback as T
}
