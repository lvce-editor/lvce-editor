import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.js'

export const targetMessagePort = () => {
  return ProcessExplorer.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
