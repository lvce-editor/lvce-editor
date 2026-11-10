import { createHash } from 'node:crypto'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import * as ReadFile from '../ReadFile/ReadFile.ts'
import * as Path from '../Path/Path.ts'

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

const walkFiles = async (folder, files) => {
  const dirents = await readdir(folder, { withFileTypes: true })
  dirents.sort((a, b) => a.name.localeCompare(b.name))
  for (const dirent of dirents) {
    const absolutePath = join(folder, dirent.name)
    if (dirent.isFile()) {
      files.push(absolutePath)
    } else if (dirent.isDirectory()) {
      await walkFiles(absolutePath, files)
    }
  }
}

export const computeFolderHash = async (folder, extraFiles = [] as any[], extraContents = [] as any[]) => {
  try {
    const absolutePath = Path.absolute(folder)
    const hash = createHash('sha1')
    const files: string[] = []
    await walkFiles(absolutePath, files)
    for (const filePath of files) {
      const content = await ReadFile.readFile(filePath)
      hash.update(content)
    }
    for (const extraFile of extraFiles) {
      const content = await ReadFile.readFile(extraFile)
      hash.update(content)
    }
    const extraContentsString = JSON.stringify(extraContents)
    hash.update(extraContentsString)
    return hash.digest('hex')
  } catch (error) {
    throw new Error('Failed to compute hash', {
      // @ts-ignore
      cause: error,
    })
  }
}
