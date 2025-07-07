import * as TemporaryMessagePort from './TemporaryMessagePort.js'

export const name = 'TemporaryMessagePort'

export const Commands = {
  getPortTuple3: TemporaryMessagePort.getPortTuple3,
  handlePorts: TemporaryMessagePort.handlePorts,
  sendTo2: TemporaryMessagePort.sendTo2,
  sendToElectron: TemporaryMessagePort.sendToElectron,
}
