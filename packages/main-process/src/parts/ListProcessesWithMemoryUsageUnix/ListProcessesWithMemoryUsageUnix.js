const { join } = require('node:path')
const { readFile } = require('node:fs/promises')
const { VError } = require('verror')
const Assert = require('../Assert/Assert.js')
const childProcess = require('node:child_process')
const EncodingType = require('../EncodingType/EncodingType.js')
const ErrorCodes = require('../ErrorCodes/ErrorCodes.js')
const ParsePsOutput = require('../ParsePsOutput/ParsePsOutput.js')
const Signal = require('../Signal/Signal.js')
const util = require('node:util')

const execFile = util.promisify(childProcess.execFile)

const getAccurateMemoryUsage = async (pid) => {
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

const getPsOutput = async () => {
  try {
    const { stdout } = await execFile('ps', ['-ax', '-o', 'pid=,ppid=,pcpu=,pmem=,command='])
    return stdout.trim()
  } catch (error) {
    // @ts-ignore
    if (error && error.signal === Signal.SIGINT) {
      return ''
    }
    // @ts-ignore
    throw new VError(error, `Failed to execute ps`)
  }
}

const addAccurateMemoryUsage = async (process) => {
  const accurateMemoryUsage = await getAccurateMemoryUsage(process.pid)
  return {
    ...process,
    memory: accurateMemoryUsage,
  }
}

const hasPositiveMemoryUsage = (process) => {
  return process.memory >= 0
}

exports.listProcessesWithMemoryUsage = async (rootPid) => {
  // console.time('getPsOutput')
  const stdout = await getPsOutput()
  // console.log({ stdout })
  // console.timeEnd('getPsOutput')
  // console.time('parsePsOutput')
  const parsed = ParsePsOutput.parsePsOutput(stdout, rootPid)
  // console.timeEnd('parsePsOutput')
  // console.time('addAccurateMemoryUsage')
  const parsedWithAccurateMemoryUsage = await Promise.all(parsed.map(addAccurateMemoryUsage))
  // console.timeEnd('addAccurateMemoryUsage')
  const filtered = parsedWithAccurateMemoryUsage.filter(hasPositiveMemoryUsage)
  return filtered
}
