import * as Command from '../Command/Command.js'
import * as Developer from './Developer.js'

// prettier-ignore
export const Commands={
  // TODO certain commands are only available in electron -> treeshake them out
  'Developer.getStartupPerformanceContent': Developer.getStartupPerformanceContent,
  'Developer.getMemoryUsageContent': Developer.getMemoryUsageContent,
  'Developer.allocateMemoryInSharedProcess': Developer.allocateMemoryInSharedProcess,
  'Developer.crashSharedProcess': Developer.crashSharedProcess,
  'Developer.createSharedProcessHeapSnapshot': Developer.createSharedProcessHeapSnapshot,
  'Developer.createSharedProcessProfile': Developer.createSharedProcessProfile,
  'Developer.showIconThemeCss': Developer.showIconThemeCss,
  'Developer.reloadIconTheme': Developer.reloadIconTheme,
  'Developer.clearCache': Developer.clearCache,
  'Developer.reloadColorTheme': Developer.reloadColorTheme,
  'Developer.showColorThemeCss': Developer.showColorThemeCss,
  'Developer.toggleDeveloperTools': Developer.toggleDeveloperTools,
  'Developer.crashMainProcess': Developer.crashMainProcess,
  'Developer.showStartupPerformance': Developer.showStartupPerformance,
  'Developer.startupPerformance': Developer.showStartupPerformance,
  'Developer.showMemoryUsage': Developer.showMemoryUsage,
  'Developer.openConfigFolder': Developer.openConfigFolder,
  'Developer.openDataFolder': Developer.openDataFolder,
  'Developer.openLogsFolder': Developer.openLogsFolder,
  'Developer.openCacheFolder': Developer.openCacheFolder,
  'Developer.openProcessExplorer': Developer.openProcessExplorer,
  'Developer.downloadViewletState': Developer.downloadViewletState,
}
