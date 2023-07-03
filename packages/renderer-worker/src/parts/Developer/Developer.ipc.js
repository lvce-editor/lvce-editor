import * as Crash from '../Crash/Crash.js'
import * as Developer from './Developer.js'

export const name = 'Developer'

// prettier-ignore
export const Commands = {
  // TODO certain commands are only available in electron -> treeshake them out
  allocateMemoryInSharedProcess: Developer.allocateMemoryInSharedProcess,
  clearCache: Developer.clearCache,
  crashMainProcess: Crash.crashMainProcess,
  crashSharedProcess: Crash.crashSharedProcess,
  createSharedProcessHeapSnapshot: Developer.createSharedProcessHeapSnapshot,
  createSharedProcessProfile: Developer.createSharedProcessProfile,
  downloadViewletState: Developer.downloadViewletState,
  getMemoryUsageContent: Developer.getMemoryUsageContent,
  getStartupPerformanceContent: Developer.getStartupPerformanceContent,
  openCacheFolder: Developer.openCacheFolder,
  openConfigFolder: Developer.openConfigFolder,
  openDataFolder: Developer.openDataFolder,
  openLogsFolder: Developer.openLogsFolder,
  openProcessExplorer: Developer.openProcessExplorer,
  reloadColorTheme: Developer.reloadColorTheme,
  reloadIconTheme: Developer.reloadIconTheme,
  showColorThemeCss: Developer.showColorThemeCss,
  showIconThemeCss: Developer.showIconThemeCss,
  showMemoryUsage: Developer.showMemoryUsage,
  showStartupPerformance: Developer.showStartupPerformance,
  startupPerformance: Developer.showStartupPerformance,
  toggleDeveloperTools: Developer.toggleDeveloperTools,
}
