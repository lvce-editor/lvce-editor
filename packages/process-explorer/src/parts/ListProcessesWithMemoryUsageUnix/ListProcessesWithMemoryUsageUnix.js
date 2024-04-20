import * as AddAccurateMemoryUsage from '../AddAccurateMemoryUsage/AddAccurateMemoryUsage.js'
import * as CreatePidMap from '../CreatePidMap/CreatePidMap.js'
import * as GetPsOutput from '../GetPsOutput/GetPsOutput.js'
import * as HasPositiveMemoryUsage from '../HasPositiveMemoryUsage/HasPositiveMemoryUsage.js'
import * as ParsePsOutput from '../ParsePsOutput/ParsePsOutput.js'

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
  const parsedWithAccurateMemoryUsage = await Promise.all(parsed.map(AddAccurateMemoryUsage.addAccurateMemoryUsage))
  // console.timeEnd('addAccurateMemoryUsage')
  const filtered = parsedWithAccurateMemoryUsage.filter(HasPositiveMemoryUsage.hasPositiveMemoryUsage)
  return filtered
}
