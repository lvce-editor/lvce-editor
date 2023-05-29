import * as Platform from '../Platform/Platform.js'

const getModule = () => {
  if (Platform.isWindows) {
    return import('../ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.js')
  }
  return import('../ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.js')
}

export const listProcessesWithMemoryUsage = async (rootPid) => {
  const module = await getModule()
  return module.listProcessesWithMemoryUsage(rootPid)
}
