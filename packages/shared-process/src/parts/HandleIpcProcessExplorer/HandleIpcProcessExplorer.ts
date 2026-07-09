import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'
import * as Assert from '../Assert/Assert.ts'

export const targetMessagePort = (): any => {
  return ProcessExplorer.acquire()
}

export const targetWebSocket = (): any => {
  return ProcessExplorer.acquire()
}

export const upgradeMessagePort = (port: any): any => {
  Assert.object(port)
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}
