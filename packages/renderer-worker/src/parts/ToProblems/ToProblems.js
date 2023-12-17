import * as Workspace from '../Workspace/Workspace.js'

const toProblem = (diagnostic) => {
  const { message, rowIndex, columnIndex, uri } = diagnostic
  return {
    message,
    rowIndex,
    columnIndex,
    uri: '',
    count: 0,
  }
}

export const toProblems = (diagnostics) => {
  const problems = []
  let problem = {
    message: '',
    rowIndex: 0,
    columnIndex: 0,
    uri: '',
    count: 0,
  }
  for (const diagnostic of diagnostics) {
    console.log({ diagnostic, problem })
    if (diagnostic.uri === problem.uri) {
      problem.count++
    } else {
      problem = {
        message: '',
        rowIndex: 0,
        columnIndex: 0,
        uri: diagnostic.uri,
        count: 1,
      }
      problems.push(problem)
    }
    problems.push(toProblem(diagnostic))
  }
  for (const problem of problems) {
    problem.uri = Workspace.pathBaseName(problem.uri)
  }
  return problems
}
