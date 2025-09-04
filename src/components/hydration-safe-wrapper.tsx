'use client'

import { useEffect, useState } from 'react'

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HydrationSafeWrapper({ children, fallback }: HydrationSafeWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback || <div className="min-h-screen bg-background" />
  }

  return <>{children}</>
}