import * as Rpc from '../Rpc/Rpc.ts'

export const openUri = async (uri: string) => {
  await Rpc.invoke('Main.openUri', uri)
}

export const splitRight = async () => {
  await Rpc.invoke('Main.splitRight')
}
