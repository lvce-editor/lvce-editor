import * as Command from '../Command/Command.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as Languages from '../Languages/Languages.js'
import * as ExtensionHostManagementBrowser from './ExtensionHostManagementBrowser.js'
import * as ExtensionHostManagementNode from './ExtensionHostManagementNode.js'
import * as ExtensionHostManagementShared from './ExtensionHostManagementShared.js'
import * as Platform from '../Platform/Platform.js'

const getExtensionHostManagementTypes = () => {
  const platform = Platform.getPlatform()
  switch (platform) {
    case 'web':
      return [ExtensionHostManagementBrowser]
    case 'remote':
    case 'electron':
      return [ExtensionHostManagementBrowser, ExtensionHostManagementNode]
    default:
      throw new Error('unsupported platform')
  }
}

const getExtensionsToActivate = (extensions, event) => {
  const extensionsToActivate = []
  for (const extension of extensions) {
    if (extension.activation && extension.activation.includes(event)) {
      extensionsToActivate.push(extension)
    }
  }
  return extensionsToActivate
}

const getExtensionsWithError = (extensions) => {
  const extensionsWithError = []
  for (const extension of extensions) {
    if (extension.status === 'rejected') {
      extensionsWithError.push(extension)
    }
  }
  return extensionsWithError
}

const handleExtensionActivationError = async (extension) => {
  const message = extension.reason.message
  const codeFrame = extension.reason.jse_cause.codeFrame
  const stack = extension.reason.originalStack
  await Command.execute(
    /* Dialog.showMessage */ 'Dialog.showMessage',
    /* error */ { message, codeFrame, stack }
  )
}

const getManagersWithExtensionsToActivate = (
  extensionHostManagers,
  extensions
) => {
  const managersToActivate = []
  for (const manager of extensionHostManagers) {
    const toActivate = []
    for (const extension of extensions) {
      if (manager.canActivate(extension)) {
        toActivate.push(extension)
      }
    }
    if (toActivate.length > 0) {
      managersToActivate.push({ manager, toActivate })
    }
  }
  return managersToActivate
}

export const activateByEvent = async (event) => {
  if (!Languages.hasLoaded()) {
    await Languages.waitForLoad()
  }
  // TODO should not query extensions multiple times
  const extensions = await ExtensionMeta.getExtensions()

  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  const extensionsWithError = getExtensionsWithError(extensions)
  for (const extension of extensionsWithError) {
    await handleExtensionActivationError(extension)
  }
  const extensionsToActivate = getExtensionsToActivate(extensions, event)
  // TODO how to handle when multiple reference providers are registered for nodejs and webworker extension host?
  // what happens when all of them / some of them throw error?
  // what happens when some of them take very long to activate?

  const extensionHostManagerTypes = getExtensionHostManagementTypes()
  const managersWithExtensions = getManagersWithExtensionsToActivate(
    extensionHostManagerTypes,
    extensionsToActivate
  )

  console.log({ managersWithExtensions })
  for (const managerWithExtensions of managersWithExtensions) {
    const extensionHost =
      await ExtensionHostManagementShared.startExtensionHost(
        managerWithExtensions.manager.name,
        managerWithExtensions.manager.ipc
      )
    for (const extension of managerWithExtensions.toActivate) {
      // TODO tell extension host to activate extension
      await extensionHost.activateExtension(extension)
    }
    return extensionHost
  }

  // TODO support querying completion items from multiple extension hosts
  // e.g. completion items from node extension host and word based completions from web worker extension host
  return {
    invoke() {
      throw new Error('not implemented')
    },
  }
}
