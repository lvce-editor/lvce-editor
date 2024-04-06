import * as Rpc from '../Rpc/Rpc.ts'

export const openUri = async (uri) => {
  await Rpc.invoke('Main.openUri', uri)
}
