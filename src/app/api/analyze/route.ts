import { NextRequest } from 'next/server'
import { openAIService } from '@/lib/server/openai-service'
import { createSuccessResponse, createErrorResponse, validateFileUpload, handleAPIError } from '@/lib/server/api-utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    // Validate file upload
    const fileValidation = validateFileUpload(file)
    if (!fileValidation.isValid) {
      return createErrorResponse(fileValidation.error!, null, 400)
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Analyze sketch using the server-side service
    const analysisResult = await openAIService.analyzeSketch(base64)

    return createSuccessResponse(analysisResult)

  } catch (error) {
    return handleAPIError(error, 'Sketch Analysis API')
  }
}
