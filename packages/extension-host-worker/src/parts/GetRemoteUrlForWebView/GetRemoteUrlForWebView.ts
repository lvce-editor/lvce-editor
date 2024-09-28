import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO if webViewId is provided,
// 1. read file as blob
// 2. send blob to webview
// 3. create objecturl in webview
// 4. send back objecturl to extension host worker
// 5. provide objectUrl to extension

export const getRemoteUrl = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
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
  const ipc = {
    addEventListener(type, listener) {
      const that = this
      const wrapped = (event) => {
        const actualEvent = {
          target: that,
          data: event.data,
        }
        listener(actualEvent)
      }
      port2.addEventListener(type, wrapped)
    },
    dispose() {},
    send(message) {
      port2.postMessage(message)
    },
  }
  HandleIpc.handleIpc(ipc)

  // TODO maybe don't send a message port only to get object url?
  // TODO dispose ipc to avoid memory leak
  const blob = await Rpc.invoke('FileSystem.getBlob', uri)
  const objectUrl = await JsonRpc.invoke(ipc, 'createObjectUrl', blob)
  return objectUrl
}
