import * as Bounds from '../Bounds/Bounds.js'
import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as Command from '../Command/Command.js'
import * as DevelopFileWatcher from '../DevelopFileWatcher/DevelopFileWatcher.js'
import * as ExecuteCurrentTest from '../ExecuteCurrentTest/ExecuteCurrentTest.js'
import * as FileSystemMap from '../FileSystemMap/FileSystemMap.js'
import * as FileSystemState from '../FileSystemState/FileSystemState.js'
import * as Focus from '../Focus/Focus.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Id from '../Id/Id.js'
import * as InitData from '../InitData/InitData.js'
import * as IpcState from '../IpcState/IpcState.js'
import * as Languages from '../Languages/Languages.js'
import * as LaunchSharedProcess from '../LaunchSharedProcess/LaunchSharedProcess.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as Location from '../Location/Location.js'
import * as Module from '../Module/Module.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RecentlyOpened from '../RecentlyOpened/RecentlyOpened.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as SessionReplay from '../SessionReplay/SessionReplay.js'
import * as UnhandledErrorHandling from '../UnhandledErrorHandling/UnhandledErrorHandling.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletModuleInternal from '../ViewletModuleInternal/ViewletModuleInternal.js'
import * as ViewletModuleMap from '../ViewletModuleMap/ViewletModuleMap.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as WatchFilesForHotReload from '../WatchFilesForHotReload/WatchFilesForHotReload.js'
import * as Workspace from '../Workspace/Workspace.js'

const actions = [
  async () => {
    Performance.mark(PerformanceMarkerType.WillLoadMain)
    await Command.execute('Layout.loadMainIfVisible')
    Performance.mark(PerformanceMarkerType.DidLoadMain)
  },
  async () => {
    LifeCycle.mark(LifeCyclePhase.Six)

    LifeCycle.mark(LifeCyclePhase.Seven)

    Performance.mark(PerformanceMarkerType.WillLoadSideBar)
    await Command.execute('Layout.loadSideBarIfVisible')
    Performance.mark(PerformanceMarkerType.DidLoadSideBar)
  },
  async () => {
    LifeCycle.mark(LifeCyclePhase.Eight)

    Performance.mark(PerformanceMarkerType.WillLoadPanel)
    await Command.execute('Layout.loadPanelIfVisible')
    Performance.mark(PerformanceMarkerType.DidLoadPanel)
  },

  async () => {
    LifeCycle.mark(LifeCyclePhase.Nine)

    Performance.mark(PerformanceMarkerType.WillLoadActivityBar)
    await Command.execute('Layout.loadActivityBarIfVisible')
    Performance.mark(PerformanceMarkerType.DidLoadActivityBar)
  },
  async () => {
    LifeCycle.mark(LifeCyclePhase.Ten)

    Performance.mark(PerformanceMarkerType.WillLoadStatusBar)
    await Command.execute('Layout.loadStatusBarIfVisible')
    Performance.mark(PerformanceMarkerType.DidLoadStatusBar)
  },

  async () => {
    await Command.execute('Layout.loadPreviewIfVisible')
  },
  async (platform, assetDir) => {
    LifeCycle.mark(LifeCyclePhase.Eleven)

    Performance.mark(PerformanceMarkerType.WillLoadIconTheme)
    // TODO check preferences if icon theme is enabled
    await IconTheme.hydrate(platform, assetDir)
    Performance.mark(PerformanceMarkerType.DidLoadIconTheme)
  },
  async (platform) => {
    LifeCycle.mark(LifeCyclePhase.Twelve)

    LifeCycle.mark(LifeCyclePhase.Thirteen)

    LifeCycle.mark(LifeCyclePhase.Fourteen)

    Performance.mark(PerformanceMarkerType.WillLoadTitleBar)
    await Command.execute('Layout.loadTitleBarIfVisible')
    Performance.mark(PerformanceMarkerType.DidLoadTitleBar)
  },
]

// TODO lazyload parts one by one (Main, SideBar, ActivityBar, TitleBar, StatusBar)
export const startup = async (platform, assetDir) => {
  onunhandledrejection = UnhandledErrorHandling.handleUnhandledRejection
  // @ts-ignore
  onerror = UnhandledErrorHandling.handleUnhandledError

  ViewletModuleInternal.registerAll(ViewletModuleMap.map)
  FileSystemState.registerAll(FileSystemMap.map)
  Command.setLoad(Module.load)
  LifeCycle.mark(LifeCyclePhase.Zero)

  Performance.mark(PerformanceMarkerType.WillStartupWorkbench)
  await RendererProcess.listen()
  if (platform !== PlatformType.Web) {
    await LaunchSharedProcess.launchSharedProcess()
  }

  LifeCycle.mark(LifeCyclePhase.One)

  const initData = await InitData.getInitData()

  IpcState.setConfig(initData.Config?.shouldLaunchMultipleWorkers)

  if (initData.Location.href.includes('?replayId')) {
    const url = new URL(initData.Location.href)
    const replayId = url.searchParams.get('replayId')
    await SessionReplay.replaySession(replayId)
    return
  }

  if (initData.Location.href.startsWith('http://localhost:3001/tests/')) {
    // TODO aquire port from other renderer worker
  }

  Bounds.set(initData.Layout.bounds.windowWidth, initData.Layout.bounds.windowHeight)

  Performance.mark(PerformanceMarkerType.WillLoadPreferences)
  await Preferences.hydrate()
  Performance.mark(PerformanceMarkerType.DidLoadPreferences)

  // TODO only load this if session replay is enabled in preferences
  if (Preferences.get('sessionReplay.enabled')) {
    Performance.mark(PerformanceMarkerType.WillLoadSessionReplay)
    await SessionReplay.startRecording()
    Performance.mark(PerformanceMarkerType.DidLoadSessionReplay)
  }

  LifeCycle.mark(LifeCyclePhase.Twelve)

  Performance.mark(PerformanceMarkerType.WillOpenWorkspace)
  await Workspace.hydrate(initData.Location)
  Performance.mark(PerformanceMarkerType.DidOpenWorkspace)

  await Focus.hydrate()

  LifeCycle.mark(LifeCyclePhase.Three)

  Performance.mark(PerformanceMarkerType.WillLoadColorTheme)
  await ColorTheme.hydrate()
  Performance.mark(PerformanceMarkerType.DidLoadColorTheme)

  LifeCycle.mark(LifeCyclePhase.Four)

  Performance.mark(PerformanceMarkerType.WillShowLayout)
  const layout = ViewletManager.create(ViewletModule.load, ViewletModuleId.Layout, 0, '', 0, 0, 0, 0)
  layout.uid = Id.create()
  const layoutState = await SaveState.getSavedViewletState(ViewletModuleId.Layout)
  const commands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id: ViewletModuleId.Layout,
      type: 0,
      // @ts-ignore
      uri: '',
      show: false,
      focus: false,
      uid: layout.uid,
    },
    false,
    false,
    { ...initData, ...layoutState },
  )
  commands.splice(1, 1)
  const layoutModule = ViewletStates.getInstance(ViewletModuleId.Layout)
  const placeholderCommands = layoutModule.factory.getInitialPlaceholderCommands(layoutModule.state)
  commands.push(...placeholderCommands)
  commands.push(['Viewlet.appendToBody', layout.uid])
  await RendererProcess.invoke('Viewlet.executeCommands', commands)
  // await Layout.hydrate(initData)
  Performance.mark(PerformanceMarkerType.DidShowLayout)

  Performance.mark(PerformanceMarkerType.WillLoadLanguages)
  await Languages.hydrate(platform, assetDir)
  Performance.mark(PerformanceMarkerType.DidLoadLanguages)

  LifeCycle.mark(LifeCyclePhase.Five)

  await Promise.all(actions.map((action) => action(platform, assetDir)))

  LifeCycle.mark(LifeCyclePhase.Fifteen)

  if (Workspace.isTest()) {
    await ExecuteCurrentTest.executeCurrentTest(platform, initData)
    return
  }
  Performance.mark(PerformanceMarkerType.WillLoadSaveState)
  await SaveState.hydrate()
  Performance.mark(PerformanceMarkerType.DidLoadSaveState)

  LifeCycle.mark(LifeCyclePhase.Sixteen)

  Performance.mark(PerformanceMarkerType.WillLoadRecentlyOpened)
  await RecentlyOpened.hydrate()
  Performance.mark(PerformanceMarkerType.DidLoadRecentlyOpened)

  // TODO tree shake out service worker in electron build

  Performance.mark(PerformanceMarkerType.WillLoadLocation)
  await Location.hydrate()
  Performance.mark(PerformanceMarkerType.DidLoadLocation)

  const watcherPromises = Promise.all([DevelopFileWatcher.hydrate(), WatchFilesForHotReload.watchFilesForHotReload()])

  Performance.measure(PerformanceMarkerType.OpenWorkspace, PerformanceMarkerType.WillOpenWorkspace, PerformanceMarkerType.DidOpenWorkspace)
  Performance.measure(PerformanceMarkerType.LoadMain, PerformanceMarkerType.WillLoadMain, PerformanceMarkerType.DidLoadMain)
  Performance.measure(PerformanceMarkerType.LoadSideBar, PerformanceMarkerType.WillLoadSideBar, PerformanceMarkerType.DidLoadSideBar)
  Performance.measure(PerformanceMarkerType.ShowLayout, PerformanceMarkerType.WillShowLayout, PerformanceMarkerType.DidShowLayout)
  Performance.measure(PerformanceMarkerType.LoadPanel, PerformanceMarkerType.WillLoadPanel, PerformanceMarkerType.DidLoadPanel)
  Performance.measure(PerformanceMarkerType.LoadActivityBar, PerformanceMarkerType.WillLoadActivityBar, PerformanceMarkerType.DidLoadActivityBar)
  Performance.measure(PerformanceMarkerType.LoadStatusBar, PerformanceMarkerType.WillLoadStatusBar, PerformanceMarkerType.DidLoadStatusBar)
  Performance.measure(PerformanceMarkerType.LoadPreferences, PerformanceMarkerType.WillLoadPreferences, PerformanceMarkerType.DidLoadPreferences)
  Performance.measure(PerformanceMarkerType.LoadColorTheme, PerformanceMarkerType.WillLoadColorTheme, PerformanceMarkerType.DidLoadColorTheme)
  Performance.measure(PerformanceMarkerType.LoadIconTheme, PerformanceMarkerType.WillLoadIconTheme, PerformanceMarkerType.DidLoadIconTheme)

  const autoUpdate = Preferences.get('application.updateMode')
  const supportsAutoUpdate = platform === PlatformType.Electron // TODO also check if auto update is supported on this platform, e.g. windows
  if (autoUpdate && autoUpdate !== 'none' && supportsAutoUpdate) {
    try {
      await Command.execute('AutoUpdater.checkForUpdates', autoUpdate)
    } catch {
      // ignore
    }
  }

  await watcherPromises
}
