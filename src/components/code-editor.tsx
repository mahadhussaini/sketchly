'use client'

import { useState, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import {
  Download,
  Copy,
  Zap,
  RefreshCw,
  Wand2,
  History,
  Code2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSketchStore } from '@/store/sketch-store'
import { useVersionHistoryStore } from '@/store/version-history-store'
import { VersionHistory } from '@/components/version-history'
import { generateCodeFromAnalysis } from '@/lib/ai/generate-code'
import { formatJSXCode, validateJSXSyntax } from '@/lib/utils/formatter'
import toast from 'react-hot-toast'

export function CodeEditor() {
  const { theme } = useTheme()
  const {
    currentSketch,
    generatedCode,
    setGeneratedCode,
    updateGeneratedCode,
    isGenerating,
    setGenerating
  } = useSketchStore()

  const {
    initializeHistory,
    addVersion,
    hasUnsavedChanges,
    setCurrentProject
  } = useVersionHistoryStore()

  const [editorValue, setEditorValue] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const handleGenerateCode = useCallback(async () => {
    if (!currentSketch?.analysis) {
      toast.error('No sketch analysis available')
      return
    }

    setGenerating(true)

    try {
      const code = await generateCodeFromAnalysis(
        currentSketch.analysis,
        currentSketch.name.replace(/\.[^/.]+$/, '') // Remove file extension
      )

      setGeneratedCode(code)
      toast.success('Code generated successfully!')
    } catch (_error) {
      console.error('Error generating code:', _error)
      toast.error('Failed to generate code')
    } finally {
      setGenerating(false)
    }
  }, [currentSketch, setGenerating, setGeneratedCode])

  // Initialize editor with generated code
  useEffect(() => {
    if (generatedCode?.jsx && generatedCode.jsx.trim()) {
      // Only update if the code is different to avoid unnecessary re-renders
      if (editorValue !== generatedCode.jsx) {
        setEditorValue(generatedCode.jsx)
        setIsModified(false)
      }
    } else if (generatedCode && (!generatedCode.jsx || !generatedCode.jsx.trim())) {
      // If generatedCode exists but jsx is empty, show empty editor
      setEditorValue('')
    }
  }, [generatedCode?.jsx])

  // Generate initial code if we have a sketch but no code
  useEffect(() => {
    if (currentSketch?.analysis && !generatedCode && !isGenerating) {
      handleGenerateCode()
    }
  }, [currentSketch, generatedCode, isGenerating, handleGenerateCode])

  // Initialize version history when component is generated
  useEffect(() => {
    if (generatedCode?.jsx && currentSketch?.id) {
      initializeHistory(currentSketch.id, generatedCode.jsx, generatedCode.componentName)
      setCurrentProject(currentSketch.id)
    }
  }, [generatedCode, currentSketch, initializeHistory, setCurrentProject])

  // Check for unsaved changes
  useEffect(() => {
    if (generatedCode && currentSketch) {
      const hasChanges = hasUnsavedChanges(currentSketch.id, editorValue)
      setIsModified(hasChanges)
    }
  }, [editorValue, generatedCode, currentSketch, hasUnsavedChanges])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value)
      setIsModified(value !== generatedCode?.jsx)
    }
  }

  const handleSaveChanges = () => {
    if (generatedCode && currentSketch) {
      // Create a new version in history
      addVersion(currentSketch.id, editorValue, 'Manual changes saved', generatedCode.componentName)

      // Update the current generated code
      updateGeneratedCode({
        jsx: editorValue,
        version: generatedCode.version + 1,
        generatedAt: new Date()
      })
      setIsModified(false)
      toast.success('Changes saved and version created!')
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(editorValue)
      toast.success('Code copied to clipboard!')
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const handleDownloadCode = () => {
    if (!generatedCode) return
    
    const blob = new Blob([editorValue], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedCode.componentName}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleAIEnhance = async () => {
    if (!currentSketch?.analysis) return
    
    setGenerating(true)
    
    try {
      // Generate enhanced version with current code as context
      const enhancedCode = await generateCodeFromAnalysis(
        currentSketch.analysis,
        generatedCode?.componentName || 'EnhancedComponent'
      )
      
      setGeneratedCode({
        ...enhancedCode,
        jsx: enhancedCode.jsx,
        version: (generatedCode?.version || 0) + 1
      })
      
      toast.success('Code enhanced with AI!')
    } catch {
      toast.error('Failed to enhance code')
    } finally {
      setGenerating(false)
    }
  }

  const handleFormatCode = () => {
    try {
      const formatted = formatJSXCode(editorValue)
      const validation = validateJSXSyntax(formatted)

      if (validation.isValid) {
        setEditorValue(formatted)
        toast.success('Code formatted successfully!')
      } else {
        toast.error('Code formatting completed but syntax errors detected')
      }
    } catch {
      toast.error('Failed to format code')
    }
  }

  if (!currentSketch) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Sketch Selected</h3>
          <p className="text-muted-foreground">Upload a sketch to start generating code</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b border-border bg-card gap-3 sm:gap-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base">
            {generatedCode?.componentName ? `${generatedCode.componentName} - Sketchly Editor` : 'Sketchly Code Editor'}
          </h3>
          {isModified && (
            <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded">
              Modified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-end flex-wrap gap-2">
          {/* AI Generate/Regenerate - Now visible on all screens */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCode}
            disabled={isGenerating || !currentSketch?.analysis}
            className="flex"
            title={!currentSketch?.analysis ? 'Upload a sketch first to generate code' : generatedCode ? 'Regenerate code with AI' : 'Generate code with AI'}
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">{generatedCode ? 'Regenerate' : 'Generate Code'}</span>
            <span className="sm:hidden">{generatedCode ? 'Regen' : 'Generate'}</span>
          </Button>

          {/* AI Enhance - Now visible on all screens */}
          {generatedCode && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIEnhance}
              disabled={isGenerating || !currentSketch?.analysis}
              className="flex"
              title="Enhance code with AI improvements"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI Enhance</span>
              <span className="sm:hidden">Enhance</span>
            </Button>
          )}

          {/* Save Changes - Full width on mobile */}
          {isModified && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveChanges}
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          )}

          {/* Version History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVersionHistory(true)}
            className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <History className="w-4 h-4" />
          </Button>

          {/* Action buttons - Always visible */}
          <div className="flex items-center space-x-1">
            {/* Format Code */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFormatCode}
              disabled={!editorValue}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
              title="Format code"
            >
              <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>

            {/* Copy Code */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              disabled={!editorValue}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>

            {/* Download Code */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadCode}
              disabled={!generatedCode}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>

            {/* Version History */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVersionHistory(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0"
              title="Version history"
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-foreground mb-2">Generating Code...</h3>
              <p className="text-muted-foreground">AI is analyzing your sketch and creating components</p>
            </div>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={editorValue}
            onChange={handleEditorChange}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-3 sm:px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span>TypeScript React</span>
            {generatedCode && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>v{generatedCode.version}</span>
                <span className="hidden sm:inline">•</span>
                <span>{generatedCode.dependencies?.length || 0} dependencies</span>
              </>
            )}
          </div>

          {generatedCode && (
            <div className="text-xs">
              Generated: {generatedCode.generatedAt instanceof Date && !isNaN(generatedCode.generatedAt.getTime()) 
                ? generatedCode.generatedAt.toLocaleTimeString() 
                : 'Just now'}
            </div>
          )}
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistory
          projectId={currentSketch?.id || ''}
          currentCode={editorValue}
          onCodeChange={(code, version) => {
            setEditorValue(code)
            setIsModified(false)
            toast.success(`Loaded version ${version.versionNumber}: ${version.description}`)
          }}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </div>
  )
}
