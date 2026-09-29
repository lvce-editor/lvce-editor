import * as Assert from '../Assert/Assert.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'

export const targetMessagePort = (): any => {
  return ProcessExplorer.acquire()
}

export const targetWebSocket = (): any => {
  return ProcessExplorer.acquire()
}

export const upgradeMessagePort = (port: any): any => {
  Assert.object(port)
  return {
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  }
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
    type: 'send',
  }
}
