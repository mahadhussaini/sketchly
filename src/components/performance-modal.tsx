'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X,
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
  Lightbulb,
  ArrowRight,
  Target
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

interface PerformanceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PerformanceModal({ isOpen, onClose }: PerformanceModalProps) {
  const [issues, setIssues] = useState<PerformanceIssue[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'suggestions'>('overview')

  const { generatedCode } = useSketchStore()

  const analyzeCode = useCallback(async () => {
    if (!generatedCode?.jsx) return

    setIsAnalyzing(true)
    try {
      const result = analyzePerformance(generatedCode.jsx)
      setIssues(result.issues)
      setMetrics(result.metrics)
      setSuggestions(result.suggestions)
    } catch (error) {
      console.error('Performance analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [generatedCode])

  useEffect(() => {
    if (isOpen && generatedCode?.jsx) {
      analyzeCode()
    }
  }, [isOpen, generatedCode, analyzeCode])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'B': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'C': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'D': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'F': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rendering': return <Cpu className="w-5 h-5" />
      case 'bundle': return <HardDrive className="w-5 h-5" />
      case 'memory': return <BarChart3 className="w-5 h-5" />
      case 'network': return <Globe className="w-5 h-5" />
      case 'accessibility': return <Eye className="w-5 h-5" />
      default: return <TrendingUp className="w-5 h-5" />
    }
  }

  const formatBundleSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Performance Analysis</h2>
            {metrics && (
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(metrics.grade)}`}>
                {metrics.grade} Grade ({metrics.performanceScore}%)
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeCode}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Re-analyze
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'issues', label: `Issues (${issues.length})`, icon: AlertTriangle },
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'overview' | 'issues' | 'suggestions')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {activeTab === 'overview' && (
            <div className="p-6">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary mr-3" />
                  <span className="text-lg">Analyzing performance...</span>
                </div>
              ) : metrics ? (
                <div className="space-y-6">
                  {/* Performance Score */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${metrics.performanceScore}, 100`}
                          className="text-muted-foreground"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                          className={metrics.performanceScore >= 80 ? 'text-green-500' :
                                   metrics.performanceScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{metrics.performanceScore}%</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Performance Score</h3>
                    <p className="text-muted-foreground">
                      {metrics.grade === 'A' && 'Excellent performance!'}
                      {metrics.grade === 'B' && 'Good performance with minor improvements needed.'}
                      {metrics.grade === 'C' && 'Moderate performance that needs attention.'}
                      {metrics.grade === 'D' && 'Poor performance requiring significant improvements.'}
                      {metrics.grade === 'F' && 'Critical performance issues that must be addressed.'}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <HardDrive className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{formatBundleSize(metrics.estimatedBundleSize)}</div>
                      <div className="text-xs text-muted-foreground">Bundle Size</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <Cpu className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{metrics.renderComplexity}</div>
                      <div className="text-xs text-muted-foreground">Render Score</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{issues.filter(i => i.type === 'error').length}</div>
                      <div className="text-xs text-muted-foreground">Critical Issues</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <Lightbulb className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{metrics.potentialOptimizations}</div>
                      <div className="text-xs text-muted-foreground">Optimizations</div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Quick Performance Tips
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      {getPerformanceTips('general').slice(0, 3).map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-4">Generate some code first to see performance analysis.</p>
                  <Button onClick={onClose}>Close</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="p-6">
              {issues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-green-600 mb-2">No Performance Issues Found</h3>
                  <p className="text-muted-foreground">Great! Your code has no detectable performance issues.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 mt-1 ${issue.type === 'error' ? 'text-red-500' : issue.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                          {issue.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : issue.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{issue.message}</h4>
                            <span className={`px-2 py-1 text-xs rounded ${issue.impact === 'high' ? 'bg-red-100 text-red-800' : issue.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                              {issue.impact}
                            </span>
                            <div className="flex items-center space-x-1">
                              {getCategoryIcon(issue.category)}
                              <span className="text-xs text-muted-foreground capitalize">{issue.category}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{issue.suggestion}</p>
                          {issue.estimatedSavings && (
                            <div className="text-sm text-green-600 flex items-center">
                              <ArrowRight className="w-4 h-4 mr-1" />
                              Potential savings: {issue.estimatedSavings}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="p-6">
              {suggestions.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Suggestions Available</h3>
                  <p className="text-muted-foreground">Your code is already well-optimized!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground">{suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
