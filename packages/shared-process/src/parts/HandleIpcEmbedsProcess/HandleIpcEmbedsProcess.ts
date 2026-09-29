import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.ts'

export const targetMessagePort = (): any => {
  return EmbedsProcess.getOrCreate()
}

export const upgradeMessagePort = (port: any, message: any): any => {
  return {
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port, message.ipcId],
    type: 'send',
  }
}
