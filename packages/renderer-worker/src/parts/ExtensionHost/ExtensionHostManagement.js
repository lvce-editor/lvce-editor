import * as Command from '../Command/Command.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ExtensionHostCore from './ExtensionHostCore.js'
import * as Languages from '../Languages/Languages.js'

export const state = {
  extensionPromiseCache: Object.create(null),
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

const activateExtension = async (extension) => {
  if (!extension.main) {
    return
  }
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

export const activateByEvent = async (event) => {
  if (!Languages.hasLoaded()) {
    await Languages.waitForLoad()
  }
  // console.log('activate', event)
  await ensureExtensionHostIsStarted()
  // TODO this seems too inefficient -> leave extensions in shared process and just send activation event to shared process
  // TODO should not query extensions multiple times
  const extensions = await ExtensionMeta.getExtensions()

  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  for (const extension of extensions) {
    if (extension.status === 'rejected') {
      const message = extension.reason.message
      const codeFrame = extension.reason.jse_cause.codeFrame
      const stack = extension.reason.originalStack
      await Command.execute(
        /* Dialog.showMessage */ 'Dialog.showMessage',
        /* error */ { message, codeFrame, stack }
      )
    }
  }
  for (const extension of extensions) {
    if (extension.activation && extension.activation.includes(event)) {
      await activateExtension(extension)
    }
  }

  // TODO ask shared process to activate extension
  // TODO in web, create web worker extension host
}
