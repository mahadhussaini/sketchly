'use client'

import { useState, useMemo, useEffect } from 'react'
import * as React from 'react'
import { AlertCircle } from 'lucide-react'

interface ComponentPreviewProps {
  code: string
  componentName: string
}

interface BabelOptions {
  presets?: unknown[]
  plugins?: unknown[]
  filename?: string
}

declare global {
  interface Window {
    Babel: {
      transform: (code: string, options: BabelOptions) => { code: string }
    }
  }
}

export function ComponentPreview({ code, componentName }: ComponentPreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [babelLoaded, setBabelLoaded] = useState(false)

  // Load Babel standalone for JSX transformation
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!window.Babel) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@babel/standalone/babel.min.js'
      script.async = true
      script.onload = () => {
        if (window.Babel) {
          setBabelLoaded(true)
          setIsLoading(false)
        }
      }
      script.onerror = () => {
        setError('Failed to load Babel transpiler. Please check your internet connection.')
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } else {
      setBabelLoaded(true)
      setIsLoading(false)
    }
  }, [])

  // Memoized component rendering
  const RenderedComponent = useMemo(() => {
    try {
      if (!code || !code.trim()) {
        throw new Error('No code provided to preview')
      }

      if (!babelLoaded || !window.Babel) {
        return null // Still loading Babel
      }

      setError(null)

      // Clean up the code for safe evaluation
      const cleanCode = code
        .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '') // Remove import statements  
        .replace(/^export\s+(default\s+)?/gm, '') // Remove export statements
        .trim()

      // Ensure we have a valid component structure
      if (!cleanCode.includes('function') && !cleanCode.includes('const') && !cleanCode.includes('=>')) {
        throw new Error('Invalid component structure: component must be a function or const declaration')
      }

      // Try to extract component name from code if not provided
      let actualComponentName = componentName
      const functionMatch = cleanCode.match(/(?:function|const|var|let)\s+(\w+)\s*[=\(]/)
      if (functionMatch) {
        actualComponentName = functionMatch[1]
      }

      // Transpile JSX to JavaScript using Babel
      let transpiledCode: string
      try {
        const result = window.Babel.transform(cleanCode, {
          presets: [['react', { runtime: 'automatic' }]],
          filename: `${componentName}.tsx`
        })
        transpiledCode = result.code
      } catch (transpileError) {
        console.error('Babel transform error:', transpileError)
        throw new Error(`JSX transpilation failed: ${transpileError instanceof Error ? transpileError.message : 'Unknown error'}`)
      }

      // Wrap the transpiled code to return the component
      // Add React import and ensure the component is exported
      const wrappedCode = `
        const React = arguments[0];
        const useState = arguments[1];
        const useEffect = arguments[2];
        const useMemo = arguments[3];
        const useCallback = arguments[4];
        
        ${transpiledCode}
        
        return typeof ${actualComponentName} !== 'undefined' ? ${actualComponentName} : null;
      `

      // Create and execute the function
      const componentFactory = new Function('React', 'useState', 'useEffect', 'useMemo', 'useCallback', wrappedCode)
      
      const Component = componentFactory(
        React,
        React.useState,
        React.useEffect,
        React.useMemo,
        React.useCallback
      )

      if (!Component || typeof Component !== 'function') {
        throw new Error(`Component "${actualComponentName}" not found or is not a function`)
      }

      return Component

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Component preview error:', errorMessage, err, { code: code.substring(0, 200) })
      setError(errorMessage)
      return null
    }
  }, [code, componentName, babelLoaded])

  // Update loading state based on Babel and component
  useEffect(() => {
    if (babelLoaded && RenderedComponent) {
      setIsLoading(false)
    } else if (!babelLoaded) {
      setIsLoading(true)
    }
  }, [babelLoaded, RenderedComponent])

  if (isLoading && !babelLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading preview engine...</p>
        </div>
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
          <p className="text-sm text-red-500 dark:text-red-300 mb-4 break-words">
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
          {isLoading && (
            <div className="mt-2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          )}
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
