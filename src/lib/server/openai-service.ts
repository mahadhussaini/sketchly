/**
 * Server-side OpenAI Service
 *
 * This module provides server-side OpenAI API integration with
 * consistent error handling, request management, and response processing.
 */

import { getOpenAIClient, getGenerationModel, getAnalysisModel } from '@/lib/openai'
import { OpenAI } from 'openai'
import { AIAnalysisResult } from '@/types'

export interface GenerationOptions {
  componentName?: string
  temperature?: number
  maxTokens?: number
}

export interface AnalysisOptions {
  maxTokens?: number
  temperature?: number
}

/**
 * Server-side service for OpenAI code generation
 */
export class OpenAIService {
  private client: OpenAI | null = null

  async initialize(): Promise<void> {
    if (!this.client) {
      this.client = await getOpenAIClient()
    }
  }

  /**
   * Generate React component code from UI analysis
   */
  async generateComponent(
    analysis: AIAnalysisResult,
    options: GenerationOptions = {}
  ): Promise<{
    jsx: string
    dependencies: string[]
    componentName: string
  }> {
    try {
      await this.initialize()

      if (!this.client) {
        throw new Error('OpenAI client not initialized')
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('OpenAI API key')) {
        throw new Error('OpenAI API key is not properly configured. Please check your OPENAI_API_KEY in .env.local and ensure it\'s a valid key from https://platform.openai.com/api-keys.')
      }
      throw error
    }

    const {
      componentName = 'GeneratedComponent',
      temperature = 0.7,
      maxTokens = 4000  // Increased for more complete code
    } = options

    const elementsDescription = analysis.detectedElements
      .map((el) => `${el.type} at (${el.bounds?.x ?? 0}, ${el.bounds?.y ?? 0}) size ${el.bounds?.width ?? 0}x${el.bounds?.height ?? 0}${el.text ? ` with text "${el.text}"` : ''}`)
      .join('\n')

    try {
      const response = await this.client.chat.completions.create({
        model: getGenerationModel(),
        messages: [
        {
          role: "system",
          content: `You are an expert React developer who creates clean, responsive components using Tailwind CSS and modern React patterns.

CRITICAL REQUIREMENTS:
- ALWAYS generate a COMPLETE, FULLY FUNCTIONAL React component
- NEVER return only imports or partial code
- The component MUST include: imports, the component function definition, and a complete return statement with JSX
- Use functional components with TypeScript
- Apply Tailwind classes for styling
- Ensure responsive design (mobile-first)
- Use semantic HTML elements
- Include proper accessibility attributes
- Add hover and focus states for interactive elements
- Use Tailwind's utility classes for spacing, colors, and layouts
- Include proper imports for any icons (use Lucide React)
- Make the component production-ready and well-structured
- The component MUST be complete and runnable
- NEVER truncate or cut off the code - always provide the full component`
        },
        {
          role: "user",
          content: `Generate a COMPLETE React component based on this UI analysis. The component MUST be fully functional with all necessary code.

Component Name: ${componentName}

Detected Elements:
${elementsDescription}

Extracted Text: ${analysis.extractedText?.join(', ') || 'None'}

Suggestions: ${analysis.suggestions?.join(', ') || 'None'}

IMPORTANT: Generate a COMPLETE React component that includes:
1. All necessary import statements (React, icons, etc.)
2. A complete TypeScript functional component definition named "${componentName}"
3. A full return statement with complete JSX markup using Tailwind CSS
4. Proper component structure that can be rendered immediately

Example structure:
import React from 'react';
// other imports...

export default function ${componentName}() {
  return (
    <div className="...">
      {/* Complete JSX content */}
    </div>
  );
}

Return ONLY the complete component code without markdown code blocks, without explanations, without comments outside the code. Start directly with the import statements. Make sure the code is COMPLETE and does not end abruptly.`
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      stream: false  // Ensure we get the full response
    })

    const choice = response.choices[0]
    const content = choice?.message?.content
    const finishReason = choice?.finish_reason
    
    if (!content) {
      throw new Error('No code generation result received')
    }
    
    // Check if the response was truncated
    if (finishReason === 'length') {
      console.warn('OpenAI response was truncated due to token limit. Consider increasing max_tokens.')
    }

    // Clean up the response to extract just the code
    let generatedJSX = content
      // Remove markdown code blocks
      .replace(/```tsx?\n?/g, '')
      .replace(/```\n?/g, '')
      // Remove any leading/trailing whitespace and explanatory text
      .replace(/^[^i]*?(?=import|export|function|const)/i, '')
      .trim()

    // More strict validation that we have a complete component
    // Check for basic component structure
    const hasImports = /import\s+/.test(generatedJSX)
    const hasComponentFunction = new RegExp(`(function|const|export\\s+default\\s+function)\\s+${componentName}`, 'i').test(generatedJSX) || 
                                  /export\s+default\s+function/.test(generatedJSX) ||
                                  /const\s+\w+\s*=.*=>/.test(generatedJSX)
    const hasReturn = /return\s*\(/.test(generatedJSX)
    const hasJSX = /<[A-Za-z]/.test(generatedJSX)
    const hasExportDefault = /export\s+default/.test(generatedJSX)
    const codeLength = generatedJSX.length
    
    // Log validation details for debugging
    console.log('Code validation:', {
      hasImports,
      hasComponentFunction,
      hasReturn,
      hasJSX,
      hasExportDefault,
      codeLength,
      preview: generatedJSX.substring(0, 200)
    })

    // If the code is incomplete, ALWAYS use fallback
    // Check multiple conditions: must have function, return, JSX, and minimum length
    const isComplete = hasComponentFunction && hasReturn && hasJSX && codeLength > 200 && hasExportDefault
    
    if (!isComplete) {
      console.warn('Generated code is incomplete or invalid, using fallback component', {
        reason: !hasComponentFunction ? 'missing component function' :
                !hasReturn ? 'missing return statement' :
                !hasJSX ? 'missing JSX' :
                codeLength <= 200 ? `code too short (${codeLength} chars)` :
                !hasExportDefault ? 'missing export default' : 'unknown'
      })
      
      // Always use fallback when code is incomplete
      const extractedText = analysis.extractedText?.slice(0, 5) || []
      generatedJSX = this.createFallbackComponent(componentName, analysis, extractedText)
      
      // If we had some imports, try to preserve them
      if (hasImports && content.length > 50) {
        const imports = content.match(/import\s+[^;]+;/g)
        if (imports && imports.length > 0) {
          // Replace imports in fallback if they exist
          const fallbackImports = generatedJSX.match(/import\s+[^;]+;/g)?.[0] || ''
          if (fallbackImports) {
            generatedJSX = generatedJSX.replace(/^import\s+[^;]+;/, imports[0])
          } else {
            generatedJSX = `${imports[0]}\n${generatedJSX}`
          }
        }
      }
    }

    // Extract dependencies from imports
    const dependencies = this.extractDependencies(generatedJSX)

    return {
      jsx: generatedJSX,
      dependencies: Array.isArray(dependencies) ? dependencies : ['react'],
      componentName
    }
    } catch (error: unknown) {
      // Handle OpenAI API errors specifically
      const apiError = error as { status?: number }
      if (apiError.status === 401) {
        throw new Error('OpenAI API key is invalid or expired. Please check your OPENAI_API_KEY in .env.local and get a new key from https://platform.openai.com/api-keys if needed.')
      }
      if (apiError.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please wait a moment and try again.')
      }
      if (apiError.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.')
      }
      // Re-throw other errors
      throw error
    }
  }

  /**
   * Analyze a UI sketch using OpenAI Vision
   */
  async analyzeSketch(
    base64Image: string,
    options: AnalysisOptions = {}
  ): Promise<AIAnalysisResult> {
    try {
      await this.initialize()

      if (!this.client) {
        throw new Error('OpenAI client not initialized')
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('OpenAI API key')) {
        throw new Error('OpenAI API key is not properly configured. Please check your OPENAI_API_KEY in .env.local and ensure it\'s a valid key from https://platform.openai.com/api-keys.')
      }
      throw error
    }

    const { maxTokens = 2000, temperature = 0.1 } = options

    try {
      const response = await this.client.chat.completions.create({
      model: getAnalysisModel(),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this UI sketch and extract the following information:

1. Identify all UI elements (buttons, inputs, cards, navigation, text, images, etc.)
2. Extract any visible text content
3. Determine the layout structure and hierarchy
4. Suggest appropriate React components and Tailwind classes
5. Provide confidence scores for each detected element

Return the analysis in this JSON format:
{
  "detectedElements": [
    {
      "type": "button|input|card|navbar|modal|text|image|container|list",
      "confidence": 0.95,
      "bounds": {"x": 10, "y": 20, "width": 100, "height": 40},
      "text": "Button Label",
      "properties": {"variant": "primary", "size": "medium"}
    }
  ],
  "extractedText": ["Header Title", "Button Label", "Input Placeholder"],
  "suggestions": [
    "Use a grid layout for the card components",
    "Consider using a navigation bar at the top",
    "Add hover states for interactive elements"
  ],
  "confidence": 0.87
}

Focus on identifying common UI patterns and providing actionable suggestions for implementation.`
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No analysis result received')
    }

    // Parse the JSON response
    try {
      const analysisResult = JSON.parse(content) as AIAnalysisResult

      // Validate the result structure
      if (!analysisResult.detectedElements || !Array.isArray(analysisResult.detectedElements)) {
        throw new Error('Invalid analysis result structure')
      }

      return analysisResult
      } catch {
        // If JSON parsing fails, create a fallback response
        return {
          detectedElements: [
            {
              type: 'container',
              confidence: 0.5,
              bounds: { x: 0, y: 0, width: 400, height: 600 },
              text: 'Analysis partially completed',
              properties: {}
            }
          ],
          extractedText: ['Manual review required'],
          suggestions: [
            'The AI analysis encountered an issue. Please try uploading a clearer image.',
            'Consider drawing UI elements with more defined boundaries.',
            'Ensure good lighting and contrast in the sketch.'
          ],
          confidence: 0.3
        }
      }
    } catch (error: unknown) {
      // Handle OpenAI API errors specifically
      const apiError = error as { status?: number }
      if (apiError.status === 401) {
        throw new Error('OpenAI API key is invalid or expired. Please check your OPENAI_API_KEY in .env.local and get a new key from https://platform.openai.com/api-keys if needed.')
      }
      if (apiError.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please wait a moment and try again.')
      }
      if (apiError.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.')
      }
      // Re-throw other errors
      throw error
    }
  }

  /**
   * Create a fallback component when generated code is incomplete
   */
  private createFallbackComponent(componentName: string, analysis: AIAnalysisResult, extractedText: string[]): string {
    const textElements = extractedText.length > 0 ? extractedText : analysis.extractedText?.slice(0, 3) || []
    const elements = analysis.detectedElements?.slice(0, 5) || []
    
    // Ensure we have at least some content
    if (textElements.length === 0 && elements.length === 0) {
      textElements.push('Generated Component', 'This component was created from your sketch', 'Please customize as needed')
    }
    
    const elementsJSX = textElements.map((text, index) => {
      // Clean and escape text safely - remove template literal syntax and special chars
      const cleanText = (text || '').replace(/[{}<>]/g, '').replace(/\${/g, '').replace(/`/g, '').substring(0, 100).trim()
      const displayText = cleanText || (index === 0 ? 'Component' : `Item ${index + 1}`)
      
      if (index === 0) {
        return `        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">${displayText}</h1>`
      } else if (text.toLowerCase().includes('button') || text.toLowerCase().includes('click')) {
        return `        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          ${displayText}
        </button>`
      } else if (text.toLowerCase().includes('input') || text.toLowerCase().includes('search')) {
        return `        <input 
          type="text" 
          placeholder="${displayText.substring(0, 50)}" 
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />`
      } else {
        return `        <p className="text-gray-600 dark:text-gray-300">${displayText}</p>`
      }
    }).join('\n')
    
    const uiElementsJSX = elements.length > 0 ? elements.map((el) => {
      const cleanText = (el.text || '').replace(/[{}<>]/g, '').replace(/\${/g, '').substring(0, 100).trim()
      
      if (el.type === 'button') {
        return `        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          ${cleanText || 'Button'}
        </button>`
      } else if (el.type === 'input') {
        return `        <input 
          type="text" 
          placeholder="${cleanText.substring(0, 50) || 'Input'}" 
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        />`
      } else if (el.type === 'card') {
        return `        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">${cleanText || 'Card Title'}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Card content</p>
        </div>`
      }
      return ''
    }).filter(Boolean).join('\n') : ''
    
    return `import React from 'react';

export default function ${componentName}() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="space-y-6">
${elementsJSX}
${uiElementsJSX}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This component was generated from your sketch. Please customize as needed.
          </p>
        </div>
      </div>
    </div>
  );
}`
  }

  /**
   * Extract dependencies from generated code
   */
  private extractDependencies(code: string): string[] {
    const dependencies = new Set<string>()

    // Extract React imports
    if (code.includes('useState') || code.includes('useEffect') || code.includes('React')) {
      dependencies.add('react')
    }

    // Extract Lucide React imports
    const lucideMatch = code.match(/from ['"]lucide-react['"]/)
    if (lucideMatch) {
      dependencies.add('lucide-react')
    }

    // Extract other common dependencies
    const commonLibs = ['next/image', 'next/link', '@headlessui/react', 'framer-motion']
    commonLibs.forEach(lib => {
      if (code.includes(lib)) {
        dependencies.add(lib)
      }
    })

    return Array.from(dependencies)
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService()
