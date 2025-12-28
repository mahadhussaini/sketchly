/**
 * Server-side API Utilities
 *
 * This module provides utilities for consistent API response handling,
 * error management, and request validation on the server side.
 */

import { NextRequest, NextResponse } from 'next/server'

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  error: string,
  details?: any,
  status: number = 500
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    },
    { status }
  )
}

/**
 * Handle API errors consistently
 */
export function handleAPIError(error: unknown, context: string): NextResponse<APIResponse> {
  console.error(`${context}:`, error)

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('OpenAI API key')) {
      return createErrorResponse('OpenAI service not configured', error.message, 503)
    }

    if (error.message.includes('rate limit')) {
      return createErrorResponse('Rate limit exceeded', error.message, 429)
    }

    if (error.message.includes('timeout')) {
      return createErrorResponse('Request timeout', error.message, 408)
    }

    return createErrorResponse('Internal server error', error.message, 500)
  }

  return createErrorResponse('Unknown error occurred', String(error), 500)
}

/**
 * Validate request body
 */
export function validateRequestBody<T>(
  body: any,
  requiredFields: (keyof T)[]
): { isValid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body is required' }
  }

  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      return { isValid: false, error: `Missing required field: ${String(field)}` }
    }
  }

  return { isValid: true }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File | null,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { isValid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] } = options

  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` }
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` }
  }

  return { isValid: true }
}

/**
 * Create a standardized API route wrapper
 */
export function createAPIRoute<TRequest = any, TResponse = any>(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse<APIResponse<TResponse>>>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse<APIResponse<TResponse>>> => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleAPIError(error, 'API Route Error')
    }
  }
}
