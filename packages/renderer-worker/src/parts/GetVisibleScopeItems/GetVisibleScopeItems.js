export const getVisibleScopeItems = (scopeChain, expandedIds, focusedIndex) => {
  const minLineY = 0
  const maxLineY = scopeChain.length
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const element = scopeChain[i]
    const isExpanded = expandedIds.includes(element.objectId)
    const isFocused = i === focusedIndex
    visible.push({
      ...element,
      isExpanded,
      isFocused,
    })
  }
  return visible
}
