import * as fs from 'node:fs/promises'
import VError from 'verror'
import * as Path from '../Path/Path.js'

/**
 *
 * @param {string} relativePath
 * @returns
 */
export const readDir = async (relativePath) => {
  try {
    const absolutePath = Path.absolute(relativePath)
    const dirents = await fs.readdir(absolutePath, { withFileTypes: true })
    return dirents
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to read directory ${relativePath}`)
  }
}
