'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  X,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSketchStore } from '@/store/sketch-store'
import { generateId, formatFileSize, isValidImageFile, createImagePreview } from '@/lib/utils'
import { analyzeSketch } from '@/lib/ai/analyze-sketch'
import toast from 'react-hot-toast'

interface SketchUploadProps {
  onUploadComplete?: () => void
}

export function SketchUpload({ onUploadComplete }: SketchUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string
    file: File
    preview: string
    status: 'uploading' | 'analyzing' | 'completed' | 'error'
  }>>([])
  
  const { addSketch, setAnalyzing, updateSketchAnalysis } = useSketchStore()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(isValidImageFile)
    
    if (validFiles.length !== acceptedFiles.length) {
      toast.error('Some files were not uploaded. Only JPG, PNG, WebP, and PDF files are supported.')
    }

    // Create preview objects for valid files
    const filePromises = validFiles.map(async (file) => {
      const preview = await createImagePreview(file)
      return {
        id: generateId(),
        file,
        preview,
        status: 'uploading' as const
      }
    })

    const newFiles = await Promise.all(filePromises)
    setUploadedFiles(prev => [...prev, ...newFiles])

    // Process each file
    for (const uploadedFile of newFiles) {
      try {
        // Update status to analyzing
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'analyzing' }
              : f
          )
        )

        setAnalyzing(true)

        // Create sketch object
        const sketch = {
          id: uploadedFile.id,
          name: uploadedFile.file.name,
          imageUrl: uploadedFile.preview,
          uploadedAt: new Date()
        }

        // Add to store
        addSketch(sketch)

        // Analyze with AI
        const analysis = await analyzeSketch(uploadedFile.file)
        
        // Update with analysis results
        updateSketchAnalysis(sketch.id, analysis)

        // Update file status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'completed' }
              : f
          )
        )

        toast.success(`Analysis complete for ${uploadedFile.file.name}`)
        
        if (onUploadComplete) {
          onUploadComplete()
        }

      } catch (error) {
        console.error('Error processing file:', error)
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'error' }
              : f
          )
        )

        toast.error(`Failed to analyze ${uploadedFile.file.name}`)
      } finally {
        setAnalyzing(false)
      }
    }
  }, [addSketch, setAnalyzing, updateSketchAnalysis, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...'
      case 'analyzing':
        return 'Analyzing with AI...'
      case 'completed':
        return 'Analysis complete'
      case 'error':
        return 'Analysis failed'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Upload to Sketchly
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload hand-drawn sketches, wireframes, or design mockups to convert them into code
        </p>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
          </div>

          {isDragActive ? (
            <div>
              <p className="text-base sm:text-lg font-medium text-primary">
                Drop your sketches here
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Release to upload and analyze
              </p>
            </div>
          ) : (
            <div>
              <p className="text-base sm:text-lg font-medium text-foreground">
                Drag & drop your sketches here
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                or click to browse files
              </p>
              <Button variant="outline" size="sm" className="sm:size-default">
                Choose Files
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Supports JPG, PNG, WebP, and PDF files up to 10MB
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-medium text-foreground">Uploaded Files</h3>

          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-card border border-border rounded-lg"
              >
                {/* File Preview */}
                <div className="flex-shrink-0">
                  {file.file.type === 'application/pdf' ? (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={file.preview}
                        alt={file.file.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {file.file.name}
                  </p>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file.size)}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(file.status)}
                      <span>{getStatusText(file.status)}</span>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={file.status === 'analyzing'}
                  className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 p-0"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
        <h4 className="text-xs sm:text-sm font-medium text-foreground mb-2">Tips for better results:</h4>
        <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
          <li>• Ensure good lighting and clear visibility of all UI elements</li>
          <li>• Include labels and text content in your sketches</li>
          <li>• Draw clear boundaries between different components</li>
          <li>• Use consistent spacing and alignment</li>
        </ul>
      </div>
    </div>
  )
}
