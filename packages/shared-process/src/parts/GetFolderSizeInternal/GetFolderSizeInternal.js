import * as fs from 'node:fs/promises'
import { join } from 'node:path'

export const getFolderSizeInternal = async (path) => {
  let total = 0
  const stats = await fs.stat(path)
  total += stats.size
  if (stats.isDirectory() && !stats.isSymbolicLink()) {
    const dirents = await fs.readdir(path)
    for (const dirent of dirents) {
      total += await getFolderSizeInternal(join(path, dirent))
    }
  }
  return total
}
