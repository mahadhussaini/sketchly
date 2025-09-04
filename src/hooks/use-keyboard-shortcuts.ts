import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
  preventDefault?: boolean
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!event.ctrlKey === !!shortcut.ctrlKey
      const shiftMatch = !!event.shiftKey === !!shortcut.shiftKey
      const altMatch = !!event.altKey === !!shortcut.altKey
      const metaMatch = !!event.metaKey === !!shortcut.metaKey

      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
    })

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault()
      }
      matchingShortcut.action()
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export function useKeyboardShortcutsWithDialog(
  shortcuts: KeyboardShortcut[],
  isEnabled: boolean = true
) {
  useKeyboardShortcuts(
    isEnabled ? shortcuts : []
  )
}

// Predefined shortcuts for common actions
export const createEditorShortcuts = (
  onSave: () => void,
  onFormat: () => void,
  onUndo: () => void,
  onRedo: () => void,
  onFind: () => void
): KeyboardShortcut[] => [
  {
    key: 's',
    ctrlKey: true,
    action: onSave,
    description: 'Save current work',
  },
  {
    key: 'f',
    ctrlKey: true,
    action: onFormat,
    description: 'Format code',
  },
  {
    key: 'z',
    ctrlKey: true,
    action: onUndo,
    description: 'Undo last action',
  },
  {
    key: 'y',
    ctrlKey: true,
    action: onRedo,
    description: 'Redo last action',
  },
  {
    key: 'f',
    ctrlKey: true,
    shiftKey: true,
    action: onFind,
    description: 'Find and replace',
  },
]

export const createGlobalShortcuts = (
  onNewProject: () => void,
  onOpenProject: () => void,
  onToggleSidebar: () => void,
  onTogglePreview: () => void
): KeyboardShortcut[] => [
  {
    key: 'n',
    ctrlKey: true,
    action: onNewProject,
    description: 'Create new project',
  },
  {
    key: 'o',
    ctrlKey: true,
    action: onOpenProject,
    description: 'Open project manager',
  },
  {
    key: 'b',
    ctrlKey: true,
    action: onToggleSidebar,
    description: 'Toggle sidebar',
  },
  {
    key: 'p',
    ctrlKey: true,
    action: onTogglePreview,
    description: 'Toggle preview panel',
  },
  {
    key: 'k',
    ctrlKey: true,
    action: () => {
      // This would typically open a command palette
      console.log('Command palette not implemented yet')
    },
    description: 'Open command palette',
  },
]

export function formatShortcut(shortcut: Omit<KeyboardShortcut, 'action' | 'description'>): string {
  const parts = []

  if (shortcut.ctrlKey) parts.push('Ctrl')
  if (shortcut.metaKey) parts.push('⌘')
  if (shortcut.altKey) parts.push('Alt')
  if (shortcut.shiftKey) parts.push('Shift')

  parts.push(shortcut.key.toUpperCase())

  return parts.join(' + ')
}
