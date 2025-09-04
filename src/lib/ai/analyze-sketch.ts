import { AIAnalysisResult } from '@/types'

export async function analyzeSketch(file: File): Promise<AIAnalysisResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to analyze sketch')
    }

    const analysisResult = await response.json() as AIAnalysisResult
    
    // Validate the result structure
    if (!analysisResult.detectedElements || !Array.isArray(analysisResult.detectedElements)) {
      throw new Error('Invalid analysis result structure')
    }

    return analysisResult

  } catch (error) {
    console.error('Error analyzing sketch:', error)
    
    // Return a fallback analysis
    return {
      detectedElements: [
        {
          type: 'container',
          confidence: 0.5,
          bounds: { x: 0, y: 0, width: 400, height: 600 },
          text: 'Unable to analyze sketch automatically',
          properties: {}
        }
      ],
      extractedText: ['Manual analysis required'],
      suggestions: [
        'Try uploading a clearer image',
        'Ensure the sketch is well-lit and in focus',
        'Draw UI elements with clear boundaries'
      ],
      confidence: 0.1
    }
  }
}
