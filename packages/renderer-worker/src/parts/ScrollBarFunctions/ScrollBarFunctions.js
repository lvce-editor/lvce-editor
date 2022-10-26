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
