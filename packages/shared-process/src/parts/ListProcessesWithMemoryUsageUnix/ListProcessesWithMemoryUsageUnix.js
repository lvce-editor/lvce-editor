import * as CreatePidMap from '../CreatePidMap/CreatePidMap.js'
import * as GetAccurateMemoryUsage from '../GetAccurateMemoryUsage/GetAccurateMemoryUsage.js'
import * as GetPsOutput from '../GetPsOutput/GetPsOutput.js'
import * as ParsePsOutput from '../ParsePsOutput/ParsePsOutput.js'

const addAccurateMemoryUsage = async (process) => {
  const accurateMemoryUsage = await GetAccurateMemoryUsage.getAccurateMemoryUsage(process.pid)
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
  const stdout = await GetPsOutput.getPsOutput()
  const pidMap = await CreatePidMap.createPidMap()
  // console.log({ stdout })
  // console.timeEnd('getPsOutput')
  // console.time('parsePsOutput')
  const parsed = ParsePsOutput.parsePsOutput(stdout, rootPid, pidMap)
  // console.timeEnd('parsePsOutput')
  // console.time('addAccurateMemoryUsage')
  const parsedWithAccurateMemoryUsage = await Promise.all(parsed.map(addAccurateMemoryUsage))
  // console.timeEnd('addAccurateMemoryUsage')
  const filtered = parsedWithAccurateMemoryUsage.filter(hasPositiveMemoryUsage)
  return filtered
}
