import * as AuthProcess from '../AuthProcess/AuthProcess.ts'

export const targetMessagePort = (): any => {
  return AuthProcess.getOrCreate()
}

export const upgradeMessagePort = (port: any, message: any): any => {
  return {
    method: 'HandleMessagePort.handleMessagePort',
    params: [port, message.ipcId],
    type: 'send',
  }
}
