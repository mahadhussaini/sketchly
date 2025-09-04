'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Cpu,
  HardDrive,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
// Temporary inline performance analysis
interface PerformanceIssue {
  type: 'warning' | 'error' | 'info'
  message: string
  suggestion: string
  impact: 'high' | 'medium' | 'low'
  category: 'rendering' | 'bundle' | 'memory' | 'network' | 'accessibility'
  estimatedSavings?: string
}

interface PerformanceMetrics {
  estimatedBundleSize: number
  renderComplexity: number
  potentialOptimizations: number
  performanceScore: number
  grade: string
}

function analyzePerformance(code: string): {
  issues: PerformanceIssue[]
  metrics: PerformanceMetrics
  suggestions: string[]
} {
  const issues: PerformanceIssue[] = []

  // Basic bundle size analysis
  if (code.length > 50000) {
    issues.push({
      type: 'warning',
      message: 'Large component detected',
      suggestion: 'Consider breaking down into smaller components',
      impact: 'medium',
      category: 'bundle'
    })
  }

  // Basic rendering analysis
  const useStateCount = (code.match(/useState/g) || []).length
  if (useStateCount > 5) {
    issues.push({
      type: 'info',
      message: 'Multiple state variables',
      suggestion: 'Consider using useReducer for complex state',
      impact: 'low',
      category: 'rendering'
    })
  }

  const metrics: PerformanceMetrics = {
    estimatedBundleSize: code.length * 0.8,
    renderComplexity: useStateCount * 10,
    potentialOptimizations: issues.length,
    performanceScore: Math.max(0, 100 - (issues.length * 10)),
    grade: issues.length === 0 ? 'A' : 'B'
  }

  const suggestions = [
    'Consider using React.memo for functional components',
    'Use useMemo for expensive computations',
    'Implement lazy loading for better performance'
  ]

  return { issues, metrics, suggestions }
}

function getPerformanceTips(_componentType: string): string[] {
  return [
    'Use React DevTools Profiler to identify bottlenecks',
    'Implement error boundaries for better error handling',
    'Consider using React.lazy for code splitting'
  ]
}
import { useSketchStore } from '@/store/sketch-store'

interface PerformanceAnalyzerProps {
  code: string
}

export function PerformanceAnalyzer({ code }: PerformanceAnalyzerProps) {
  const [issues, setIssues] = useState<PerformanceIssue[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTips, setShowTips] = useState(false)

  const { generatedCode } = useSketchStore()

  const analyzeCode = useCallback(async () => {
    setIsAnalyzing(true)
    try {
      const result = analyzePerformance(code)
      setIssues(result.issues)
      setMetrics(result.metrics)
      setSuggestions(result.suggestions)
    } catch (error) {
      console.error('Performance analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [code])

  useEffect(() => {
    if (code) {
      analyzeCode()
    }
  }, [code, analyzeCode])

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rendering':
        return <Cpu className="w-4 h-4" />
      case 'bundle':
        return <HardDrive className="w-4 h-4" />
      case 'memory':
        return <BarChart3 className="w-4 h-4" />
      case 'network':
        return <Globe className="w-4 h-4" />
      case 'accessibility':
        return <Eye className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      case 'medium':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
      case 'low':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const formatBundleSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!generatedCode) {
    return null
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-muted/30">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Performance Analysis</span>
          {metrics && (
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                metrics.grade === 'A' ? 'bg-green-100 text-green-800' :
                metrics.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                metrics.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metrics.grade}
              </span>
              <span className="text-xs text-muted-foreground">
                {metrics.performanceScore}/100
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTips(!showTips)}
            className="w-6 h-6 p-0"
          >
            {showTips ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeCode}
            disabled={isAnalyzing}
            className="w-6 h-6 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 p-0"
          >
            {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <HardDrive className="w-3 h-3 text-blue-500" />
                <span className="font-medium">{formatBundleSize(metrics.estimatedBundleSize)}</span>
              </div>
              <div className="text-muted-foreground">Bundle Size</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Cpu className="w-3 h-3 text-green-500" />
                <span className="font-medium">{metrics.renderComplexity}</span>
              </div>
              <div className="text-muted-foreground">Render Score</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="w-3 h-3 text-purple-500" />
                <span className="font-medium">{metrics.potentialOptimizations}</span>
              </div>
              <div className="text-muted-foreground">Optimizations</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="font-medium">{metrics.performanceScore}%</span>
              </div>
              <div className="text-muted-foreground">Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tips */}
      {showTips && (
        <div className="p-3 border-b border-border bg-blue-50 dark:bg-blue-900/10">
          <h4 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">💡 Performance Tips</h4>
          <div className="space-y-1">
            {getPerformanceTips('general').map((tip, index) => (
              <div key={index} className="text-xs text-blue-700 dark:text-blue-300 flex items-start">
                <span className="mr-2">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues List */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {issues.length === 0 ? (
            <div className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-green-600 mb-1">No Performance Issues Found</h4>
              <p className="text-xs text-muted-foreground">
                Great! No performance issues were detected in your code.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="p-3 border border-border rounded-md bg-card"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIssueIcon(issue.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="text-xs font-medium text-foreground">
                          {issue.message}
                        </h5>
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getImpactColor(issue.impact)}`}>
                          {issue.impact}
                        </span>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(issue.category)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {issue.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {issue.suggestion}
                      </p>
                      {issue.estimatedSavings && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          💰 Potential savings: {issue.estimatedSavings}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Optimization Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-t border-border bg-muted/20">
              <h4 className="font-medium text-sm mb-2">🚀 Optimization Suggestions</h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-start">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
