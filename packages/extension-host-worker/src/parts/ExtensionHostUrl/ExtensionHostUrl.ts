import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const getRemoteUrl = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  if (options.webViewId) {
    // console.log({ id: options.webViewId })
    const webView = ExtensionHostWebViewState.getWebView(options.webViewId)
    if (!webView) {
      throw new Error(`webview ${options.webViewId} not found`)
    }
    const { uid, origin } = webView
    const { port1, port2 } = GetPortTuple.getPortTuple()
    const promise = new Promise((resolve) => {
      port2.onmessage = resolve
    })
    const portType = 'test'
    await Rpc.invokeAndTransfer('WebView.setPort', uid, port1, origin, portType)
    const event = await promise
    // @ts-ignore
    if (event.data !== 'ready') {
      throw new Error('unexpected first message')
    }
  }
  // TODO if webViewId is provided,
  // 1. read file as blob
  // 2. send blob to webview
  // 3. create objecturl in webview
  // 4. send back objecturl to extension host worker
  // 5. provide objectUrl to extension

  if (uri.startsWith('html://')) {
    const url = await Rpc.invoke('Blob.getSrc', uri)
    return url
  }
  if (Platform.platform === PlatformType.Remote) {
    // TODO support custom file system protocols
    return `/remote/${uri}`
  }
  if (Platform.platform === PlatformType.Electron) {
    // TODO
    return `/remote/${uri}`
  }
  throw new Error(`unsupported platform`)
}
