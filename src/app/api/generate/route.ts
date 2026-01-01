import { NextRequest } from 'next/server'
import { openAIService } from '@/lib/server/openai-service'
import { createSuccessResponse, createErrorResponse, validateRequestBody, handleAPIError } from '@/lib/server/api-utils'
import { AIAnalysisResult } from '@/types'

interface GenerateRequest {
  analysis: AIAnalysisResult
  componentName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = validateRequestBody<GenerateRequest>(body, ['analysis'])
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, null, 400)
    }

    const { analysis, componentName = 'GeneratedComponent' } = body as GenerateRequest

    // Validate analysis structure
    if (!analysis.detectedElements || !Array.isArray(analysis.detectedElements)) {
      return createErrorResponse('Invalid analysis data: detectedElements array is required', null, 400)
    }

    // Generate component using the server-side service
    const result = await openAIService.generateComponent(analysis, { componentName })

    // Validate the generated code is not empty
    if (!result.jsx || result.jsx.trim().length < 50) {
      console.error('Generated code is too short or empty:', result.jsx?.substring(0, 100))
      return createErrorResponse('Code generation failed: Generated code is incomplete. Please try again.', null, 500)
    }

    // Ensure the code has proper structure
    if (!result.jsx.includes('export default') && !result.jsx.includes('export default function')) {
      console.error('Generated code missing export statement')
      return createErrorResponse('Code generation failed: Generated code is missing required structure. Please try again.', null, 500)
    }

    const response = {
      jsx: result.jsx,
      css: '', // CSS is handled by Tailwind
      componentName: result.componentName,
      dependencies: Array.isArray(result.dependencies) ? result.dependencies : ['react'],
      generatedAt: new Date().toISOString(),
      version: 1
    }

    return createSuccessResponse(response)

  } catch (error) {
    return handleAPIError(error, 'Code Generation API')
  }
}
