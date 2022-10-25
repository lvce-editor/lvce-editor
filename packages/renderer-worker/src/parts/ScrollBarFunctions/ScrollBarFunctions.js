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
