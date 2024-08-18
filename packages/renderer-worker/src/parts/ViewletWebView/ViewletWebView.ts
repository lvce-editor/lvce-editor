import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as GetWebViewSandBox from '../GetWebViewSandBox/GetWebViewSandBox.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as Id from '../Id/Id.js'

export const create = (id, uri) => {
  return {
    id,
    uri,
    iframeSrc: '',
    sandbox: [],
    portId: 0,
  }
}

const getIframeSrc = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView.path
    }
  }
  return ''
}

export const loadContent = async (state) => {
  const { uri } = state
  const webViewId = uri.slice('webview://'.length)
  const webViews = await GetWebViews.getWebViews()
  const iframeSrc = getIframeSrc(webViews, webViewId)
  // TODO make port configurable
  const webViewPort = 3002

  await ExtensionHostManagement.activateByEvent(`onWebView:${webViewId}`)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const portId = Id.create()
  await Transferrable.transferToRendererProcess(portId, port1)
  await ExtensionHostWorker.invokeAndTransfer([port2], 'ExtensionHostWebView.create', webViewId, port2)
  if (Platform.platform === PlatformType.Remote) {
    // TODO apply something similar for electron
    // TODO pass webview root, so that only these resources can be accessed
    // TODO pass csp configuration to server
    // TODO pass coop / coep configuration to server
    const root = await SharedProcess.invoke('Platform.getRoot')
    const relativePath = iframeSrc.slice('http://localhost:3000/'.length)
    let webViewRoot = root + '/' + relativePath
    if (webViewRoot.endsWith('./index.html')) {
      webViewRoot = webViewRoot.slice(0, -'./index.html'.length)
    }
    const frameAncestors = 'http://localhost:3000'
    await SharedProcess.invoke('WebViewServer.start', webViewPort, frameAncestors, webViewRoot)
  }
  let actualIframeSrc = iframeSrc
  if (Platform.platform === PlatformType.Remote) {
    // actualIframeSrc = iframeSrc.replace('http://localhost:3000', `http://localhost:${webViewPort}`)
    // TODO how to support many webviews, without opening too many ports
    // TODO remove index.html extension
    actualIframeSrc = `http://localhost:${webViewPort}/index.html`
  }
  const sandbox = GetWebViewSandBox.getIframeSandbox()
  return {
    ...state,
    iframeSrc: actualIframeSrc,
    sandbox,
    portId,
  }
}
