/**
 *
 * @param {string} string
 * @param {number|undefined} startIndex
 * @returns
 */
// @ts-ignore
export const getNewLineIndex = (string, startIndex = undefined) => {
  return string.indexOf('\n', startIndex)
}
