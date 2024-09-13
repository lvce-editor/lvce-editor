import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetIframeSrc from '../GetIframeSrc/GetIframeSrc.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetWebViewFrameAncestors from '../GetWebViewFrameAncestors/GetWebViewFrameAncestors.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as GetWebViewSandBox from '../GetWebViewSandBox/GetWebViewSandBox.ts'
import * as Id from '../Id/Id.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as GetWebViewCsp from '../GetWebViewCsp/GetWebViewCsp.ts'
import * as Scheme from '../Scheme/Scheme.ts'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as WebViewServer from '../WebViewServer/WebViewServer.ts'

export const create = async (webViewPort: string, webViewId: string, previewServerId: number, uri: string) => {
  let root = ''
  if (Platform.platform === PlatformType.Remote) {
    root = await SharedProcess.invoke('Platform.getRoot')
  }
  const webViews = await GetWebViews.getWebViews()
  const iframeResult = await GetIframeSrc.getIframeSrc(webViews, webViewId, webViewPort, root, IsGitpod.isGitpod, location.protocol, location.host)
  if (!iframeResult) {
    return undefined
  }

  const { iframeSrc, webViewRoot, srcDoc } = iframeResult
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

  ExtensionHostWorker.invokeAndTransfer('ExtensionHostWebView.create', webViewId, port2, uri)
  // TODO don't hardcode protocol
  let origin = ''
  if (Platform.platform === PlatformType.Electron) {
    await WebViewServer.registerProtocol()
    await WebViewServer.create(previewServerId) // TODO move this up
    origin = `${Scheme.WebView}://-/`
  } else if (Platform.platform === PlatformType.Remote) {
    // TODO apply something similar for electron
    // TODO pass webview root, so that only these resources can be accessed
    // TODO pass csp configuration to server
    // TODO pass coop / coep configuration to server

    await WebViewServer.create(previewServerId) // TODO move this up
    await WebViewServer.start(previewServerId, webViewPort) // TODO move this up
    await WebViewServer.setHandler(previewServerId, frameAncestors, webViewRoot)
    // TODO make this work in gitpod also

    origin = `http://localhost:${webViewPort}`
  } else {
    origin = '*'
  }
  const sandbox = GetWebViewSandBox.getIframeSandbox()
  const csp = GetWebViewCsp.getWebViewCsp() // TODO only in web
  return {
    srcDoc,
    iframeSrc,
    sandbox,
    portId,
    origin,
    csp,
  }
}
