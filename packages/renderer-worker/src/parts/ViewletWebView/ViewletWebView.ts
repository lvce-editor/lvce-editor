import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as GetWebViewSandBox from '../GetWebViewSandBox/GetWebViewSandBox.ts'
import * as Id from '../Id/Id.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as WebViewServer from '../WebViewServer/WebViewServer.ts'

export const create = (id, uri) => {
  return {
    id,
    uri,
    iframeSrc: '',
    sandbox: [],
    portId: 0,
    origin: '',
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
  console.time('webviews')
  const webViews = await GetWebViews.getWebViews()
  console.timeEnd('webviews')
  const iframeSrc = getIframeSrc(webViews, webViewId)
  // TODO make port configurable
  const webViewPort = 3002

  console.time('activate')
  await ExtensionHostManagement.activateByEvent(`onWebView:${webViewId}`)
  console.timeEnd('activate')
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const portId = Id.create()
  await Transferrable.transferToRendererProcess(portId, port1)
  // TODO figure out order for events, e.g.
  // 1. activate extension, create webview and ports in parallel
  // 2. wait for webview to load (?)
  // 3. setup extension host worker rpc
  // 4. create webview in extension host worker and load content

  ExtensionHostWorker.invokeAndTransfer([port2], 'ExtensionHostWebView.create', webViewId, port2)
  let origin = ''
  if (Platform.platform === PlatformType.Remote) {
    // TODO apply something similar for electron
    // TODO pass webview root, so that only these resources can be accessed
    // TODO pass csp configuration to server
    // TODO pass coop / coep configuration to server
    console.time('getRoot')
    const root = await SharedProcess.invoke('Platform.getRoot')
    console.timeEnd('getRoot')
    const relativePath = iframeSrc.slice('http://localhost:3000/'.length)
    let webViewRoot = root + '/' + relativePath
    if (webViewRoot.endsWith('./index.html')) {
      webViewRoot = webViewRoot.slice(0, -'./index.html'.length)
    }
    const frameAncestors = 'http://localhost:3000'
    console.time('server start')
    await WebViewServer.start(webViewPort) // TODO move this up
    console.timeEnd('server start')
    console.time('setHandler')
    await WebViewServer.setHandler(frameAncestors, webViewRoot)
    console.timeEnd('setHandler')
    // TODO maybe allow same origin, so that iframe origin is not null
    origin = '*'
  } else {
    origin = '*'
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
    origin,
  }
}
