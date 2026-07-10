import * as fs from 'node:fs/promises'
import * as Path from '../Path/Path.ts'

export const mkdir = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  await fs.mkdir(absolutePath, { recursive: true })
}
