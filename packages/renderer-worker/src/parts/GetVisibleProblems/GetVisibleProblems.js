import * as IconTheme from '../IconTheme/IconTheme.js'

const getIcon = (uri) => {
  if (!uri) {
    return ''
  }
  return IconTheme.getFileNameIcon(uri)
}

export const getVisibleProblems = (problems, focusedIndex) => {
  const visibleItems = []
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i]
    visibleItems.push({
      ...problem,
      isActive: i === focusedIndex,
      icon: getIcon(problem.uri),
    })
  }
  return visibleItems
}
