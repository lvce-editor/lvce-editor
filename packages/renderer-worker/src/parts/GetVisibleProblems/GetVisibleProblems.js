import * as FilterProblems from '../FilterProblems/FilterProblems.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Assert from '../Assert/Assert.ts'

const getIcon = (uri) => {
  if (!uri) {
    return ''
  }
  return IconTheme.getFileNameIcon(uri)
}

export const getVisibleProblems = (problems, collapsedUris, focusedIndex, filterValue) => {
  Assert.array(problems)
  Assert.array(collapsedUris)
  Assert.number(focusedIndex)
  Assert.string(filterValue)
  const visibleItems = []
  const filterValueLength = filterValue.length
  const filtered = FilterProblems.filterProblems(problems, collapsedUris, filterValue)
  for (let i = 0; i < filtered.length; i++) {
    const problem = filtered[i]
    visibleItems.push({
      ...problem,
      isEven: i % 2 === 0,
      isActive: i === focusedIndex,
      icon: getIcon(problem.uri),
      filterValueLength,
    })
  }
  return visibleItems
}
