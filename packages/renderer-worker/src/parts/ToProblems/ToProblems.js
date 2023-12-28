import * as Workspace from '../Workspace/Workspace.js'

const toProblem = (diagnostic) => {
  const { message, rowIndex, columnIndex, source } = diagnostic
  return {
    message,
    rowIndex,
    columnIndex,
    uri: '',
    relativePath: '',
    count: 0,
    source,
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
