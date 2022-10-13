import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SashType from '../SashType/SashType.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'

// TODO where to force rendering of contents (need to call sidebar.openViewlet somewhere)

export const state = {
  activityBarLeft: 0,
  activityBarTop: 0,
  activityBarWidth: 48,
  activityBarHeight: 0,
  activityBarVisible: true,
  mainLeft: 0,
  mainTop: 0,
  mainWidth: 0,
  mainHeight: 0,
  mainVisible: true,
  panelLeft: 0,
  panelTop: 0,
  panelWidth: 0,
  panelHeight: 160,
  panelVisible: false,
  sideBarLeft: 0,
  sideBarTop: 0,
  sideBarWidth: 240,
  sideBarHeight: 0,
  sideBarVisible: true,
  statusBarLeft: 0,
  statusBarTop: 0,
  statusBarWidth: 0,
  statusBarHeight: 0,
  statusBarVisible: true,
  titleBarLeft: 0,
  titleBarTop: 0,
  titleBarWidth: 0,
  titleBarHeight: 0,
  titleBarVisible: true,
  windowWidth: 0,
  windowHeight: 0,
  sashId: '',
}

const SIDE_BAR_MIN_WIDTH = 170
const SIDE_BAR_MAX_WIDTH = Number.POSITIVE_INFINITY
const PANEL_MIN_HEIGHT = 150
const PANEL_MAX_HEIGHT = 600

const clamp = (min, max, value) => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const getDefaultTitleBarHeight = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return 28
    default:
      return 20
  }
}

export const getPoints = (layout, bounds) => {
  const windowWidth = bounds.windowWidth
  const windowHeight = bounds.windowHeight
  const titleBarHeight = bounds.titleBarHeight || getDefaultTitleBarHeight()

  const activityBarVisible = layout.activityBarVisible
  const panelVisible = layout.panelVisible
  const sideBarVisible = layout.sideBarVisible
  const statusBarVisible = layout.statusBarVisible
  const titleBarVisible = layout.titleBarVisible

  const activityBarWidth = 48 // TODO put magic numbers somewhere
  const sideBarWidth = clamp(
    SIDE_BAR_MIN_WIDTH,
    SIDE_BAR_MAX_WIDTH,
    layout.sideBarWidth
  )

  const panelHeight = clamp(
    PANEL_MIN_HEIGHT,
    PANEL_MAX_HEIGHT,
    layout.panelHeight
  ) // TODO check that it is in bounds of window
  const statusBarHeight = 20

  const p1 = /* Top */ 0
  let p2 = /* End of Title Bar */ 0
  let p3 = /* End of Main */ 0
  let p4 = /* End of Panel */ 0
  const p5 = /* End of StatusBar */ windowHeight

  const p6 = /* Left */ 0
  let p7 = /* End of Main */ windowWidth - activityBarWidth
  let p8 = /* End of SideBar */ windowWidth
  const p9 = /* End of ActivityBar */ windowWidth
  if (titleBarVisible) {
    p2 = titleBarHeight
  }
  if (statusBarVisible) {
    p4 = windowHeight - statusBarHeight
  }
  p3 = panelVisible ? p4 - panelHeight : p4
  if (activityBarVisible) {
    p8 = windowWidth - activityBarWidth
  }
  if (sideBarVisible) {
    p7 = p8 - sideBarWidth
  }
  return {
    activityBarLeft: p8,
    activityBarTop: p2,
    activityBarWidth: 48,
    activityBarHeight: p4 - p2,
    activityBarVisible,
    mainLeft: p6,
    mainTop: p2,
    mainWidth: p7 - p6,
    mainHeight: p3 - p2,
    mainVisible: true,
    panelLeft: p6,
    panelTop: p3,
    panelWidth: p8 - p6,
    panelHeight: p4 - p3,
    panelVisible,
    sideBarLeft: p7,
    sideBarTop: p2,
    sideBarWidth: p8 - p7,
    sideBarHeight: p3 - p2,
    sideBarVisible,
    statusBarLeft: p1,
    statusBarTop: p4,
    statusBarWidth: windowWidth,
    statusBarHeight: 20,
    statusBarVisible,
    titleBarLeft: p6,
    titleBarTop: p1,
    titleBarWidth: windowWidth,
    titleBarHeight,
    titleBarVisible: true,
    windowWidth,
    windowHeight,
  }
}

export const updateLayout = async (layout) => {
  const points = getPoints(layout, state)
  Object.assign(state, points)
  RendererProcess.invoke(
    /* Layout.update */ 'Layout.update',
    /* points */ points
  )
  await Command.execute(
    /* LocalStorage.setJson */ 'LocalStorage.setJson',
    /* key */ 'layout',
    /* value */ state
  )
}

const getDimensions = (state, id) => {
  switch (id) {
    case 'Main':
      return {
        top: state.mainTop,
        left: state.mainLeft,
        width: state.mainWidth,
        height: state.mainHeight,
      }
    case 'SideBar':
      return {
        top: state.sideBarTop,
        left: state.sideBarLeft,
        width: state.sideBarWidth,
        height: state.sideBarHeight,
      }
    case 'TitleBar':
      return {
        top: state.titleBarTop,
        left: state.titleBarLeft,
        width: state.titleBarWidth,
        height: state.titleBarHeight,
      }
    case 'Panel':
      return {
        top: state.panelTop,
        left: state.panelLeft,
        width: state.panelWidth,
        height: state.panelHeight,
      }
    case 'StatusBar':
      return {
        top: state.statusBarTop,
        left: state.statusBarLeft,
        width: state.statusBarWidth,
        height: state.statusBarHeight,
      }
    case 'ActivityBar':
      return {
        top: state.activityBarTop,
        left: state.activityBarLeft,
        width: state.activityBarWidth,
        height: state.activityBarHeight,
      }
    default:
      throw new Error('unexpected component')
  }
}

const show = async (key, id) => {
  updateLayout({
    ...state,
    [key]: true,
  })
  const dimensions = getDimensions(state, id)
  const instance = ViewletManager.create(
    ViewletModule.load,
    id,
    '',
    'builtin://',
    dimensions.left,
    dimensions.top,
    dimensions.width,
    dimensions.height
  )
  return ViewletManager.load(instance, /* focus */ false, /* restore */ true)
}

const hide = async (key, id) => {
  updateLayout({
    ...state,
    [key]: false,
  })
  await Command.execute('SaveState.handleVisibilityChange', 'hidden')
  await Viewlet.dispose(id)
}

const toggle = async (key, id) => {
  await (state[key] ? hide(key, id) : show(key, id))
}

// TODO replace with one method in renderer process: setSideBarVisibility(true|false)
export const showSideBar = async () => {
  await show('sideBarVisible', 'SideBar')
}

export const hideSideBar = async () => {
  await hide('sideBarVisible', 'SideBar')
}

export const toggleSideBar = async () => {
  await toggle('sideBarVisible', 'SideBar')
}

// TODO replace with one method in renderer process: setPanelVisible(true|false)

export const showPanel = async () => {
  await show('panelVisible', 'Panel')
}

export const hidePanel = async () => {
  await hide('panelVisible', 'Panel')
}

export const togglePanel = async () => {
  await toggle('panelVisible', 'Panel')
}

export const showMain = async () => {
  await show('mainVisible', 'Main')
}

export const togglePart = (partId) => {
  switch (partId) {
    case /* SideBar */ 1:
      toggleSideBar()
      break
    case /* Panel */ 2:
      togglePanel()
      break
    default:
      break
  }
}

export const isPanelVisible = () => {
  return state.panelVisible
}

export const isSideBarVisible = () => {
  return state.sideBarVisible
}

export const isVisible = (partId) => {
  switch (partId) {
    case /* SideBar */ 1:
      return isSideBarVisible()
    case /* Panel */ 2:
      return isPanelVisible()
    default:
      return false
  }
}

// TODO replace with one method in renderer process: setActivityBarVisible(true|false)

export const showActivityBar = async () => {
  await show('activityBarVisible', 'ActivityBar')
}

export const hideActivityBar = async () => {
  await hide('activityBarVisible', 'ActivityBar')
}

export const toggleActivityBar = async () => {
  await toggle('activityBarVisible', 'ActivityBar')
}

export const showStatusBar = async () => {
  await show('statusBarVisible', 'StatusBar')
}

export const hideStatusBar = async () => {
  await hide('statusBarVisible', 'StatusBar')
}

export const toggleStatusBar = async () => {
  await toggle('statusBarVisible', 'StatusBar')
}

export const showTitleBar = async () => {
  await show('titleBarVisible', 'TitleBar')
}

export const hideTitleBar = async () => {
  await hide('titleBarVisible', 'TitleBar')
}

export const toggleTitleBar = async () => {
  await toggle('titleBarVisible', 'TitleBar')
}

const getBounds = async () => {
  return RendererProcess.invoke(/* Layout.getBounds */ 'Layout.getBounds')
}

const getInitialLayout = async () => {
  // TODO this is very similar to state
  const cachedLayout = await Command.execute(
    /* LocalStorage.getJson */ 'LocalStorage.getJson',
    /* key */ 'layout'
  )
  if (cachedLayout) {
    return cachedLayout
  }
  return state
}

export const hydrate = async (initData) => {
  const windowBounds = initData.Layout.bounds
  const initialLayout = initData.layout ? JSON.parse(initData.layout) : state
  const points = getPoints(initialLayout, windowBounds)
  Object.assign(state, points)
  await RendererProcess.invoke(
    /* Layout.show */ 'Layout.show',
    /* points */ points
  )
}

const isChild = (id) => {
  return (
    id === 'Main' ||
    id === 'SideBar' ||
    id === 'ActivityBar' ||
    id === 'Panel' ||
    id === 'TitleBar'
  )
}

export const handleSashPointerDown = (id) => {
  state.sashId = id
  console.log({ id })
}

const getNewStatePointerMoveSideBar = (state, x, y) => {
  const {
    windowWidth,
    activityBarWidth,
    windowHeight,
    statusBarHeight,
    titleBarHeight,
    activityBarHeight,
  } = state
  const newSideBarWidth = windowWidth - activityBarWidth - x
  if (newSideBarWidth <= SIDE_BAR_MIN_WIDTH / 2) {
    return {
      ...state,
      sideBarVisible: false,
      mainWidth: windowWidth - activityBarWidth,
    }
  }
  if (newSideBarWidth <= SIDE_BAR_MIN_WIDTH) {
    return {
      ...state,
      sideBarWidth: SIDE_BAR_MIN_WIDTH,
      mainWidth: windowWidth - state.activityBarWidth - SIDE_BAR_MIN_WIDTH,
      sideBarLeft: windowWidth - activityBarWidth - SIDE_BAR_MIN_WIDTH,
      sideBarVisible: true,
    }
  }
  return {
    ...state,
    sideBarVisible: true,
    mainWidth: x,
    sideBarLeft: x,
    sideBarWidth: newSideBarWidth,
  }
}

const getNewStatePointerMovePanel = (state, x, y) => {
  const {
    windowWidth,
    activityBarWidth,
    windowHeight,
    statusBarHeight,
    titleBarHeight,
    activityBarHeight,
  } = state
  const newPanelHeight = windowHeight - statusBarHeight - y
  if (newPanelHeight < PANEL_MIN_HEIGHT / 2) {
    return {
      ...state,
      panelVisible: false,
      mainHeight: windowHeight - statusBarHeight - titleBarHeight,
    }
  }
  if (newPanelHeight <= PANEL_MIN_HEIGHT) {
    return {
      ...state,
      panelVisible: true,
      panelHeight: PANEL_MIN_HEIGHT,
      mainHeight: windowHeight - activityBarHeight - PANEL_MIN_HEIGHT,
    }
  }
  return {
    ...state,
    panelVisible: true,
    mainHeight: y - titleBarHeight,
    panelTop: y,
    panelHeight: windowHeight - statusBarHeight - y,
  }
}

const getNewStatePointerMove = (state, x, y) => {
  switch (state.sashId) {
    case SashType.SideBar:
      return getNewStatePointerMoveSideBar(state, x, y)
    case SashType.Panel:
      return getNewStatePointerMovePanel(state, x, y)
    default:
      throw new Error(`unsupported sash type ${state.sashId}`)
  }
}

// TODO make this functional
export const handleSashPointerMove = async (x, y) => {
  const newState = getNewStatePointerMove(state, x, y)
  await updateLayout(newState)
}

// TODO a bit unnecessary to send the same layout very often, but it avoids keeping state in renderer process
export const handleResize = async (bounds) => {
  const points = getPoints(state, bounds)
  Object.assign(state, points)
  await RendererProcess.invoke(
    /* Layout.update */ 'Layout.update',
    /* points */ points
  )
  const ids = ['Main', 'ActivityBar', 'SideBar', 'TitleBar', 'StatusBar']
  const resizeInstance = (id) => {
    const dimensions = getDimensions(state, id)
    return Viewlet.resize(id, dimensions)
  }
  const commands = ids.flatMap(resizeInstance)
  if (commands.length === 0) {
    return
  }
  // TODO send the whole batch at once
  for (const command of commands) {
    RendererProcess.invoke(...command)
  }
}
