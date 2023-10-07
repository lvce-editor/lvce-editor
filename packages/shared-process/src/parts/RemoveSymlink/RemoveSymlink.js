import { rm } from 'node:fs/promises'
import * as Assert from '../Assert/Assert.js'
import { VError } from '../VError/VError.js'

export const removeSymlink = async (path) => {
  try {
    Assert.string(path)
    await rm(path, { force: true })
  } catch (error) {
    throw new VError(error, `Failed to remove symlink ${path}`)
  }
}
