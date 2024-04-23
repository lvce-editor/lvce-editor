import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'

export const targetMessagePort = () => {
  return EmbedsProcess.getOrCreate()
}

export const upgradeMessagePort = (port, message) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [message.ipcId],
    transfer: [port],
  }
}
