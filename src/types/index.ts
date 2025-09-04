export interface UploadedFile {
  file: File
  preview: string
  id: string
}

export interface AIAnalysisResult {
  detectedElements: DetectedElement[]
  extractedText: string[]
  suggestions: string[]
  confidence: number
}

export interface DetectedElement {
  type: 'button' | 'input' | 'card' | 'navbar' | 'modal' | 'text' | 'image' | 'container' | 'list'
  confidence: number
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  text?: string
  properties?: Record<string, unknown>
}

export interface ComponentTemplate {
  id: string
  name: string
  category: 'form' | 'navigation' | 'layout' | 'data-display' | 'feedback'
  description: string
  code: string
  preview: string
  tags: string[]
}

export interface ExportOptions {
  format: 'nextjs' | 'react' | 'html'
  includeStyles: boolean
  includeDependencies: boolean
  componentName: string
  typescript: boolean
}

export interface ProjectSettings {
  theme: 'light' | 'dark' | 'system'
  autoSave: boolean
  livePreview: boolean
  aiSuggestions: boolean
}
