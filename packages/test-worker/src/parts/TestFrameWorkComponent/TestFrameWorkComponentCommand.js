import * as Rpc from '../Rpc/Rpc.js'

export const execute = async (id, ...args) => {
  return Rpc.invoke(id, ...args)
}
