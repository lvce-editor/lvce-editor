import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as Character from '../Character/Character.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.js'
import { VError } from '../VError/VError.js'

const getContent = async (pid) => {
  try {
    const filePath = join('/proc', `${pid}`, 'statm')
    const content = await readFile(filePath, EncodingType.Utf8)
    return content
  } catch (error) {
    if (IsEnoentError.isEnoentError(error) || IsEsrchError.isEsrchError(error)) {
      return -1
    }
    throw error
  }
}

const parseMemory = (content) => {
  const trimmedContent = content.trim()
  const numberBlocks = trimmedContent.split(Character.Space)
  const pageSize = 4096
  const rss = Number.parseInt(numberBlocks[1]) * pageSize
  const shared = Number.parseInt(numberBlocks[2]) * pageSize
  const memory = rss - shared
  return memory
}

export const getAccurateMemoryUsage = async (pid) => {
  try {
    Assert.number(pid)
    const content = await getContent(pid)
    if (!content) {
      return -1
    }
    const memory = parseMemory(content)
    return memory
  } catch (error) {
    throw new VError(error, 'Failed to get accurate memory usage')
  }
}
