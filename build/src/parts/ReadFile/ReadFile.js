import * as fs from 'fs/promises'
import * as Path from '../Path/Path.js'

export const readFile = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  const content = await fs.readFile(absolutePath, 'utf-8')
  return content
}
