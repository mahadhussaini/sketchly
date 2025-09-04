import { AIAnalysisResult } from '@/types'
import { GeneratedCode } from '@/store/sketch-store'

export async function generateCodeFromAnalysis(
  analysis: AIAnalysisResult,
  componentName: string = 'GeneratedComponent'
): Promise<GeneratedCode> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysis, componentName }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate code')
    }

    const result = await response.json()
    
    return {
      jsx: result.jsx,
      css: result.css,
      componentName: result.componentName,
      dependencies: result.dependencies,
      generatedAt: new Date(result.generatedAt),
      version: result.version
    }

  } catch (error) {
    console.error('Error generating code:', error)
    
    // Return a fallback component
    return {
      jsx: createFallbackComponent(componentName, analysis),
      css: '',
      componentName,
      dependencies: ['react'],
      generatedAt: new Date(),
      version: 1
    }
  }
}


function createFallbackComponent(componentName: string, analysis: AIAnalysisResult): string {
  const textElements = analysis.extractedText.slice(0, 3)
  
  return `import React from 'react'

export default function ${componentName}() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="space-y-4">
        ${textElements.map((text, index) => {
          if (index === 0) {
            return `<h1 className="text-2xl font-bold text-gray-900 dark:text-white">${text}</h1>`
          } else if (text.toLowerCase().includes('button')) {
            return `<button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            ${text}
          </button>`
          } else {
            return `<p className="text-gray-600 dark:text-gray-300">${text}</p>`
          }
        }).join('\n        ')}
        
        {/* Fallback content - manual editing required */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a generated component based on your sketch. 
            Please review and customize as needed.
          </p>
        </div>
      </div>
    </div>
  )
}`
}
