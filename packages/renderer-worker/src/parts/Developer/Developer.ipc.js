import * as Command from '../Command/Command.js'
import * as Developer from './Developer.js'

// prettier-ignore
export const __initialize__ = () => {
  // TODO certain commands are only available in electron -> treeshake them out
  Command.register('Developer.getStartupPerformanceContent', Developer.getStartupPerformanceContent)
  Command.register('Developer.getMemoryUsageContent', Developer.getMemoryUsageContent)
  Command.register('Developer.allocateMemoryInSharedProcess', Developer.allocateMemoryInSharedProcess)
  Command.register('Developer.crashSharedProcess', Developer.crashSharedProcess)
  Command.register('Developer.createSharedProcessHeapSnapshot', Developer.createSharedProcessHeapSnapshot)
  Command.register('Developer.createSharedProcessProfile', Developer.createSharedProcessProfile)
  Command.register('Developer.showIconThemeCss', Developer.showIconThemeCss)
  Command.register('Developer.reloadIconTheme', Developer.reloadIconTheme)
  Command.register('Developer.clearCache', Developer.clearCache)
  Command.register('Developer.reloadColorTheme', Developer.reloadColorTheme)
  Command.register('Developer.showColorThemeCss', Developer.showColorThemeCss)
  Command.register('Developer.toggleDeveloperTools', Developer.toggleDeveloperTools)
  Command.register('Developer.crashMainProcess', Developer.crashMainProcess)
  Command.register('Developer.showStartupPerformance', Developer.showStartupPerformance)
  Command.register('Developer.startupPerformance', Developer.showStartupPerformance)
  Command.register('Developer.showMemoryUsage', Developer.showMemoryUsage)
  Command.register('Developer.openConfigFolder', Developer.openConfigFolder)
  Command.register('Developer.openDataFolder', Developer.openDataFolder)
  Command.register('Developer.openLogsFolder', Developer.openLogsFolder)
  Command.register('Developer.openCacheFolder', Developer.openCacheFolder)
  Command.register('Developer.openProcessExplorer', Developer.openProcessExplorer)
  Command.register('Developer.downloadViewletState', Developer.downloadViewletState)
}
