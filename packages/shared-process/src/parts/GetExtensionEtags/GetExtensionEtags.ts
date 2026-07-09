import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'

const serializeStats = (stats) => {
  const { mtime, size } = stats
  return {
    mtime,
    size,
  }
}

const getManifestStats = async (path) => {
  const absolutePath = join(path, 'extension.json')
  try {
    const stats = await stat(absolutePath)
    return [serializeStats(stats)]
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      const monoRepoPath = join(path, 'packages', 'extension', 'extension.json')
      const stats = await stat(monoRepoPath)
      return [serializeStats(stats)]
    }
    throw error
  }
}

const getOnly = async (path) => {
  if (!path) {
    return []
  }
  return getManifestStats(path)
}

const getFolder = async (path) => {
  try {
    const dirents = await FileSystem.readDirWithFileTypes(path)
    const folderNames = dirents.filter((dirent) => dirent.type === DirentType.Directory).map((dirent) => dirent.name)
    const stats = await Promise.all(
      folderNames.map(async (folderName) => {
        const extensionManifestPath = join(path, folderName, 'extension.json')
        const direntStats = await stat(extensionManifestPath)
        return serializeStats(direntStats)
      }),
    )
    return stats
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return []
    }
  }
}

const get = (input) => {
  switch (input.type) {
    case ExtensionManifestInputType.Folder:
    case ExtensionManifestInputType.LinkedExtensionsFolder:
      return getFolder(input.path)
    case ExtensionManifestInputType.OnlyExtension:
    case ExtensionManifestInputType.LinkedExtension:
      return getOnly(input.path)
    default:
      return []
  }
}

export const getExtensionEtags = async (inputs) => {
  const stats = await Promise.all(inputs.map(get))
  const flatStats = stats.flat(1)
  return flatStats
}
