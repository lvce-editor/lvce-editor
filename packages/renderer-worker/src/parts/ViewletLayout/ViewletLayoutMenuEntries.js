export const getQuickPickMenuEntries = () => {
  return [
    {
      id: 'AutoUpdater.checkForUpdates',
      label: 'Updater: Check for Updates',
    },
    {
      id: 'Main.openUri',
      label: 'Show Language Models',
      args: ['language-models:///1'],
    },
    {
      id: 'Layout.toggleSideBar',
      label: 'Layout: Toggle Side Bar',
    },
    {
      id: 'Developer.openIframeInspector',
      label: 'Developer: Open Iframe Inspector',
    },
    {
      id: 'Layout.togglePanel',
      label: 'Layout: Toggle Panel',
    },
    {
      id: 'Layout.toggleActivityBar',
      label: 'Layout: Toggle Activity Bar',
    },
    {
      id: 'Layout.togglePreview',
      label: 'Layout: Toggle Preview',
    },
    {
      id: 'Layout.toggleSideBarPosition',
      label: 'Layout: Toggle Side Bar Position',
      aliases: ['Position Side Bar', 'Move Side Bar', 'Side Bar Location'],
    },
    {
      id: 'Focus.output',
      label: 'Focus: Output',
    },
    {
      id: 'Focus.nextPart',
      label: 'Focus: Next Part',
    },
    {
      id: 'Focus.previousPart',
      label: 'Focus: Previous Part',
    },
    {
      id: 'Focus.statusBar',
      label: 'Focus: Status Bar',
    },
    {
      id: 'Focus.problems',
      label: 'Focus: Problems',
    },
    {
      id: 'Focus.debugConsole',
      label: 'Focus: Debug Console',
    },
    {
      id: 'Focus.terminal',
      label: 'Focus: Terminal',
    },
    {
      id: 'Terminal.clear',
      label: 'Terminal: Clear',
    },
    {
      id: 'Terminal.paste',
      label: 'Terminal: Paste',
    },
    {
      id: 'Terminal.kill',
      label: 'Terminal: Kill active Instance',
    },
    {
      id: 'Terminal.scrollUpLine',
      label: 'Terminal: Scroll Up Line',
    },
    {
      id: 'Terminal.scrollDownLine',
      label: 'Terminal: Scroll Down Line',
    },
    {
      id: 'Terminal.scrollUpPage',
      label: 'Terminal: Scroll Up Page',
    },
    {
      id: 'Terminal.scrollDownPage',
      label: 'Terminal: Scroll Down Page',
    },
    {
      id: 'Focus.previousTerminal',
      label: 'Focus: Previous Terminal',
    },
    {
      id: 'Focus.nextTerminal',
      label: 'Focus: Next Terminal',
    },
    {
      id: 'Terminal.split',
      label: 'Terminal: Split',
    },
    {
      id: 'Terminal.toggleSelection',
      label: 'Toggle Selection',
    },
    {
      id: 'Focus.explorer',
      label: 'Focus: Explorer',
    },
    {
      id: 'Focus.search',
      label: 'Focus: Search',
    },
    {
      id: 'Focus.sourceControl',
      label: 'Focus: Source Control',
    },
    {
      id: 'Focus.debugAndRun',
      label: 'Focus: Debug and Run',
    },
    {
      id: 'Focus.Extensions',
      label: 'Focus: Extensions',
    },
    {
      id: 'Preferences.openUserKeyBindings',
      label: 'Preferences: Open User Key Bindings',
    },
    {
      id: 'Preferences.openDefaultKeyBindings',
      label: 'Preferences: Open Default Key Bindings',
      aliases: ['Set Key Bindings', 'Key Map', 'Key Mapping'],
    },
    {
      id: 'Preferences.openSettingsJson',
      label: 'Preferences: Open Settings',
      aliases: ['Change Settings', 'Configure Settings', 'Preferences'],
    },
    {
      id: 'Preferences.openSettingsUi',
      label: 'Preferences: Open Settings Ui',
      aliases: ['Change Settings Ui', 'Configure Settings Ui', 'Preferences'],
    },
    {
      id: 'Extensions.openExtensionsFolder',
      label: 'Extensions: Open Extensions Folder',
      deprecated: true,
      TODO: 'add support for deprecated commands',
    },
    {
      id: 'Extensions.openCachedExtensionsFolder',
      label: 'Extensions: Open Cached Extensions Folder',
    },
    {
      id: 'ActivityBar.focus',
      label: 'Focus: ActivityBar',
    },
    {
      id: 'Focus.titleBar',
      label: 'Focus: Title Bar',
    },
    {
      id: 'Developer.showMemoryUsage',
      label: 'Developer: Show Memory Usage',
    },
    {
      id: 'Developer.downloadViewletState',
      label: 'Developer: Download Viewlets',
    },
    {
      id: 'Developer.allocateMemoryInSharedProcess',
      label: 'Developer: Allocate Memory in Shared Process',
    },
    {
      id: 'Developer.crashSharedProcess',
      label: 'Developer: Crash Shared Process',
    },
    {
      id: 'Developer.crashMainProcess',
      label: 'Developer: Crash Main Process',
    },
    {
      id: 'Developer.createSharedProcessHeapSnapshot',
      label: 'Developer: Create Shared Process Heap Snapshot',
    },
    {
      id: 'Developer.createSharedProcessProfile',
      label: 'Developer: Create Shared Process Profile',
    },
    {
      id: 'Developer.clearCache',
      label: 'Developer: Clear Cache',
    },
    {
      id: 'Developer.openConfigFolder',
      label: 'Developer: Open Config Folder',
    },
    {
      id: 'Developer.openCacheFolder',
      label: 'Developer: Open Cache Folder',
    },
    {
      id: 'Developer.openDataFolder',
      label: 'Developer: Open Data Folder',
    },
    {
      id: 'QuickPick.showColorTheme',
      label: 'Preferences: Color Theme',
      aliases: ['Select Color Theme', 'Switch Color Theme', 'Theme Color'],
    },
    {
      id: 'Developer.measureLatencyBetweenExtensionHostAndSharedProcess',
      label: 'Developer: Measure Latency Between Extension Host and Shared Process',
    },
    {
      id: 'Developer.measureLatencyBetweenSharedProcessAndRendererProcess',
      label: 'Developer: Measure Latency Between Shared Process and Renderer Process',
    },
    {
      id: 'Developer.showState',
      label: 'Developer: Show state',
    },
    {
      id: 'Developer.startupPerformance',
      label: 'Developer: Startup Performance',
    },
    {
      id: 'Developer.toggleDeveloperTools',
      label: 'Developer: Toggle Developer Tools',
    },
    {
      id: 'RebuildNodePty.rebuildNodePty',
      label: 'Developer: Rebuild Node Pty',
    },
    {
      id: 'DebugSharedProcess.debugSharedProcess',
      label: 'Developer: Debug Shared Process',
    },
    {
      id: 'Reload.reload',
      label: 'Window: Reload',
      aliases: ['Reload Window'],
    },
    {
      id: 'Window.close',
      label: 'Window: Close',
      aliases: ['Close Window'],
    },
    {
      id: 'Window.minimize',
      label: 'Window: Minimize',
      aliases: ['Minimize Window'],
    },
    {
      id: 'Window.maximize',
      label: 'Window: Maximize',
      aliases: ['Maximize Window'],
    },
    {
      id: 'Window.unmaximize',
      label: 'Window: Unmaximize',
      aliases: ['Unmaximize Window'],
    },
    {
      id: 'Window.makeScreenshot',
      label: 'Window: Make Screenshot',
    },
    {
      id: 'Main.CloseEditor',
      label: 'Main: Close Editor',
    },
    {
      id: 'Main.CloseAllEditors',
      label: 'Main: Close all Editors',
    },
    {
      id: 'Dialog.openFolder',
      label: 'File: Open Folder',
    },
    {
      id: 'file.openRecent',
      label: 'File: Open Recent',
    },
    {
      id: 'About.showAbout',
      label: 'Help: About',
    },
    {
      id: 'audio.playBell',
      label: 'Audio: Play Bell',
    },
    {
      id: 'serviceWorker.uninstall',
      label: 'Service Worker: Uninstall',
    },
    {
      id: 'Developer.openLogsFolder',
      label: 'Developer: Open Logs Folder',
    },
    {
      id: 'Developer.openProcessExplorer',
      label: 'Developer: Open Process Explorer',
    },
    {
      id: 'Developer.openStorageOverview',
      label: 'Developer: Open Storage Overview',
    },
    {
      id: 'Developer.openBrowserViewOverview',
      label: 'Developer: Open Browser View Overview',
    },
    {
      id: 'Developer.openScreenCastView',
      label: 'Developer: Open ScreenCast View',
    },
    {
      id: 'Explorer.collapseAll',
      label: 'Explorer: Collapse All',
    },
    {
      id: 'Explorer.newFile',
      label: 'Explorer: New File',
    },
    {
      id: 'Explorer.newFolder',
      label: 'Explorer: New Folder',
    },
    {
      id: 'Explorer.expandAll',
      label: 'Explorer: Expand All',
    },
    {
      id: 'Explorer.hotReload',
      label: 'Explorer: Hot Reload',
    },
    {
      id: 'Explorer.expandRecursively',
      label: 'Explorer: Expand Recursively',
    },
    {
      id: 'SessionReplay.replayCurrentSession',
      label: 'SessionReplay: Replay Current Session',
    },
    {
      id: 'SessionReplay.downloadSession',
      label: 'SessionReplay: Download Session',
    },
    {
      id: 'SessionReplay.openSession',
      label: 'SessionReplay: Open Session',
    },
    {
      id: 'ContentTracing.start',
      label: 'Developer: Start Content Tracing',
    },
    {
      id: 'ContentTracing.stop',
      label: 'Developer: Stop Content Tracing',
    },
    {
      id: 'Window.zoomIn',
      label: 'Window: Zoom In',
    },
    {
      id: 'Window.zoomOut',
      label: 'Window: Zoom Out',
    },
    {
      id: 'Window.zoomReset',
      label: 'Window: Reset Zoom',
    },
    {
      id: 'Main.openUri',
      label: 'Simple Browser: Open',
      args: ['simple-browser://'],
    },
    {
      id: 'SimpleBrowser.openDevtools',
      label: 'Simple Browser: Open Dev Devtools',
    },
    {
      id: 'Workspace.close',
      label: 'Workspace: Close',
    },
    {
      id: 'Layout.showE2eTests',
      label: 'Layout: Show E2E Tests',
    },
  ]
}
