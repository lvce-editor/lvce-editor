import { existsSync } from 'node:fs'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const trash = async (path) => {
  if (!existsSync(path)) {
    return
  }
  await ParentIpc.invoke('Trash.trash', path)
}
