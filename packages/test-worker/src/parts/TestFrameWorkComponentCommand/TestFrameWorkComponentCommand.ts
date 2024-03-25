import * as Rpc from '../Rpc/Rpc.ts'

export const execute = async (id, ...args) => {
  return Rpc.invoke(id, ...args)
}
