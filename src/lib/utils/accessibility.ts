// Accessibility analysis utilities for React components

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  suggestion: string
  line?: number
  element?: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
}

export function analyzeAccessibility(code: string): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Split code into lines for line number tracking
  // Note: lines variable is declared but not used in current implementation

  // Check for images without alt text
  const imgWithoutAlt = /<img[^>]*src=[^>]*>/gi
  let match
  while ((match = imgWithoutAlt.exec(code)) !== null) {
    if (!match[0].includes('alt=')) {
      const lineNumber = code.substring(0, match.index).split('\n').length
      issues.push({
        type: 'error',
        message: 'Image missing alt attribute',
        suggestion: 'Add alt="descriptive text" to the img tag',
        line: lineNumber,
        element: 'img',
        impact: 'critical'
      })
    }
  }

  // Check for buttons without accessible names
  const buttonWithoutText = /<button[^>]*>(?:\s*)<\/button>/gi
  while ((match = buttonWithoutText.exec(code)) !== null) {
    const lineNumber = code.substring(0, match.index).split('\n').length
    issues.push({
      type: 'error',
      message: 'Button without accessible text',
      suggestion: 'Add text content or aria-label to button',
      line: lineNumber,
      element: 'button',
      impact: 'critical'
    })
  }

  // Check for form inputs without labels
  const inputWithoutLabel = /<input[^>]*>/gi
  while ((match = inputWithoutLabel.exec(code)) !== null) {
    const inputMatch = match[0]
    const lineNumber = code.substring(0, match.index).split('\n').length

    // Check if there's an associated label nearby
    const codeSnippet = code.substring(
      Math.max(0, match.index - 200),
      Math.min(code.length, match.index + 200)
    )

    if (!codeSnippet.includes('label') && !inputMatch.includes('aria-label')) {
      issues.push({
        type: 'warning',
        message: 'Input may need a label',
        suggestion: 'Add a label element or aria-label attribute',
        line: lineNumber,
        element: 'input',
        impact: 'serious'
      })
    }
  }

  // Check for insufficient color contrast (basic check)
  const textElements = code.match(/color:\s*#[0-9a-fA-F]{3,6}/g) || []
  textElements.forEach(colorMatch => {
    // This is a simplified check - in a real implementation you'd use WCAG contrast formulas
    const color = colorMatch.split('#')[1].toLowerCase()
    if (color === 'ffffff' || color === 'fff' || color === '000000' || color === '000') {
      issues.push({
        type: 'warning',
        message: 'Potential color contrast issue',
        suggestion: 'Verify text meets WCAG AA contrast requirements',
        impact: 'moderate'
      })
    }
  })

  // Check for missing lang attribute on html element
  if (!code.includes('lang=')) {
    issues.push({
      type: 'warning',
      message: 'Missing language attribute',
      suggestion: 'Add lang="en" (or appropriate language) to html element',
      impact: 'moderate'
    })
  }

  // Check for missing heading hierarchy
  const headings = code.match(/<h[1-6][^>]*>/gi) || []
  if (headings.length > 0) {
    const headingLevels = headings.map(h => parseInt(h.charAt(2)))
    if (!headingLevels.includes(1)) {
      issues.push({
        type: 'warning',
        message: 'Missing h1 heading',
        suggestion: 'Start with an h1 heading for page structure',
        impact: 'moderate'
      })
    }
  }

  // Check for keyboard navigation issues
  if (code.includes('onclick=') && !code.includes('onkeydown=')) {
    issues.push({
      type: 'warning',
      message: 'Click events without keyboard support',
      suggestion: 'Add keyboard event handlers for accessibility',
      impact: 'serious'
    })
  }

  // Check for focus management
  const interactiveElements = code.match(/<(button|input|select|textarea|a)[^>]*>/gi) || []
  if (interactiveElements.length > 5 && !code.includes('autoFocus') && !code.includes('focus()')) {
    issues.push({
      type: 'info',
      message: 'Consider focus management',
      suggestion: 'Implement proper focus management for complex forms',
      impact: 'minor'
    })
  }

  return issues
}

export function generateAccessibilityReport(issues: AccessibilityIssue[]): {
  summary: {
    errors: number
    warnings: number
    info: number
    total: number
  }
  score: number
  grade: string
} {
  const summary = {
    errors: issues.filter(i => i.type === 'error').length,
    warnings: issues.filter(i => i.type === 'warning').length,
    info: issues.filter(i => i.type === 'info').length,
    total: issues.length
  }

  // Calculate accessibility score (0-100)
  let score = 100

  // Errors have highest impact
  score -= summary.errors * 15

  // Warnings have moderate impact
  score -= summary.warnings * 5

  // Info items have minimal impact
  score -= summary.info * 1

  score = Math.max(0, Math.min(100, score))

  // Determine grade
  let grade: string
  if (score >= 90) grade = 'A'
  else if (score >= 80) grade = 'B'
  else if (score >= 70) grade = 'C'
  else if (score >= 60) grade = 'D'
  else grade = 'F'

  return { summary, score, grade }
}

export function getAccessibilitySuggestions(componentType: string): string[] {
  const suggestions: Record<string, string[]> = {
    button: [
      'Add aria-label if no visible text',
      'Use semantic button elements',
      'Ensure sufficient touch target size (44px minimum)',
      'Test with keyboard navigation'
    ],
    input: [
      'Associate with label or aria-label',
      'Add placeholder text for guidance',
      'Include aria-describedby for additional help',
      'Use appropriate input types (email, tel, etc.)'
    ],
    form: [
      'Group related fields with fieldset and legend',
      'Provide clear error messages',
      'Show progress for multi-step forms',
      'Add autocomplete attributes'
    ],
    navigation: [
      'Use semantic nav element',
      'Mark current page with aria-current',
      'Ensure keyboard navigation works',
      'Add skip links for screen readers'
    ],
    card: [
      'Use semantic article or section',
      'Provide heading hierarchy',
      'Ensure interactive elements are keyboard accessible',
      'Consider focus management for complex cards'
    ]
  }

  return suggestions[componentType] || [
    'Use semantic HTML elements',
    'Ensure keyboard accessibility',
    'Provide clear focus indicators',
    'Test with screen readers'
  ]
}
