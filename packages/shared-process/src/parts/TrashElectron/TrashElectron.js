import { existsSync } from 'node:fs'
import * as MainProcess from '../MainProcess/MainProcess.js'

export const trash = async (path) => {
  console.log({ existsSync })
  if (!existsSync(path)) {
    console.log('not exists')
    return
  }
  await MainProcess.invoke('Trash.trash', path)
}
