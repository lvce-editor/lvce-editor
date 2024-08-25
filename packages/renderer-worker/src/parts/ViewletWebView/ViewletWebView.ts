import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetIframeSrc from '../GetIframeSrc/GetIframeSrc.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as GetWebViewSandBox from '../GetWebViewSandBox/GetWebViewSandBox.ts'
import * as Id from '../Id/Id.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as WebViewServer from '../WebViewServer/WebViewServer.ts'
import * as GetWebViewFrameAncestors from '../GetWebViewFrameAncestors/GetWebViewFrameAncestors.ts'

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

const getWebViewId = (uri) => {
  if (uri.startsWith('webview://')) {
    const webViewId = uri.slice('webview://'.length)
    return webViewId
  }
  if (uri.endsWith('.heapsnapshot')) {
    return 'builtin.heap-snapshot-viewer'
  }
  return ''
}

export const loadContent = async (state) => {
  const { uri } = state
  const webViews = await GetWebViews.getWebViews()
  const webViewId = getWebViewId(uri)
  // TODO make port configurable
  const webViewPort = 3002
  let root = ''
  if (Platform.platform === PlatformType.Remote) {
    root = await SharedProcess.invoke('Platform.getRoot')
  }
  const iframeResult = GetIframeSrc.getIframeSrc(webViews, webViewId, webViewPort, root, IsGitpod.isGitpod, location.protocol, location.host)
  if (!iframeResult) {
    return state
  }

  const { iframeSrc, webViewRoot } = iframeResult
  const frameAncestors = GetWebViewFrameAncestors.getWebViewFrameAncestors(location.protocol, location.host)
  await ExtensionHostManagement.activateByEvent(`onWebView:${webViewId}`)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const portId = Id.create()
  await Transferrable.transferToRendererProcess(portId, port1)
  // TODO figure out order for events, e.g.
  // 1. activate extension, create webview and ports in parallel
  // 2. wait for webview to load (?)
  // 3. setup extension host worker rpc
  // 4. create webview in extension host worker and load content

  ExtensionHostWorker.invokeAndTransfer('ExtensionHostWebView.create', webViewId, port2)
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
