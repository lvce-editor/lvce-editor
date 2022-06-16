import * as fs from 'fs/promises'
import * as Path from '../Path/Path.js'

export const mkdir = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  await fs.mkdir(absolutePath, { recursive: true })
}
