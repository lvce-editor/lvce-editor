import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as Layout from '../Layout/Layout.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as Performance from '../Performance/Performance.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as ServiceWorker from '../ServiceWorker/ServiceWorker.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as RecentlyOpened from '../RecentlyOpened/RecentlyOpened.js'
import * as Location from '../Location/Location.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as SessionReplay from '../SessionReplay/SessionReplay.js'
import * as InitData from '../InitData/InitData.js'
import * as Command from '../Command/Command.js'

const handleUnhandledRejection = async (event) => {
  console.info(`[renderer-worker] Unhandled Rejection: ${event.reason}`)
  try {
    await ErrorHandling.handleError(event.reason)
  } catch {}
}

const handleError = async (event) => {
  console.info(`[renderer-worker] Unhandled Error: ${event}`)
  try {
    await ErrorHandling.handleError(event.reason)
  } catch {}
}

// TODO lazyload parts one by one (Main, SideBar, ActivityBar, TitleBar, StatusBar)
export const startup = async (config) => {
  onunhandledrejection = handleUnhandledRejection
  onerror = handleError
  LifeCycle.mark(LifeCycle.Phase.Zero)

  Performance.mark('willStartupWorkbench')
  await RendererProcess.listen()
  await SharedProcess.listen()

  LifeCycle.mark(LifeCycle.Phase.One)

  const initData = await InitData.getInitData()

  Performance.mark('code/willLoadPreferences')
  await Preferences.hydrate()
  Performance.mark('code/didLoadPreferences')

  // TODO only load this if session replay is enabled in preferences
  Performance.mark('code/willLoadSessionReplay')
  await SessionReplay.startRecording()
  Performance.mark('code/didLoadSessionReplay')

  LifeCycle.mark(LifeCycle.Phase.Twelve)

  Performance.mark('code/willOpenWorkspace')
  await Workspace.hydrate(initData.Location)
  Performance.mark('code/didOpenWorkspace')

  LifeCycle.mark(LifeCycle.Phase.Three)

  Performance.mark('code/willLoadColorTheme')
  await ColorTheme.hydrate()
  Performance.mark('code/didLoadColorTheme')

  LifeCycle.mark(LifeCycle.Phase.Four)

  Performance.mark('code/willShowLayout')
  await Layout.hydrate(initData)
  Performance.mark('code/didShowLayout')

  LifeCycle.mark(LifeCycle.Phase.Five)

  Performance.mark('code/willLoadMain')
  await Layout.showMain()
  Performance.mark('code/didLoadMain')

  LifeCycle.mark(LifeCycle.Phase.Six)

  Performance.mark('code/willLoadKeyBindings')
  await KeyBindings.hydrate()
  Performance.mark('code/didLoadKeyBindings')

  LifeCycle.mark(LifeCycle.Phase.Seven)

  Performance.mark('code/willLoadSideBar')
  if (Layout.state.sideBarVisible) {
    await Layout.showSideBar()
  }
  Performance.mark('code/didLoadSideBar')

  LifeCycle.mark(LifeCycle.Phase.Eight)

  Performance.mark('code/willLoadPanel')
  if (Layout.state.panelVisible) {
    await Layout.showPanel()
  }
  Performance.mark('code/didLoadPanel')

  LifeCycle.mark(LifeCycle.Phase.Nine)

  Performance.mark('code/willLoadActivityBar')
  if (Layout.state.activityBarVisible) {
    await Layout.showActivityBar()
  }
  Performance.mark('code/didLoadActivityBar')

  LifeCycle.mark(LifeCycle.Phase.Ten)

  Performance.mark('code/willLoadStatusBar')
  if (Layout.state.statusBarVisible) {
    await Layout.showStatusBar()
  }
  Performance.mark('code/didLoadStatusBar')

  LifeCycle.mark(LifeCycle.Phase.Eleven)

  Performance.mark('code/willLoadIconTheme')
  // TODO check preferences if icon theme is enabled
  await IconTheme.hydrate()
  Performance.mark('code/didLoadIconTheme')

  LifeCycle.mark(LifeCycle.Phase.Twelve)

  LifeCycle.mark(LifeCycle.Phase.Thirteen)

  LifeCycle.mark(LifeCycle.Phase.Fourteen)

  Performance.mark('code/willLoadTitleBar')
  if (Layout.state.titleBarVisible) {
    await Layout.showTitleBar()
  }
  Performance.mark('code/didLoadTitleBar')

  LifeCycle.mark(LifeCycle.Phase.Fifteen)

  if (Workspace.isTest()) {
    const jsPath = initData.Location.href
      .replace('/tests', '/packages/extension-host-worker-tests/src')
      .replace(/\.html$/, '.js')
    await Command.execute('Test.execute', jsPath)
  } else {
    Performance.mark('code/willLoadSaveState')
    await SaveState.hydrate()
    Performance.mark('code/didLoadSaveState')
  }

  LifeCycle.mark(LifeCycle.Phase.Sixteen)

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

  Performance.measure(
    'code/loadKeyBindings',
    'code/willLoadKeyBindings',
    'code/didLoadKeyBindings'
  )
  Performance.measure(
    'code/openWorkspace',
    'code/willOpenWorkspace',
    'code/didOpenWorkspace'
  )
  Performance.measure('code/loadMain', 'code/willLoadMain', 'code/didLoadMain')
  Performance.measure(
    'code/loadSideBar',
    'code/willLoadSideBar',
    'code/didLoadSideBar'
  )
  Performance.measure(
    'code/showLayout',
    'code/willShowLayout',
    'code/didShowLayout'
  )
  Performance.measure(
    'code/loadPanel',
    'code/willLoadPanel',
    'code/didLoadPanel'
  )
  Performance.measure(
    'code/loadActivityBar',
    'code/willLoadActivityBar',
    'code/didLoadActivityBar'
  )
  Performance.measure(
    'code/loadStatusBar',
    'code/willLoadStatusBar',
    'code/didLoadStatusBar'
  )
  Performance.measure(
    'code/loadPreferences',
    'code/willLoadPreferences',
    'code/didLoadPreferences'
  )
  Performance.measure(
    'code/loadColorTheme',
    'code/willLoadColorTheme',
    'code/didLoadColorTheme'
  )
  Performance.measure(
    'code/loadIconTheme',
    'code/willLoadIconTheme',
    'code/didLoadIconTheme'
  )
}
