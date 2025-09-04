'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import Monaco Editor to prevent SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-sm text-muted-foreground">Loading code editor...</p>
      </div>
    </div>
  ),
})

interface MonacoWrapperProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  theme?: string
  options?: Record<string, unknown>
  className?: string
}

export function MonacoWrapper({
  value,
  onChange,
  language = 'typescript',
  theme = 'light',
  options = {},
  className = '',
}: MonacoWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [editorValue, setEditorValue] = useState(value)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setEditorValue(value)
    }
  }, [value, mounted])

  const handleEditorChange = (val: string | undefined) => {
    setEditorValue(val || '')
    onChange?.(val)
  }

  // Don't render anything until mounted to prevent hydration mismatches
  if (!mounted) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Preparing editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full ${className}`}>
      <MonacoEditor
        height="100%"
        language={language}
        value={editorValue}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          quickSuggestions: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          bracketPairColorization: { enabled: true },
          // Disable problematic features that can cause hydration issues
          renderValidationDecorations: 'off',
          renderWhitespace: 'selection',
          // Ensure consistent rendering
          wordBasedSuggestions: 'off',
          ...options,
        }}
        loading={
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground">Loading Monaco Editor...</p>
            </div>
          </div>
        }
        onMount={(editor, monaco) => {
          // Configure Monaco to prevent hydration issues
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            allowNonTsExtensions: true,
          })

          // Suppress Monaco-specific warnings
          const originalWarn = console.warn
          console.warn = (...args) => {
            const message = args.join(' ')
            // Suppress Monaco hydration-related warnings
            if (
              message.includes('Could not create web worker') ||
              message.includes('Monaco Editor') ||
              message.includes('hydration')
            ) {
              return
            }
            originalWarn.apply(console, args)
          }

          // Cleanup on unmount
          return () => {
            console.warn = originalWarn
          }
        }}
      />
    </div>
  )
}
