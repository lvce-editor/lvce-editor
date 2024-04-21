import * as TemporaryMessagePort from './TemporaryMessagePort.js'

export const name = 'TemporaryMessagePort'

export const Commands = {
  createPortTuple: TemporaryMessagePort.createPortTuple,
  dispose: TemporaryMessagePort.dispose,
  sendTo: TemporaryMessagePort.sendTo,
}
