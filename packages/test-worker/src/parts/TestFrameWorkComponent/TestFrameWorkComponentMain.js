import * as Rpc from '../Rpc/Rpc.js'

export const openUri = async (uri) => {
  await Rpc.invoke('Main.openUri', uri)
}
