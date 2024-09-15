import * as GetFileUrl from '../GetFileUrl/GetFileUrl.js'
import * as Platform from '../Platform/Platform.js'

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
    const fileUrl = GetFileUrl.getFileUrl(filePath)
    return fileUrl
  }
  return ''
}
