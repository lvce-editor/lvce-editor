const Platform = require('../Platform/Platform.js')

const getModule = () => {
  if (Platform.isWindows()) {
    return require('./ListProcessesWithMemoryUsageWindows.js')
  }
  return require('./ListProcessesWithMemoryUsageUnix.js')
}

exports.listProcessesWithMemoryUsage = async (rootPid) => {
  const module = getModule()
  return module.listProcessesWithMemoryUsage(rootPid)
}
