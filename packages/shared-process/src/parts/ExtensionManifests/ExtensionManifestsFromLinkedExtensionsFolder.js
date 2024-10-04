import { readlink } from 'node:fs/promises'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as MergeWithSymlinks from '../MergeWithSymlinks/MergeWithSymlinks.js'
import * as ToAbsolutePaths from '../ToAbsolutePaths/ToAbsolutePaths.js'
import { VError } from '../VError/VError.js'

const readSymlink = async (absolutePath) => {
  try {
    const info = await readlink(absolutePath)
    return info
  } catch {
    return ''
  }
}

const readSymlinks = (absolutePaths) => {
  return Promise.all(absolutePaths.map(readSymlink))
}

export const getExtensionManifests = async (path) => {
  try {
    if (!path) {
      return []
    }
    const dirents = await FileSystem.readDir(path)
    const absolutePaths = ToAbsolutePaths.toAbsolutePaths(path, dirents)
    const manifests = await Promise.all(absolutePaths.map(ExtensionManifest.get))
    const symlinks = await readSymlinks(absolutePaths)
    const merged = MergeWithSymlinks.mergeWithSymLinks(manifests, symlinks)
    return merged
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return []
    }
    throw new VError(error, 'Failed to get extension manifests')
  }
}
