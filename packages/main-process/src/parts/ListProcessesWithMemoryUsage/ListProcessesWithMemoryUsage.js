const Platform = require('../Platform/Platform.js')

const getModule = () => {
  if (Platform.isWindows) {
    return require('../ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.js')
  }
  return require('../ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.js')
}

exports.listProcessesWithMemoryUsage = async (rootPid) => {
  const module = getModule()
  return module.listProcessesWithMemoryUsage(rootPid)
}
