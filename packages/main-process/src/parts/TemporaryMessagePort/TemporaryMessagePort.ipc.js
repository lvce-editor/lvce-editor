import * as TemporaryMessagePort from './TemporaryMessagePort.js'

export const name = 'TemporaryMessagePort'

export const Commands = {
  create: TemporaryMessagePort.create,
  dispose: TemporaryMessagePort.dispose,
}
