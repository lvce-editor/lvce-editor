const getPickDescription = (provider, pick) => {
  if (provider.getPickDescription) {
    return provider.getPickDescription(pick)
  }
  return ''
}

export const getVisible = (provider, items, minLineY, maxLineY) => {
  const visibleItems = []
  const setSize = items.length
  const max = Math.min(items.length, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const item = items[i]
    const label = provider.getPickLabel(item)
    const description = getPickDescription(provider, item)
    const icon = provider.getPickIcon(item)
    visibleItems.push({
      label,
      description,
      icon,
      posInSet: i + 1,
      setSize,
    })
  }
  return visibleItems
}
