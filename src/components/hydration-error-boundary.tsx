'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a hydration-related error
    const isHydrationError = error.message.includes('Hydration') ||
                            error.message.includes('hydration') ||
                            error.message.includes('Extra attributes from the server') ||
                            error.message.includes('Text content does not match server-rendered HTML') ||
                            error.message.includes('data-new-gr-c-s-check-loaded') ||
                            error.message.includes('data-gr-ext-installed')

    if (isHydrationError) {
      // Suppress hydration errors by not updating state
      return { hasError: false }
    }

    // For other errors, show the error boundary
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if this is a hydration-related error
    const isHydrationError = error.message.includes('Hydration') ||
                            error.message.includes('hydration') ||
                            error.message.includes('Extra attributes from the server') ||
                            error.message.includes('Text content does not match server-rendered HTML') ||
                            error.message.includes('data-new-gr-c-s-check-loaded') ||
                            error.message.includes('data-gr-ext-installed')

    if (isHydrationError) {
      // Suppress hydration errors silently
      console.info('Hydration mismatch detected and suppressed:', error.message)
      return
    }

    // Log non-hydration errors
    this.setState({
      hasError: true,
      error,
      errorInfo
    })

    // Log error for debugging (but not hydration errors)
    console.error('Error caught by HydrationErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Only show error boundary for non-hydration errors
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for components that need hydration-safe rendering
export function useHydrationSafeState<T>(serverValue: T, clientValue?: T): T {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated ? (clientValue ?? serverValue) : serverValue
}

// Utility component for hydration-safe rendering
export function HydrationSafe({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated && fallback) {
    return <>{fallback}</>
  }

  return <>{children}</>
}