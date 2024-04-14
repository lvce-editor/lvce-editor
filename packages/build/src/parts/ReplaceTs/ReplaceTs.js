export const replaceTs = (content) => {
  if (!content) {
    return content
  }
  const newLines = []
  const lines = content.split('\n')
  for (const line of lines) {
    let newLine = line
    if (newLine.startsWith('import') || (newLine.startsWith('{') && newLine.endsWith(".ts'"))) {
      newLine = newLine.replace(".ts'", ".js'")
    }
    newLines.push(newLine)
  }
  return newLines.join('\n')
}
