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
      maxTokens = 3000
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

Guidelines:
- Use functional components with TypeScript
- Apply Tailwind classes for styling
- Ensure responsive design (mobile-first)
- Use semantic HTML elements
- Include proper accessibility attributes
- Add hover and focus states for interactive elements
- Use Tailwind's utility classes for spacing, colors, and layouts
- Include proper imports for any icons (use Lucide React)
- Make the component production-ready and well-structured`
        },
        {
          role: "user",
          content: `Generate a React component based on this UI analysis:

Component Name: ${componentName}

Detected Elements:
${elementsDescription}

Extracted Text: ${analysis.extractedText?.join(', ') || 'None'}

Suggestions: ${analysis.suggestions?.join(', ') || 'None'}

Please generate:
1. A complete React component with TypeScript
2. Use Tailwind CSS for all styling
3. Make it responsive and accessible
4. Include any necessary imports
5. Use modern React patterns (hooks, functional components)

Return ONLY the component code without markdown formatting or explanations.`
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No code generation result received')
    }

    // Clean up the response to extract just the code
    const generatedJSX = content
      .replace(/```tsx?/g, '')
      .replace(/```/g, '')
      .trim()

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
