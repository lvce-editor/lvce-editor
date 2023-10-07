import { join } from 'node:path'
import { stat } from 'node:fs/promises'
import * as Root from '../Root/Root.cjs'

export const getTypeScriptCachePath = async (path) => {
  const fileStat = await stat(path)
  return join(Root.root, '.cache', `${[fileStat.ino, fileStat.size, fileStat.mtime.getTime()].join('-')}.js`)
}
