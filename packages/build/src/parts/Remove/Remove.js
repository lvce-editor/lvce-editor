import { glob } from 'glob'
import { rm } from 'node:fs/promises'
import * as Path from '../Path/Path.js'
import { VError } from '@lvce-editor/verror'

export const remove = async (relativePath) => {
  try {
    const absolutePath = Path.absolute(relativePath)
    await rm(absolutePath, { recursive: true, force: true })
  } catch (error) {
    throw new VError(error, `Failed to remove ${relativePath}`)
  }
}

export const removeMatching = async (relativePath, pattern) => {
  try {
    const absolutePath = Path.absolute(relativePath)
    const paths = await glob(pattern, {
      cwd: absolutePath,
      absolute: true,
    })
    for (const path of paths) {
      await rm(path, { recursive: true, force: true })
    }
  } catch (error) {
    throw new VError(error, `Failed to remove ${relativePath} pattern ${pattern}`)
  }
}
