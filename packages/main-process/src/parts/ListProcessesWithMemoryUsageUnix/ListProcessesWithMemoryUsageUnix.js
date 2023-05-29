const ParsePsOutput = require('../ParsePsOutput/ParsePsOutput.js')
const GetAccurateMemoryUsage = require('../GetAccurateMemoryUsage/GetAccurateMemoryUsage.js')
const GetPsOutput = require('../GetPsOutput/GetPsOutput.js')

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

exports.listProcessesWithMemoryUsage = async (rootPid) => {
  // console.time('getPsOutput')
  const stdout = await GetPsOutput.getPsOutput()
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
