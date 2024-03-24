import * as Rpc from '../Rpc/Rpc.ts'

export const setPath = async (path) => {
  await Rpc.invoke('Workspace.setPath', path)
}
