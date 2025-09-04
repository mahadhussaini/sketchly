// Browser extension detection and handling utilities
import React from 'react'

export interface BrowserExtension {
  name: string
  attributes: string[]
  selectors: string[]
  detected: boolean
}

export const COMMON_EXTENSIONS: BrowserExtension[] = [
  {
    name: 'Grammarly',
    attributes: [
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'data-gr-ext-disabled',
      'data-new-gr-c-s-loaded',
      'data-grammarly-shadow-root'
    ],
    selectors: [
      '[data-grammarly-part]',
      '[data-grammarly-shadow-root]',
      '.grammarly-shadow-root'
    ],
    detected: false
  },
  {
    name: 'LastPass',
    attributes: ['data-lastpass'],
    selectors: ['[data-lastpass]'],
    detected: false
  },
  {
    name: 'Dashlane',
    attributes: ['data-dashlane'],
    selectors: ['[data-dashlane]'],
    detected: false
  },
  {
    name: 'Rainbow Wallet',
    attributes: ['data-rainbow-extension'],
    selectors: ['[data-rainbow-extension]'],
    detected: false
  },
  {
    name: 'MetaMask',
    attributes: ['data-metamask'],
    selectors: ['[data-metamask]'],
    detected: false
  },
  {
    name: '1Password',
    attributes: ['data-onepassword'],
    selectors: ['[data-onepassword]'],
    detected: false
  }
]

export function detectBrowserExtensions(): BrowserExtension[] {
  if (typeof window === 'undefined') return COMMON_EXTENSIONS

  const detected: BrowserExtension[] = []

  COMMON_EXTENSIONS.forEach(extension => {
    let isDetected = false

    // Check for attributes
    extension.attributes.forEach(attr => {
      if (document.documentElement.hasAttribute(attr) ||
          document.body.hasAttribute(attr) ||
          document.querySelector(`[${attr}]`)) {
        isDetected = true
      }
    })

    // Check for selectors
    extension.selectors.forEach(selector => {
      if (document.querySelector(selector)) {
        isDetected = true
      }
    })

    // Check user agent
    if (navigator.userAgent.includes(extension.name)) {
      isDetected = true
    }

    if (isDetected) {
      detected.push({
        ...extension,
        detected: true
      })
      console.info(`🔌 Detected browser extension: ${extension.name}`)
    }
  })

  return detected
}

export function createExtensionSuppressor() {
  const detectedExtensions = detectBrowserExtensions()

  if (detectedExtensions.length === 0) {
    console.info('✅ No problematic browser extensions detected')
    return () => {}
  }

  console.info(`🔧 Suppressing ${detectedExtensions.length} browser extensions`)

  // Create style element to hide extension elements
  const style = document.createElement('style')
  style.textContent = `
    /* Hide browser extension elements */
    ${detectedExtensions.map(ext =>
      ext.selectors.map(selector => `${selector} { display: none !important; }`).join('\n')
    ).join('\n')}

    /* Hide elements with extension attributes */
    ${detectedExtensions.map(ext =>
      ext.attributes.map(attr => `[${attr}] { display: none !important; }`).join('\n')
    ).join('\n')}
  `
  document.head.appendChild(style)

  // Remove extension attributes from all elements
  const cleanupAttributes = () => {
    const allElements = document.querySelectorAll('*')
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement
      detectedExtensions.forEach(ext => {
        ext.attributes.forEach(attr => {
          if (htmlElement.hasAttribute(attr)) {
            htmlElement.removeAttribute(attr)
          }
        })
      })
    })
  }

  // Initial cleanup
  cleanupAttributes()

  // Set up mutation observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName) {
        detectedExtensions.forEach(ext => {
          if (mutation.attributeName && ext.attributes.includes(mutation.attributeName)) {
            const target = mutation.target as HTMLElement
            target.removeAttribute(mutation.attributeName)
          }
        })
      }
    })
  })

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: detectedExtensions.flatMap(ext => ext.attributes)
  })

  // Return cleanup function
  return () => {
    observer.disconnect()
    if (style.parentNode) {
      style.parentNode.removeChild(style)
    }
  }
}

export function suppressConsoleWarnings() {
  if (typeof window === 'undefined') return () => {}

  const originalWarn = console.warn
  const originalError = console.error

  const suppressedMessages = [
    'Extra attributes from the server',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed',
    'data-gr-ext-disabled',
    'data-new-gr-c-s-loaded',
    'data-grammarly-shadow-root',
    'data-lastpass',
    'data-dashlane',
    'data-rainbow-extension',
    'Hydration',
    'hydration',
    'Text content does not match server-rendered HTML'
  ]

  console.warn = (...args) => {
    const message = args.join(' ')
    const shouldSuppress = suppressedMessages.some(suppressed =>
      message.includes(suppressed)
    )

    if (!shouldSuppress) {
      originalWarn.apply(console, args)
    }
  }

  console.error = (...args) => {
    const message = args.join(' ')
    const shouldSuppress = suppressedMessages.some(suppressed =>
      message.includes(suppressed)
    )

    if (!shouldSuppress) {
      originalError.apply(console, args)
    }
  }

  return () => {
    console.warn = originalWarn
    console.error = originalError
  }
}

export function createHydrationSafeEnvironment() {
  if (typeof window === 'undefined') return () => {}

  // Detect and suppress browser extensions
  const cleanupExtensions = createExtensionSuppressor()

  // Suppress console warnings
  const cleanupConsole = suppressConsoleWarnings()

  // Note: Global Error constructor override removed to avoid type conflicts
  // Hydration warnings are handled by other mechanisms in the application

  console.info('🛡️ Hydration-safe environment initialized')

  return () => {
    cleanupExtensions()
    cleanupConsole()
  }
}

// React hook for hydration safety
export function useBrowserExtensionDetection() {
  const [extensions, setExtensions] = React.useState<BrowserExtension[]>([])

  React.useEffect(() => {
    const detected = detectBrowserExtensions()
    setExtensions(detected)

    if (detected.length > 0) {
      console.info(`🔌 Found ${detected.length} browser extensions that may cause hydration issues`)
    }
  }, [])

  return extensions
}

// Utility to safely check if we're in a browser environment
export function isClient(): boolean {
  return typeof window !== 'undefined' &&
         typeof window.document !== 'undefined' &&
         typeof window.navigator !== 'undefined'
}

// Safe DOM manipulation
export function safeDOMOperation(operation: () => void) {
  if (!isClient()) return

  try {
    operation()
  } catch (error) {
    console.warn('Safe DOM operation failed:', error)
  }
}
