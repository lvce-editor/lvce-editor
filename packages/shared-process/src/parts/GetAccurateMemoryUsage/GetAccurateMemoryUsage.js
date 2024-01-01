import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.js'
import * as ParseMemory from '../ParseMemory/ParseMemory.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

const getContent = async (pid) => {
  try {
    const filePath = join('/proc', `${pid}`, 'statm')
    const content = await readFile(filePath, EncodingType.Utf8)
    return content
  } catch (error) {
    if (IsEnoentError.isEnoentError(error) || IsEsrchError.isEsrchError(error)) {
      return ''
    }
    throw error
  }
}

export const getAccurateMemoryUsage = async (pid) => {
  try {
    Assert.number(pid)
    if (Platform.isMacOs) {
      return 0
    }
    const content = await getContent(pid)
    if (!content) {
      return -1
    }
    const memory = ParseMemory.parseMemory(content)
    return memory
  } catch (error) {
    throw new VError(error, 'Failed to get accurate memory usage')
  }
}
