import * as BabelNodeType from '../BabelNodeType/BabelNodeType.js'

const walk = (node, visitor) => {
  if (!node) {
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      walk(item, visitor)
    }
    return
  }
  visitor(node)
  switch (node.type) {
    case BabelNodeType.File:
      walk(node.program, visitor)
      break
    case BabelNodeType.Program:
      walk(node.body, visitor)
      break
    case BabelNodeType.ExportNamedDeclaration:
      walk(node.declaration, visitor)
      break
    case BabelNodeType.VariableDeclaration:
      walk(node.declarations, visitor)
      break
    case BabelNodeType.VariableDeclarator:
      walk(node.init, visitor)
      break
    case BabelNodeType.ArrowFunctionExpression:
      walk(node.body, visitor)
      break
    case BabelNodeType.BlockStatement:
      walk(node.body, visitor)
      break
    case BabelNodeType.ExpressionStatement:
      walk(node.expression, visitor)
      break
    case BabelNodeType.AwaitExpression:
      walk(node.argument, visitor)
      break
    case BabelNodeType.CallExpression:
      walk(node.callee, visitor)
      break
    default:
      break
  }
}

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

  const visitor = (node) => {
    if (
      node &&
      node.type === 'CallExpression' &&
      node.callee &&
      node.callee.type === 'Import' &&
      node.arguments &&
      node.arguments[0] &&
      node.arguments[0].type === 'StringLiteral'
    ) {
      const relativePath = node.arguments[0].extra.rawValue
      const start = node.arguments[0].start
      const end = node.arguments[0].end
      dependencies.push({ relativePath, code, start, end })
    }
  }
  walk(ast, visitor)
  return dependencies
}
