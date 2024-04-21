import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'

export const targetMessagePort = () => {
  return EmbedsProcess.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
