import * as Rpc from '../Rpc/Rpc.ts'

export const setPath = async (path: string) => {
  await Rpc.invoke('Workspace.setPath', path)
}
