import { basename } from 'node:path'
import * as BuiltinExtensionsPath from '../BuiltinExtensionsPath/BuiltinExtensionsPath.ts'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.ts'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.ts'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'
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
    symlink,
    version,
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
        path: link.resolvedPath,
        type: ExtensionManifestInputType.LinkedExtension,
      }
    })
    const manifests = await ExtensionManifests.getAll([
      ...transientLinkedExtensions,
      {
        path: PlatformPaths.getLinkedExtensionsPath(),
        type: ExtensionManifestInputType.LinkedExtensionsFolder,
      },
      {
        path: PlatformPaths.getExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
      {
        path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
    ])
    const infos = getManifestInfos(manifests)
    return infos
  } catch (error) {
    throw new VError(error, `Failed to list extensions`)
  }
}
