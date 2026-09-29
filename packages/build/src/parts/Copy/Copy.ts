import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import fsExtra from 'fs-extra'
import { VError } from '@lvce-editor/verror'
import * as Path from '../Path/Path.ts'

/**
 * @param {{from:string, to:string, ignore?:string[], dereference?:boolean}} param0
 */
export const copy = async ({ from, to, ignore = [] as any[], dereference = false }) => {
  try {
    const absoluteFrom = Path.absolute(from)
    const absoluteTo = Path.absolute(to)
    const absoluteIgnore = new Set(
      ignore.map((dirent) => {
        return join(absoluteFrom, dirent)
      }),
    )
    await fsExtra.copy(absoluteFrom, absoluteTo, {
      overwrite: true,
      dereference,
      filter(dirent) {
        return !absoluteIgnore.has(dirent)
      },
    })
  } catch (error) {
    throw new VError(error, `Failed to copy ${from} to ${to}`)
  }
}

export const copyFile = async ({ from, to }) => {
  try {
    const absoluteFrom = Path.absolute(from)
    if (!fsExtra.existsSync(absoluteFrom)) {
      throw new Error(`file not found ${absoluteFrom}`)
    }
    const absoluteTo = Path.absolute(to)
    await fs.mkdir(Path.dirname(absoluteTo), { recursive: true })
    await fs.copyFile(absoluteFrom, absoluteTo)
  } catch (error) {
    throw new VError(error, `Failed to copy ${from} to ${to}`)
  }
}
