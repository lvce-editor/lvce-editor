export const getBabelAstDependencies = (code, ast) => {
  const { program } = ast
  const { body } = program
  const dependencies = []
  console.log({ code, ast })
  for (const node of body) {
    if (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration') {
      const relativePath = node.source.extra.rawValue
      const start = node.source.start
      const end = node.source.end
      dependencies.push({ relativePath, code, start, end })
    } else if (
      node.type === 'VariableDeclaration' &&
      node.declarations &&
      node.declarations[0] &&
      node.declarations[0].type === 'VariableDeclarator' &&
      node.declarations[0].init &&
      node.declarations[0].init.type === 'AwaitExpression' &&
      node.declarations[0].init.argument &&
      node.declarations[0].init.argument.type === 'CallExpression' &&
      node.declarations[0].init.argument.callee &&
      node.declarations[0].init.argument.callee.type === 'Import' &&
      node.declarations[0].init.argument.arguments &&
      node.declarations[0].init.argument.arguments[0] &&
      node.declarations[0].init.argument.arguments[0].type === 'StringLiteral'
    ) {
      const relativePath = node.declarations[0].init.argument.arguments[0].extra.rawValue
      const start = node.declarations[0].init.argument.arguments[0].start
      const end = node.declarations[0].init.argument.arguments[0].end
      dependencies.push({ relativePath, code, start, end })
    }
  }
  return dependencies
}
