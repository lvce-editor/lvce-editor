import * as AuthProcess from '../AuthProcess/AuthProcess.js'

export const targetMessagePort = () => {
  return AuthProcess.getOrCreate()
}

export const upgradeMessagePort = (port, message) => {
  return {
    type: 'send',
    method: 'HandleMessagePort.handleMessagePort',
    params: [port, message.ipcId],
  }
}
