import * as CreateWebViewIpc from '../CreateWebViewIpc/CreateWebViewIpc.ts'
import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as Rpc from '../Rpc/Rpc.ts'

// TODO if webViewId is provided,
// 1. read file as blob
// 2. send blob to webview
// 3. create objecturl in webview
// 4. send back objecturl to extension host worker
// 5. provide objectUrl to extension

export const getRemoteUrlForWebView = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  const webView = ExtensionHostWebViewState.getWebView(options.webViewId)
  if (!webView) {
    throw new Error(`webview ${options.webViewId} not found`)
  }
  const [ipc, blob] = await Promise.all([CreateWebViewIpc.createWebViewIpc(webView), Rpc.invoke('FileSystem.getBlob', uri)])
  const objectUrl = await JsonRpc.invoke(ipc, 'createObjectUrl', blob)
  return objectUrl
}
