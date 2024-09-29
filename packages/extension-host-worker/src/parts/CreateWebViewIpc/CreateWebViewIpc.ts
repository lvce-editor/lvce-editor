import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const createWebViewIpc = async (webView: any): Promise<any> => {
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
  // TODO maybe don't send a message port only to get object url?
  // TODO dispose ipc to avoid memory leak
  HandleIpc.handleIpc(ipc)
  return ipc
}
