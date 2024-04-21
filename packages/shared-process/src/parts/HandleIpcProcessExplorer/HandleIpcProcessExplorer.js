import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.js'
import * as Assert from '../Assert/Assert.js'

export const targetMessagePort = () => {
  return ProcessExplorer.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  Assert.object(port)
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
