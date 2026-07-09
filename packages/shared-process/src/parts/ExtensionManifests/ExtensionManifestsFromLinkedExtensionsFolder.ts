import { readlink } from 'node:fs/promises'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as MergeWithSymlinks from '../MergeWithSymlinks/MergeWithSymlinks.ts'
import * as ToAbsolutePaths from '../ToAbsolutePaths/ToAbsolutePaths.ts'
import { VError } from '../VError/VError.ts'

const readSymlink = async (absolutePath: any): Promise<any> => {
  try {
    const info = await readlink(absolutePath)
    return info
  } catch {
    return ''
  }
}

const readSymlinks = (absolutePaths: any): any => {
  return Promise.all(absolutePaths.map(readSymlink))
}

export const getExtensionManifests = async (path: any): Promise<any> => {
  try {
    if (!path) {
      return []
    }
    const dirents = await FileSystem.readDirWithFileTypes(path)
    const folderNames = dirents.filter((dirent: any) => dirent.type === DirentType.Directory).map((dirent: any) => dirent.name)
    const absolutePaths = ToAbsolutePaths.toAbsolutePaths(path, folderNames)
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
