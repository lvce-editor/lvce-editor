import * as IsWindows from '../IsWindows/IsWindows.js'

const getModule = () => {
  if (IsWindows.isWindows) {
    return import('../ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.js')
  }
  return import('../ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.js')
}

export const listProcessesWithMemoryUsage = async (rootPid) => {
  const module = await getModule()
  return module.listProcessesWithMemoryUsage(rootPid)
}
