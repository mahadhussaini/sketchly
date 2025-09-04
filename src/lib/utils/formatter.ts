// Basic code formatting utilities for React/JSX code

export function formatJSXCode(code: string): string {
  try {
    // Basic formatting rules for JSX
    let formatted = code

    // Add proper indentation
    formatted = addIndentation(formatted)

    // Fix spacing around operators and punctuation
    formatted = fixSpacing(formatted)

    // Clean up multiple empty lines
    formatted = cleanEmptyLines(formatted)

    // Format JSX attributes
    formatted = formatJSXAttributes(formatted)

    return formatted
  } catch (error) {
    console.error('Error formatting code:', error)
    return code // Return original code if formatting fails
  }
}

function addIndentation(code: string): string {
  const lines = code.split('\n')
  let indentLevel = 0
  const indentSize = 2

  const formattedLines = lines.map((line, _index) => {
    const trimmedLine = line.trim()

    // Skip empty lines
    if (!trimmedLine) return ''

    // Decrease indent for closing tags/braces
    if (trimmedLine.startsWith('</') || trimmedLine.startsWith('}') || trimmedLine.startsWith(')') || trimmedLine.startsWith(']')) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmedLine

    // Increase indent for opening tags/braces
    if (
      (trimmedLine.endsWith('{') && !trimmedLine.includes('}')) ||
      (trimmedLine.endsWith('(') && !trimmedLine.includes(')')) ||
      (trimmedLine.endsWith('[') && !trimmedLine.includes(']')) ||
      (trimmedLine.includes('<') && trimmedLine.includes('>') && !trimmedLine.includes('</') && !trimmedLine.includes('/>'))
    ) {
      indentLevel++
    }

    return indentedLine
  })

  return formattedLines.join('\n')
}

function fixSpacing(code: string): string {
  return code
    // Fix spacing around operators
    .replace(/([^=!<>])=([^=])/g, '$1 = $2')
    .replace(/([^=!<>])==([^=])/g, '$1 === $2')
    .replace(/([^=!<>])!=([^=])/g, '$1 !== $2')
    .replace(/([^=!<>])<=([^=])/g, '$1 <= $2')
    .replace(/([^=!<>])>=([^=])/g, '$1 >= $2')
    .replace(/([^=!<>])<([^=])/g, '$1 < $2')
    .replace(/([^=!<>])>([^=])/g, '$1 > $2')

    // Fix spacing around punctuation
    .replace(/,([^ ])/g, ', $1')
    .replace(/;([^ ])/g, '; $1')
    .replace(/:([^ ])/g, ': $1')

    // Fix spacing in function calls
    .replace(/(\w+)\s*\(\s*/g, '$1(')
    .replace(/\s*\)\s*/g, ')')
}

function cleanEmptyLines(code: string): string {
  return code
    .split('\n')
    .filter((line, index, arr) => {
      // Remove more than 2 consecutive empty lines
      if (!line.trim()) {
        const prevLine = arr[index - 1] || ''
        const nextLine = arr[index + 1] || ''
        return prevLine.trim() || nextLine.trim()
      }
      return true
    })
    .join('\n')
    .trim()
}

function formatJSXAttributes(code: string): string {
  return code
    // Format JSX attributes with proper spacing
    .replace(/(\w+)=/g, '$1=')
    .replace(/=\s*{/g, '={')
    .replace(/}\s+/g, '} ')
    .replace(/=\s*"([^"]*)"/g, '="$1"')
    .replace(/=\s*'([^']*)'/g, "='$1'")
}

export function validateJSXSyntax(code: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Basic validation checks
  const openTags: string[] = []
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    // Check for unclosed JSX tags
    const openTagMatch = line.match(/<(\w+)[^>]*[^/]>$/)
    const closeTagMatch = line.match(/<\/(\w+)>$/)

    if (openTagMatch) {
      openTags.push(openTagMatch[1])
    }

    if (closeTagMatch) {
      const expectedTag = openTags.pop()
      if (expectedTag !== closeTagMatch[1]) {
        errors.push(`Line ${index + 1}: Mismatched closing tag. Expected </${expectedTag}>`)
      }
    }

    // Check for unclosed braces
    const openBraces = (line.match(/{/g) || []).length
    const closeBraces = (line.match(/}/g) || []).length

    if (openBraces !== closeBraces) {
      errors.push(`Line ${index + 1}: Unmatched braces`)
    }

    // Check for unclosed parentheses
    const openParens = (line.match(/\(/g) || []).length
    const closeParens = (line.match(/\)/g) || []).length

    if (openParens !== closeParens) {
      errors.push(`Line ${index + 1}: Unmatched parentheses`)
    }
  })

  // Check for unclosed tags at the end
  if (openTags.length > 0) {
    errors.push(`Unclosed tags: ${openTags.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function generateComponentName(suggestion: string): string {
  // Convert suggestion to PascalCase component name
  return suggestion
    .split(/[^a-zA-Z0-9]/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '')
}

export function optimizeImports(code: string): string {
  // Basic import optimization
  const lines = code.split('\n')
  const imports: string[] = []
  const otherLines: string[] = []

  lines.forEach(line => {
    if (line.trim().startsWith('import')) {
      imports.push(line.trim())
    } else {
      otherLines.push(line)
    }
  })

  // Sort imports (React first, then third-party, then local)
  const sortedImports = imports.sort((a, b) => {
    if (a.includes('react')) return -1
    if (b.includes('react')) return 1
    if (a.includes('from \'')) return -1
    if (b.includes('from \'')) return 1
    return a.localeCompare(b)
  })

  return [...sortedImports, '', ...otherLines].join('\n')
}
