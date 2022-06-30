import * as fs from 'fs/promises'
import * as Path from '../Path/Path.js'

export const readDir = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  const dirents = await fs.readdir(absolutePath, { withFileTypes: true })
  return dirents
}
