import { existsSync } from 'node:fs'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'

const getPrebuildsToKeep = (platform, arch) => {
  if (platform === 'linux' && arch === 'x64') {
    return 'linux-x64'
  }
  if (platform === 'linux' && arch === 'arm64') {
    return 'linux-arm64'
  }
  if (platform === 'darwin' && arch === 'x64') {
    return 'darwin-x64'
  }
  if (platform === 'darwin' && arch === 'arm') {
    return 'darwin-arm64'
  }
  if (platform === 'win32') {
    return 'win32-x64'
  }
  return '*'
}

export const removeBarePrebuilds = async (to, platform, arch) => {
  const toKeep = getPrebuildsToKeep(platform, arch)
  if (toKeep === '*') {
    return
  }
  const modules = ['bare-fs', 'bare-os', 'bare-url']
  for (const module of modules) {
    const prebuildsPath = `${to}/node_modules/${module}/prebuilds`
    if (!existsSync(prebuildsPath)) {
      continue
    }
    const dirents = await ReadDir.readDir(prebuildsPath)
    if (!dirents.includes(toKeep)) {
      throw new Error('missing files to keep')
    }
    for (const dirent of dirents) {
      if (dirent !== toKeep) {
        await Remove.remove(`${to}/node_modules/${module}/prebuilds/${dirent}`)
      }
    }
  }
}
