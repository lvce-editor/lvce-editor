import * as IconTheme from '../IconTheme/IconTheme.js'

const getIcon = (uri) => {
  if (!uri) {
    return ''
  }
  return IconTheme.getFileNameIcon(uri)
}

const matchesFilterValue = (string, filterValueLower) => {
  if (filterValueLower) {
    return string.toLowerCase().indexOf(filterValueLower)
  }
  return 0
}

export const getVisibleProblems = (problems, focusedIndex, filterValue) => {
  const visibleItems = []
  const filterValueLower = filterValue.toLowerCase()
  const filterValueLength = filterValue.length
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i]
    const uriMatchIndex = matchesFilterValue(problem.uri, filterValueLower)
    const sourceMatchIndex = matchesFilterValue(problem.source, filterValueLower)
    const messageMatchIndex = matchesFilterValue(problem.message, filterValueLower)
    if (uriMatchIndex === -1 && sourceMatchIndex === -1 && messageMatchIndex === -1) {
      continue
    }
    visibleItems.push({
      ...problem,
      isEven: i % 2 === 0,
      isActive: i === focusedIndex,
      icon: getIcon(problem.uri),
      uriMatchIndex,
      sourceMatchIndex,
      messageMatchIndex,
      filterValueLength,
    })
  }
  return visibleItems
}
