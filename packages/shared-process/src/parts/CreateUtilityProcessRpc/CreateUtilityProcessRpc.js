import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createUtilityProcessRpc = async (options) => {
  await ParentIpc.invoke('CreateUtilityProcessRpc.createUtilityProcessRpc', {
    ...options,
  })
}
