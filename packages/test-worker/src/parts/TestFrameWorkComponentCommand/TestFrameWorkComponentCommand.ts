import * as Rpc from '../Rpc/Rpc.ts'

export const execute = async (id: string, ...args: any[]) => {
  return Rpc.invoke(id, ...args)
}
