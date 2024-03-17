import * as Rpc from '../Rpc/Rpc.js'

export const setPath = async (path) => {
  await Rpc.invoke('Workspace.setPath', path)
}
