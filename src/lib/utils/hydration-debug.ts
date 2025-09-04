// Hydration debugging utilities
import React from 'react'

export function logHydrationInfo() {
  if (typeof window === 'undefined') {
    console.log('🔍 Server-side rendering')
    return
  }

  console.log('🔍 Client-side hydration')
  console.log('User Agent:', navigator.userAgent)
  console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`)
  console.log('Device Pixel Ratio:', window.devicePixelRatio)

  // Check for common browser extensions
  const extensions = [
    'Grammarly',
    'LastPass',
    'Dashlane',
    'Rainbow Wallet',
    'MetaMask',
    '1Password'
  ]

  extensions.forEach(ext => {
    if (navigator.userAgent.includes(ext) ||
        document.documentElement.innerHTML.includes(ext.toLowerCase())) {
      console.log(`🔌 Detected: ${ext}`)
    }
  })
}

export function detectHydrationMismatches() {
  if (typeof window === 'undefined') return

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const attr = mutation.attributeName
        if (attr?.startsWith('data-')) {
          console.log('⚠️ Attribute changed during hydration:', attr)
        }
      }
    })
  })

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
  })

  return () => observer.disconnect()
}

export function createHydrationSafeLogger() {
  const originalWarn = console.warn
  const originalError = console.error

  console.warn = (...args) => {
    const message = args.join(' ')
    if (message.includes('Extra attributes from the server') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed')) {
      console.info('🔇 Suppressed hydration warning:', message)
      return
    }
    originalWarn.apply(console, args)
  }

  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('Extra attributes from the server') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed') ||
        message.includes('Text content does not match server-rendered HTML')) {
      console.info('🔇 Suppressed hydration error:', message)
      return
    }
    originalError.apply(console, args)
  }

  return () => {
    console.warn = originalWarn
    console.error = originalError
  }
}

export function createHydrationBoundary(Component: React.ComponentType<Record<string, unknown>>) {
  return class HydrationBoundary extends React.Component {
    state = { hasError: false, isHydrationError: false }

    static getDerivedStateFromError(error: Error) {
      const isHydrationError = error.message.includes('Hydration') ||
                              error.message.includes('hydration') ||
                              error.message.includes('Extra attributes from the server') ||
                              error.message.includes('data-new-gr-c-s-check-loaded') ||
                              error.message.includes('data-gr-ext-installed')

      return {
        hasError: true,
        isHydrationError
      }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      if (this.state.isHydrationError) {
        console.info('🔇 Hydration error caught and suppressed:', error.message)
      } else {
        console.error('Error boundary caught error:', error, errorInfo)
      }
    }

    render() {
      if (this.state.hasError) {
        if (this.state.isHydrationError) {
          // Render the component anyway for hydration errors
          return React.createElement(Component, this.props)
        }

        return React.createElement('div', {
          className: 'p-4 border border-red-200 rounded bg-red-50'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-red-800 font-medium'
          }, 'Something went wrong'),
          React.createElement('p', {
            key: 'message',
            className: 'text-red-600 text-sm'
          }, 'Please refresh the page')
        ])
      }

      return React.createElement(Component, this.props)
    }
  }
}

export function useHydrationDebugger() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logHydrationInfo()
      const cleanup = detectHydrationMismatches()
      const restoreLogger = createHydrationSafeLogger()

      return () => {
        if (cleanup) cleanup()
        restoreLogger()
      }
    }
  }, [])
}

// Performance monitoring for hydration
export function useHydrationPerformance() {
  const [hydrationTime, setHydrationTime] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && typeof performance !== 'undefined') {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      if (navigation) {
        const hydrationStart = navigation.responseEnd
        const hydrationEnd = performance.now()
        const time = hydrationEnd - hydrationStart

        setHydrationTime(time)
        console.log(`⚡ Hydration completed in ${time.toFixed(2)}ms`)
      }
    }
  }, [])

  return hydrationTime
}

// Utility to check if we're in a browser environment safely
export function isBrowser(): boolean {
  return typeof window !== 'undefined' &&
         typeof window.document !== 'undefined' &&
         typeof window.navigator !== 'undefined'
}

// Safe localStorage access
export function safeLocalStorage() {
  if (!isBrowser()) return null

  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return localStorage
  } catch {
    // localStorage not available (private mode, etc.)
    return null
  }
}

// Safe sessionStorage access
export function safeSessionStorage() {
  if (!isBrowser()) return null

  try {
    const testKey = '__storage_test__'
    sessionStorage.setItem(testKey, 'test')
    sessionStorage.removeItem(testKey)
    return sessionStorage
  } catch {
    return null
  }
}
