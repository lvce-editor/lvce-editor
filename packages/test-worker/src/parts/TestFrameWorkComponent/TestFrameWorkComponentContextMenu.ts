import * as Rpc from '../Rpc/Rpc.ts'

export const selectItem = async (text) => {
  await Rpc.invoke('Menu.selectItem', text)
}
