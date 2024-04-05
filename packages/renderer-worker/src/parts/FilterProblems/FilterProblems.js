import * as ProblemListItemType from '../ProblemListItemType/ProblemListItemType.js'

const matchesFilterValue = (string, filterValueLower) => {
  if (filterValueLower) {
    return string.toLowerCase().indexOf(filterValueLower)
  }
  return 0
}

export const filterProblems = (problems, collapsedUris, filterValue) => {
  const filterValueLower = filterValue.toLowerCase()
  const filtered = []
  for (const problem of problems) {
    const uriMatchIndex = matchesFilterValue(problem.uri, filterValueLower)
    const sourceMatchIndex = matchesFilterValue(problem.source, filterValueLower)
    const messageMatchIndex = matchesFilterValue(problem.message, filterValueLower)
    if (uriMatchIndex === -1 && sourceMatchIndex === -1 && messageMatchIndex === -1) {
      continue
    }
    if (collapsedUris.includes(problem.uri) && problem.listItemType === ProblemListItemType.Item) {
      continue
    }

    filtered.push({
      ...problem,
      uriMatchIndex,
      sourceMatchIndex,
      messageMatchIndex,
    })
  }
  return filtered
}
