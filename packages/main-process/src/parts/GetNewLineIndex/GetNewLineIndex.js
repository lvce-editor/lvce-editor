/**
 *
 * @param {string} string
 * @param {number|undefined} startIndex
 * @returns
 */
exports.getNewLineIndex = (string, startIndex = undefined) => {
  return string.indexOf('\n', startIndex)
}
