import * as fs from 'node:fs/promises'
import { VError } from '@lvce-editor/verror'
import * as Path from '../Path/Path.js'

/**
 *
 * @param {string} relativePath
 * @returns
 */
export const readDirWithFileTypes = async (relativePath) => {
  try {
    const absolutePath = Path.absolute(relativePath)
    const dirents = await fs.readdir(absolutePath, { withFileTypes: true })
    return dirents
  } catch (error) {
    throw new VError(error, `Failed to read directory ${relativePath}`)
  }
}

/**
 *
 * @param {string} relativePath
 * @returns
 */
export const readDir = async (relativePath) => {
  try {
    const absolutePath = Path.absolute(relativePath)
    const dirents = await fs.readdir(absolutePath)
    return dirents
  } catch (error) {
    throw new VError(error, `Failed to read directory ${relativePath}`)
  }
}
