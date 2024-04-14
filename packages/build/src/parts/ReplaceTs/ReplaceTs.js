export const replaceTs = async (content) => {
  if (!content) {
    return content
  }
  const typescriptUri = 'typescript'
  const typescript = await import(typescriptUri)
  const newContent = await typescript.transpileModule(content, {
    compilerOptions: {
      target: 'esnext',
    },
  })
  return newContent
}
