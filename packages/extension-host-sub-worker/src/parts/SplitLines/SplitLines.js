/**
 *
 * @param {string|undefined} lines
 * @returns string[]
 */
export const splitLines = (lines) => {
  if (!lines) {
    return []
  }
  return lines.split('\n')
}
