import { VError } from '@lvce-editor/verror'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createUtilityProcessRpc = async (options) => {
  try {
    await ParentIpc.invoke('CreateUtilityProcessRpc.createUtilityProcessRpc', {
      ...options,
    })
  } catch (error) {
    throw new VError(error, `Failed to create electronutility process rpc`)
  }
}
