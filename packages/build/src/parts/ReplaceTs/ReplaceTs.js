export const fixImports = (content) => {
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

export const replaceTs = async (content) => {
  if (!content) {
    return content
  }
  const typescriptUri = 'typescript'
  const { default: typescript } = await import(typescriptUri)
  const { outputText: newContent } = await typescript.transpileModule(content, {
    compilerOptions: {
      target: 'esnext',
    },
  })
  return fixImports(newContent)
}
