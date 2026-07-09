import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'
import * as Assert from '../Assert/Assert.ts'

export const targetMessagePort = () => {
  return ProcessExplorer.acquire()
}

export const targetWebSocket = () => {
  return ProcessExplorer.acquire()
}

export const upgradeMessagePort = (port) => {
  Assert.object(port)
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}

export const upgradeWebSocket = (handle, message) => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}
