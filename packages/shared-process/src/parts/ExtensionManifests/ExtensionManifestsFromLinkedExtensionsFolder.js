import { readlink } from 'node:fs/promises'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
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

const mergeWithSymLinks = (manifests, symlinks) => {
  const { length } = manifests
  const merged = []
  for (let i = 0; i < length; i++) {
    const manifest = manifests[i]
    const symlink = symlinks[i]
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      merged.push(manifest)
    } else {
      merged.push({ ...manifest, symlink })
    }
  }
  return merged
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
    const merged = mergeWithSymLinks(manifests, symlinks)
    return merged
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return []
    }
    throw new VError(error, 'Failed to get extension manifests')
  }
}
