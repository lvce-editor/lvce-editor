import * as Character from '../Character/Character.ts'

/**
 *
 * @param {string} string
 * @param {number|undefined} startIndex
 * @returns
 */
export const getNewLineIndex = (string, startIndex = undefined) => {
  return string.indexOf(Character.NewLine, startIndex)
}
