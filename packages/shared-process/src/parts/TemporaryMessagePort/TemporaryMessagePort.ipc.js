import * as TemporaryMessagePort from './TemporaryMessagePort.js'

export const name = 'TemporaryMessagePort'

export const Commands = {
  handlePorts: TemporaryMessagePort.handlePorts,
  sendTo2: TemporaryMessagePort.sendTo2,
}
