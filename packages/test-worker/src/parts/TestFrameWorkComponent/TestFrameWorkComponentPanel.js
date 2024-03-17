import * as Rpc from '../Rpc/Rpc.js'

export const open = async (id) => {
  await Rpc.invoke('Layout.showPanel', id)
}
