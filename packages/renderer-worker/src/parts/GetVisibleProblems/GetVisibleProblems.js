import * as IconTheme from '../IconTheme/IconTheme.js'

const getIcon = (uri) => {
  if (!uri) {
    return ''
  }
  return IconTheme.getFileNameIcon(uri)
}

const matchesFilterValue = (problem, filterValueLower) => {
  if (filterValueLower) {
    if (!problem.message) {
      return true
    }
    return (
      problem.uri.toLowerCase().includes(filterValueLower) ||
      problem.message.toLowerCase().includes(filterValueLower) ||
      problem.source.toLowerCase().includes(filterValueLower)
    )
  }
  return true
}

export const getVisibleProblems = (problems, focusedIndex, filterValue) => {
  const visibleItems = []
  const filterValueLower = filterValue.toLowerCase()
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i]
    if (!matchesFilterValue(problem, filterValueLower)) {
      continue
    }
    visibleItems.push({
      ...problem,
      isActive: i === focusedIndex,
      icon: getIcon(problem.uri),
    })
  }
  return visibleItems
}
