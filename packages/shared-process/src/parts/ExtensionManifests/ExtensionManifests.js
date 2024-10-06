import * as DeduplicateExtensions from '../DeduplicateExtensions/DeduplicateExtensions.js'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifestsGetFromFolder from './ExtensionManifestsFromFolder.js'
import * as ExtensionManifestsGetFromLinkedExtensionsFolder from './ExtensionManifestsFromLinkedExtensionsFolder.js'
import * as ExtensionManifestsGetFromOnlyExtension from './ExtensionManifestsFromOnlyExtension.js'

const getModule = (type) => {
  switch (type) {
    case ExtensionManifestInputType.Folder:
      return ExtensionManifestsGetFromFolder
    case ExtensionManifestInputType.OnlyExtension:
      return ExtensionManifestsGetFromOnlyExtension
    case ExtensionManifestInputType.LinkedExtensionsFolder:
      return ExtensionManifestsGetFromLinkedExtensionsFolder
    default:
      throw new Error('unsupported input type')
  }
}

const get = (input) => {
  const module = getModule(input.type)
  return module.getExtensionManifests(input.path)
}

export const getAll = async (inputs, builtinExtensionsPath) => {
  const manifests = await Promise.all(inputs.map(get))
  const flatManifests = manifests.flat(1)
  const uniqueExtensions = DeduplicateExtensions.deduplicateExtensions(flatManifests, builtinExtensionsPath)
  return uniqueExtensions
}
