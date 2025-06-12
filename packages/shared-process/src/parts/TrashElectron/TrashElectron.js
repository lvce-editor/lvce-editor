import { existsSync } from 'node:fs'
import * as MainProcess from '../MainProcess/MainProcess.js'

export const trash = async (path) => {
  if (!existsSync(path)) {
    return
  }
  await MainProcess.invoke('Trash.trash', path)
}
