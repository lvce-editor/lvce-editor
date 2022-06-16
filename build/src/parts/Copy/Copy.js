import * as fs from 'fs/promises'
import * as Path from '../Path/Path.js'
import fsExtra from 'fs-extra'
import { join } from 'path'

/**
 * @param {{from:string, to:string, ignore?:string[]}} param0
 */
export const copy = async ({ from, to, ignore = [] }) => {
  const absoluteFrom = Path.absolute(from)
  const absoluteTo = Path.absolute(to)
  const absoluteIgnore = ignore.map((dirent) => {
    return join(absoluteFrom, dirent)
  })
  await fsExtra.copy(absoluteFrom, absoluteTo, {
    recursive: true,
    overwrite: true,
    dereference: true,
    filter(dirent) {
      return !absoluteIgnore.includes(dirent)
    },
  })
}

export const copyFile = async ({ from, to }) => {
  const absoluteFrom = Path.absolute(from)
  const absoluteTo = Path.absolute(to)
  await fs.mkdir(Path.dirname(absoluteTo), { recursive: true })
  await fs.copyFile(absoluteFrom, absoluteTo)
}
