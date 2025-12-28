import { OpenAI } from 'openai'

/**
 * OpenAI Configuration and Client Management
 *
 * This module provides a centralized, secure way to configure and access
 * OpenAI API clients throughout the application. It includes proper validation,
 * error handling, and environment variable management.
 */

// Environment variable validation
function validateOpenAIConfig(): { isValid: boolean; error?: string } {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      isValid: false,
      error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.'
    }
  }

  if (apiKey === 'your_openai_api_key_here' || apiKey.trim() === '') {
    return {
      isValid: false,
      error: 'OpenAI API key appears to be a placeholder. Please replace "your_openai_api_key_here" with your actual OpenAI API key from https://platform.openai.com/api-keys.'
    }
  }

  // Check for known invalid key patterns
  const invalidPatterns = [
    'sk-test-',
    'sk-invalid-',
    'sk-fake-'
  ]

  for (const pattern of invalidPatterns) {
    if (apiKey.includes(pattern) || apiKey === pattern) {
      return {
        isValid: false,
        error: 'OpenAI API key appears to be invalid or a test key. Please get a valid API key from https://platform.openai.com/api-keys.'
      }
    }
  }

  // Basic validation - OpenAI keys start with 'sk-'
  if (!apiKey.startsWith('sk-')) {
    return {
      isValid: false,
      error: 'OpenAI API key appears to be invalid. Keys should start with "sk-".'
    }
  }

  // Check minimum length for OpenAI keys (they're typically 51+ characters)
  if (apiKey.length < 51) {
    return {
      isValid: false,
      error: 'OpenAI API key appears to be too short. Valid keys are typically 51+ characters long.'
    }
  }

  return { isValid: true }
}

/**
 * Get a configured OpenAI client instance
 * @returns Promise<OpenAI> - Configured OpenAI client
 * @throws Error if configuration is invalid
 */
export async function getOpenAIClient(): Promise<OpenAI> {
  const validation = validateOpenAIConfig()

  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  try {
    // Dynamically import OpenAI to avoid build-time issues
    const { default: OpenAI } = await import('openai')

    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // Optional: Add timeout and other configuration
      timeout: 60000, // 60 seconds
      maxRetries: 3,
    })
  } catch (error) {
    throw new Error(`Failed to initialize OpenAI client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Check if OpenAI is properly configured
 * @returns boolean - True if OpenAI is configured and ready to use
 */
export function isOpenAIConfigured(): boolean {
  return validateOpenAIConfig().isValid
}

/**
 * Get the configured model for code generation
 * @returns string - The model to use for code generation
 */
export function getGenerationModel(): string {
  return process.env.OPENAI_MODEL_GENERATE || 'gpt-4.1-nano'
}

/**
 * Get the configured model for sketch analysis
 * @returns string - The model to use for sketch analysis
 */
export function getAnalysisModel(): string {
  return process.env.OPENAI_MODEL_ANALYZE || 'gpt-4.1-nano'
}

/**
 * Get configuration status for debugging/admin purposes
 * @returns Object with configuration status
 */
export function getOpenAIConfigStatus() {
  const validation = validateOpenAIConfig()
  const apiKey = process.env.OPENAI_API_KEY

  return {
    isConfigured: validation.isValid,
    hasApiKey: !!apiKey,
    keyFormatValid: apiKey ? apiKey.startsWith('sk-') : false,
    isPlaceholder: apiKey === 'your_openai_api_key_here',
    generationModel: getGenerationModel(),
    analysisModel: getAnalysisModel(),
    error: validation.error
  }
}
