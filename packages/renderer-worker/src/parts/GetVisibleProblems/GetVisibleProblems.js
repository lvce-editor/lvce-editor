export const getVisibleProblems = (problems, focusedIndex) => {
  const visibleItems = []
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i]
    visibleItems.push({
      ...problem,
      isActive: i === focusedIndex,
    })
  }
  return visibleItems
}
