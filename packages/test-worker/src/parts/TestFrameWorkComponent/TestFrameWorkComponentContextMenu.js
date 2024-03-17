import * as Rpc from '../Rpc/Rpc.js'

export const selectItem = async (text) => {
  await Rpc.invoke('Menu.selectItem', text)
}
