import * as CreateProcessIpc from '../CreateProcessIpc/CreateProcessIpc.js'

export const listen = () => {
  return CreateProcessIpc.createProcessIpc(process)
}
