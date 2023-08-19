import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const exit = async () => {
  await ParentIpc.invoke('App.exit')
}
