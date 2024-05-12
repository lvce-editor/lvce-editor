import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as LoadErrorCode from '../LoadErrorCode/LoadErrorCode.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await EmbedsProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  return id
}

export const disposeWebContentsView = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}

export const resizeWebContentsView = (id, x, y, width, height) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.resizeBrowserView', id, x, y, width, height)
}


export const setIframeSrcFallback = async (id, error) => {
  const { code, message } = error
  await EmbedsProcess.invoke('ElectronWebContentsView.setIframeSrcFallback', id, code, message)

}

export const setIframeSrc = async (id, iframeSrc) => {
  try {

    await EmbedsProcess.invoke('ElectronWebContentsView.setIframeSrc', id, iframeSrc)

  } catch (error) {

    console.log({ error })
    // TODO send error back to embeds worker,
    // embeds worker decides how to handle error
    // @ts-ignore
    if (error && error.code === LoadErrorCode.ERR_ABORTED) {
      console.info(`[embeds worker] navigation to ${iframeSrc} aborted`)
      return
    }
    // @ts-ignore
    if (error && error.code === LoadErrorCode.ERR_FAILED
    ) {
      console.info(`[embeds worker] navigation to ${iframeSrc} canceled`)
      // ElectronWebContentsViewState.removeCanceled(webContents.id)
      return
    }
    try {
      await setIframeSrcFallback(id, error)
    } catch (error) {
      console.warn(`Failed to set iframe src`, error)
    }

  }
}

export const focus = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.focus', id)
}

export const openDevtools = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.openDevtools', id)
}

export const reload = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.reload', id)
}

export const show = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.show', id)
}

export const hide = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.hide', id)
}

export const forward = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.forward', id)
}

export const backward = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.backward', id)
}

export const cancelNavigation = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.cancelNavigation', id)
}

export const inspectElement = (id, x, y) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (id, fallthroughKeybindings) => {
  // TODO
  // return EmbedsProcess.invoke('ElectronWebContentsView.setFallthroughKeyBindings', id, fallthroughKeybindings)
}

export const getStats = (id, fallthroughKeybindings) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.getStats', id, fallthroughKeybindings)
}

const forwardEvent =
  (key) =>
    (id, ...args) => {
      Rpc.send(key, ...args)
    }

export const handleDidNavigate = forwardEvent('ElectronBrowserView.handleDidNavigate')

export const handleTitleUpdated = forwardEvent('ElectronBrowserView.handleTitleUpdated')

export const handleWillNavigate = forwardEvent('ElectronBrowserView.handleWillNavigate')

export const handleContextMenu = forwardEvent('ElectronBrowserView.handleContextMenu')
