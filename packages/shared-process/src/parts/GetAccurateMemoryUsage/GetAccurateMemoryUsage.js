import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as Character from '../Character/Character.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { VError } from '../VError/VError.js'

export const getAccurateMemoryUsage = async (pid) => {
  Assert.number(pid)
  try {
    const filePath = join('/proc', `${pid}`, 'statm')
    let content
    try {
      content = await readFile(filePath, EncodingType.Utf8)
    } catch (error) {
      if (
        error &&
        // @ts-ignore
        (error.code === ErrorCodes.ENOENT ||
          // @ts-ignore
          error.code === ErrorCodes.ESRCH)
      ) {
        return -1
      }
      throw error
    }
    const trimmedContent = content.trim()
    const numberBlocks = trimmedContent.split(Character.Space)
    const pageSize = 4096
    const rss = Number.parseInt(numberBlocks[1]) * pageSize
    const shared = Number.parseInt(numberBlocks[2]) * pageSize
    const memory = rss - shared
    return memory
  } catch (error) {
    throw new VError(error, 'Failed to get accurate memory usage')
  }
}
