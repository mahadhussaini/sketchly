import React from 'react'

// Browser extension detection and handling utilities

export interface BrowserExtension {
  name: string
  attributes: string[]
  elements: string[]
  description: string
  impact: 'low' | 'medium' | 'high'
}

export const KNOWN_EXTENSIONS: BrowserExtension[] = [
  {
    name: 'Grammarly',
    attributes: ['data-new-gr-c-s-check-loaded', 'data-grammarly-shadow-root'],
    elements: ['grammarly-extension', 'grammarly-shadow-root'],
    description: 'Grammarly writing assistant extension',
    impact: 'high'
  },
  {
    name: 'Grammarly (old)',
    attributes: ['data-gr-ext-installed'],
    elements: [],
    description: 'Legacy Grammarly extension attributes',
    impact: 'high'
  },
  {
    name: 'React Developer Tools',
    attributes: ['data-react-devtools-portal-id'],
    elements: [],
    description: 'React development tools extension',
    impact: 'low'
  },
  {
    name: 'Redux DevTools',
    attributes: ['data-redux-devtools-portal-id'],
    elements: [],
    description: 'Redux development tools extension',
    impact: 'low'
  },
  {
    name: 'LastPass',
    attributes: ['data-lastpass-root'],
    elements: [],
    description: 'Password manager extension',
    impact: 'medium'
  },
  {
    name: '1Password',
    attributes: ['data-onepassword-root'],
    elements: [],
    description: 'Password manager extension',
    impact: 'medium'
  }
]

export function detectBrowserExtensions(): BrowserExtension[] {
  if (typeof window === 'undefined') return []

  const detected: BrowserExtension[] = []

  KNOWN_EXTENSIONS.forEach(extension => {
    const hasAttributes = extension.attributes.some(attr =>
      document.documentElement.hasAttribute(attr) ||
      document.body.hasAttribute(attr)
    )

    const hasElements = extension.elements.some(selector =>
      document.querySelector(selector) !== null
    )

    if (hasAttributes || hasElements) {
      detected.push(extension)
    }
  })

  return detected
}

export function cleanupExtensionInterference(): void {
  if (typeof window === 'undefined') return

  try {
    // Remove extension elements
    KNOWN_EXTENSIONS.forEach(extension => {
      extension.elements.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => element.remove())
      })
    })

    // Clean up extension attributes
    const allAttributes = KNOWN_EXTENSIONS.flatMap(ext => ext.attributes)

    allAttributes.forEach(attr => {
      document.documentElement.removeAttribute(attr)
      document.body.removeAttribute(attr)

      // Clean up from all elements
      const elementsWithAttr = document.querySelectorAll(`[${attr}]`)
      elementsWithAttr.forEach(element => {
        element.removeAttribute(attr)
      })
    })

    console.debug('Browser extension interference cleaned up')
  } catch (error) {
    console.debug('Failed to cleanup extension interference:', error)
  }
}

export function isHydrationError(error: Error): boolean {
  const message = error.message.toLowerCase()
  const knownIndicators = [
    'extra attributes from the server',
    'hydration',
    'server and client',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed',
    'data-grammarly-shadow-root'
  ]

  return knownIndicators.some(indicator => message.includes(indicator))
}

export function createHydrationSafeElement(
  tagName: string,
  attributes: Record<string, string> = {},
  children?: React.ReactNode
): React.ReactElement {
  // This is a utility to create elements that are safe from hydration mismatches
  // In a real implementation, this would use React.createElement with proper keys
  return React.createElement(tagName, {
    key: Math.random().toString(36),
    ...attributes,
    suppressHydrationWarning: true
  }, children)
}

export function suppressConsoleWarnings(): () => void {
  if (typeof window === 'undefined') return () => {}

  const originalWarn = console.warn
  const originalError = console.error

  const suppressedMessages = [
    'Warning: Extra attributes from the server:',
    'Warning: Did not expect server HTML to contain',
    'Warning: Expected server HTML to contain',
    'Warning: Text content did not match',
    'Could not create web worker',
  ]

  const shouldSuppress = (message: string): boolean => {
    return suppressedMessages.some(suppressed =>
      message.includes(suppressed) ||
      KNOWN_EXTENSIONS.some(ext =>
        ext.attributes.some(attr => message.includes(attr)) ||
        ext.elements.some(el => message.includes(el))
      )
    )
  }

  console.warn = (...args) => {
    const message = args.join(' ')
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, args)
    }
  }

  console.error = (...args) => {
    const message = args.join(' ')
    if (!shouldSuppress(message)) {
      originalError.apply(console, args)
    }
  }

  // Return cleanup function
  return () => {
    console.warn = originalWarn
    console.error = originalError
  }
}

// React hook for safe hydration
export function useHydrationSafeState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(initialValue)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return [hydrated ? state : initialValue, setState]
}

// Utility to check if we're in a browser environment safely
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

// Safe localStorage wrapper that doesn't cause hydration issues
export function safeLocalStorage() {
  if (!isBrowser()) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    }
  }

  try {
    return window.localStorage
  } catch {
    // localStorage might be disabled
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    }
  }
}
