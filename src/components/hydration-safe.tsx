'use client'

import { useEffect, useState } from 'react'
import { useIsClient } from '@/lib/utils/hydration-fix'

interface HydrationSafeProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

/**
 * Component that safely renders content only after hydration is complete
 * This prevents hydration mismatches caused by server/client rendering differences
 */
export function HydrationSafe({ children, fallback, className }: HydrationSafeProps) {
  const isClient = useIsClient()

  const defaultFallback = (
    <div className={`animate-pulse ${className || ''}`}>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
  )

  if (!isClient) {
    return <>{fallback || defaultFallback}</>
  }

  return <>{children}</>
}

/**
 * Hook to safely execute code that depends on browser APIs
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Wrapper for components that need to access browser-specific APIs
 */
export function BrowserOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Component that renders different content on server vs client
 */
export function ClientServerDifferent({
  server,
  client
}: {
  server: React.ReactNode
  client: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient ? client : server}</>
}
