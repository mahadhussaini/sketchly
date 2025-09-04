'use client'

import { useEffect } from 'react'
import { HydrationErrorBoundary } from '@/components/hydration-error-boundary'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Application Error:', error)
  }, [error])

  // Check if this is a hydration error
  const isHydrationError =
    error.message.includes('Extra attributes from the server') ||
    error.message.includes('Hydration') ||
    error.message.includes('Server and client') ||
    error.message.includes('data-new-gr-c-s-check-loaded') ||
    error.message.includes('data-gr-ext-installed')

  if (isHydrationError) {
    return (
      <HydrationErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Hydration Issue Detected
            </h1>
            <p className="text-muted-foreground mb-6">
              This appears to be caused by browser extensions interfering with the page rendering.
              We&apos;ve automatically cleaned up the issue.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  // Clean up and reload
                  const extensionElements = document.querySelectorAll(
                    'grammarly-extension, grammarly-shadow-root, [data-grammarly-shadow-root]'
                  )
                  extensionElements.forEach(el => el.remove())

                  const attributes = [
                    'data-new-gr-c-s-check-loaded',
                    'data-gr-ext-installed',
                    'data-grammarly-shadow-root'
                  ]

                  attributes.forEach(attr => {
                    document.body.removeAttribute(attr)
                    document.documentElement.removeAttribute(attr)
                  })

                  setTimeout(() => window.location.reload(), 100)
                }}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Clean & Reload
              </button>

              <button
                onClick={reset}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Try Again
              </button>
            </div>

            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                {error.message}
                {error.stack && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          </div>
        </div>
      </HydrationErrorBoundary>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>

        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
            Error Details
          </summary>
          <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
            {error.message}
            {error.stack && (
              <>
                {'\n\nStack Trace:\n'}
                {error.stack}
              </>
            )}
          </pre>
        </details>
      </div>
    </div>
  )
}
