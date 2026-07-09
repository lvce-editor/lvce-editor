import { rm } from 'node:fs/promises'
import * as Assert from '../Assert/Assert.ts'
import { VError } from '../VError/VError.ts'

export const removeSymlink = async (path: any): Promise<any> => {
  try {
    Assert.string(path)
    await rm(path, { force: true })
  } catch (error) {
    throw new VError(error, `Failed to remove symlink ${path}`)
  }
}
