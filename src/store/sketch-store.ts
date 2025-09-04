import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AIAnalysisResult } from '@/types'

export interface SketchData {
  id: string
  name: string
  imageUrl: string
  uploadedAt: Date
  analysis?: AIAnalysisResult
}

export interface GeneratedCode {
  jsx: string
  css: string
  componentName: string
  dependencies: string[]
  generatedAt: Date
  version: number
}

interface SketchStore {
  // State
  sketches: SketchData[]
  currentSketch: SketchData | null
  generatedCode: GeneratedCode | null
  isAnalyzing: boolean
  isGenerating: boolean
  
  // Actions
  addSketch: (sketch: SketchData) => void
  setCurrentSketch: (sketch: SketchData | null) => void
  updateSketchAnalysis: (sketchId: string, analysis: AIAnalysisResult) => void
  setGeneratedCode: (code: GeneratedCode) => void
  updateGeneratedCode: (updates: Partial<GeneratedCode>) => void
  setAnalyzing: (analyzing: boolean) => void
  setGenerating: (generating: boolean) => void
  clearAll: () => void
}

export const useSketchStore = create<SketchStore>()(
  devtools(
    (set) => ({
      // Initial state
      sketches: [],
      currentSketch: null,
      generatedCode: null,
      isAnalyzing: false,
      isGenerating: false,

      // Actions
      addSketch: (sketch) =>
        set((state) => ({
          sketches: [...state.sketches, sketch],
          currentSketch: sketch,
        })),

      setCurrentSketch: (sketch) =>
        set({ currentSketch: sketch }),

      updateSketchAnalysis: (sketchId, analysis) =>
        set((state) => ({
          sketches: state.sketches.map((sketch) =>
            sketch.id === sketchId ? { ...sketch, analysis } : sketch
          ),
          currentSketch:
            state.currentSketch?.id === sketchId
              ? { ...state.currentSketch, analysis }
              : state.currentSketch,
        })),

      setGeneratedCode: (code) =>
        set({ generatedCode: code }),

      updateGeneratedCode: (updates) =>
        set((state) => ({
          generatedCode: state.generatedCode
            ? { ...state.generatedCode, ...updates }
            : null,
        })),

      setAnalyzing: (analyzing) =>
        set({ isAnalyzing: analyzing }),

      setGenerating: (generating) =>
        set({ isGenerating: generating }),

      clearAll: () =>
        set({
          sketches: [],
          currentSketch: null,
          generatedCode: null,
          isAnalyzing: false,
          isGenerating: false,
        }),
    }),
    {
      name: 'sketch-store',
    }
  )
)
