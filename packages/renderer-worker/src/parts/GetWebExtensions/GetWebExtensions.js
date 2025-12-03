import * as Command from '../Command/Command.js'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebExtensionsUrl from '../WebExtensionsUrl/WebExtensionsUrl.js'

const getSharedProcessExtensions = () => {
  return SharedProcess.invoke(/* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions')
}

const getStaticWebExtensions = () => {
  return Command.execute('Ajax.getJson', WebExtensionsUrl.webExtensionsUrl)
}

const getWebExtensionsWeb = async () => {
  const staticWebExtensions = await getStaticWebExtensions()
  return [...staticWebExtensions, ...ExtensionMetaState.state.webExtensions]
}

const isWebExtension = (extension) => {
  return extension && typeof extension.browser === 'string'
}

const getWebExtensionsDefault = async () => {
  const staticWebExtensions = await getStaticWebExtensions()
  const sharedProcessExtensions = await getSharedProcessExtensions()
  const sharedProcessWebExtensions = sharedProcessExtensions.filter(isWebExtension)
  return [...staticWebExtensions, sharedProcessWebExtensions, ...ExtensionMetaState.state.webExtensions]
}

export const getWebExtensions = async () => {
  try {
    switch (Platform.getPlatform()) {
      case PlatformType.Web:
        return getWebExtensionsWeb()
      default:
        return getWebExtensionsDefault()
    }
  } catch {
    return ExtensionMetaState.state.webExtensions
  }
}
