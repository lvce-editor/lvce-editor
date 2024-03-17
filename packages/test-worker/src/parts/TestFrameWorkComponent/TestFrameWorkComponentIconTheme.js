import * as Rpc from '../Rpc/Rpc.js'

export const setIconTheme = async (id) => {
  await Rpc.invoke('IconTheme.setIconTheme', id)
}
