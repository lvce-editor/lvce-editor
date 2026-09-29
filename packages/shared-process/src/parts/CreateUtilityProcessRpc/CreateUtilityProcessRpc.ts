import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const createUtilityProcessRpc = async (options: any): Promise<any> => {
  await ParentIpc.invoke('CreateUtilityProcessRpc.createUtilityProcessRpc', {
    ...options,
  })
}
