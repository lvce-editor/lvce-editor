/**
 *
 * @param {number} size
 * @param {number} contentSize
 * @param {number} minimumSliderSize
 * @returns
 */
export const getScrollBarSize = (size: number, contentSize: number, minimumSliderSize: number) => {
  if (size >= contentSize) {
    return 0
  }
  return Math.max(Math.round(size ** 2 / contentSize), minimumSliderSize)
}

export const getScrollBarOffset = (delta: number, finalDelta: number, size: number, scrollBarSize: number) => {
  const scrollBarOffset = (delta / finalDelta) * (size - scrollBarSize)
  return scrollBarOffset
}

export const getScrollBarY = getScrollBarOffset

export const getScrollBarWidth = (width: number, longestLineWidth: number) => {
  if (width > longestLineWidth) {
    return 0
  }
  return width ** 2 / longestLineWidth
}

export const getNewDeltaPercent = (height: number, scrollBarHeight: number, relativeY: number) => {
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
