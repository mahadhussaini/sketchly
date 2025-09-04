import { NextRequest, NextResponse } from 'next/server'
import { AIAnalysisResult } from '@/types'

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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
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
                url: base64,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No analysis result received')
    }

    // Parse the JSON response
    let analysisResult: AIAnalysisResult
    try {
      analysisResult = JSON.parse(content)
    } catch {
      // If JSON parsing fails, create a fallback response
      analysisResult = {
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

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('Error analyzing sketch:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze sketch',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
