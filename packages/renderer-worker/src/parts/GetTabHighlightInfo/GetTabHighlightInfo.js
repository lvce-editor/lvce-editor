const getIndices = (eventX, eventY, tabs) => {
  let width = 0
  for (let i = 0; i < tabs.length; i++) {
    const tabWidth = tabs[i].tabWidth
    const halfTabWidth = tabWidth / 2
    const newWidth = width + tabWidth
    if (newWidth >= eventX) {
      if (width + halfTabWidth >= eventX) {
        return i
      }
      return width
    }
    width = newWidth
  }
  return -1
}

export const getTabHighlightInfo = (eventX, eventY, tabs) => {
  const left = getIndices(eventX, eventY, tabs)
  if (left === -1) {
    return {
      highlight: false,
      highlightLeft: 0,
      highlightHeight: 0,
    }
  }
  return {
    highlight: true,
    highlightLeft: left,
    highlightHeight: 100,
  }
}
