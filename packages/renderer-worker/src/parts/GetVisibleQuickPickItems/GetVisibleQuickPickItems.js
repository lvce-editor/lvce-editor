const getPickDescription = (provider, pick) => {
  if (provider.getPickDescription) {
    return provider.getPickDescription(pick)
  }
  return ''
}

export const getVisible = (provider, items, minLineY, maxLineY, focusedIndex) => {
  const visibleItems = []
  const setSize = items.length
  const max = Math.min(items.length, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const item = items[i]
    const pick = item.pick
    const label = provider.getPickLabel(pick)
    const description = getPickDescription(provider, pick)
    const icon = provider.getPickIcon(pick)
    console.log(item.matches)
    visibleItems.push({
      label,
      description,
      icon,
      posInSet: i + 1,
      setSize,
      isActive: i === focusedIndex,
    })
  }
  return visibleItems
}
