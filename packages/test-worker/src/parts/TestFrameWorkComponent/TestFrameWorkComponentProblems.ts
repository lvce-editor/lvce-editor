import * as Rpc from '../Rpc/Rpc.ts'

export const show = async () => {
  await Rpc.invoke('Panel.selectIndex', 0)
}
