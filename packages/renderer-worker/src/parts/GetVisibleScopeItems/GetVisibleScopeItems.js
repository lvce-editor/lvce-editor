import * as DebugItemFlags from '../DebugItemFlags/DebugItemFlags.js'

const getExpandable = (valueType) => {
  if (valueType === 'object') {
    return true
  }
  return false
}

const getFlags = (isExpanded, isExpandable, isFocused) => {
  let flags = DebugItemFlags.None
  if (isExpanded) {
    flags |= DebugItemFlags.Expanded
  } else if (isExpandable) {
    flags |= DebugItemFlags.Collapsed
  }
  if (isFocused) {
    flags |= DebugItemFlags.Focused
  }
  return flags
}

export const getVisibleScopeItems = (scopeChain, expandedIds, focusedIndex) => {
  const minLineY = 0
  const maxLineY = scopeChain.length
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const element = scopeChain[i]
    const isExpanded = expandedIds.includes(element.objectId)
    const isExpandable = getExpandable(element.valueType)
    const isFocused = i === focusedIndex
    const flags = getFlags(isExpanded, isExpandable, isFocused)
    console.log(element, flags)
    visible.push({
      ...element,
      flags,
    })
  }
  return visible
}
