import * as Developer from './Developer.js'

// prettier-ignore
export const Commands = {
  'Developer.allocateMemoryInSharedProcess': Developer.allocateMemoryInSharedProcess,
  'Developer.clearCache': Developer.clearCache,
  'Developer.crashMainProcess': Developer.crashMainProcess,
  'Developer.crashSharedProcess': Developer.crashSharedProcess,
  'Developer.createSharedProcessHeapSnapshot': Developer.createSharedProcessHeapSnapshot,
  'Developer.createSharedProcessProfile': Developer.createSharedProcessProfile,
  'Developer.downloadViewletState': Developer.downloadViewletState,
  'Developer.getMemoryUsageContent': Developer.getMemoryUsageContent,
  'Developer.getStartupPerformanceContent': Developer.getStartupPerformanceContent,
  'Developer.openCacheFolder': Developer.openCacheFolder,
  'Developer.openConfigFolder': Developer.openConfigFolder,
  'Developer.openDataFolder': Developer.openDataFolder,
  'Developer.openLogsFolder': Developer.openLogsFolder,
  'Developer.openProcessExplorer': Developer.openProcessExplorer,
  'Developer.reloadColorTheme': Developer.reloadColorTheme,
  'Developer.reloadIconTheme': Developer.reloadIconTheme,
  'Developer.showColorThemeCss': Developer.showColorThemeCss,
  'Developer.showIconThemeCss': Developer.showIconThemeCss,
  'Developer.showMemoryUsage': Developer.showMemoryUsage,
  'Developer.showStartupPerformance': Developer.showStartupPerformance,
  'Developer.startupPerformance': Developer.showStartupPerformance,
  'Developer.toggleDeveloperTools': Developer.toggleDeveloperTools,
  // TODO certain commands are only available in electron -> treeshake them out
}
