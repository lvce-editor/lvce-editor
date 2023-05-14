import * as FirstUtilityProcessEventType from '../FirstUtilityProcessEventType/FirstUtilityProcessEventType.js'
import * as getFirstUtilityProcessEvent from '../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcChildWithElectronUtilityProcess from '../IpcChildWithElectronUtilityProcess/IpcChildWithElectronUtilityProcess.js'

export const listen = async () => {
  const parentPort = IpcChildWithElectronUtilityProcess.listen()
  const { type, event } = await getFirstUtilityProcessEvent.getFirstUtilityProcessEvent(parentPort)
  if (type !== FirstUtilityProcessEventType.Message) {
    throw new Error('expected message event')
  }
  const { ports } = event
  if (ports.length === 0) {
    throw new Error(`expected message port to be passed`)
  }
  const port = ports[0]
  port.start()
  return port
}

export const wrap = (port) => {
  return {
    type: IpcChildType.ElectronUtilityProcessMessagePort,
    port,
    on(event, listener) {
      switch (event) {
        case 'message':
          const wrappedListener = (event) => {
            listener(event.data)
          }
          this.port.on(event, wrappedListener)
          break
        default:
          this.port.on(event, listener)
          break
      }
    },
    off(event, listener) {
      this.port.off(event, listener)
    },
    send(message) {
      this.port.postMessage(message)
    },
    dispose() {
      this.port.close()
    },
  }
}
