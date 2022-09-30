import { basename } from 'node:path'
import VError from 'verror'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.js'
import * as Platform from '../Platform/Platform.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'

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

const getManifestInfo = (json) => {
  const id = getManifestId(json)
  const version = getManifestVersion(json)
  return {
    id,
    version,
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
        type: ExtensionManifestInputType.Folder,
        path: Platform.getLinkedExtensionsPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: Platform.getExtensionsPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: Platform.getBuiltinExtensionsPath(),
      },
    ])
    const infos = getManifestInfos(manifests)
    return infos
  } catch (error) {
    throw new VError(error, `Failed to list extensions`)
  }
}
