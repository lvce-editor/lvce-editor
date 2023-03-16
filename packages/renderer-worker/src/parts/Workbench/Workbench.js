import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as InitData from '../InitData/InitData.js'
import * as Languages from '../Languages/Languages.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as Location from '../Location/Location.js'
import * as Module from '../Module/Module.js'
import * as Performance from '../Performance/Performance.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RecentlyOpened from '../RecentlyOpened/RecentlyOpened.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as ServiceWorker from '../ServiceWorker/ServiceWorker.js'
import * as SessionReplay from '../SessionReplay/SessionReplay.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
// TODO lazyload parts one by one (Main, SideBar, ActivityBar, TitleBar, StatusBar)
export const startup = async (config) => {
  onunhandledrejection = ErrorHandling.handleUnhandledRejection
  onerror = ErrorHandling.handleUnhandledError

  Command.setLoad(Module.load)
  LifeCycle.mark(LifeCyclePhase.Zero)

  Performance.mark('willStartupWorkbench')
  await RendererProcess.listen()
  if (Platform.platform !== PlatformType.Web) {
    await SharedProcess.listen()
  }

  LifeCycle.mark(LifeCyclePhase.One)

  const initData = await InitData.getInitData()

  if (initData.Location.href.includes('?replayId')) {
    const url = new URL(initData.Location.href)
    const replayId = url.searchParams.get('replayId')
    await SessionReplay.replaySession(replayId)
    return
  }

  Performance.mark('code/willLoadPreferences')
  await Preferences.hydrate()
  Performance.mark('code/didLoadPreferences')

  // TODO only load this if session replay is enabled in preferences
  if (Preferences.get('sessionReplay.enabled')) {
    Performance.mark('code/willLoadSessionReplay')
    await SessionReplay.startRecording()
    Performance.mark('code/didLoadSessionReplay')
  }

  LifeCycle.mark(LifeCyclePhase.Twelve)

  Performance.mark('code/willOpenWorkspace')
  await Workspace.hydrate(initData.Location)
  Performance.mark('code/didOpenWorkspace')

  LifeCycle.mark(LifeCyclePhase.Three)

  Performance.mark('code/willLoadColorTheme')
  await ColorTheme.hydrate()
  Performance.mark('code/didLoadColorTheme')

  LifeCycle.mark(LifeCyclePhase.Four)

  Performance.mark('code/willShowLayout')
  const layout = ViewletManager.create(ViewletModule.load, ViewletModuleId.Layout, '', '', 0, 0, 0, 0)
  const layoutState = await SaveState.getSavedViewletState(ViewletModuleId.Layout)
  const commands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id: ViewletModuleId.Layout,
      type: 0,
      uri: '',
      show: false,
      focus: false,
    },
    false,
    false,
    { ...initData, ...layoutState }
  )
  commands.splice(1, 1)
  const layoutModule = ViewletStates.getInstance(ViewletModuleId.Layout)
  const placeholderCommands = layoutModule.factory.getInitialPlaceholderCommands(layoutModule.state)
  commands.push(...placeholderCommands)
  commands.push(['Viewlet.appendToBody', ViewletModuleId.Layout])
  await RendererProcess.invoke('Viewlet.executeCommands', commands)
  // await Layout.hydrate(initData)
  Performance.mark('code/didShowLayout')

  Performance.mark('code/willLoadLanguages')
  await Languages.hydrate()
  Performance.mark('code/didLoadLanguages')

  LifeCycle.mark(LifeCyclePhase.Five)

  Performance.mark('code/willLoadMain')
  await Command.execute('Layout.loadMainIfVisible')
  Performance.mark('code/didLoadMain')

  LifeCycle.mark(LifeCyclePhase.Six)

  LifeCycle.mark(LifeCyclePhase.Seven)

  Performance.mark('code/willLoadSideBar')
  await Command.execute('Layout.loadSideBarIfVisible')
  Performance.mark('code/didLoadSideBar')

  LifeCycle.mark(LifeCyclePhase.Eight)

  Performance.mark('code/willLoadPanel')
  await Command.execute('Layout.loadPanelIfVisible')
  Performance.mark('code/didLoadPanel')

  LifeCycle.mark(LifeCyclePhase.Nine)

  Performance.mark('code/willLoadActivityBar')
  await Command.execute('Layout.loadActivityBarIfVisible')
  Performance.mark('code/didLoadActivityBar')

  LifeCycle.mark(LifeCyclePhase.Ten)

  Performance.mark('code/willLoadStatusBar')
  await Command.execute('Layout.loadStatusBarIfVisible')
  Performance.mark('code/didLoadStatusBar')

  LifeCycle.mark(LifeCyclePhase.Eleven)

  Performance.mark('code/willLoadIconTheme')
  // TODO check preferences if icon theme is enabled
  await IconTheme.hydrate()
  Performance.mark('code/didLoadIconTheme')

  LifeCycle.mark(LifeCyclePhase.Twelve)

  LifeCycle.mark(LifeCyclePhase.Thirteen)

  LifeCycle.mark(LifeCyclePhase.Fourteen)

  if (Platform.platform === PlatformType.Electron && Preferences.get('window.titleBarStyle') === 'native') {
    await Command.execute('ElectronApplicationMenu.hydrate')
  } else {
    Performance.mark('code/willLoadTitleBar')
    await Command.execute('Layout.loadTitleBarIfVisible')
    Performance.mark('code/didLoadTitleBar')
  }

  LifeCycle.mark(LifeCyclePhase.Fifteen)

  if (Workspace.isTest()) {
    const testPath = await Platform.getTestPath()
    const href = initData.Location.href
    const fileName = href.slice(href.lastIndexOf('/') + 1)
    const jsfileName = fileName.replace(/\.html$/, '.js')
    const jsPath = `${testPath}/src/${jsfileName}`
    await Command.execute('Test.execute', jsPath)
    return
  } else {
    Performance.mark('code/willLoadSaveState')
    await SaveState.hydrate()
    Performance.mark('code/didLoadSaveState')
  }

  LifeCycle.mark(LifeCyclePhase.Sixteen)

  Performance.mark('code/willLoadRecentlyOpened')
  await RecentlyOpened.hydrate()
  Performance.mark('code/didLoadRecentlyOpened')

  // TODO tree shake out service worker in electron build

  Performance.mark('code/willLoadServiceWorker')
  await ServiceWorker.hydrate()
  Performance.mark('code/didLoadServiceWorker')

  Performance.mark('code/willLoadLocation')
  await Location.hydrate()
  Performance.mark('code/didLoadLocation')

  Performance.measure('code/openWorkspace', 'code/willOpenWorkspace', 'code/didOpenWorkspace')
  Performance.measure('code/loadMain', 'code/willLoadMain', 'code/didLoadMain')
  Performance.measure('code/loadSideBar', 'code/willLoadSideBar', 'code/didLoadSideBar')
  Performance.measure('code/showLayout', 'code/willShowLayout', 'code/didShowLayout')
  Performance.measure('code/loadPanel', 'code/willLoadPanel', 'code/didLoadPanel')
  Performance.measure('code/loadActivityBar', 'code/willLoadActivityBar', 'code/didLoadActivityBar')
  Performance.measure('code/loadStatusBar', 'code/willLoadStatusBar', 'code/didLoadStatusBar')
  Performance.measure('code/loadPreferences', 'code/willLoadPreferences', 'code/didLoadPreferences')
  Performance.measure('code/loadColorTheme', 'code/willLoadColorTheme', 'code/didLoadColorTheme')
  Performance.measure('code/loadIconTheme', 'code/willLoadIconTheme', 'code/didLoadIconTheme')
}
