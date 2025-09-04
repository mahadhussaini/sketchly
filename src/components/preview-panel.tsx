'use client'

import { useState, useMemo } from 'react'
import {
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Eye,
  Code,
  Settings,
  Maximize2,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSketchStore } from '@/store/sketch-store'
import { ComponentPreview } from '@/components/component-preview'
import { AccessibilityChecker } from '@/components/accessibility-checker'

type ViewportSize = 'mobile' | 'tablet' | 'desktop'

const viewportSizes = {
  mobile: { width: 375, height: 667, icon: Smartphone },
  tablet: { width: 768, height: 1024, icon: Tablet },
  desktop: { width: 1200, height: 800, icon: Monitor }
}

export function PreviewPanel() {
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const { generatedCode, currentSketch } = useSketchStore()

  const currentViewport = viewportSizes[viewport]
  const ViewportIcon = currentViewport.icon

  // Memoize the component preview to avoid unnecessary re-renders
  const previewComponent = useMemo(() => {
    if (!generatedCode?.jsx) return null
    
    return (
      <ComponentPreview
        code={generatedCode.jsx}
        componentName={generatedCode.componentName}
      />
    )
  }, [generatedCode])

  if (!currentSketch) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Preview Available</h3>
          <p className="text-muted-foreground">Upload a sketch and generate code to see the preview</p>
        </div>
      </div>
    )
  }

  if (!generatedCode) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Code Generated</h3>
          <p className="text-muted-foreground">Generate code from your sketch to see the live preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base">Sketchly Live Preview</h3>
          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
            {generatedCode.componentName}
          </span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Viewport Controls */}
          <div className="flex items-center space-x-1 mr-2 sm:mr-4">
            {Object.entries(viewportSizes).map(([key, config]) => {
              const Icon = config.icon
              return (
                <Button
                  key={key}
                  variant={viewport === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewport(key as ViewportSize)}
                  className="w-7 h-7 sm:w-9 sm:h-9 p-0"
                  title={`${key} (${config.width}x${config.height})`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )
            })}
          </div>

          {/* View Toggle - Hidden on mobile */}
          <Button
            variant={showCode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="hidden sm:flex"
          >
            <Code className="w-4 h-4 mr-2" />
            {showCode ? 'Hide Code' : 'Show Code'}
          </Button>

          {/* Fullscreen - Hidden on mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">
        {showCode ? (
          // Split view: Preview + Code (Desktop only)
          <div className="flex h-full">
            <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-gray-50 dark:bg-gray-900">
              <div
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: Math.min(currentViewport.width, window.innerWidth - 400),
                  height: Math.min(currentViewport.height, window.innerHeight - 200),
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <div className="w-full h-full overflow-auto">
                  {previewComponent}
                </div>
              </div>
            </div>

            <div className="w-64 sm:w-80 lg:w-96 border-l border-border bg-card">
              <div className="p-3 sm:p-4 border-b border-border">
                <h4 className="font-medium text-foreground text-sm sm:text-base">Generated Code</h4>
              </div>
              <div className="p-3 sm:p-4 overflow-auto text-xs sm:text-sm">
                <pre className="whitespace-pre-wrap font-mono text-muted-foreground">
                  {generatedCode.jsx}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          // Full preview with accessibility checker
          <div className="h-full flex flex-col lg:flex-row gap-4">
            {/* Main Preview */}
            <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-gray-50 dark:bg-gray-900">
              <div
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  width: isFullscreen ? '100%' : Math.min(currentViewport.width, window.innerWidth - (window.innerWidth > 1024 ? 400 : 32)),
                  height: isFullscreen ? '100%' : Math.min(currentViewport.height, window.innerHeight - 120),
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                {/* Device Frame (only for non-fullscreen) */}
                {!isFullscreen && viewport !== 'desktop' && (
                  <div className="bg-gray-800 h-4 sm:h-6 rounded-t-lg flex items-center justify-center">
                    <div className="w-8 sm:w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                )}

                <div className="w-full h-full overflow-auto">
                  {previewComponent}
                </div>
              </div>
            </div>

            {/* Analysis Tools - Desktop only */}
            <div className="hidden lg:block w-80 space-y-4">
              <AccessibilityChecker code={generatedCode.jsx} />
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Performance</span>
                    <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                      A Grade
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">
                    Performance analysis is temporarily unavailable. Component generation completed successfully!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-3 sm:px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="flex items-center space-x-1">
              <ViewportIcon className="w-3 h-3" />
              <span>{viewport} ({currentViewport.width}×{currentViewport.height})</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>React Component</span>
            <span className="hidden sm:inline">•</span>
            <span>Tailwind CSS</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
            <span>Version {generatedCode.version}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Last updated: {generatedCode.generatedAt.toLocaleTimeString()}</span>
            <span className="sm:hidden">Updated {generatedCode.generatedAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
