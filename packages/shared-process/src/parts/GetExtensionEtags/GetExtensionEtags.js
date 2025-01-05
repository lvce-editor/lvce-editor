import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'

const serializeStats = (stats) => {
  const { mtime, size } = stats
  return {
    mtime,
    size,
  }
}

const getOnly = async (path) => {
  if (!path) {
    return []
  }
  const absolutePath = join(path, 'extension.json')
  const stats = await stat(absolutePath)
  return [serializeStats(stats)]
}

const getFolder = async (path) => {
  try {
    const dirents = await readdir(path)
    const stats = await Promise.all(
      dirents.map(async (dirent) => {
        const extensionManifestPath = join(path, dirent, 'extension.json')
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
