import * as Rpc from '../Rpc/Rpc.ts'

export const open = async (id) => {
  await Rpc.invoke('Layout.showPanel', id)
}
