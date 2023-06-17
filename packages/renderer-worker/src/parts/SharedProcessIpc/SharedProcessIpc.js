import * as IpcParent from '../IpcParent/IpcParent.js'
import * as ProcotolType from '../ProtocolType/ProtocolType.js'

export const listen = (method) => {
  return IpcParent.create({
    method,
    type: 'shared-process',
    name: 'Shared Process',
    protocol: ProcotolType.SharedProcess,
  })
}
