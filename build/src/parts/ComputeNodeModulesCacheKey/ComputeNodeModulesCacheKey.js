import { createHash } from 'crypto'
import { readFile } from 'fs/promises'
import { join } from 'path'
import * as Root from '../Root/Root.js'

const locations = [
  'lerna.json',
  'package-lock.json',
  'build/package-lock.json',
  'packages/extension-host/package-lock.json',
  'packages/pty-host/package-lock.json',
  'packages/main-process/package-lock.json',
  'packages/renderer-process/package-lock.json',
  'packages/renderer-worker/package-lock.json',
  'packages/shared-process/package-lock.json',
  'packages/server/package-lock.json',
  'build/src/parts/ComputeNodeModulesCacheKey/ComputeNodeModulesCacheKey.js',
  'build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.js',
]

const getAbsolutePath = (relativePath) => {
  return join(Root.root, relativePath)
}

const getContent = (absolutePath) => {
  return readFile(absolutePath)
}

const computeHash = async (locations) => {
  const absolutePaths = locations.map(getAbsolutePath)
  const contents = await Promise.all(absolutePaths.map(getContent))
  const hash = createHash('sha1')
  for (const content of contents) {
    hash.update(content)
  }
  return hash.digest('hex')
}

const main = async () => {
  const hash = await computeHash(locations)
  process.stdout.write(hash)
}

main()
