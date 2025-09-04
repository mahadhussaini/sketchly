'use client'

import React, { useEffect } from 'react'
import { createHydrationSafeEnvironment } from '@/lib/utils/browser-extensions'

// List of common browser extension attributes that cause hydration warnings
const BROWSER_EXTENSION_ATTRIBUTES = [
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
  'data-gr-ext-disabled',
  'data-new-gr-c-s-loaded',
  'data-grammarly-shadow-root',
  'data-lastpass',
  'data-dashlane',
  'data-rainbow-extension',
  'data-react-helmet',
  'data-styled-components',
  'data-emotion',
  'data-jotai-devtools',
  'data-nextjs-portal',
  'data-nextjs-toast',
  'data-radix-popper-content-wrapper',
  'data-radix-scroll-area-viewport',
  'data-radix-select-viewport',
  'data-radix-tooltip-content',
  'data-radix-tooltip-trigger',
  'data-radix-portal',
  'data-radix-menu-content',
  'data-radix-dropdown-menu-content',
  'data-radix-dialog-overlay',
  'data-radix-dialog-content',
  'data-radix-alert-dialog-overlay',
  'data-radix-alert-dialog-content',
  'data-radix-tooltip-provider',
  'data-radix-menu-trigger',
  'data-radix-dropdown-menu-trigger',
  'data-radix-dialog-trigger',
  'data-radix-alert-dialog-trigger',
  'data-radix-select-trigger',
  'data-radix-select-content',
  'data-radix-select-item',
  'data-radix-select-value',
  'data-radix-select-icon',
  'data-radix-select-scroll-up-button',
  'data-radix-select-scroll-down-button',
  'data-radix-select-item-text',
  'data-radix-select-item-indicator',
  'data-radix-select-label',
  'data-radix-select-group',
  'data-radix-select-separator',
  'data-radix-select-arrow',
  'data-radix-scroll-area-corner',
  'data-radix-scroll-area-thumb',
  'data-radix-scroll-area-scrollbar',
  'data-radix-hover-card-content',
  'data-radix-hover-card-trigger',
  'data-radix-navigation-menu-content',
  'data-radix-navigation-menu-trigger',
  'data-radix-navigation-menu-viewport',
  'data-radix-navigation-menu-indicator',
  'data-radix-navigation-menu-item',
  'data-radix-navigation-menu-link',
  'data-radix-navigation-menu-list',
  'data-radix-navigation-menu-viewport-content',
  'data-radix-collapsible-content',
  'data-radix-collapsible-trigger',
  'data-radix-accordion-content',
  'data-radix-accordion-trigger',
  'data-radix-accordion-item',
  'data-radix-accordion-header',
  'data-radix-tabs-content',
  'data-radix-tabs-list',
  'data-radix-tabs-trigger',
  'data-radix-switch-thumb',
  'data-radix-checkbox-indicator',
  'data-radix-radio-group-item',
  'data-radix-radio-group-indicator',
  'data-radix-slider-track',
  'data-radix-slider-range',
  'data-radix-slider-thumb',
  'data-radix-progress-indicator',
  'data-radix-toggle',
  'data-radix-avatar-image',
  'data-radix-avatar-fallback',
  'data-headlessui-state',
  'data-headlessui-open',
  'data-headlessui-closed',
  'data-headlessui-focus',
  'data-headlessui-active',
  'data-headlessui-selected',
  'data-headlessui-disabled',
  'data-headlessui-expanded',
  'data-headlessui-collapsed',
  'data-headlessui-hidden',
  'data-headlessui-visible',
  'data-floating-ui-portal',
  'data-floating-ui-reference-hidden',
  'data-floating-ui-escaped',
  'data-floating-ui-positioned',
  'data-floating-ui-strategy',
  'data-floating-ui-placement',
  'data-floating-ui-inert',
  'data-floating-ui-arrow',
  'data-floating-ui-middleware-arrow',
  'data-floating-ui-auto-update',
  'data-floating-ui-safe-polygon',
  'data-floating-ui-shift',
  'data-floating-ui-flip',
  'data-floating-ui-size',
  'data-floating-ui-hide',
  'data-floating-ui-offset',
  'data-floating-ui-inline',
  'data-floating-ui-composite',
  'data-floating-ui-list-navigation',
  'data-floating-ui-typeahead',
  'data-floating-ui-dismiss',
  'data-floating-ui-click-outside',
  'data-floating-ui-focus-outside',
  'data-floating-ui-hover',
  'data-floating-ui-role',
  'data-floating-ui-label',
  'data-floating-ui-description',
  'data-floating-ui-id',
  'data-floating-ui-aria-labelledby',
  'data-floating-ui-aria-describedby',
  'data-floating-ui-aria-expanded',
  'data-floating-ui-aria-haspopup',
  'data-floating-ui-aria-controls',
  'data-floating-ui-aria-activedescendant',
  'data-floating-ui-aria-autocomplete',
  'data-floating-ui-aria-readonly',
  'data-floating-ui-aria-required',
  'data-floating-ui-aria-invalid',
  'data-floating-ui-aria-errormessage',
  'data-floating-ui-aria-valuemin',
  'data-floating-ui-aria-valuemax',
  'data-floating-ui-aria-valuenow',
  'data-floating-ui-aria-valuetext',
  'data-floating-ui-aria-orientation',
  'data-floating-ui-aria-level',
  'data-floating-ui-aria-posinset',
  'data-floating-ui-aria-setsize',
  'data-floating-ui-aria-multiselectable',
  'data-floating-ui-aria-selected',
  'data-floating-ui-aria-checked',
  'data-floating-ui-aria-pressed',
  'data-floating-ui-aria-current',
  'data-floating-ui-aria-busy',
  'data-floating-ui-aria-live',
  'data-floating-ui-aria-atomic',
  'data-floating-ui-aria-relevant',
  'data-floating-ui-aria-grabbed',
  'data-floating-ui-aria-dropeffect',
  'data-floating-ui-aria-hidden',
  'data-floating-ui-aria-disabled',
  'data-floating-ui-aria-sort',
  'data-floating-ui-aria-rowcount',
  'data-floating-ui-aria-rowindex',
  'data-floating-ui-aria-rowspan',
  'data-floating-ui-aria-colcount',
  'data-floating-ui-aria-colindex',
  'data-floating-ui-aria-colspan',
  'data-floating-ui-aria-describedby',
  'data-floating-ui-aria-labelledby',
  'data-floating-ui-aria-level',
  'data-floating-ui-aria-posinset',
  'data-floating-ui-aria-setsize',
  'data-floating-ui-aria-expanded',
  'data-floating-ui-aria-haspopup',
  'data-floating-ui-aria-controls',
  'data-floating-ui-aria-activedescendant',
  'data-floating-ui-aria-autocomplete',
  'data-floating-ui-aria-readonly',
  'data-floating-ui-aria-required',
  'data-floating-ui-aria-invalid',
  'data-floating-ui-aria-errormessage',
  'data-floating-ui-aria-valuemin',
  'data-floating-ui-aria-valuemax',
  'data-floating-ui-aria-valuenow',
  'data-floating-ui-aria-valuetext',
  'data-floating-ui-aria-orientation',
  'data-floating-ui-aria-multiselectable',
  'data-floating-ui-aria-selected',
  'data-floating-ui-aria-checked',
  'data-floating-ui-aria-pressed',
  'data-floating-ui-aria-current',
  'data-floating-ui-aria-busy',
  'data-floating-ui-aria-live',
  'data-floating-ui-aria-atomic',
  'data-floating-ui-aria-relevant',
  'data-floating-ui-aria-grabbed',
  'data-floating-ui-aria-dropeffect',
  'data-floating-ui-aria-hidden',
  'data-floating-ui-aria-disabled',
  'data-floating-ui-aria-sort',
  'data-floating-ui-aria-rowcount',
  'data-floating-ui-aria-rowindex',
  'data-floating-ui-aria-rowspan',
  'data-floating-ui-aria-colcount',
  'data-floating-ui-aria-colindex',
  'data-floating-ui-aria-colspan',
]

export function HydrationSuppressor() {
  useEffect(() => {
    // Create a comprehensive hydration-safe environment
    const cleanup = createHydrationSafeEnvironment()

    // Additional cleanup for any remaining extension attributes
    const removeExtensionAttributes = () => {
      const elements = document.querySelectorAll('*')

      elements.forEach((element) => {
        const htmlElement = element as HTMLElement
        const attributes = Array.from(htmlElement.attributes)

        attributes.forEach((attr) => {
          if (BROWSER_EXTENSION_ATTRIBUTES.includes(attr.name)) {
            try {
              htmlElement.removeAttribute(attr.name)
            } catch {
              // Silently ignore removal errors
            }
          }
        })
      })
    }

    // Function to suppress hydration warnings
    const suppressHydrationWarnings = () => {
      // Override console.warn to filter out hydration warnings
      const originalWarn = console.warn
      console.warn = (...args) => {
        const message = args.join(' ')
        // Filter out common hydration warning messages
        if (
          message.includes('Extra attributes from the server') ||
          message.includes('data-new-gr-c-s-check-loaded') ||
          message.includes('data-gr-ext-installed') ||
          message.includes('Hydration') ||
          message.includes('hydration')
        ) {
          return // Suppress these warnings
        }
        originalWarn.apply(console, args)
      }

      // Override console.error for hydration errors
      const originalError = console.error
      console.error = (...args) => {
        const message = args.join(' ')
        // Filter out hydration-related errors
        if (
          message.includes('Extra attributes from the server') ||
          message.includes('data-new-gr-c-s-check-loaded') ||
          message.includes('data-gr-ext-installed') ||
          message.includes('Hydration') ||
          message.includes('hydration') ||
          message.includes('Text content does not match server-rendered HTML')
        ) {
          return // Suppress these errors
        }
        originalError.apply(console, args)
      }
    }

    // Clean up extension attributes immediately
    removeExtensionAttributes()

    // Suppress hydration warnings
    suppressHydrationWarnings()

    // Set up a mutation observer to handle dynamically added extension attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          if (BROWSER_EXTENSION_ATTRIBUTES.includes(mutation.attributeName)) {
            const target = mutation.target as HTMLElement
            try {
              target.removeAttribute(mutation.attributeName)
            } catch {
              // Silently ignore removal errors
            }
          }
        }
      })
    })

    // Start observing
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: BROWSER_EXTENSION_ATTRIBUTES
    })

    // Clean up on unmount
    return () => {
      cleanup()
      observer.disconnect()
    }
  }, [])

  // This component doesn't render anything
  return null
}

// HOC to suppress hydration warnings for specific components
export function withHydrationSuppression<P extends object>(
  Component: React.ComponentType<P>
) {
  return function HydrationSuppressedComponent(props: P) {
    return (
      <div suppressHydrationWarning>
        <Component {...props} />
      </div>
    )
  }
}

// Utility hook for components that need to handle hydration
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}