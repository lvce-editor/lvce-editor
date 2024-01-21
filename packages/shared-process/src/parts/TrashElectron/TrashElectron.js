import { existsSync } from 'node:fs'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const trash = async (path) => {
  if (!existsSync(path)) {
    return
  }
  await ParentIpc.invoke('Trash.trash', path)
}
