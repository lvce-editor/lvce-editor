/**
 *
 * @param {number} height
 * @param {number} contentHeight
 * @param {number} minimumSliderSize
 * @returns
 */
export const getScrollBarHeight = (
  height,
  contentHeight,
  minimumSliderSize
) => {
  if (height > contentHeight) {
    return 0
  }
  return Math.max(Math.round(height ** 2 / contentHeight), minimumSliderSize)
}

export const getScrollBarY = (deltaY, finalDeltaY, height, scrollBarHeight) => {
  const scrollBarY = (deltaY / finalDeltaY) * (height - scrollBarHeight)
  return scrollBarY
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
