import * as fs from 'node:fs/promises'
import { VError } from '@lvce-editor/verror'
import * as Path from '../Path/Path.js'

export const rename = async ({ from, to }) => {
  try {
    const fromAbsolutePath = Path.absolute(from)
    const toAbsolutePath = Path.absolute(to)
    await fs.mkdir(Path.dirname(toAbsolutePath), { recursive: true })
    await fs.rename(fromAbsolutePath, toAbsolutePath)
  } catch (error) {
    throw new VError(error, `Failed to rename ${from} to ${to}`)
  }
}
