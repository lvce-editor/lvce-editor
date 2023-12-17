import * as Workspace from '../Workspace/Workspace.js'

const toProblem = (diagnostic) => {
  const { message, rowIndex, columnIndex, uri } = diagnostic
  return {
    message,
    rowIndex,
    columnIndex,
    uri: '',
  }
}

export const toProblems = (diagnostics) => {
  let uri = ''
  const problems = []
  for (const diagnostic of diagnostics) {
    if (diagnostic.uri !== uri) {
      problems.push({
        message: '',
        rowIndex: 0,
        columnIndex: 0,
        uri: Workspace.pathBaseName(diagnostic.uri),
      })
      uri = diagnostic.uri
    }
    problems.push(toProblem(diagnostic))
  }
  return problems
}
