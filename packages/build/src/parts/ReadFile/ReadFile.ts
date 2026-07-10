import * as fs from 'node:fs/promises'
import * as Path from '../Path/Path.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'

export const readFile = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  const content = await fs.readFile(absolutePath, EncodingType.Utf8)
  return content
}
