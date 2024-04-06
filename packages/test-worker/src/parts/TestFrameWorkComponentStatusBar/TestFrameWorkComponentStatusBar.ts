import * as Rpc from '../Rpc/Rpc.ts'

export const update = async () => {
  await Rpc.invoke('StatusBar.updateStatusBarItems')
}
