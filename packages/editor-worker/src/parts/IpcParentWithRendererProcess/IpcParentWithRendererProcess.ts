import * as GetData from '../GetData/GetData.ts'
import * as SendMessagePortToRendererProcess from '../SendMessagePortToRendererProcess/SendMessagePortToRendererProcess.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.ts'
import { IpcError } from '../IpcError/IpcError.ts'

export const create = async () => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await SendMessagePortToRendererProcess.sendMessagePortToRendererProcess(port1)
  const event = await WaitForFirstMessage.waitForFirstMessage(port2)
  if (event.data !== 'ready') {
    throw new IpcError('unexpected first message')
  }
  return port2
}

export const wrap = (port: any) => {
  return {
    port,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event: any) => {
        const data = GetData.getData(event)
        // @ts-ignore
        listener({
          target: this,
          data,
        })
      }
      this.port.onmessage = wrappedListener
    },
    send(message: any) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message: any, transfer: any) {
      this.port.postMessage(message, transfer)
    },
  }
}
