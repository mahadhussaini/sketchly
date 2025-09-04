'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { SketchUpload } from '@/components/sketch-upload'
import { CodeEditor } from '@/components/code-editor'
import { PreviewPanel } from '@/components/preview-panel'
import { ComponentLibrary } from '@/components/component-library'
import { ProjectManager } from '@/components/project-manager'
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts'
import { useSketchStore } from '@/store/sketch-store'
import { useProjectStore } from '@/store/project-store'
import { useKeyboardShortcutsWithDialog, createGlobalShortcuts } from '@/hooks/use-keyboard-shortcuts'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'editor' | 'preview'>('upload')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projectManagerOpen, setProjectManagerOpen] = useState(false)
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false)

  const { generatedCode, currentSketch, addSketch, updateSketchAnalysis } = useSketchStore()
  const { currentProject, addSketchToProject, setCurrentSketch } = useProjectStore()

  // Sync current sketch with project
  useEffect(() => {
    if (currentSketch && currentProject && !currentProject.sketches.find(s => s.id === currentSketch.id)) {
      addSketchToProject(currentSketch)
    }
  }, [currentSketch, currentProject, addSketchToProject])

  // Load project sketches when project changes
  useEffect(() => {
    if (currentProject && currentProject.sketches.length > 0) {
      // Load sketches from project
      currentProject.sketches.forEach(sketch => {
        addSketch(sketch)
        if (sketch.analysis) {
          updateSketchAnalysis(sketch.id, sketch.analysis)
        }
      })

      if (currentProject.currentSketchId) {
        setCurrentSketch(currentProject.currentSketchId)
      }
    }
  }, [currentProject, addSketch, updateSketchAnalysis, setCurrentSketch])

  // Keyboard shortcuts
  const globalShortcuts = createGlobalShortcuts(
    () => setProjectManagerOpen(true), // New project
    () => setProjectManagerOpen(true), // Open project
    () => setSidebarOpen(!sidebarOpen), // Toggle sidebar
    () => setActiveTab(activeTab === 'preview' ? 'editor' : 'preview') // Toggle preview
  )

  // Add keyboard shortcuts for tab switching
  const tabShortcuts = [
    {
      key: '1',
      action: () => setActiveTab('upload'),
      description: 'Switch to Upload tab',
      preventDefault: true
    },
    {
      key: '2',
      action: () => setActiveTab('editor'),
      description: 'Switch to Editor tab',
      preventDefault: true
    },
    {
      key: '3',
      action: () => setActiveTab('preview'),
      description: 'Switch to Preview tab',
      preventDefault: true
    },
    {
      key: '?',
      shiftKey: true,
      action: () => setKeyboardShortcutsOpen(true),
      description: 'Show keyboard shortcuts',
      preventDefault: true
    }
  ]

  useKeyboardShortcutsWithDialog([...globalShortcuts, ...tabShortcuts], !projectManagerOpen && !keyboardShortcutsOpen)

  return (
    <div className="flex flex-col h-screen">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onProjectClick={() => setProjectManagerOpen(true)}
        onKeyboardClick={() => setKeyboardShortcutsOpen(true)}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Component Library */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-80
          border-r border-border bg-card transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <ComponentLibrary onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Tab Navigation */}
          <div className="border-b border-border bg-card px-3 sm:px-6 py-3">
            <nav className="flex space-x-1 sm:space-x-6 overflow-x-auto scrollbar-hide min-w-0">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'upload'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Upload Sketch
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                disabled={!generatedCode}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                  activeTab === 'editor'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Code Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                disabled={!generatedCode}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                  activeTab === 'preview'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Live Preview
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'upload' && (
              <div className="h-full p-3 sm:p-6">
                <SketchUpload onUploadComplete={() => setActiveTab('editor')} />
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="h-full">
                <CodeEditor />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full p-3 sm:p-6">
                <PreviewPanel />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Project Manager Modal */}
      <ProjectManager
        isOpen={projectManagerOpen}
        onClose={() => setProjectManagerOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={keyboardShortcutsOpen}
        onClose={() => setKeyboardShortcutsOpen(false)}
      />
    </div>
  )
}
