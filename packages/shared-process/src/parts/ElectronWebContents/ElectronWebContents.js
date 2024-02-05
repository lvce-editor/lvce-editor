import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const dispose = async (id) => {
  await ParentIpc.invoke('ElectronWebContents.dispose', id)
}
