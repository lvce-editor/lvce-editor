import { shell } from 'electron'
import * as Assert from '../Assert/Assert.cjs'

export const trash = async (path) => {
  Assert.string(path)
  await shell.trashItem(path)
}
