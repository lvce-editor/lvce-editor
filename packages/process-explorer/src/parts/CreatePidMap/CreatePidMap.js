import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createPidMap = async () => {
  return ParentIpc.invoke('CreatePidMap.createPidMap')
}
