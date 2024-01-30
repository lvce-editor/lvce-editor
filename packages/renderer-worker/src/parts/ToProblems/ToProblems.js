import * as Workspace from '../Workspace/Workspace.js'
import * as ProblemFlags from '../ProblemFlags/ProblemFlags.js'

const toProblem = (diagnostic) => {
  const { message, rowIndex, columnIndex, source, code } = diagnostic
  return {
    message: message || '',
    rowIndex: rowIndex || 0,
    columnIndex: columnIndex || 0,
    uri: '',
    relativePath: '',
    count: 0,
    source: source || '',
    code: code || '',
    flags: ProblemFlags.Error,
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
    code: '',
    flags: ProblemFlags.Collapsed,
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
        code: '',
        flags: ProblemFlags.Collapsed,
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
