import * as Debug from '../Debug/Debug.js'

export const didInstallExtension = (extensionHost, extension) => {
  return extensionHost.invoke('didInstallExtension', extension)
}

export const didUninstallExtension = (extensionHost, extension) => {
  return extensionHost.invoke('didUninstallExtension', extension)
}

export const disableExtension = (extensionHost, extension) => {
  return extensionHost.invoke('disableExtension', extension)
}

// TODO have enableExtensionsCommand to avoid sending too many messages via ipc -> only send one ipc message to enable multiple extensions
export const enableExtension = async (extensionHost, extension) => {
  Debug.debug(`ExtensionHost#enableExtension ${extension.id}`)
  await extensionHost.invoke('enableExtension', extension)
}

export const activateAll = async (extensions) => {
  // console.log({ extensions })
  const results = await Promise.allSettled(extensions.map(enableExtension))
  // console.log({ results })
  return results
}
