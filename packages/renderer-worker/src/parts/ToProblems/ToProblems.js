import * as Workspace from '../Workspace/Workspace.js'

const toProblem = (diagnostic) => {
  const { message, rowIndex, columnIndex, source, code, type } = diagnostic
  return {
    message: message || '',
    rowIndex: rowIndex || 0,
    columnIndex: columnIndex || 0,
    uri: '',
    relativePath: '',
    count: 0,
    source: source || '',
    code: code || '',
    type: type || 'error',
  }
}

export const toProblems = (diagnostics) => {
  const problems = []
  let problem = {
    message: '',
    rowIndex: 0,
    columnIndex: 0,
    uri: '',
    relativePath: '',
    count: 0,
    source: '',
  }
  for (const diagnostic of diagnostics) {
    if (diagnostic.uri === problem.uri) {
      problem.count++
    } else {
      problem = {
        message: '',
        rowIndex: 0,
        columnIndex: 0,
        uri: diagnostic.uri,
        relativePath: '',
        count: 1,
        source: '',
        type: '',
      }
      problems.push(problem)
    }
    problems.push(toProblem(diagnostic))
  }
  for (const problem of problems) {
    problem.relativePath = Workspace.pathRelative(problem.uri)
    problem.uri = Workspace.pathBaseName(problem.uri)
  }
  return problems
}
