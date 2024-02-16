const getPickDescription = (provider, pick) => {
  if (provider.getPickDescription) {
    return provider.getPickDescription(pick)
  }
  return ''
}

const getFileIcon = (provider, pick) => {
  if (provider.getPickFileIcon) {
    return provider.getPickFileIcon(pick)
  }
  return ''
}

export const getVisible = (provider, items, minLineY, maxLineY, focusedIndex) => {
  const visibleItems = []
  const setSize = items.length
  const max = Math.min(setSize, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const item = items[i]
    const pick = item.pick
    const label = provider.getPickLabel(pick)
    const description = getPickDescription(provider, pick)
    const icon = provider.getPickIcon(pick)
    const fileIcon = getFileIcon(provider, pick)
    visibleItems.push({
      label,
      description,
      icon,
      fileIcon,
      posInSet: i + 1,
      setSize,
      isActive: i === focusedIndex,
      matches: item.matches,
    })
  }
  return visibleItems
}
