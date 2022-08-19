import { rm } from 'node:fs/promises'
import * as Path from '../Path/Path.js'

export const remove = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  await rm(absolutePath, { recursive: true, force: true })
}
