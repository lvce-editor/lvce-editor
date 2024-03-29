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

const deduplicateExtensions = (extensions, builtinExtensionsPath) => {
  const seen = Object.create(null)
  const uniqueExtensions = []
  for (const extension of extensions) {
    if (extension.id in seen) {
      continue
    }
    seen[extension.id] = true
    if (extension.path.startsWith(builtinExtensionsPath)) {
      extension.builtin = true
    }
    uniqueExtensions.push(extension)
  }
  return uniqueExtensions
}

export const getAll = async (inputs, builtinExtensionsPath) => {
  const manifests = await Promise.all(inputs.map(get))
  const flatManifests = manifests.flat(1)
  const uniqueExtensions = deduplicateExtensions(flatManifests, builtinExtensionsPath)
  return uniqueExtensions
}
