/**
 * OpenAI Client-side Utilities
 *
 * This module provides client-side utilities for OpenAI API interactions.
 * It handles communication with server-side API routes and provides
 * a clean interface for the frontend components.
 */

export interface OpenAIConfig {
  isConfigured: boolean
  hasApiKey: boolean
  keyFormatValid: boolean
  isPlaceholder: boolean
  generationModel: string
  analysisModel: string
  error?: string
}

/**
 * Get OpenAI configuration status from the server
 */
export async function getOpenAIConfigStatus(): Promise<OpenAIConfig> {
  try {
    const response = await fetch('/api/config/status')
    if (!response.ok) {
      throw new Error('Failed to fetch config status')
    }
    const result = await response.json()
    // Handle wrapped API response { success: true, data: {...} }
    const status = result.data || result
    return {
      isConfigured: status.isConfigured || false,
      hasApiKey: status.hasApiKey || false,
      keyFormatValid: status.keyFormatValid || false,
      isPlaceholder: status.isPlaceholder || false,
      generationModel: status.generationModel || 'gpt-4o',
      analysisModel: status.analysisModel || 'gpt-4o',
      error: status.error
    }
  } catch (error) {
    console.error('Error fetching OpenAI config status:', error)
    return {
      isConfigured: false,
      hasApiKey: false,
      keyFormatValid: false,
      isPlaceholder: true,
      generationModel: 'gpt-4o',
      analysisModel: 'gpt-4o',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if OpenAI is properly configured
 */
export async function isOpenAIConfigured(): Promise<boolean> {
  const status = await getOpenAIConfigStatus()
  return status.isConfigured
}

/**
 * Get the current generation model
 */
export async function getGenerationModel(): Promise<string> {
  const status = await getOpenAIConfigStatus()
  return status.generationModel
}

/**
 * Get the current analysis model
 */
export async function getAnalysisModel(): Promise<string> {
  const status = await getOpenAIConfigStatus()
  return status.analysisModel
}