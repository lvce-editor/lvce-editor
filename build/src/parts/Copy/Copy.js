import * as fs from 'fs/promises'
import * as Path from '../Path/Path.js'
import fsExtra from 'fs-extra'
import { join } from 'path'
import VError from 'verror'

/**
 * @param {{from:string, to:string, ignore?:string[]}} param0
 */
export const copy = async ({ from, to, ignore = [] }) => {
  try {
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
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to copy ${from} to ${to}`)
  }
}

export const copyFile = async ({ from, to }) => {
  try {
    const absoluteFrom = Path.absolute(from)
    const absoluteTo = Path.absolute(to)
    await fs.mkdir(Path.dirname(absoluteTo), { recursive: true })
    await fs.copyFile(absoluteFrom, absoluteTo)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to copy ${from} to ${to}`)
  }
}
