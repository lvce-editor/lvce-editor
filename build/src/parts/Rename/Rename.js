import * as fs from 'fs/promises'
import * as Path from '../Path/Path.js'

export const rename = async ({ from, to }) => {
  const fromAbsolutePath = Path.absolute(from)
  const toAbsolutePath = Path.absolute(to)
  await fs.rename(fromAbsolutePath, toAbsolutePath)
}
