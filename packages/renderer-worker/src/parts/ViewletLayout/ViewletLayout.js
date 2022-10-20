import * as Clamp from '../Clamp/Clamp.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SashType from '../SashType/SashType.js'
import { VError } from '../VError/VError.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as Preferences from '../Preferences/Preferences.js'

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

const mMain = {
  moduleId: ViewletModuleId.Main,
  kVisible: kMainVisible,
  kTop: kMainTop,
  kLeft: kMainLeft,
  kWidth: kMainWidth,
  kHeight: kMainHeight,
}

const mActivityBar = {
  moduleId: ViewletModuleId.ActivityBar,
  kVisible: kActivityBarVisible,
  kTop: kActivityBarTop,
  kLeft: kActivityBarLeft,
  kWidth: kActivityBarWidth,
  kHeight: kActivityBarHeight,
}

const mSideBar = {
  moduleId: ViewletModuleId.SideBar,
  kVisible: kSideBarVisible,
  kTop: kSideBarTop,
  kLeft: kSideBarLeft,
  kWidth: kSideBarWidth,
  kHeight: kSideBarHeight,
}

const mTitleBar = {
  moduleId: ViewletModuleId.TitleBar,
  kVisible: kTitleBarVisible,
  kTop: kTitleBarTop,
  kLeft: kTitleBarLeft,
  kWidth: kTitleBarWidth,
  kHeight: kTitleBarHeight,
}

const mStatusBar = {
  moduleId: ViewletModuleId.StatusBar,
  kVisible: kStatusBarVisible,
  kTop: kStatusBarTop,
  kLeft: kStatusBarLeft,
  kWidth: kStatusBarWidth,
  kHeight: kStatusBarHeight,
}

const mPanel = {
  moduleId: ViewletModuleId.Panel,
  kVisible: kPanelVisible,
  kTop: kpanelTop,
  kLeft: kPanelLeft,
  kWidth: kPanelWidth,
  kHeight: kPanelHeight,
}

export const name = 'Layout'

export const getPoints = (
  source,
  destination,
  sideBarLocation = SideBarLocationType.Right
) => {
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

  if (sideBarLocation === SideBarLocationType.Right) {
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
    p3 = p4
    if (panelVisible) {
      p3 -= newPanelHeight
    }
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
    destination[kMainHeight] = p3 - p2
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
  } else {
    const p1 = /* Top */ 0
    let p2 = /* End of Title Bar */ 0
    let p3 = /* End of Main */ 0
    let p4 = /* End of Panel */ 0
    const p5 = /* End of StatusBar */ windowHeight

    const p6 = /* Left */ 0
    let p7 = /* End of ActivityBar */ 0
    let p8 = /* End of SideBar */ 0
    const p9 = /* End of Main */ 0

    if (titleBarVisible) {
      p2 = titleBarHeight
    }
    if (statusBarVisible) {
      p4 = windowHeight - statusBarHeight
    }
    p3 = p4
    if (panelVisible) {
      p3 -= newPanelHeight
    }
    if (activityBarVisible) {
      p7 = activityBarWidth
    }
    if (sideBarVisible) {
      p8 = p7 + sideBarWidth
    }
    destination[kActivityBarLeft] = p6
    destination[kActivityBarTop] = p2
    destination[kActivityBarWidth] = 48
    destination[kActivityBarHeight] = p4 - p2
    destination[kActivityBarVisible] = activityBarVisible

    destination[kMainLeft] = p8
    destination[kMainTop] = p2
    destination[kMainWidth] = windowWidth - p8
    destination[kMainHeight] = p3 - p2
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
}

export const create = () => {
  return {
    points: new Uint16Array(kTotal),
    sideBarViewletId: '',
    [kSashId]: SashType.None,
    sideBarLocation: SideBarLocationType.Right,
  }
}

export const saveState = (state) => {
  const { points } = state
  const pointsArray = [...points]
  return {
    points: pointsArray,
  }
}

const getSideBarLocationType = () => {
  const location = Preferences.get('workbench.sideBarLocation')
  switch (location) {
    case 'left':
      return SideBarLocationType.Left
    default:
      return SideBarLocationType.Right
  }
}

export const loadContent = (state, savedState) => {
  const { Layout } = savedState
  const { bounds } = Layout
  const { windowWidth, windowHeight } = bounds
  const { points } = state
  const sideBarLocation = getSideBarLocationType()
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
  newPoints[kStatusBarHeight] = 20
  newPoints[kStatusBarVisible] = 1
  newPoints[kTitleBarHeight] = 20
  newPoints[kTitleBarVisible] = 1
  newPoints[kWindowHeight] = windowHeight
  newPoints[kWindowWidth] = windowWidth
  // TODO get side bar min width from preferences
  getPoints(newPoints, newPoints, sideBarLocation)
  return {
    ...state,
    points: newPoints,
    sideBarLocation,
  }
}

const show = async (state, module) => {
  const { points } = state
  const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId } = module
  const newPoints = new Uint16Array(points)
  newPoints[kVisible] = 1
  getPoints(newPoints, newPoints)
  const top = newPoints[kTop]
  const left = newPoints[kLeft]
  const width = newPoints[kWidth]
  const height = newPoints[kHeight]
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
  if (commands) {
    commands.push(['Viewlet.append', 'Layout', moduleId])
  }
  // TODO
  // - load that component
  // - if component is hidden now, return
  // - if component is still visible, render new component
  return {
    newState: {
      ...state,
      points: newPoints,
    },
    commands,
  }
}

const hide = (state, module) => {
  const { points } = state
  const { kVisible, moduleId } = module
  const newPoints = new Uint16Array(points)
  newPoints[kVisible] = 0
  getPoints(newPoints, newPoints)
  // TODO also resize other viewlets if necessary
  const commands = Viewlet.disposeFunctional(moduleId)
  const resizeCommands = getResizeCommands(points, newPoints)
  commands.push(...resizeCommands)
  return {
    newState: {
      ...state,
      points: newPoints,
    },
    commands,
  }
}

const toggle = (state, module) => {
  const { points } = state
  const { kVisible } = module
  if (points[kVisible]) {
    return hide(state, module)
  }
  return show(state, module)
}

export const showSideBar = (state) => {
  return show(state, mSideBar)
}

export const hideSideBar = (state) => {
  return hide(state, mSideBar)
}

export const toggleSideBar = (state) => {
  return toggle(state, mSideBar)
}

export const showPanel = (state) => {
  return show(state, mPanel)
}

export const hidePanel = (state) => {
  return hide(state, mPanel)
}

export const togglePanel = (state) => {
  return toggle(state, mPanel)
}

export const showActivityBar = (state) => {
  return show(state, mActivityBar)
}

export const hideActivityBar = (state) => {
  return hide(state, mActivityBar)
}

export const toggleActivityBar = (state) => {
  return toggle(state, mActivityBar)
}

export const showStatusBar = (state) => {
  return show(state, mStatusBar)
}

export const hideStatusBar = (state) => {
  return hide(state, mStatusBar)
}

export const toggleStatusBar = (state) => {
  return toggle(state, mStatusBar)
}

export const showTitleBar = (state) => {
  return show(state, mTitleBar)
}

export const hideTitleBar = (state) => {
  return hide(state, mTitleBar)
}

export const toggleTitleBar = (state) => {
  return toggle(state, mTitleBar)
}

export const showMain = (state) => {
  return show(state, mMain)
}

export const hideMain = (state) => {
  return hide(state, mMain)
}

export const toggleMain = (state) => {
  return toggle(state, mMain)
}

const getReferenceNodes = (sideBarLocation) => {
  if (sideBarLocation === SideBarLocationType.Left) {
    return [
      ViewletModuleId.TitleBar,
      ViewletModuleId.ActivityBar,
      'SashSideBar',
      ViewletModuleId.SideBar,
      ViewletModuleId.Main,
      'SashPanel',
      ViewletModuleId.Panel,
      ViewletModuleId.StatusBar,
    ]
  }
  return [
    ViewletModuleId.TitleBar,
    ViewletModuleId.Main,
    ViewletModuleId.SideBar,
    'SashSideBar',
    ViewletModuleId.ActivityBar,
    'SashPanel',
    ViewletModuleId.Panel,
    ViewletModuleId.StatusBar,
  ]
}

const loadIfVisible = async (state, module) => {
  const { points, sideBarLocation } = state
  const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId } = module
  const visible = points[kVisible]
  const top = points[kTop]
  const left = points[kLeft]
  const width = points[kWidth]
  const height = points[kHeight]
  let commands = []
  if (visible) {
    commands = await ViewletManager.load({
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
    if (commands) {
      const referenceNodes = getReferenceNodes(sideBarLocation)
      commands.push(['Viewlet.append', 'Layout', moduleId, referenceNodes])
    }
  }
  return {
    newState: state,
    commands,
  }
}

export const loadMainIfVisible = (state) => {
  return loadIfVisible(state, mMain)
}

export const loadSideBarIfVisible = (state) => {
  return loadIfVisible(state, mSideBar)
}

export const loadPanelIfVisible = (state) => {
  return loadIfVisible(state, mPanel)
}

export const loadActivityBarIfVisible = (state) => {
  return loadIfVisible(state, mActivityBar)
}

export const loadStatusBarIfVisible = (state) => {
  return loadIfVisible(state, mStatusBar)
}

export const loadTitleBarIfVisible = (state) => {
  return loadIfVisible(state, mTitleBar)
}

export const handleSashPointerDown = (state, sashId) => {
  return {
    ...state,
    [kSashId]: sashId,
  }
}

const getNewStatePointerMoveSideBar = (points, x, y) => {
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

const getNewStatePointerMovePanel = (points, x, y) => {
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

const getNewStatePointerMove = (sashId, points, x, y) => {
  switch (sashId) {
    case SashType.SideBar:
      return getNewStatePointerMoveSideBar(points, x, y)
    case SashType.Panel:
      return getNewStatePointerMovePanel(points, x, y)
    default:
      throw new Error(`unsupported sash type ${sashId}`)
  }
}

const isEqual = (oldPoints, newPoints, kTop, kLeft, kWidth, kHeight) => {
  return (
    oldPoints[kTop] === newPoints[kTop] &&
    oldPoints[kLeft] === newPoints[kLeft] &&
    oldPoints[kWidth] === newPoints[kWidth] &&
    oldPoints[kHeight] === newPoints[kHeight]
  )
}

const getResizeCommands = (oldPoints, newPoints) => {
  const modules = [mMain, mActivityBar, mSideBar, mTitleBar, mStatusBar, mPanel]
  const commands = []
  for (const module of modules) {
    const { kTop, kLeft, kWidth, kHeight, moduleId } = module
    if (!isEqual(oldPoints, newPoints, kTop, kLeft, kWidth, kHeight)) {
      const newTop = newPoints[kTop]
      const newLeft = newPoints[kLeft]
      const newWidth = newPoints[kWidth]
      const newHeight = newPoints[kHeight]
      const resizeCommands = Viewlet.resize(moduleId, {
        top: newTop,
        left: newLeft,
        width: newWidth,
        height: newHeight,
      })
      commands.push(...resizeCommands)
      commands.push([
        'Viewlet.setBounds',
        moduleId,
        newLeft,
        newTop,
        newWidth,
        newHeight,
      ])
    }
  }
  return commands
}

const showAsync = async (points, module) => {
  try {
    const { moduleId, kTop, kLeft, kWidth, kHeight } = module
    const commands = await ViewletManager.load({
      getModule: ViewletModule.load,
      id: moduleId,
      type: 0,
      // @ts-ignore
      uri: '',
      show: false,
      focus: false,
      top: points[kTop],
      left: points[kLeft],
      width: points[kWidth],
      height: points[kHeight],
    })
    if (commands) {
      commands.push(['Viewlet.append', 'Layout', moduleId])
    }
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
    // TODO
    // 2. load module
    // 3. if module is still visible, replace placeholder with actual viewlet
    // 4. else do nothing
  } catch (error) {
    throw new VError(error, `Failed to show ${module.moduleId}`)
  }
}

const showPlaceholder = (points, module) => {
  const { moduleId, kTop, kLeft, kWidth, kHeight } = module
  return [
    'Viewlet.createPlaceholder',
    /* id */ moduleId,
    /* parentId */ 'Layout',
    /* top */ points[kTop],
    /* left */ points[kLeft],
    /* width */ points[kWidth],
    /* height */ points[kHeight],
  ]
}

export const handleSashPointerMove = (state, x, y) => {
  const { points, sashId } = state
  const newPoints = getNewStatePointerMove(sashId, points, x, y)
  getPoints(newPoints, newPoints)
  // TODO resize commands, resize viewlets recursively
  const allCommands = getResizeCommands(points, newPoints)
  const newState = {
    ...state,
    points: newPoints,
  }
  if (points[kPanelVisible] !== newPoints[kPanelVisible]) {
    if (newPoints[kPanelVisible]) {
      showAsync(newPoints, mPanel) // TODO avoid side effect
      const commands = showPlaceholder(newPoints, mPanel)
      console.log({ commands })
      allCommands.push(commands)
    } else {
      const commands = Viewlet.disposeFunctional(ViewletModuleId.Panel)
      allCommands.push(...commands)
    }
  }
  if (points[kSideBarVisible] !== newPoints[kSideBarVisible]) {
    if (newPoints[kSideBarVisible]) {
      showAsync(newPoints, mPanel) // TODO avoid side effect
      const commands = showPlaceholder(newPoints, mSideBar)
      allCommands.push(commands)
    } else {
      const { commands } = hide(newState, mSideBar)
      allCommands.push(...commands)
    }
  }
  return {
    newState,
    commands: allCommands,
  }
}

export const handleResize = (state, windowWidth, windowHeight) => {
  const { points } = state
  const newPoints = new Uint16Array(points)
  newPoints[kWindowWidth] = windowWidth
  newPoints[kWindowHeight] = windowHeight
  getPoints(newPoints, newPoints)
  // TODO duplicate code with handleSashPointerMove
  const commands = getResizeCommands(points, newPoints)
  return {
    newState: {
      ...state,
      points: newPoints,
    },
    commands,
  }
}

const handleSashDoubleClickPanel = (state) => {
  const { points } = state
  if (points[kPanelVisible]) {
    const newPoints = new Uint16Array(points)
    newPoints[kPanelHeight] = 200
    getPoints(newPoints, newPoints)
    const commands = getResizeCommands(points, newPoints)
    return {
      newState: {
        ...state,
        points: newPoints,
      },
      commands,
    }
  }
  return {
    newState: state,
    commands: [],
  }
}

// TODO return commands and newState
const handleSashDoubleClickSideBar = (state) => {
  const { points } = state
  if (points[kSideBarVisible]) {
    const newPoints = new Uint16Array(points)
    newPoints[kSideBarWidth] = 240
    getPoints(newPoints, newPoints)
    const commands = getResizeCommands(points, newPoints)
    return {
      newState: {
        ...state,
        points: newPoints,
      },
      commands,
    }
  }
  return {
    newState: state,
    commands: [],
  }
}

export const handleSashDoubleClick = (state, sashId) => {
  switch (sashId) {
    case SashType.Panel:
      return handleSashDoubleClickPanel(state)
    case SashType.SideBar:
      return handleSashDoubleClickSideBar(state)
    default:
      throw new Error(`unsupported sash type ${sashId}`)
  }
}

export const isSideBarVisible = (state) => {
  const { points } = state
  return points[kSideBarVisible]
}

export const getInitialPlaceholderCommands = (state) => {
  const { points } = state
  const commands = []
  const modules = [mTitleBar, mMain, mSideBar, mActivityBar, mPanel, mStatusBar]
  for (const module of modules) {
    const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId } = module
    if (points[kVisible]) {
      commands.push([
        'Viewlet.createPlaceholder',
        moduleId,
        ViewletModuleId.Layout,
        points[kTop],
        points[kLeft],
        points[kWidth],
        points[kHeight],
      ])
    }
  }
  return commands
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
