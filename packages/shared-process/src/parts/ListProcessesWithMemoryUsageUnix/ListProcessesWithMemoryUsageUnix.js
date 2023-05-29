import * as childProcess from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as util from 'node:util'
import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ParsePsOutput from '../ParsePsOutput/ParsePsOutput.js'
import * as Signal from '../Signal/Signal.js'
import { VError } from '../VError/VError.js'

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

export const listProcessesWithMemoryUsage = async (rootPid) => {
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
