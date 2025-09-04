import { NextRequest, NextResponse } from 'next/server'

interface DetectedElement {
  type: string
  confidence?: number
  bounds?: {
    x: number
    y: number
    width: number
    height: number
  }
  text?: string
  properties?: Record<string, unknown>
}

interface AnalysisData {
  detectedElements: DetectedElement[]
  extractedText?: string[]
  suggestions?: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Dynamically import OpenAI to avoid build-time issues
    const { default: OpenAI } = await import('openai')

    const openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null

    // Check if OpenAI client is available
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      )
    }

    const { analysis, componentName = 'GeneratedComponent' } = await request.json()

    if (!analysis || !analysis.detectedElements) {
      return NextResponse.json(
        { error: 'Invalid analysis data provided' },
        { status: 400 }
      )
    }

    const elementsDescription = (analysis as AnalysisData).detectedElements
      .map((el: DetectedElement) => `${el.type} at (${el.bounds?.x ?? 0}, ${el.bounds?.y ?? 0}) size ${el.bounds?.width ?? 0}x${el.bounds?.height ?? 0}${el.text ? ` with text "${el.text}"` : ''}`)
      .join('\n')

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
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
      max_tokens: 3000,
      temperature: 0.7
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
    const dependencies = extractDependencies(generatedJSX)

    const result = {
      jsx: generatedJSX,
      css: '', // CSS is handled by Tailwind
      componentName,
      dependencies,
      generatedAt: new Date().toISOString(),
      version: 1
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error generating code:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function extractDependencies(code: string): string[] {
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
