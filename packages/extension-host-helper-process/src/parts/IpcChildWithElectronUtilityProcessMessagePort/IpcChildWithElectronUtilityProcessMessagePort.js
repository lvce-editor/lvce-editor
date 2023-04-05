import * as IpcChildWithElectronUtilityProcess from '../IpcChildWithElectronUtilityProcess/IpcChildWithElectronUtilityProcess.js'

const waitForFirstMessage = async (parentPort) => {
  const { type, event } = await new Promise((resolve) => {
    const cleanup = (value) => {
      parentPort.off('message', handleMessage)
      resolve(value)
    }
    const handleMessage = (event) => {
      cleanup({ type: 'message', event })
    }
    parentPort.on('message', handleMessage)
  })
  return {
    type,
    event,
  }
}

export const listen = async () => {
  const parentPort = IpcChildWithElectronUtilityProcess.listen()
  const { type, event } = await waitForFirstMessage(parentPort)
  if (type !== 'message') {
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
    port,
    on(event, listener) {
      this.port.on(event, listener)
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
