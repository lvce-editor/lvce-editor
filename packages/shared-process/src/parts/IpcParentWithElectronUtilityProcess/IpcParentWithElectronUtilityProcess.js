import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as TemporaryMessagePort from '../TemporaryMessagePort/TemporaryMessagePort.js'

const ElectronUtilityProcess = 3

export const create = async (options) => {
  // TODO how to launch process without race condition?
  // when promise resolves, process might have already exited
  await ParentIpc.invoke('IpcParent.create', {
    ...options,
    method: ElectronUtilityProcess,
    noReturn: true,
  })
  // TODO use uuid instead of name
  const port = await TemporaryMessagePort.create(options.name)
  port.name = options.name
  return port
}

export const wrap = (port) => {
  return {
    port,
    send(message) {
      this.port.postMessage(message)
    },
    async sendAndTransfer(message, transfer) {
      this.port.postMessage(message, transfer)
    },
    on(event, listener) {
      switch (event) {
        case 'close':
          this.port.on(event, listener)
          break
        case 'message':
          const wrapped = (event) => {
            const syntheticEvent = {
              data: event.data,
              target: this,
            }
            listener(syntheticEvent)
          }
          this.port.on(event, wrapped)
          break
        default:
          break
      }
    },
    off(event, listener) {},
    dispose() {
      this.port.close()
      ParentIpc.invoke('TemporaryMessagePort.dispose', this.port.name)
    },
  }
}
