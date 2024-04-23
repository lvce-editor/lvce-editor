import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const create = async ({ initialCommand }) => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  // TODO call sendMessagePortToSharedProcess function instead
  await Rpc.invokeAndTransfer('IpcParent.create', [port1], {
    method: 8,
    type: 1,
    initialCommand,
    port: port1,
    raw: true,
    ipcId: IpcId.EmbedsWorker,
  })
  return port2
}

export const wrap = (port) => {
  return {
    port,
    send(message) {
      port.postMessage(message)
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const syntheticEvent = {
          target: this,
          data: event.data,
        }
        listener(syntheticEvent)
      }
      this.port.onmessage = wrappedListener
    },
    dispose() {
      this.port.close
    },
  }
}
