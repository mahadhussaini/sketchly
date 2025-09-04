'use client'

import { useState, useMemo } from 'react'
import * as React from 'react'
import { AlertCircle } from 'lucide-react'

interface ComponentPreviewProps {
  code: string
  componentName: string
}

export function ComponentPreview({ code, componentName }: ComponentPreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Memoized component rendering
  const RenderedComponent = useMemo(() => {
    try {
      setError(null)
      setIsLoading(true)

      // Clean up the code for safe evaluation
      const cleanCode = code
        .replace(/^import.*$/gm, '') // Remove import statements
        .replace(/^export\s+(default\s+)?/gm, '') // Remove export statements
        .trim()

      // Create a safe function that returns the component
      const componentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        'useMemo',
        'useCallback',
        `
        try {
          ${cleanCode}
          return ${componentName};
        } catch (error) {
          throw new Error('Component compilation failed: ' + error.message);
        }
        `
      )

      // Execute the function with React hooks
      const Component = componentFunction(
        React,
        React.useState,
        React.useEffect,
        React.useMemo,
        React.useCallback
      )

      setIsLoading(false)
      
      return Component

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setIsLoading(false)
      return null
    }
  }, [code, componentName])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
            Preview Error
          </h3>
          <p className="text-sm text-red-500 dark:text-red-300 mb-4">
            {error}
          </p>
          <div className="text-xs text-muted-foreground">
            Try regenerating the code or editing it manually to fix syntax issues.
          </div>
        </div>
      </div>
    )
  }

  if (!RenderedComponent) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="text-center">
          <div className="text-muted-foreground">No component to preview</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[200px]">
      <ErrorBoundary>
        <div className="p-4">
          <RenderedComponent />
        </div>
      </ErrorBoundary>
    </div>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component preview error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[200px] p-8">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              Render Error
            </h3>
            <p className="text-sm text-red-500 dark:text-red-300 mb-4">
              {this.state.error?.message || 'Component failed to render'}
            </p>
            <div className="text-xs text-muted-foreground">
              Check the component code for runtime errors.
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
