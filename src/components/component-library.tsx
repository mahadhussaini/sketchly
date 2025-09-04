'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ComponentTemplate } from '@/types'
import { Icon } from '@/components/icon-wrapper'

const componentTemplates: ComponentTemplate[] = [
  // Form Components
  {
    id: 'button-primary',
    name: 'Primary Button',
    category: 'form',
    description: 'Main action button with primary styling',
    code: `<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
  Click me
</button>`,
    preview: 'Button',
    tags: ['button', 'primary', 'action']
  },
  {
    id: 'button-secondary',
    name: 'Secondary Button',
    category: 'form',
    description: 'Secondary action button',
    code: `<button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors font-medium">
  Secondary
</button>`,
    preview: 'Secondary',
    tags: ['button', 'secondary', 'action']
  },
  {
    id: 'input-text',
    name: 'Text Input',
    category: 'form',
    description: 'Standard text input field',
    code: `<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>`,
    preview: 'Input',
    tags: ['input', 'form', 'text']
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'form',
    description: 'Multi-line text input',
    code: `<textarea
  placeholder="Enter your message..."
  rows={4}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
/>`,
    preview: 'Textarea',
    tags: ['textarea', 'form', 'text', 'multiline']
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'form',
    description: 'Checkbox input with label',
    code: `<label className="flex items-center space-x-2">
  <input
    type="checkbox"
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
  <span className="text-sm">Accept terms and conditions</span>
</label>`,
    preview: '☐ Checkbox',
    tags: ['checkbox', 'form', 'input']
  },

  // Layout Components
  {
    id: 'card-basic',
    name: 'Basic Card',
    category: 'layout',
    description: 'Simple card container with shadow',
    code: `<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-300">Card content goes here.</p>
</div>`,
    preview: 'Card',
    tags: ['card', 'container', 'layout']
  },
  {
    id: 'card-with-image',
    name: 'Card with Image',
    category: 'layout',
    description: 'Card with image and content',
    code: `<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
  <img src="/placeholder.jpg" alt="Card image" className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Card Title</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">Card description goes here.</p>
    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
      Learn More
    </button>
  </div>
</div>`,
    preview: 'Card+Image',
    tags: ['card', 'image', 'layout']
  },
  {
    id: 'grid-responsive',
    name: 'Responsive Grid',
    category: 'layout',
    description: 'Responsive grid layout',
    code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h3 className="font-medium mb-2">Grid Item 1</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">Content for first item</p>
  </div>
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h3 className="font-medium mb-2">Grid Item 2</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">Content for second item</p>
  </div>
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h3 className="font-medium mb-2">Grid Item 3</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">Content for third item</p>
  </div>
</div>`,
    preview: 'Grid',
    tags: ['grid', 'responsive', 'layout']
  },

  // Navigation Components
  {
    id: 'navbar-simple',
    name: 'Simple Navbar',
    category: 'navigation',
    description: 'Clean navigation bar with logo and links',
    code: `<nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
  <div className="font-bold text-xl text-gray-900 dark:text-white">Logo</div>
  <div className="flex space-x-6">
    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Home</a>
    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
  </div>
</nav>`,
    preview: 'Navbar',
    tags: ['navigation', 'header', 'menu']
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    description: 'Breadcrumb navigation',
    code: `<nav className="flex" aria-label="Breadcrumb">
  <ol className="flex items-center space-x-2">
    <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Home</a></li>
    <li className="text-gray-400">/</li>
    <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Products</a></li>
    <li className="text-gray-400">/</li>
    <li className="text-gray-900 dark:text-white font-medium">Current Page</li>
  </ol>
</nav>`,
    preview: 'Home / Products / Current',
    tags: ['breadcrumb', 'navigation', 'menu']
  },

  // Data Display Components
  {
    id: 'table-simple',
    name: 'Simple Table',
    category: 'data-display',
    description: 'Basic data table',
    code: `<div className="overflow-x-auto">
  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
    <thead>
      <tr className="bg-gray-50 dark:bg-gray-800">
        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium">Name</th>
        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium">Email</th>
        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">John Doe</td>
        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">john@example.com</td>
        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
    preview: 'Table',
    tags: ['table', 'data', 'display']
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'data-display',
    description: 'Status or label badge',
    code: `<div className="flex flex-wrap gap-2">
  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Primary</span>
  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Success</span>
  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Danger</span>
  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Warning</span>
</div>`,
    preview: 'Badges',
    tags: ['badge', 'status', 'label']
  },

  // Feedback Components
  {
    id: 'alert-success',
    name: 'Success Alert',
    category: 'feedback',
    description: 'Success notification alert',
    code: `<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success!</h3>
      <p className="mt-2 text-sm text-green-700 dark:text-green-300">Your changes have been saved successfully.</p>
    </div>
  </div>
</div>`,
    preview: 'Success Alert',
    tags: ['alert', 'success', 'notification']
  },
  {
    id: 'loading-spinner',
    name: 'Loading Spinner',
    category: 'feedback',
    description: 'Loading spinner animation',
    code: `<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
</div>`,
    preview: '⏳ Loading...',
    tags: ['loading', 'spinner', 'animation']
  },

  // Advanced Components
  {
    id: 'modal-basic',
    name: 'Basic Modal',
    category: 'feedback',
    description: 'Simple modal dialog',
    code: `<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Modal Title</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Modal content goes here.</p>
      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm</button>
      </div>
    </div>
  </div>
</div>`,
    preview: 'Modal',
    tags: ['modal', 'dialog', 'popup']
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    category: 'navigation',
    description: 'Dropdown menu component',
    code: `<div className="relative">
  <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
    <span>Menu</span>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Option 1</a>
    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Option 2</a>
    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Option 3</a>
  </div>
</div>`,
    preview: 'Dropdown',
    tags: ['dropdown', 'menu', 'navigation']
  }
]

const categories = [
  { id: 'form', name: 'Form Elements', iconName: 'MousePointer' as const },
  { id: 'layout', name: 'Layout', iconName: 'Layout' as const },
  { id: 'navigation', name: 'Navigation', iconName: 'List' as const },
  { id: 'data-display', name: 'Data Display', iconName: 'Type' as const },
  { id: 'feedback', name: 'Feedback', iconName: 'Settings' as const }
]

interface ComponentLibraryProps {
  onClose?: () => void
}

export function ComponentLibrary({ onClose }: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['form', 'layout'])
  )

  const filteredComponents = componentTemplates.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || component.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const componentsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = filteredComponents.filter(comp => comp.category === category.id)
    return acc
  }, {} as Record<string, ComponentTemplate[]>)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const copyComponentCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Sketchly Components</h2>
          {/* Mobile Close Button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden w-8 h-8 p-0"
            >
              <Icon name="X" className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="component-search"
            name="component-search"
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Categories and Components */}
      <div className="flex-1 overflow-y-auto">
        {categories.map(category => {
          const components = componentsByCategory[category.id] || []
          const isExpanded = expandedCategories.has(category.id)

          if (components.length === 0 && searchTerm) return null

          return (
            <div key={category.id} className="border-b border-border last:border-b-0">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={category.iconName} className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm text-foreground">{category.name}</span>
                  <span className="text-xs text-muted-foreground">({components.length})</span>
                </div>
                {isExpanded ? (
                  <Icon name="ChevronDown" className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Icon name="ChevronRight" className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Components */}
              {isExpanded && (
                <div className="pb-2">
                  {components.map(component => (
                    <div
                      key={component.id}
                      className="mx-3 mb-2 p-3 bg-background rounded-md border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {component.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {component.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyComponentCode(component.code)}
                            className="w-6 h-6 p-0"
                          >
                            <Icon name="Copy" className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0"
                          >
                            <Icon name="Plus" className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Component Preview */}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded border p-2 text-xs">
                        <div className="text-center text-muted-foreground py-2">
                          {component.preview}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {component.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          <Icon name="Plus" className="w-4 h-4 mr-2" />
          Add Custom Component
        </Button>
      </div>
    </div>
  )
}
