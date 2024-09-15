import { join } from 'path'
import { pathToFileURL } from 'url'
import * as Root from '../Root/Root.js'

/**
 *
 * @param {string} filePath
 * @returns {string}
 */
export const getFileUrl = (filePath) => {
  const fileUrl = pathToFileURL(join(Root.root, filePath)).toString()
  return fileUrl
}
