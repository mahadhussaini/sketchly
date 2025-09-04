'use client'

// No React hooks needed for this component
import { Keyboard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatShortcut, createGlobalShortcuts, createEditorShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null

  const globalShortcuts = createGlobalShortcuts(
    () => {}, // These are placeholder actions
    () => {},
    () => {},
    () => {}
  )

  const editorShortcuts = createEditorShortcuts(
    () => {},
    () => {},
    () => {},
    () => {},
    () => {}
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="space-y-6">
            {/* Global Shortcuts */}
            <div>
              <h3 className="text-base font-medium mb-3 text-foreground">Global Shortcuts</h3>
              <div className="space-y-2">
                {globalShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs bg-background border border-border rounded font-mono">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Shortcuts */}
            <div>
              <h3 className="text-base font-medium mb-3 text-foreground">Code Editor</h3>
              <div className="space-y-2">
                {editorShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs bg-background border border-border rounded font-mono">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>


            {/* Additional Shortcuts */}
            <div>
              <h3 className="text-base font-medium mb-3 text-foreground">Navigation</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                  <span className="text-sm text-foreground">Switch to Upload tab</span>
                  <kbd className="px-2 py-1 text-xs bg-background border border-border rounded font-mono">
                    1
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                  <span className="text-sm text-foreground">Switch to Code Editor tab</span>
                  <kbd className="px-2 py-1 text-xs bg-background border border-border rounded font-mono">
                    2
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                  <span className="text-sm text-foreground">Switch to Preview tab</span>
                  <kbd className="px-2 py-1 text-xs bg-background border border-border rounded font-mono">
                    3
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                  <span className="text-sm text-foreground">Toggle sidebar</span>
                  <kbd className="px-2 py-1 text-xs bg-background border border-border rounded font-mono">
                    Ctrl + B
                  </kbd>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">💡 Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Press <kbd className="px-1 py-0.5 text-xs bg-background border border-border rounded">?</kbd> anywhere to show this dialog</li>
                <li>• Shortcuts work when the respective panels are active</li>
                <li>• Use <kbd className="px-1 py-0.5 text-xs bg-background border border-border rounded">Tab</kbd> to navigate between interactive elements</li>
                <li>• Hold <kbd className="px-1 py-0.5 text-xs bg-background border border-border rounded">Shift</kbd> for additional actions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Got it!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
