import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Hash from '../Hash/Hash.js'
import * as Root from '../Root/Root.js'

const getAbsolutePath = (relativePath) => {
  return join(Root.root, relativePath)
}

const getContent = (absolutePath) => {
  return readFile(absolutePath)
}

const computeHash = async (locations) => {
  const absolutePaths = locations.map(getAbsolutePath)
  const contents = await Promise.all(absolutePaths.map(getContent))
  const hash = Hash.computeHash(contents)
  return hash
}

export const computeCacheKey = async (locations) => {
  const hash = await computeHash(locations)
  return hash
}
