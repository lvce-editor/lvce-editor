import * as DeduplicateExtensions from '../DeduplicateExtensions/DeduplicateExtensions.ts'
import { getDisabledExtensionIds } from '../ExtensionManagement/ExtensionManagement.ts'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.ts'
import * as ExtensionManifestsGetFromFolder from './ExtensionManifestsFromFolder.ts'
import * as ExtensionManifestsGetFromLinkedExtension from './ExtensionManifestsFromLinkedExtension.ts'
import * as ExtensionManifestsGetFromLinkedExtensionsFolder from './ExtensionManifestsFromLinkedExtensionsFolder.ts'
import * as ExtensionManifestsGetFromOnlyExtension from './ExtensionManifestsFromOnlyExtension.ts'

const getModule = (type: any): any => {
  switch (type) {
    case ExtensionManifestInputType.Folder:
      return ExtensionManifestsGetFromFolder
    case ExtensionManifestInputType.LinkedExtension:
      return ExtensionManifestsGetFromLinkedExtension
    case ExtensionManifestInputType.LinkedExtensionsFolder:
      return ExtensionManifestsGetFromLinkedExtensionsFolder
    case ExtensionManifestInputType.OnlyExtension:
      return ExtensionManifestsGetFromOnlyExtension
    default:
      throw new Error('unsupported input type')
  }
}

const get = (input: any): any => {
  const module = getModule(input.type)
  return module.getExtensionManifests(input.path)
}

const isBuiltin = (extension: any): any => {
  return extension && extension.id && extension.id.startsWith('builtin.')
}

const addExtensionDisabledStatus = (uniqueExtensions: any, disabledExtensionIds: any): any => {
  return uniqueExtensions.map((extension: any) => {
    return {
      ...extension,
      disabled: disabledExtensionIds.includes(extension.id),
      isBuiltin: isBuiltin(extension),
    }
  })
}

export const getAll = async (inputs: any, builtinExtensionsPath: any = undefined): Promise<any> => {
  const manifests = await Promise.all(inputs.map(get))
  const disabledIds = await getDisabledExtensionIds()
  const flatManifests = manifests.flat(1)
  const uniqueExtensions = DeduplicateExtensions.deduplicateExtensions(flatManifests, builtinExtensionsPath)
  const filteredExtensions = addExtensionDisabledStatus(uniqueExtensions, disabledIds)
  return filteredExtensions
}
