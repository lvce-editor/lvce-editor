import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as IframeWorker from '../IframeWorker/IframeWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Platform from '../Platform/Platform.js'

export const setPort = async (uid: number, port: MessagePort, origin: string, portType: string): Promise<void> => {
  await RendererProcess.invokeAndTransfer('WebView.setPort', uid, port, origin, portType)
}

export const create = async (id: number, webViewPort: string, webViewId: string, previewServerId: number, uri: string) => {
  return IframeWorker.invoke('WebView.create2', {
    id,
    webViewPort,
    webViewId,
    previewServerId,
    uri,
    platform: Platform.platform,
  })
}

export const compat = {
  sharedProcessInvoke(...args) {
    return SharedProcess.invoke(...args)
  },
  rendererProcessInvoke(...args) {
    return RendererProcess.invoke(...args)
  },
  extensionHostWorkerInvokeAndTransfer(...args) {
    return ExtensionHostWorker.invokeAndTransfer(...args)
  },
  extensionHostWorkerInvoke(...args) {
    return ExtensionHostWorker.invoke(...args)
  },
}
