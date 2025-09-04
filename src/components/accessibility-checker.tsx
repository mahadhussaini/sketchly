'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  AlertTriangle,
  Info,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analyzeAccessibility, generateAccessibilityReport, AccessibilityIssue } from '@/lib/utils/accessibility'
import { useSketchStore } from '@/store/sketch-store'

interface AccessibilityCheckerProps {
  code: string
}

export function AccessibilityChecker({ code }: AccessibilityCheckerProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [report, setReport] = useState<{
    summary: { errors: number; warnings: number; info: number; total: number }
    score: number
    grade: string
  } | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { generatedCode } = useSketchStore()

  const analyzeCode = useCallback(async () => {
    setIsAnalyzing(true)
    try {
      const accessibilityIssues = analyzeAccessibility(code)
      const accessibilityReport = generateAccessibilityReport(accessibilityIssues)

      setIssues(accessibilityIssues)
      setReport(accessibilityReport)
    } catch (error) {
      console.error('Accessibility analysis failed:', error)
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
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      case 'serious':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'minor':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  if (!generatedCode) {
    return null
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-muted/30">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Accessibility</span>
          {report && (
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                report.grade === 'A' ? 'bg-green-100 text-green-800' :
                report.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                report.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {report.grade}
              </span>
              <span className="text-xs text-muted-foreground">
                {report.score}/100
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
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

      {/* Summary */}
      {report && (
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>{report.summary.errors}</span>
              </div>
              <div className="text-muted-foreground">Errors</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                <span>{report.summary.warnings}</span>
              </div>
              <div className="text-muted-foreground">Warnings</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1">
                <Info className="w-3 h-3 text-blue-500" />
                <span>{report.summary.info}</span>
              </div>
              <div className="text-muted-foreground">Info</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{report.score}</span>
              </div>
              <div className="text-muted-foreground">Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Issues List */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {issues.length === 0 ? (
            <div className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-green-600 mb-1">No Issues Found</h4>
              <p className="text-xs text-muted-foreground">
                Great! No accessibility issues were detected in your code.
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
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {issue.suggestion}
                      </p>
                      {issue.element && (
                        <div className="text-xs text-muted-foreground">
                          Element: <code className="px-1 py-0.5 bg-muted rounded text-xs">
                            &lt;{issue.element}&gt;
                          </code>
                          {issue.line && (
                            <span className="ml-2">Line {issue.line}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resources */}
          <div className="p-3 border-t border-border bg-muted/20">
            <h4 className="text-xs font-medium mb-2">Accessibility Resources</h4>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.w3.org/WAI/WCAG21/quickref/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-primary hover:underline"
              >
                <span>WCAG Guidelines</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://web.dev/accessibility/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-primary hover:underline"
              >
                <span>Web.dev Guide</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
