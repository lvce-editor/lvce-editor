import * as Crash from '../Crash/Crash.js'
import * as OpenSpecialFolder from '../OpenSpecialFolder/OpenSpecialFolder.js'
import * as Developer from './Developer.js'
import * as Devtools from '../Devtools/Devtools.js'

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
  openBrowserViewOverview: Developer.openBrowserViewOverview,
  openCacheFolder: OpenSpecialFolder.openCacheFolder,
  openConfigFolder: OpenSpecialFolder.openConfigFolder,
  openDataFolder: OpenSpecialFolder.openDataFolder,
  openLogsFolder: OpenSpecialFolder.openLogsFolder,
  openProcessExplorer: Developer.openProcessExplorer,
  openScreenCastView: Developer.openScreenCastView,
  reloadColorTheme: Developer.reloadColorTheme,
  reloadIconTheme: Developer.reloadIconTheme,
  showColorThemeCss: Developer.showColorThemeCss,
  showIconThemeCss: Developer.showIconThemeCss,
  showMemoryUsage: Developer.showMemoryUsage,
  showStartupPerformance: Developer.showStartupPerformance,
  openStorageOverview: Developer.openStorageOverview,
  openBrowserViewOverview: Developer.openBrowserViewOverview,
  openScreenCastView: Developer.openScreenCastView,
  startupPerformance: Developer.showStartupPerformance,
  toggleDeveloperTools: Devtools.toggleDeveloperTools,
}
