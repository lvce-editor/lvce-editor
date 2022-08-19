import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import fsExtra from 'fs-extra'
import VError from 'verror'
import * as Path from '../Path/Path.js'

/**
 * @param {{from:string, to:string, ignore?:string[]}} param0
 */
export const copy = async ({ from, to, ignore = [] }) => {
  try {
    const absoluteFrom = Path.absolute(from)
    const absoluteTo = Path.absolute(to)
    const absoluteIgnore = new Set(ignore.map((dirent) => {
      return join(absoluteFrom, dirent)
    }))
    await fsExtra.copy(absoluteFrom, absoluteTo, {
      recursive: true,
      overwrite: true,
      dereference: true,
      filter(dirent) {
        return !absoluteIgnore.has(dirent)
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
