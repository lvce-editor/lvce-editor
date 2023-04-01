/**
 *
 * @param {number} size
 * @param {number} contentSize
 * @param {number} minimumSliderSize
 * @returns
 */
export const getScrollBarSize = (size, contentSize, minimumSliderSize) => {
  if (size >= contentSize) {
    return 0
  }
  return Math.max(Math.round(size ** 2 / contentSize), minimumSliderSize)
}

export const getScrollBarOffset = (delta, finalDelta, size, scrollBarSize) => {
  const scrollBarOffset = (delta / finalDelta) * (size - scrollBarSize)
  return scrollBarOffset
}

export const getScrollBarY = getScrollBarOffset

export const getScrollBarWidth = (width, longestLineWidth) => {
  if (width > longestLineWidth) {
    return 0
  }
  return width ** 2 / longestLineWidth
}

export const getNewDeltaPercent = (height, scrollBarHeight, relativeY) => {
  const halfScrollBarHeight = scrollBarHeight / 2
  if (relativeY <= halfScrollBarHeight) {
    // clicked at top
    return {
      percent: 0,
      handleOffset: relativeY,
    }
  }
  if (relativeY <= height - halfScrollBarHeight) {
    // clicked in middle
    return {
      percent: (relativeY - halfScrollBarHeight) / (height - scrollBarHeight),
      handleOffset: halfScrollBarHeight,
    }
  }
  // clicked at bottom
  return {
    percent: 1,
    handleOffset: scrollBarHeight - height + relativeY,
  }
}
