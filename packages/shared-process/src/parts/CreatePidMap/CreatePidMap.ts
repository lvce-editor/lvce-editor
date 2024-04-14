import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createPidMap = async () => {
  const pidMap = await ParentIpc.invoke('CreatePidMap.createPidMap')
  return pidMap
}
