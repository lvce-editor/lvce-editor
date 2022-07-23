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
  LifeCycle.mark(LifeCycle.PHASE_ZERO)

  Performance.mark('willStartupWorkbench')
  RendererProcess.listen()
  await SharedProcess.listen()

  LifeCycle.mark(LifeCycle.PHASE_ONE)

  // const initData = await InitData.getInitData()
  // console.log({ initData })

  Performance.mark('code/willLoadPreferences')
  await Preferences.hydrate()
  Performance.mark('code/didLoadPreferences')

  // TODO only load this if session replay is enabled in preferences
  Performance.mark('code/willLoadSessionReplay')
  await SessionReplay.startRecording()
  Performance.mark('code/didLoadSessionReplay')

  LifeCycle.mark(LifeCycle.PHASE_TWO)

  Performance.mark('code/willOpenWorkspace')
  await Workspace.hydrate()
  Performance.mark('code/didOpenWorkspace')

  LifeCycle.mark(LifeCycle.PHASE_THREE)

  Performance.mark('code/willLoadColorTheme')
  await ColorTheme.hydrate()
  Performance.mark('code/didLoadColorTheme')

  LifeCycle.mark(LifeCycle.PHASE_FOUR)

  Performance.mark('code/willShowLayout')
  await Layout.hydrate()
  Performance.mark('code/didShowLayout')

  LifeCycle.mark(LifeCycle.PHASE_FIVE)

  Performance.mark('code/willLoadMain')
  await Layout.showMain()
  Performance.mark('code/didLoadMain')

  LifeCycle.mark(LifeCycle.PHASE_SIX)

  Performance.mark('code/willLoadKeyBindings')
  await KeyBindings.hydrate()
  Performance.mark('code/didLoadKeyBindings')

  LifeCycle.mark(LifeCycle.PHASE_SEVEN)

  Performance.mark('code/willLoadSideBar')
  if (Layout.state.sideBarVisible) {
    await Layout.showSideBar()
  }
  Performance.mark('code/didLoadSideBar')

  LifeCycle.mark(LifeCycle.PHASE_EIGHT)

  Performance.mark('code/willLoadPanel')
  if (Layout.state.panelVisible) {
    await Layout.showPanel()
  }
  Performance.mark('code/didLoadPanel')

  LifeCycle.mark(LifeCycle.PHASE_NINE)

  Performance.mark('code/willLoadActivityBar')
  if (Layout.state.activityBarVisible) {
    await Layout.showActivityBar()
  }
  Performance.mark('code/didLoadActivityBar')

  LifeCycle.mark(LifeCycle.PHASE_TEN)

  Performance.mark('code/willLoadStatusBar')
  if (Layout.state.statusBarVisible) {
    await Layout.showStatusBar()
  }
  Performance.mark('code/didLoadStatusBar')

  LifeCycle.mark(LifeCycle.PHASE_ELEVEN)

  Performance.mark('code/willLoadIconTheme')
  // TODO check preferences if icon theme is enabled
  await IconTheme.hydrate()
  Performance.mark('code/didLoadIconTheme')

  LifeCycle.mark(LifeCycle.PHASE_TWELVE)

  LifeCycle.mark(LifeCycle.PHASE_THIRTEEN)

  LifeCycle.mark(LifeCycle.PHASE_FOURTEEN)

  Performance.mark('code/willLoadTitleBar')
  if (Layout.state.titleBarVisible) {
    await Layout.showTitleBar()
  }
  Performance.mark('code/didLoadTitleBar')

  LifeCycle.mark(LifeCycle.PHASE_FIFTEEN)

  Performance.mark('code/willLoadSaveState')
  await SaveState.hydrate()
  Performance.mark('code/didLoadSaveState')

  LifeCycle.mark(LifeCycle.PHASE_SIXTEEN)

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
