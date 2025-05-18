import * as ParentIpc from '../MainProcess/MainProcess.js'

export const createUtilityProcessRpc = async (options) => {
  await ParentIpc.invoke('CreateUtilityProcessRpc.createUtilityProcessRpc', {
    ...options,
  })
}
