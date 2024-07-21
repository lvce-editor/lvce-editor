import * as Rpc from '../Rpc/Rpc.ts'

export const open = async (id: string) => {
  await Rpc.invoke('Layout.showPanel', id)
}
