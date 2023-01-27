export const getBabelAstDependencies = (code, ast) => {
  const { program } = ast
  const { body } = program
  const dependencies = []
  for (const node of body) {
    if (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration') {
      const relativePath = node.source.extra.rawValue
      const start = node.source.start
      const end = node.source.end
      dependencies.push({ relativePath, code, start, end })
    }
  }
  return dependencies
}
