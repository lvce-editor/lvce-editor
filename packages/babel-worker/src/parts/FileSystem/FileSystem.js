import * as fs from 'node:fs/promises'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { dirname } from 'node:path'

export const writeFile = async (path, content) => {
  try {
    await fs.writeFile(path, content)
  } catch (error) {
    if (error && error.code === ErrorCodes.ENOENT) {
      await fs.mkdir(dirname(path), { recursive: true })
      await fs.writeFile(path, content)
    }
  }
}

export const readFile = async (path) => {
  const content = await fs.readFile(path, 'utf8')
  return content
}
