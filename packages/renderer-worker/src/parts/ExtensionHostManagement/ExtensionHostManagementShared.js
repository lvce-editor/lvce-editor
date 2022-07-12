import * as Command from '../Command/Command.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as Languages from '../Languages/Languages.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'

/**
 * @enum
 */
const ExtensionHostState = {
  Off: 0,
  Loading: 1,
  Running: 2,
  Error: 3,
}

export const state = {
  extensionPromiseCache: Object.create(null),
  extensionHosts: Object.create(null),
}

const isActivatableExtension = (extension) => {
  return extension.main
}

const toActivatableExtension = (extension) => {
  return {
    path: extension.path,
    id: extension.id,
    main: extension.main,
  }
}

const activateExtension = async (extensionHost, extension) => {
  if (!state.extensionPromiseCache[extension.id]) {
    const activatableExtension = toActivatableExtension(extension)
    state.extensionPromiseCache[extension.id] = SharedProcess.invoke(
      /* ExtensionHost.enableExtension */ 'ExtensionHost.enableExtension',
      /* activatableExtension */ activatableExtension
    )
  }
  // TODO what if activation fails or extension is restarted ot extension host is restarted?
  return state.extensionPromiseCache[extension.id]
}

export const ensureExtensionHostIsStarted = async () => {
  switch (ExtensionHostCore.state.status) {
    case ExtensionHostCore.STATUS_OFF:
      ExtensionHostCore.state.extensionHostPromise =
        ExtensionHostCore.startNodeExtensionHost()
      await ExtensionHostCore.state.extensionHostPromise
      await activateByEvent('onStartupFinished')
      break
    case ExtensionHostCore.STATUS_LOADING:
      await ExtensionHostCore.state.extensionHostPromise
      break
    case ExtensionHostCore.STATUS_RUNNING:
      break
    case ExtensionHostCore.STATUS_ERROR:
      throw new Error('extension host is broken')
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

// const startExtensionHost = async (type) => {
//   return ExtensionHostIpc.listen(ExtensionHostIpc.Methods.SharedProcess)
// }

export const startExtensionHost = async (key, method) => {
  const existingExtensionHost = state.extensionHosts[key]
  if (existingExtensionHost) {
    switch (existingExtensionHost.state) {
      case ExtensionHostState.Off:
        throw new Error('extension host cannot be off')
      case ExtensionHostState.Loading:
        return existingExtensionHost.promise
      case ExtensionHostState.Running:
        return existingExtensionHost.ipc
      default:
        throw new Error('unexpected extension host state')
    }
  }
  const promise = ExtensionHostIpc.listen(method)
  state.extensionHosts[key] = {
    state: ExtensionHostState.Loading,
    promise,
  }
  const ipc = await promise
  const handleMessage = (message) => {
    console.log()
  }
  ipc.onmessage
  state.extensionHosts[key] = {
    state: ExtensionHostState.Running,
    ipc,
  }
  return ipc
}

export const stopExtensionHost = async (key) => {
  const existingExtensionHost = state.extensionHosts[key]
  if (existingExtensionHost) {
    switch (existingExtensionHost.state) {
      case ExtensionHostState.Off:
        throw new Error('extension host cannot be off')
      case ExtensionHostState.Loading:
      case ExtensionHostState.Error:
        existingExtensionHost.ipc.dispose()
        break
      default:
        throw new Error('invalid extension host state')
    }
  }
}

const startExtensionHostNode = () => {
  return startExtensionHost(
    'nodeExtensionHost',
    ExtensionHostIpc.Methods.WebWorker
  )
}

const startExtensionHostWeb = () => {}

const stopExtensionHostNode = () => {}

const isExtensionHostNodeExtension = (extension) => {
  return typeof extension.main === 'string'
}

const isExtensionHostWebExtension = (extension) => {
  return typeof extension.browser === 'string'
}

const startNodeExtensionHost = async () => {}

const startWebExtensionHost = async () => {}

export const canActivate = (manager, extensions) => {
  return extensions.some(manager.canActivate)
}
