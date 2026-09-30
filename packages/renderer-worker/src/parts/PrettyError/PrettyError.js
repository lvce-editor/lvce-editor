import * as ErrorWorker from '../ErrorWorker/ErrorWorker.ts'
import * as FileSystemDisk from '../FileSystem/FileSystemDisk.js'
import * as GetTokenizePath from '../GetTokenizePath/GetTokenizePath.js'

const getFileUrl = (stack) => {
  if (typeof stack !== 'string') {
    return undefined
  }
  for (const line of stack.split('\n')) {
    const match = line.match(/(file:\/\/\/.*):(\d+):(\d+)\)?$/)
    if (match) {
      return match[1]
    }
  }
  return undefined
}

const serializeError = (error) => {
  if (!error) {
    return error
  }
  return {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
    codeFrame: error.codeFrame,
    constructor: {
      name: error.constructor.name,
    },
  }
}

export const prepare = async (error) => {
  try {
    const serialized = serializeError(error)
    const tokenizerPath = GetTokenizePath.getTokenizePath('javascript')
    const sourceUrl = getFileUrl(serialized.stack)
    let sourceText
    if (sourceUrl) {
      try {
        sourceText = await FileSystemDisk.readFile(sourceUrl)
      } catch {
        // The formatter can still return the original diagnostic without source access.
      }
    }
    const prepared = await ErrorWorker.invoke('Errors.prepare', serialized, {
      tokenizerPath,
      ...(sourceText !== undefined && { sourceText, sourceUrl }),
    })
    return prepared
  } catch {
    return error
  }
}

export const print = async (error, prefix = '') => {
  await ErrorWorker.invoke('Errors.print', error, prefix)
}

export const getMessage = (error) => {
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}`
  }
  if (error && error.message) {
    return `${error.constructor.name}: ${error.message}`
  }
  return `Error: ${error}`
}
