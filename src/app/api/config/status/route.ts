import { NextRequest } from 'next/server'
import { getOpenAIConfigStatus } from '@/lib/openai'
import { createSuccessResponse, handleAPIError } from '@/lib/server/api-utils'

export async function GET(_request: NextRequest) {
  try {
    console.log('[Config Status] Starting configuration status check...')

    // Log environment details for debugging
    const nodeEnv = process.env.NODE_ENV
    console.log('[Config Status] Node environment:', nodeEnv)

    const envKeys = Object.keys(process.env)
    const relevantKeys = envKeys.filter(key => key.includes('OPENAI') || key.includes('NEXT_PUBLIC'))
    console.log('[Config Status] Relevant env var keys found:', relevantKeys)

    // Get OpenAI configuration status
    const openaiStatus = getOpenAIConfigStatus()
    console.log('[OpenAI Config] Checking environment variables...')
    console.log('[OpenAI Config] OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'NOT SET', `(length: ${process.env.OPENAI_API_KEY?.length || 0})`)

    if (process.env.OPENAI_API_KEY) {
      const startsWith = process.env.OPENAI_API_KEY.substring(0, 3)
      console.log('[OpenAI Config] OPENAI_API_KEY starts with:', startsWith === 'sk-' ? 'sk-' : startsWith)
    }

    console.log('[OpenAI Config] OPENAI_ORGANIZATION_ID:', process.env.OPENAI_ORGANIZATION_ID ? 'Set' : 'NOT SET')
    console.log('[OpenAI Config] OPENAI_PROJECT_ID:', process.env.OPENAI_PROJECT_ID ? 'Set' : 'NOT SET')

    const openaiEnvVars = envKeys.filter(key => key.startsWith('OPENAI_')).map(key => `${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`)
    console.log('[OpenAI Config] All OPENAI_* env vars:', openaiEnvVars)

    // Validate API key
    console.log('[OpenAI Config] API key validation:', openaiStatus.isConfigured ? '✅ Valid' : '❌ Invalid')

    if (!openaiStatus.isConfigured) {
      console.log('[OpenAI Config] ❌ OPENAI_API_KEY appears to be invalid')
      console.log('[OpenAI Config] Expected format: starts with "sk-" and 51+ characters')
      console.log('[OpenAI Config] Actual value:', process.env.OPENAI_API_KEY ? `"${process.env.OPENAI_API_KEY.substring(0, 10)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}"` : 'NOT SET', `(length: ${process.env.OPENAI_API_KEY?.length || 0})`)
    }

    // Environment validation
    console.log('[Env Validation] Starting validation of 4 environment variables')

    const validations = [
      { key: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY },
      { key: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL },
      { key: 'OPENAI_ORGANIZATION_ID', value: process.env.OPENAI_ORGANIZATION_ID },
      { key: 'OPENAI_PROJECT_ID', value: process.env.OPENAI_PROJECT_ID }
    ]

    const errors: string[] = []

    validations.forEach(({ key, value }) => {
      const isSet = !!value
      console.log(`[Env Validation] Checking ${key}: ${isSet ? 'Set' : 'NOT SET'}`)

      if (key === 'OPENAI_API_KEY' && value) {
        const isValid = value.startsWith('sk-') && value.length >= 51
        console.log(`[Env Validation] ${key} validation: ${isValid ? '✅ Valid' : '❌ Invalid'}`)
        if (!isValid) {
          errors.push(`Environment variable ${key} has invalid format`)
        }
      } else if (key === 'NEXT_PUBLIC_APP_URL' && value) {
        console.log(`[Env Validation] ${key} validation: ✅ Valid`)
      } else if (key.includes('OPENAI_ORGANIZATION_ID') || key.includes('OPENAI_PROJECT_ID')) {
        console.log(`[Env Validation] ⚠️  Optional variable ${key} is not set`)
      }
    })

    console.log(`[Env Validation] Validation complete: ${errors.length > 0 ? `❌ ${errors.length} error(s) found` : '✅ All validations passed'}`)
    if (errors.length > 0) {
      console.log('[Env Validation] Errors:', errors)
    }

    // Prepare final status
    const finalStatus = {
      ...openaiStatus,
      environmentValidation: {
        errors,
        isValid: errors.length === 0
      },
      environment: {
        nodeEnv,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    }

    console.log('[Config Status] Environment validation:', finalStatus.environmentValidation.isValid ? '✅ Valid' : `❌ ${errors.length} error(s)`)
    console.log('[Config Status] OPENAI_API_KEY present:', finalStatus.environment.hasOpenAIKey)
    console.log('[Config Status] NEXT_PUBLIC_APP_URL present:', finalStatus.environment.hasAppUrl)
    if (finalStatus.environment.appUrl) {
      console.log('[Config Status] NEXT_PUBLIC_APP_URL value:', finalStatus.environment.appUrl)
    }
    console.log('[Config Status] Overall configuration status:', (finalStatus.isConfigured && finalStatus.environmentValidation.isValid) ? '✅ Configured' : '❌ Not configured')
    console.log('[Config Status] Returning status response')

    return createSuccessResponse(finalStatus)

  } catch (error) {
    console.error('[Config Status] Error in status endpoint:', error)
    return handleAPIError(error, 'Configuration Status API')
  }
}