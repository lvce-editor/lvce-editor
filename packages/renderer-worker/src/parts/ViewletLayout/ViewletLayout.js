import * as Clamp from '../Clamp/Clamp.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as SashType from '../SashType/SashType.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const kWindowWidth = 0
const kWindowHeight = 1

const kMainVisible = 2
const kMainTop = 3
const kMainLeft = 4
const kMainWidth = 5
const kMainHeight = 6

const kActivityBarVisible = 7
const kActivityBarTop = 8
const kActivityBarLeft = 9
const kActivityBarWidth = 10
const kActivityBarHeight = 11

const kSideBarVisible = 12
const kSideBarTop = 13
const kSideBarLeft = 14
const kSideBarWidth = 15
const kSideBarHeight = 16
const kSideBarMinWidth = 17
const kSideBarMaxWidth = 18

const kPanelVisible = 19
const kpanelTop = 20
const kPanelLeft = 21
const kPanelWidth = 22
const kPanelHeight = 23
const kPanelMinHeight = 24
const kPanelMaxHeight = 25

const kStatusBarVisible = 26
const kStatusBarTop = 27
const kStatusBarLeft = 28
const kStatusBarWidth = 29
const kStatusBarHeight = 30

const kTitleBarVisible = 31
const kTitleBarTop = 32
const kTitleBarLeft = 33
const kTitleBarWidth = 34
const kTitleBarHeight = 35

const kTotal = 36

const kSashId = 'sashId'

export const name = 'Layout'

export const getPoints = (source, destination) => {
  const activityBarVisible = source[kActivityBarVisible]
  const panelVisible = source[kPanelVisible]
  const sideBarVisible = source[kSideBarVisible]
  const statusBarVisible = source[kStatusBarVisible]
  const titleBarVisible = source[kTitleBarVisible]
  const windowWidth = source[kWindowWidth]
  const windowHeight = source[kWindowHeight]
  const sideBarMinWidth = source[kSideBarMinWidth]
  const sideBarMaxWidth = source[kSideBarMaxWidth]
  const panelMinHeight = source[kPanelMinHeight]
  const panelMaxHeight = source[kPanelMaxHeight]
  const titleBarHeight = source[kTitleBarHeight]
  const sideBarWidth = source[kSideBarWidth]
  const panelHeight = source[kPanelHeight]
  const activityBarWidth = source[kActivityBarWidth]
  const statusBarHeight = source[kStatusBarHeight]

  const newSideBarWidth = Clamp.clamp(
    sideBarWidth,
    sideBarMinWidth,
    sideBarMaxWidth
  )

  const newPanelHeight = Clamp.clamp(
    panelHeight,
    panelMinHeight,
    panelMaxHeight
  ) // TODO check that it is in bounds of window

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
  p3 = panelVisible ? p4 - newPanelHeight : p4
  if (activityBarVisible) {
    p8 = windowWidth - activityBarWidth
  }
  if (sideBarVisible) {
    p7 = p8 - newSideBarWidth
  }
  destination[kActivityBarLeft] = p8
  destination[kActivityBarTop] = p2
  destination[kActivityBarWidth] = 48
  destination[kActivityBarHeight] = p4 - p2
  destination[kActivityBarVisible] = activityBarVisible
  destination[kMainLeft] = p6
  destination[kMainTop] = p2
  destination[kMainWidth] = p7 - p6
  destination[kMainHeight] = p4 - p3
  destination[kMainVisible] = 1
  destination[kPanelLeft] = p6
  destination[kpanelTop] = p3
  destination[kPanelWidth] = p8 - p6
  destination[kPanelHeight] = p4 - p3
  destination[kPanelVisible] = panelVisible
  destination[kSideBarLeft] = p7
  destination[kSideBarTop] = p2
  destination[kSideBarWidth] = p8 - p7
  destination[kSideBarHeight] = p3 - p2
  destination[kSideBarVisible] = sideBarVisible
  destination[kStatusBarLeft] = p1
  destination[kStatusBarTop] = p4
  destination[kStatusBarWidth] = windowWidth
  destination[kStatusBarHeight] = 20
  destination[kStatusBarVisible] = statusBarVisible
  destination[kTitleBarLeft] = p6
  destination[kTitleBarTop] = p1
  destination[kTitleBarWidth] = windowWidth
  destination[kTitleBarHeight] = titleBarHeight
  destination[kTitleBarVisible] = titleBarVisible
}

export const create = () => {
  return {
    points: new Uint16Array(kTotal),
    [kSashId]: SashType.None,
  }
}

export const saveState = (state) => {
  const { points } = state
  const pointsArray = [...points]
  return {
    points: pointsArray,
  }
}

export const loadContent = (state, savedState) => {
  const { Layout } = savedState
  const { bounds } = Layout
  const { windowWidth, windowHeight } = bounds
  const { points } = state
  const newPoints = new Uint16Array(points)
  newPoints[kActivityBarVisible] = 1
  newPoints[kActivityBarWidth] = 48
  newPoints[kMainVisible] = 1
  newPoints[kPanelHeight] = 160
  newPoints[kPanelMaxHeight] = 600
  newPoints[kPanelMinHeight] = 150
  newPoints[kSideBarMaxWidth] = 9999999
  newPoints[kSideBarMinWidth] = 170
  newPoints[kSideBarVisible] = 1
  newPoints[kSideBarWidth] = 240
  newPoints[kWindowHeight] = windowHeight
  newPoints[kWindowWidth] = windowWidth
  newPoints[kTitleBarHeight] = 20
  newPoints[kTitleBarVisible] = 1
  newPoints[kStatusBarVisible] = 1
  // TODO get side bar min width from preferences
  getPoints(newPoints, newPoints)
  return {
    ...state,
    points: newPoints,
  }
}

const getDefaultTitleBarHeight = () => {
  // switch (Platform.platform) {
  //   case PlatformType.Electron:
  //     return 28
  //   default:
  //     return 20
  // }
}

const show = (state, key) => {
  const { points } = state
  const newPoints = new Uint16Array(points)
  newPoints[key] = 1
  getPoints(newPoints, newPoints)
  // TODO
  // - load that component
  // - if component is hidden now, return
  // - if component is still visible, render new component
  return {
    ...state,
    points: newPoints,
  }
}

const hide = (state, key) => {
  const { points } = state
  const newPoints = new Uint16Array(points)
  newPoints[key] = 0
  getPoints(newPoints, newPoints)
  return {
    ...state,
    points: newPoints,
  }
}

const toggle = (state, key) => {
  const { points } = state
  const newPoints = new Uint16Array(points)
  newPoints[key] = points[key] ? 0 : 1
  getPoints(newPoints, newPoints)
  return {
    ...state,
    points: newPoints,
  }
}

export const showSideBar = (state) => {
  return show(state, kSideBarVisible)
}

export const hideSideBar = (state) => {
  return hide(state, kSideBarVisible)
}

export const toggleSideBar = (state) => {
  return toggle(state, kSideBarVisible)
}

export const showPanel = (state) => {
  return show(state, kPanelVisible)
}

export const hidePanel = (state) => {
  return hide(state, kPanelVisible)
}

export const togglePanel = (state) => {
  return toggle(state, kPanelVisible)
}

export const showActivityBar = (state) => {
  return show(state, kActivityBarVisible)
}

export const hideActivityBar = (state) => {
  return hide(state, kActivityBarVisible)
}

export const toggleActivityBar = (state) => {
  return toggle(state, kActivityBarVisible)
}

export const showStatusBar = (state) => {
  return show(state, kStatusBarVisible)
}

export const hideStatusBar = (state) => {
  return hide(state, kStatusBarVisible)
}

export const toggleStatusBar = (state) => {
  return toggle(state, kStatusBarVisible)
}

export const showTitleBar = (state) => {
  return show(state, kTitleBarVisible)
}

export const hideTitleBar = (state) => {
  return hide(state, kTitleBarVisible)
}

export const toggleTitleBar = (state) => {
  return toggle(state, kTitleBarVisible)
}

export const showMain = (state) => {
  return show(state, kMainVisible)
}

export const hideMain = (state) => {
  return hide(state, kMainVisible)
}

export const toggleMain = (state) => {
  return toggle(state, kMainVisible)
}

const loadIfVisible = async (
  state,
  kVisible,
  kTop,
  kLeft,
  kWidth,
  kHeight,
  moduleId
) => {
  const { points } = state
  const visible = points[kVisible]
  const top = points[kTop]
  const left = points[kLeft]
  const width = points[kWidth]
  const height = points[kHeight]
  if (visible) {
    const commands = await ViewletManager.load({
      getModule: ViewletModule.load,
      id: moduleId,
      type: 0,
      // @ts-ignore
      uri: '',
      show: false,
      focus: false,
      top,
      left,
      width,
      height,
    })
    commands.push(['Viewlet.append', 'Layout', moduleId])
    await RendererProcess.invoke('Viewlet.executeCommands', commands)
  }
  return state
}

export const loadMainIfVisible = (state) => {
  return loadIfVisible(
    state,
    kMainVisible,
    kMainTop,
    kMainLeft,
    kMainWidth,
    kMainHeight,
    ViewletModuleId.Main
  )
}

export const loadSideBarIfVisible = (state) => {
  return loadIfVisible(
    state,
    kSideBarVisible,
    kSideBarTop,
    kSideBarLeft,
    kSideBarWidth,
    kSideBarHeight,
    ViewletModuleId.SideBar
  )
}

export const loadPanelIfVisible = (state) => {
  return loadIfVisible(
    state,
    kPanelVisible,
    kpanelTop,
    kPanelLeft,
    kPanelWidth,
    kPanelHeight,
    ViewletModuleId.Panel
  )
}

export const loadActivityBarIfVisible = (state) => {
  return loadIfVisible(
    state,
    kActivityBarVisible,
    kActivityBarTop,
    kActivityBarLeft,
    kMainWidth,
    kActivityBarHeight,
    ViewletModuleId.ActivityBar
  )
}

export const loadStatusBarIfVisible = (state) => {
  return loadIfVisible(
    state,
    kStatusBarVisible,
    kStatusBarTop,
    kStatusBarLeft,
    kStatusBarWidth,
    kStatusBarHeight,
    ViewletModuleId.StatusBar
  )
}

export const loadTitleBarIfVisible = (state) => {
  return loadIfVisible(
    state,
    kTitleBarVisible,
    kTitleBarTop,
    kTitleBarLeft,
    kTitleBarWidth,
    kTitleBarHeight,
    ViewletModuleId.TitleBar
  )
}

export const handleSashPointerDown = (state, sashId) => {
  return {
    ...state,
    [kSashId]: sashId,
  }
}

const getNewStatePointerMoveSideBar = (state, x, y) => {
  const { points } = state
  const windowWidth = points[kWindowWidth]
  const activityBarWidth = points[kActivityBarWidth]
  const sideBarMinWidth = points[kSideBarMinWidth]
  const newSideBarWidth = windowWidth - activityBarWidth - x
  const newPoints = new Uint16Array(points)
  if (newSideBarWidth <= sideBarMinWidth / 2) {
    newPoints[kSideBarVisible] = 0
    newPoints[kMainWidth] = windowWidth - activityBarWidth
  } else if (newSideBarWidth <= sideBarMinWidth) {
    newPoints[kSideBarWidth] = sideBarMinWidth
    newPoints[kMainWidth] = windowWidth - activityBarWidth - sideBarMinWidth
    newPoints[kSideBarLeft] = windowWidth - activityBarWidth - sideBarMinWidth
    newPoints[kSideBarVisible] = 1
  } else {
    newPoints[kSideBarVisible] = 1
    newPoints[kMainWidth] = x
    newPoints[kSideBarLeft] = x
    newPoints[kSideBarWidth] = newSideBarWidth
  }
  return newPoints
}

const getNewStatePointerMovePanel = (state, x, y) => {
  const { points } = state
  const windowHeight = points[kWindowHeight]
  const statusBarHeight = points[kStatusBarHeight]
  const titleBarHeight = points[kTitleBarHeight]
  const activityBarHeight = points[kActivityBarHeight]
  const panelMinHeight = points[kPanelMinHeight]
  const newPanelHeight = windowHeight - statusBarHeight - y
  const newPoints = new Uint16Array(points)
  if (newPanelHeight < panelMinHeight / 2) {
    newPoints[kPanelVisible] = 0
    newPoints[kMainHeight] = windowHeight - statusBarHeight - titleBarHeight
  } else if (newPanelHeight <= panelMinHeight) {
    newPoints[kPanelVisible] = 1
    newPoints[kPanelHeight] = panelMinHeight
    newPoints[kMainHeight] = windowHeight - activityBarHeight - panelMinHeight
  } else {
    newPoints[kPanelVisible] = 1
    newPoints[kMainHeight] = y - titleBarHeight
    newPoints[kpanelTop] = y
    newPoints[kPanelHeight] = windowHeight - statusBarHeight - y
  }
  return newPoints
}

const getNewStatePointerMove = (state, x, y) => {
  switch (state[kSashId]) {
    case SashType.SideBar:
      return getNewStatePointerMoveSideBar(state, x, y)
    case SashType.Panel:
      return getNewStatePointerMovePanel(state, x, y)
    default:
      throw new Error(`unsupported sash type ${state[kSashId]}`)
  }
}

export const handleSashPointerMove = (state, x, y) => {
  const newPoints = getNewStatePointerMove(state, x, y)
  getPoints(newPoints, newPoints)
  // TODO resize commands, resize viewlets recursively
  return {
    ...state,
    points: newPoints,
  }
}

export const hasFunctionalRender = true

const renderSashes = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const { points } = newState
    const sideBarLeft = points[kSideBarLeft]
    const sideBarTop = points[kSideBarTop]
    const sideBarHeight = points[kSideBarHeight]
    const panelTop = points[kpanelTop]
    const panelLeft = points[kPanelLeft]
    const panelWidth = points[kPanelWidth]
    return [
      'Viewlet.send',
      'Layout',
      'setSashes',
      {
        id: 'SashSideBar',
        top: sideBarTop,
        left: sideBarLeft,
        width: 2,
        height: sideBarHeight,
        direction: 'horizontal',
      },
      {
        id: 'SashPanel',
        top: panelTop,
        left: panelLeft,
        width: panelWidth,
        height: 2,
        direction: 'vertical',
      },
    ]
  },
}

export const render = [renderSashes]
