const RE_WHITESPACE = /^\s+/

const countWhitespaceAtStart = (line, columnIndex) => {
  const whitespaceMatch = line.slice(0, columnIndex).match(RE_WHITESPACE)
  if (!whitespaceMatch) {
    return 0
  }
  return whitespaceMatch[0].length
}

const getDocumentEdits = (line, rowIndex, columnIndex, indent) => {
  // TODO handle virtual space when cursor is greater than line length
  if (columnIndex === line.length) {
    return [
      {
        type: /* splice */ 2,
        rowIndex: rowIndex + 1,
        count: 0,
        newLines: [indent],
      },
    ]
  }
  const newLine1 = line.slice(0, columnIndex)
  const newLine2 = indent + line.slice(columnIndex)
  return [
    {
      type: /* splice */ 2,
      rowIndex,
      count: 1,
      newLines: [newLine1, newLine2],
    },
  ]
}

// TODO have smart line break that can insert braces, commas, structure, etc.

// TODO handle multiple cursors

const isWhitespace = (character) => {
  return character === ' ' || character === '\t'
}

export const getIndent = (line) => {
  const whitespaceMatch = line.match(RE_WHITESPACE)
  if (!whitespaceMatch) {
    return ''
  }
  return whitespaceMatch[0]
}
