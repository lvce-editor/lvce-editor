import { basename } from 'node:path'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import { VError } from '../VError/VError.js'

const getManifestVersion = (json) => {
  if (json && json.version && typeof json.version === 'string') {
    return json.version
  }
  return 'n/a'
}

const getManifestId = (json) => {
  if (json && json.id && typeof json.id === 'string') {
    return json.id
  }
  return basename(json.path)
}

const getSymlink = (json) => {
  if (json && json.symlink && typeof json.symlink === 'string') {
    return json.symlink
  }
  return ''
}

const getManifestInfo = (json) => {
  const id = getManifestId(json)
  const version = getManifestVersion(json)
  const symlink = getSymlink(json)
  return {
    id,
    version,
    symlink,
  }
}

const isFulfilled = (result) => {
  return result.status === ExtensionManifestStatus.Resolved
}

const getManifestInfos = (manifests) => {
  const results = manifests.filter(isFulfilled).map(getManifestInfo)
  return results
}

export const list = async () => {
  try {
    const manifests = await ExtensionManifests.getAll([
      {
        type: ExtensionManifestInputType.LinkedExtensionsFolder,
        path: PlatformPaths.getLinkedExtensionsPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getExtensionsPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getBuiltinExtensionsPath(),
      },
    ])
    const infos = getManifestInfos(manifests)
    return infos
  } catch (error) {
    throw new VError(error, `Failed to list extensions`)
  }
}
