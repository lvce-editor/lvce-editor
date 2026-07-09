import { basename } from 'node:path'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.ts'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.ts'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'
import * as BuiltinExtensionsPath from '../BuiltinExtensionsPath/BuiltinExtensionsPath.ts'
import { VError } from '../VError/VError.ts'

const getManifestVersion = (json: any): any => {
  if (json && json.version && typeof json.version === 'string') {
    return json.version
  }
  return 'n/a'
}

const getManifestId = (json: any): any => {
  if (json && json.id && typeof json.id === 'string') {
    return json.id
  }
  return basename(json.path)
}

const getSymlink = (json: any): any => {
  if (json && json.symlink && typeof json.symlink === 'string') {
    return json.symlink
  }
  return ''
}

const getManifestInfo = (json: any): any => {
  const id = getManifestId(json)
  const version = getManifestVersion(json)
  const symlink = getSymlink(json)
  return {
    id,
    version,
    symlink,
  }
}

const isFulfilled = (result: any): any => {
  return result.status === ExtensionManifestStatus.Resolved
}

const getManifestInfos = (manifests: any): any => {
  const results = manifests.filter(isFulfilled).map(getManifestInfo)
  return results
}

export const list = async (): Promise<any> => {
  try {
    const transientLinkedExtensions = TransientLinkedExtensions.getLinkedExtensions().map((link: any) => {
      return {
        type: ExtensionManifestInputType.LinkedExtension,
        path: link.resolvedPath,
      }
    })
    const manifests = await ExtensionManifests.getAll([
      ...transientLinkedExtensions,
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
        path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
      },
    ])
    const infos = getManifestInfos(manifests)
    return infos
  } catch (error) {
    throw new VError(error, `Failed to list extensions`)
  }
}
