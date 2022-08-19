import * as fs from 'node:fs/promises'
import { gzipSizeFromFile } from 'gzip-size'
import * as Path from '../Path/Path.js'
import * as PrettyBytes from '../PrettyBytes/PrettyBytes.js'

export const getFileSize = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  const stat = await fs.stat(absolutePath)
  const size = stat.size
  const prettySize = PrettyBytes.format(size)
  return prettySize
}

export const getGzipFileSize = async (relativePath) => {
  const absolutePath = Path.absolute(relativePath)
  const size = await gzipSizeFromFile(absolutePath)
  const prettySize = PrettyBytes.format(size)
  return prettySize
}
