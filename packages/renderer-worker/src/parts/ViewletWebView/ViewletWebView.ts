import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetIframeSrc from '../GetIframeSrc/GetIframeSrc.ts'
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

export const loadContent = async (state) => {
  const { uri } = state
  const webViewId = uri.slice('webview://'.length)
  console.time('webviews')
  const webViews = await GetWebViews.getWebViews()
  console.timeEnd('webviews')
  // TODO make port configurable
  const webViewPort = 3002
  let root = ''
  if (Platform.platform === PlatformType.Remote) {
    root = await SharedProcess.invoke('Platform.getRoot')
  }
  const iframeResult = GetIframeSrc.getIframeSrc(webViews, webViewId, webViewPort, root)
  if (!iframeResult) {
    return state
  }

  console.log({ iframeResult })

  const { frameAncestors, iframeSrc, webViewRoot } = iframeResult
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

    await WebViewServer.start(webViewPort) // TODO move this up
    await WebViewServer.setHandler(frameAncestors, webViewRoot)
    // TODO maybe allow same origin, so that iframe origin is not null
    origin = '*'
  } else {
    origin = '*'
  }
  const sandbox = GetWebViewSandBox.getIframeSandbox()
  return {
    ...state,
    iframeSrc,
    sandbox,
    portId,
    origin,
  }
}
