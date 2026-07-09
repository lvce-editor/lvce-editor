import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const createUtilityProcessRpc = async (options) => {
  await ParentIpc.invoke('CreateUtilityProcessRpc.createUtilityProcessRpc', {
    ...options,
  })
}
