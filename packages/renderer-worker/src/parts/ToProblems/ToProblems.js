import * as Workspace from '../Workspace/Workspace.js'
import * as ProblemListItemType from '../ProblemListItemType/ProblemListItemType.js'

const toProblem = (diagnostic, index) => {
  const { message, rowIndex, columnIndex, source, code, type, uri } = diagnostic
  return {
    message: message || '',
    rowIndex: rowIndex || 0,
    columnIndex: columnIndex || 0,
    uri,
    relativePath: '',
    count: 0,
    source: source || '',
    code: code || '',
    type: type || 'error',
    listItemType: ProblemListItemType.Item,
    posInSet: index,
    setSize: 1,
    level: 2,
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
  let relativeIndex = 0
  for (const diagnostic of diagnostics) {
    if (diagnostic.uri === problem.uri) {
      relativeIndex++
      problem.count++
    } else {
      relativeIndex = 1
      problem = {
        message: '',
        rowIndex: 0,
        columnIndex: 0,
        uri: diagnostic.uri,
        relativePath: '',
        count: 1,
        source: '',
        type: '',
        listItemType: ProblemListItemType.Expanded,
        posInSet: relativeIndex,
        setSize: 123,
        level: 1,
      }
      problems.push(problem)
    }
    problems.push(toProblem(diagnostic, relativeIndex))
  }
  for (const problem of problems) {
    problem.relativePath = Workspace.pathRelative(problem.uri)
    problem.uri = Workspace.pathBaseName(problem.uri)
  }
  return problems
}
