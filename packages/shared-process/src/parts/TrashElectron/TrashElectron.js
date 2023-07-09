import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const trash = async (path) => {
  await ParentIpc.invoke('Trash.trash', path)
}
