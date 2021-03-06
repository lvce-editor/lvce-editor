import { createHash } from 'crypto'
import { join } from 'path'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as ReadFile from '../ReadFile/ReadFile.js'

export const computeHash = (contents) => {
  const hash = createHash('sha1')
  if (Array.isArray(contents)) {
    for (const content of contents) {
      hash.update(content)
    }
  } else if (typeof contents === 'string') {
    hash.update(contents)
  }
  return hash.digest('hex')
}

const walkFiles = async (folder, fn) => {
  const dirents = await ReadDir.readDir(folder)
  for (const dirent of dirents) {
    const absolutePath = join(folder, dirent.name)
    if (dirent.isFile()) {
      await fn(absolutePath)
    } else if (dirent.isDirectory()) {
      await walkFiles(absolutePath, fn)
    }
  }
}

export const computeFolderHash = async (folder, extraFiles = []) => {
  try {
    const hash = createHash('sha1')
    const handleFilePath = async (filePath) => {
      const content = await ReadFile.readFile(filePath)
      hash.update(content)
    }
    await walkFiles(folder, handleFilePath)
    for (const extraFile of extraFiles) {
      const content = await ReadFile.readFile(extraFile)
      hash.update(content)
    }
    return hash.digest('hex')
  } catch (error) {
    throw new Error('Failed to compute hash', {
      // @ts-ignore
      cause: error,
    })
  }
}
