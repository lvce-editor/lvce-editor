import { glob } from 'glob'
import { rm } from 'node:fs/promises'
import * as Path from '../Path/Path.js'

export const remove = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  await rm(absolutePath, { recursive: true, force: true })
}

export const removeMatching = async (relativePath, pattern) => {
  const absolutePath = Path.absolute(relativePath)
  const paths = await glob(pattern, {
    cwd: absolutePath,
    absolute: true,
  })
  for (const path of paths) {
    await rm(path)
  }
}
