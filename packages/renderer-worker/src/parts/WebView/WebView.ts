import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetIframeSrc from '../GetIframeSrc/GetIframeSrc.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetWebView from '../GetWebView/GetWebView.ts'
import * as GetWebViewOrigin from '../GetWebViewOrigin/GetWebViewOrigin.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as GetWebViewSandBox from '../GetWebViewSandBox/GetWebViewSandBox.ts'
import * as Id from '../Id/Id.js'
import * as IframeWorker from '../IframeWorker/IframeWorker.ts'
import * as IsGitpod from '../IsGitpod/IsGitpod.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebViewProtocol from '../WebViewProtocol/WebViewProtocol.ts'

export const setPort = async (uid: number, port: MessagePort, origin: string, portType: string): Promise<void> => {
  await RendererProcess.invokeAndTransfer('WebView.setPort', uid, port, origin, portType)
}

export const create = async (id: number, webViewPort: string, webViewId: string, previewServerId: number, uri: string) => {
  let root = ''
  if (Platform.platform === PlatformType.Remote) {
    root = await SharedProcess.invoke('Platform.getRoot')
  }
  const webViews = await GetWebViews.getWebViews()
  const locationProtocol = await IframeWorker.invoke('Location.getProtocol')
  const locationHost = await IframeWorker.invoke('Location.getHost')
  const locationOrigin = await IframeWorker.invoke('Location.getOrigin')
  const iframeResult = await GetIframeSrc.getIframeSrc(
    webViews,
    webViewId,
    webViewPort,
    root,
    IsGitpod.isGitpod,
    locationProtocol,
    locationHost,
    locationOrigin,
  )
  if (!iframeResult) {
    return undefined
  }

  const webView = GetWebView.getWebView(webViews, webViewId)

  const { iframeSrc, webViewRoot, srcDoc, iframeContent } = iframeResult
  const frameAncestors = await IframeWorker.invoke('WebView.getFrameAncestors', locationProtocol, locationHost)

  // TODO figure out order for events, e.g.
  // 1. activate extension, create webview and ports in parallel
  // 2. wait for webview to load (?)
  // 3. setup extension host worker rpc
  // 4. create webview in extension host worker and load content

  const csp = await IframeWorker.invoke('WebView.getWebViewCsp', webView)
  const sandbox = GetWebViewSandBox.getIframeSandbox(webView)
  const iframeCsp = Platform.platform === PlatformType.Web ? csp : ''
  const credentialless = true

  await ExtensionHostManagement.activateByEvent(`onWebView:${webViewId}`)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const portId = Id.create()

  await WebViewProtocol.register(previewServerId, webViewPort, frameAncestors, webViewRoot, csp, iframeContent)

  await RendererProcess.invoke('WebView.create', id, iframeSrc, sandbox, iframeCsp, credentialless)

  await RendererProcess.invoke('WebView.load', id)
  const origin = GetWebViewOrigin.getWebViewOrigin(webViewPort)

  const portType = ''
  // @ts-ignore
  await setPort(id, port1, origin, portType)

  // TODO split up into create and load
  await ExtensionHostWorker.invokeAndTransfer('ExtensionHostWebView.create', webViewId, port2, uri, id, origin)

  await ExtensionHostWorker.invoke('ExtensionHostWebView.load', webViewId)

  return {
    srcDoc,
    iframeSrc,
    sandbox,
    portId,
    origin,
    csp: iframeCsp,
  }
}
