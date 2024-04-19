import * as Rpc from '../Rpc/Rpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

const getPort = async () => {
  const { port1, port2 } = new MessageChannel()
  await Rpc.invokeAndTransfer('IpcParent.create', [port1], {
    method: 8,
    type: 1,
    initialCommand: 'HandleElectronMessagePortForEmbedsProcess.handleElectronMessagePortForEmbedsProcess',
    port: port1,
    raw: true,
  })

  return port2
}

const createIpc = (port) => {
  const ipc = {
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
  return ipc
}

export const launchEmbedsProcessIpc = async () => {
  const port = await getPort()
  const ipc = createIpc(port)
  HandleIpc.handleIpc(ipc)
  return ipc
}
