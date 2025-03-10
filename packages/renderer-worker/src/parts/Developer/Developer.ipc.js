import * as Crash from '../Crash/Crash.js'
import * as Devtools from '../Devtools/Devtools.js'
import * as OpenSpecialFolder from '../OpenSpecialFolder/OpenSpecialFolder.js'
import * as Developer from './Developer.js'

export const name = 'Developer'

// prettier-ignore
export const Commands = {
  // TODO certain commands are only available in electron -> treeshake them out
  allocateMemoryInSharedProcess: Developer.allocateMemoryInSharedProcess,
  openIframeInspector: Developer.openIframeInspector,
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
  openStorageOverview: Developer.openStorageOverview,
  reloadColorTheme: Developer.reloadColorTheme,
  reloadIconTheme: Developer.reloadIconTheme,
  showColorThemeCss: Developer.showColorThemeCss,
  showMemoryUsage: Developer.showMemoryUsage,
  showStartupPerformance: Developer.showStartupPerformance,
  startupPerformance: Developer.showStartupPerformance,
  toggleDeveloperTools: Devtools.toggleDeveloperTools,
}
