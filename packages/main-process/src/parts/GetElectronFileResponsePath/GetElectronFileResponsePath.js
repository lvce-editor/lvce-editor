import { join } from 'path'
import { pathToFileURL } from 'url'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'

const prefix = `${Platform.scheme}://`
const prefixLength = prefix.length

/**
 *
 * @param {string} url
 * @returns {string}
 */
export const getElectronFileResponsePath = (url) => {
  if (url.startsWith(prefix)) {
    const filePath = url.slice(prefixLength)
    const fileUrl = pathToFileURL(join(Root.root, filePath)).toString()
    return fileUrl
  }
  return ''
}
