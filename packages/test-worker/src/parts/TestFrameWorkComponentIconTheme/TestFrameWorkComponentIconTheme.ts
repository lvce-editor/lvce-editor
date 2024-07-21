import * as Rpc from '../Rpc/Rpc.ts'

export const setIconTheme = async (id: string) => {
  await Rpc.invoke('IconTheme.setIconTheme', id)
}
