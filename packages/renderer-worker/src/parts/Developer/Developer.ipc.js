import * as Command from '../Command/Command.js'
import * as Developer from './Developer.js'

export const __initialize__ = () => {
  Command.register(820, Developer.getStartupPerformanceContent)
  Command.register(821, Developer.getMemoryUsageContent)
  Command.register(822, Developer.allocateMemoryInSharedProcess)
  Command.register(823, Developer.crashSharedProcess)
  Command.register(824, Developer.createSharedProcessHeapSnapshot)
  Command.register(825, Developer.createSharedProcessProfile)
  Command.register(826, Developer.showIconThemeCss)
  Command.register(827, Developer.reloadIconTheme)
  Command.register(828, Developer.clearCache)
  Command.register(829, Developer.reloadColorTheme)
  Command.register(830, Developer.showColorThemeCss)
  // TODO certain commands are only available in electron -> treeshake them out
  Command.register(831, Developer.toggleDeveloperTools)
  Command.register(832, Developer.crashMainProcess)
  Command.register(833, Developer.showStartupPerformance)
  Command.register(834, Developer.showMemoryUsage)
  Command.register(835, Developer.openConfigFolder)
  Command.register(836, Developer.openDataFolder)
  Command.register(837, Developer.openLogsFolder)
  Command.register(838, Developer.openCacheFolder)
  Command.register(839, Developer.openProcessExplorer)
}
