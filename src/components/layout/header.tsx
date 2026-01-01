'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useSketchStore } from '@/store/sketch-store'
import { Icon } from '@/components/icon-wrapper'
import { getOpenAIConfigStatus } from '@/lib/ai/openai-client'
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
  onProjectClick?: () => void
  onKeyboardClick?: () => void
}

export function Header({ onMenuClick, onProjectClick, onKeyboardClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { generatedCode, currentSketch, isAnalyzing, isGenerating } = useSketchStore()
  const [showSettings, setShowSettings] = useState(false)
  const [aiStatus, setAiStatus] = useState<{ isConfigured: boolean; loading: boolean }>({ isConfigured: false, loading: true })

  useEffect(() => {
    // Check AI configuration status
    getOpenAIConfigStatus().then(status => {
      setAiStatus({ isConfigured: status.isConfigured || false, loading: false })
    }).catch(() => {
      setAiStatus({ isConfigured: false, loading: false })
    })
  }, [])

  const handleExport = () => {
    if (!generatedCode) return
    
    // Create a download link for the generated code
    const blob = new Blob([generatedCode.jsx], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedCode.componentName}.jsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        {/* Mobile Menu Button + Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden w-8 h-8 p-0"
          >
            <Icon name="Menu" className="w-4 h-4" />
          </Button>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg">
              <Icon name="Zap" className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            {/* Full name and tagline on larger screens */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Sketchly</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Sketch to Code</p>
            </div>
            {/* Short name on mobile */}
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-foreground">Sketchly</h1>
            </div>
          </div>
        </div>

        {/* Project Info */}
        {currentSketch && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Current:</span>
              <span className="ml-2 font-medium truncate max-w-32">{currentSketch.name}</span>
            </div>
            {generatedCode && (
              <div className="text-xs text-muted-foreground">
                v{generatedCode.version} • {generatedCode.generatedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* AI Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-2 py-1 rounded-md bg-muted/50">
            {aiStatus.loading ? (
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
            ) : aiStatus.isConfigured ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">AI Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400">AI Not Configured</span>
              </>
            )}
            {(isAnalyzing || isGenerating) && (
              <Zap className="w-3 h-3 text-primary animate-pulse ml-1" />
            )}
          </div>

          {/* AI Status - Mobile */}
          <div className="md:hidden">
            {(isAnalyzing || isGenerating) ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
              </div>
            ) : !aiStatus.isConfigured && !aiStatus.loading ? (
              <div className="w-8 h-8 flex items-center justify-center" title="AI not configured">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
            ) : null}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            {theme === 'dark' ? (
              <Icon name="Sun" className="w-4 h-4" />
            ) : (
              <Icon name="Moon" className="w-4 h-4" />
            )}
          </Button>

          {/* Version History - Hidden on small screens */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!generatedCode}
            className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <Icon name="History" className="w-4 h-4" />
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={!generatedCode}
            className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <Icon name="Download" className="w-4 h-4" />
          </Button>

          {/* Keyboard Shortcuts */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onKeyboardClick}
            className="w-8 h-8 sm:w-9 sm:h-9 p-0"
            title="Keyboard shortcuts (Shift + ?)"
          >
            <Icon name="Keyboard" className="w-4 h-4" />
          </Button>


          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <Icon name="Settings" className="w-4 h-4" />
          </Button>

          {/* Projects */}
          <Button
            variant="outline"
            size="sm"
            onClick={onProjectClick}
            className="hidden sm:flex"
          >
            <Icon name="FolderOpen" className="w-4 h-4 mr-2" />
            Projects
          </Button>

          {/* Design System Toggle - Hidden on small screens */}
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:flex ml-2"
          >
            <Icon name="Palette" className="w-4 h-4 mr-2" />
            Design System
          </Button>
        </div>
      </div>

      {/* Mobile Project Info */}
      {currentSketch && (
        <div className="md:hidden px-3 pb-3 border-t border-border">
          <div className="flex items-center justify-between text-xs pt-2">
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground block">Current Project:</span>
              <span className="font-medium text-foreground truncate block">{currentSketch.name}</span>
            </div>
            {generatedCode && (
              <div className="text-muted-foreground text-right">
                <div className="text-xs">Version</div>
                <div className="font-medium">v{generatedCode.version}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
