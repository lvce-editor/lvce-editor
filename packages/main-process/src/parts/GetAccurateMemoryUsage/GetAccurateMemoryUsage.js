const { join } = require('node:path')
const { readFile } = require('node:fs/promises')
const { VError } = require('verror')
const Assert = require('../Assert/Assert.js')
const EncodingType = require('../EncodingType/EncodingType.js')
const ErrorCodes = require('../ErrorCodes/ErrorCodes.js')

exports.getAccurateMemoryUsage = async (pid) => {
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
    const numberBlocks = trimmedContent.split(' ')
    const pageSize = 4096
    const rss = Number.parseInt(numberBlocks[1]) * pageSize
    const shared = Number.parseInt(numberBlocks[2]) * pageSize
    const memory = rss - shared
    return memory
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to get accurate memory usage')
  }
}
