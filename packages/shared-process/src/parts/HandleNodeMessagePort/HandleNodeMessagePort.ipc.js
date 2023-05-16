import * as HandleNodeMessagePort from './HandleNodeMessagePort.js'

export const name = 'HandleNodeMessagePort'

export const Commands = {
  handleElectronMessagePort: HandleNodeMessagePort.handleNodeMessagePort,
}
