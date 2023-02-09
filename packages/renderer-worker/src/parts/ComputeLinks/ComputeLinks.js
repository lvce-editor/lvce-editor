import * as DecorationType from '../DecorationType/DecorationType.js'

const RE_LINK = /https:\/\/.*/

/**
 * @param {string} line
 */
export const computeLinks = (line, offset) => {
  const links = []
  const linkMatch = line.match(RE_LINK)
  if (linkMatch) {
    links.push(offset, linkMatch[0].length, DecorationType.Link, linkMatch.index)
  }
  return links
}
