import * as Rpc from '../Rpc/Rpc.js'

export const update = async () => {
  await Rpc.invoke('StatusBar.updateStatusBarItems')
}
