import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionsCache from '../ExtensionsCache/ExtensionsCache.js'

export const getExtensions = () => {
  if (!ExtensionsCache.has()) {
    ExtensionsCache.set(ExtensionMeta.getExtensions())
  }
  return ExtensionsCache.get()
}
