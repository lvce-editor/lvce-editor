import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.js'
import * as Command from '../Command/Command.js'
import * as GetDefaultTitleBarHeight from '../GetDefaultTitleBarHeight/GetDefaultTitleBarHeight.js'
import * as Id from '../Id/Id.js'
import * as LayoutKeys from '../LayoutKeys/LayoutKeys.js'
import * as LayoutModules from '../LayoutModules/LayoutModules.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SashType from '../SashType/SashType.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import { VError } from '../VError/VError.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getPoints = (source, destination, sideBarLocation = SideBarLocationType.Right) => {
  const activityBarVisible = source[LayoutKeys.ActivityBarVisible]
  const panelVisible = source[LayoutKeys.PanelVisible]
  const sideBarVisible = source[LayoutKeys.SideBarVisible]
  const statusBarVisible = source[LayoutKeys.StatusBarVisible]
  const titleBarVisible = source[LayoutKeys.TitleBarVisible]
  const previewVisible = source[LayoutKeys.PreviewVisible]
  const windowWidth = source[LayoutKeys.WindowWidth]
  const windowHeight = source[LayoutKeys.WindowHeight]
  const sideBarMinWidth = source[LayoutKeys.SideBarMinWidth]
  const sideBarMaxWidth = source[LayoutKeys.SideBarMaxWidth]
  const panelMinHeight = source[LayoutKeys.PanelMinHeight]
  const previewMinHeight = source[LayoutKeys.PreviewMinHeight]
  const previewMaxHeight = source[LayoutKeys.PreviewMaxHeight]
  const panelMaxHeight = source[LayoutKeys.PanelMaxHeight]
  const titleBarHeight = source[LayoutKeys.TitleBarHeight]
  const sideBarWidth = source[LayoutKeys.SideBarWidth]
  const panelHeight = source[LayoutKeys.PanelHeight]
  const activityBarWidth = source[LayoutKeys.ActivityBarWidth]
  const statusBarHeight = source[LayoutKeys.StatusBarHeight]
  const previewHeight = source[LayoutKeys.PreviewHeight]
  const previewWidth = source[LayoutKeys.PreviewWidth]
  const previewMinWidth = source[LayoutKeys.PreviewMinWidth]
  const previewMaxWidth = source[LayoutKeys.PreviewMaxWidth]

  const newSideBarWidth = Clamp.clamp(sideBarWidth, sideBarMinWidth, sideBarMaxWidth)
  const newPreviewHeight = Clamp.clamp(previewHeight, previewMinHeight, previewMaxHeight)
  const newPreviewWidth = Clamp.clamp(previewWidth, previewMinWidth, previewMaxWidth)
  const newPanelHeight = Clamp.clamp(panelHeight, panelMinHeight, panelMaxHeight) // TODO check that it is in bounds of window

  if (sideBarLocation === SideBarLocationType.Right) {
    const p1 = /* Top */ 0
    let p2 = /* End of Title Bar */ 0
    let p25 /* End of SideBar */ = 0
    let p3 = /* End of Main */ 0
    let p4 = /* End of Panel */ 0
    // @ts-ignore
    const p5 = /* End of StatusBar */ windowHeight

    const p6 = /* Left */ 0
    let p65 /* Start of Preview */ = 0
    let p7 = /* End of Main */ windowWidth - activityBarWidth
    let p8 = /* End of SideBar */ windowWidth
    // @ts-ignore
    const p9 = /* End of ActivityBar */ windowWidth

    if (titleBarVisible) {
      p2 = titleBarHeight
    }
    if (statusBarVisible) {
      p4 = windowHeight - statusBarHeight
    }
    if (previewVisible) {
      p25 = Math.max(p4 - previewHeight, 300)
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
    if (previewVisible) {
      p65 = Math.max(p7 - previewWidth, 300)
    }
    destination[LayoutKeys.ActivityBarLeft] = p8
    destination[LayoutKeys.ActivityBarTop] = p2
    destination[LayoutKeys.ActivityBarWidth] = 48
    destination[LayoutKeys.ActivityBarHeight] = p4 - p2
    destination[LayoutKeys.ActivityBarVisible] = activityBarVisible

    destination[LayoutKeys.MainLeft] = p6
    destination[LayoutKeys.MainTop] = p2
    destination[LayoutKeys.MainWidth] = p7 - p6
    destination[LayoutKeys.MainHeight] = p3 - p2
    destination[LayoutKeys.MainVisible] = 1

    destination[LayoutKeys.PanelLeft] = p6
    destination[LayoutKeys.panelTop] = p3
    destination[LayoutKeys.PanelWidth] = p8 - p6
    destination[LayoutKeys.PanelHeight] = p4 - p3
    destination[LayoutKeys.PanelVisible] = panelVisible

    destination[LayoutKeys.SideBarLeft] = p7
    destination[LayoutKeys.SideBarTop] = p2
    destination[LayoutKeys.SideBarWidth] = p8 - p7
    destination[LayoutKeys.SideBarHeight] = p3 - p2
    destination[LayoutKeys.SideBarVisible] = sideBarVisible

    destination[LayoutKeys.StatusBarLeft] = p1
    destination[LayoutKeys.StatusBarTop] = p4
    destination[LayoutKeys.StatusBarWidth] = windowWidth
    destination[LayoutKeys.StatusBarHeight] = 20
    destination[LayoutKeys.StatusBarVisible] = statusBarVisible

    destination[LayoutKeys.TitleBarLeft] = p6
    destination[LayoutKeys.TitleBarTop] = p1
    destination[LayoutKeys.TitleBarWidth] = windowWidth
    destination[LayoutKeys.TitleBarHeight] = GetDefaultTitleBarHeight.getDefaultTitleBarHeight()
    destination[LayoutKeys.TitleBarVisible] = titleBarVisible

    destination[LayoutKeys.PreviewLeft] = p65
    destination[LayoutKeys.PreviewTop] = p25
    destination[LayoutKeys.PreviewWidth] = newPreviewWidth
    destination[LayoutKeys.PreviewHeight] = newPreviewHeight
    destination[LayoutKeys.PreviewVisible] = previewVisible
  } else {
    const p1 = /* Top */ 0
    let p2 = /* End of Title Bar */ 0
    let p3 = /* End of Main */ 0
    let p4 = /* End of Panel */ 0
    // @ts-ignore
    const p5 = /* End of StatusBar */ windowHeight

    const p6 = /* Left */ 0
    let p7 = /* End of ActivityBar */ 0
    let p8 = /* End of SideBar */ 0
    // @ts-ignore
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
    destination[LayoutKeys.ActivityBarLeft] = p6
    destination[LayoutKeys.ActivityBarTop] = p2
    destination[LayoutKeys.ActivityBarWidth] = 48
    destination[LayoutKeys.ActivityBarHeight] = p4 - p2
    destination[LayoutKeys.ActivityBarVisible] = activityBarVisible

    destination[LayoutKeys.MainLeft] = p8
    destination[LayoutKeys.MainTop] = p2
    destination[LayoutKeys.MainWidth] = windowWidth - p8
    destination[LayoutKeys.MainHeight] = p3 - p2
    destination[LayoutKeys.MainVisible] = 1

    destination[LayoutKeys.PanelLeft] = p6
    destination[LayoutKeys.panelTop] = p3
    destination[LayoutKeys.PanelWidth] = p8 - p6
    destination[LayoutKeys.PanelHeight] = p4 - p3
    destination[LayoutKeys.PanelVisible] = panelVisible

    destination[LayoutKeys.SideBarLeft] = p7
    destination[LayoutKeys.SideBarTop] = p2
    destination[LayoutKeys.SideBarWidth] = p8 - p7
    destination[LayoutKeys.SideBarHeight] = p3 - p2
    destination[LayoutKeys.SideBarVisible] = sideBarVisible

    destination[LayoutKeys.StatusBarLeft] = p1
    destination[LayoutKeys.StatusBarTop] = p4
    destination[LayoutKeys.StatusBarWidth] = windowWidth
    destination[LayoutKeys.StatusBarHeight] = 20
    destination[LayoutKeys.StatusBarVisible] = statusBarVisible

    destination[LayoutKeys.TitleBarLeft] = p6
    destination[LayoutKeys.TitleBarTop] = p1
    destination[LayoutKeys.TitleBarWidth] = windowWidth
    destination[LayoutKeys.TitleBarHeight] = titleBarHeight
    destination[LayoutKeys.TitleBarVisible] = titleBarVisible

    destination[LayoutKeys.PreviewLeft] = windowWidth / 2
    destination[LayoutKeys.PreviewTop] = windowHeight / 2
    destination[LayoutKeys.PreviewWidth] = windowWidth / 2
    destination[LayoutKeys.PreviewHeight] = windowHeight / 3
    destination[LayoutKeys.PreviewVisible] = previewVisible
  }
}

export const create = (id) => {
  Assert.number(id)
  return {
    points: new Uint16Array(LayoutKeys.Total),
    sideBarViewletId: '',
    [LayoutKeys.SashId]: SashType.None,
    sideBarLocation: SideBarLocationType.Right,
    uid: id,
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

const getSavedPoints = (savedState) => {
  if (savedState && savedState.points) {
    const { points } = savedState
    if (Array.isArray(points) && points.length === LayoutKeys.Total) {
      return new Uint16Array(points)
    }
  }
  return new Uint16Array(LayoutKeys.Total)
}

const isNativeTitleBarStyle = () => {
  return Platform.platform === PlatformType.Electron && Preferences.get('window.titleBarStyle') === 'native'
}
export const loadContent = (state, savedState) => {
  const { Layout } = savedState
  const { bounds } = Layout
  const { windowWidth, windowHeight } = bounds
  const sideBarLocation = getSideBarLocationType()
  const newPoints = getSavedPoints(savedState)
  newPoints[LayoutKeys.ActivityBarVisible] = 1
  newPoints[LayoutKeys.ActivityBarWidth] = 48
  newPoints[LayoutKeys.MainVisible] = 1
  newPoints[LayoutKeys.PanelHeight] ||= 160
  newPoints[LayoutKeys.PanelMaxHeight] = 600
  newPoints[LayoutKeys.PanelMinHeight] = 150
  newPoints[LayoutKeys.SideBarMaxWidth] = 9999999
  newPoints[LayoutKeys.SideBarMinWidth] = 170
  newPoints[LayoutKeys.SideBarVisible] = 1
  newPoints[LayoutKeys.SideBarWidth] ||= 240
  newPoints[LayoutKeys.StatusBarHeight] = 20
  newPoints[LayoutKeys.StatusBarVisible] = 1
  newPoints[LayoutKeys.PreviewHeight] ||= 350
  newPoints[LayoutKeys.PreviewMinHeight] = Math.max(200, windowHeight / 2)
  newPoints[LayoutKeys.PreviewMaxHeight] = 1200
  newPoints[LayoutKeys.PreviewWidth] ||= 600
  newPoints[LayoutKeys.PreviewMinWidth] = 100
  newPoints[LayoutKeys.PreviewMaxWidth] = Math.max(1800, windowWidth / 2)
  if (isNativeTitleBarStyle()) {
    newPoints[LayoutKeys.TitleBarHeight] = 0
    newPoints[LayoutKeys.TitleBarVisible] = 0
  } else {
    newPoints[LayoutKeys.TitleBarHeight] = GetDefaultTitleBarHeight.getDefaultTitleBarHeight()
    newPoints[LayoutKeys.TitleBarVisible] = 1
  }
  newPoints[LayoutKeys.WindowHeight] = windowHeight
  newPoints[LayoutKeys.WindowWidth] = windowWidth
  // TODO get side bar min width from preferences
  getPoints(newPoints, newPoints, sideBarLocation)
  return {
    ...state,
    points: newPoints,
    sideBarLocation,
  }
}

const show = async (state, module, currentViewletId) => {
  const { points } = state
  const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId } = module
  const newPoints = new Uint16Array(points)
  newPoints[kVisible] = 1
  getPoints(newPoints, newPoints)
  const x = newPoints[kTop]
  const y = newPoints[kLeft]
  const width = newPoints[kWidth]
  const height = newPoints[kHeight]
  const uid = state.uid
  const childUid = Id.create()
  const commands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id: moduleId,
      type: 0,
      // @ts-ignore
      uri: '',
      show: false,
      focus: false,
      x,
      y,
      width,
      height,
      parentUid: uid,
      uid: childUid,
    },
    false,
    true,
    undefined,
  )
  if (commands) {
    commands.push(['Viewlet.append', uid, childUid])
  }
  const resizeCommands = await getResizeCommands(points, newPoints)
  commands.push(...resizeCommands)
  return {
    newState: {
      ...state,
      points: newPoints,
    },
    commands,
  }
}

const hide = async (state, module) => {
  const { points } = state
  const { kVisible, moduleId } = module
  const newPoints = new Uint16Array(points)
  newPoints[kVisible] = 0
  getPoints(newPoints, newPoints)
  // TODO save state to local storage after rending (in background)
  await SaveState.saveViewletState(moduleId)
  // TODO also resize other viewlets if necessary
  const instanceState = ViewletStates.getState(moduleId)
  const commands = Viewlet.disposeFunctional(instanceState.uid)
  const resizeCommands = await getResizeCommands(points, newPoints)
  commands.push(...resizeCommands)
  return {
    newState: {
      ...state,
      points: newPoints,
    },
    commands,
  }
}

const toggle = (state, module, moduleId) => {
  const { points } = state
  const { kVisible } = module
  if (points[kVisible]) {
    return hide(state, module)
  }
  return show(state, module, moduleId)
}

export const showSideBar = (state) => {
  return show(state, LayoutModules.SideBar)
}

export const hideSideBar = (state) => {
  return hide(state, LayoutModules.SideBar)
}

export const toggleSideBar = (state) => {
  return toggle(state, LayoutModules.SideBar)
}

export const showPanel = (state) => {
  return show(state, LayoutModules.Panel)
}

export const hidePanel = (state) => {
  return hide(state, LayoutModules.Panel)
}

export const togglePanel = (state, moduleId = ViewletModuleId.None) => {
  return toggle(state, LayoutModules.Panel, moduleId)
}

export const showActivityBar = (state) => {
  return show(state, LayoutModules.ActivityBar)
}

export const hideActivityBar = (state) => {
  return hide(state, LayoutModules.ActivityBar)
}

export const toggleActivityBar = (state) => {
  return toggle(state, LayoutModules.ActivityBar)
}

export const showStatusBar = (state) => {
  return show(state, LayoutModules.StatusBar)
}

export const hideStatusBar = (state) => {
  return hide(state, LayoutModules.StatusBar)
}

export const toggleStatusBar = (state) => {
  return toggle(state, LayoutModules.StatusBar)
}

export const showPreview = (state) => {
  return show(state, LayoutModules.Preview)
}

export const hidePreview = (state) => {
  return hide(state, LayoutModules.Preview)
}

export const togglePreview = (state) => {
  return toggle(state, LayoutModules.Preview)
}

export const showTitleBar = (state) => {
  return show(state, LayoutModules.TitleBar)
}

export const hideTitleBar = (state) => {
  return hide(state, LayoutModules.TitleBar)
}

export const toggleTitleBar = (state) => {
  return toggle(state, LayoutModules.TitleBar)
}

export const showMain = (state) => {
  return show(state, LayoutModules.Main)
}

export const hideMain = (state) => {
  return hide(state, LayoutModules.Main)
}

export const toggleMain = (state) => {
  return toggle(state, LayoutModules.Main)
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
  try {
    const { points, sideBarLocation } = state
    const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId } = module
    const visible = points[kVisible]
    const x = points[kLeft]
    const y = points[kTop]
    const width = points[kWidth]
    const height = points[kHeight]
    let commands = []
    const parentUid = state.uid
    if (visible) {
      const childUid = Id.create()
      commands = await ViewletManager.load(
        {
          getModule: ViewletModule.load,
          id: moduleId,
          type: 0,
          // @ts-ignore
          uri: '',
          show: false,
          focus: false,
          x,
          y,
          width,
          height,
          uid: childUid,
        },
        false,
        true,
      )
      if (commands) {
        const referenceNodes = getReferenceNodes(sideBarLocation)
        commands.push(['Viewlet.append', parentUid, childUid, referenceNodes])
      }
    }
    return {
      newState: state,
      commands,
    }
  } catch (error) {
    throw new VError(error, `Failed to load ${module.moduleId}`)
  }
}

export const loadMainIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.Main)
}

export const loadSideBarIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.SideBar)
}

export const loadPanelIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.Panel)
}

export const loadActivityBarIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.ActivityBar)
}

export const loadStatusBarIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.StatusBar)
}

export const loadTitleBarIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.TitleBar)
}

export const loadPreviewIfVisible = (state) => {
  return loadIfVisible(state, LayoutModules.Preview)
}

export const handleSashPointerDown = (state, sashId) => {
  const newState = {
    ...state,
    [LayoutKeys.SashId]: sashId,
  }
  const commands = []
  return {
    newState,
    commands,
  }
}

export const handleSashPointerUp = (state, sashId) => {
  const newState = {
    ...state,
    [LayoutKeys.SashId]: '',
  }
  const commands = []
  return {
    newState,
    commands,
  }
}

const getNewStatePointerMoveSideBar = (points, x, y) => {
  const windowWidth = points[LayoutKeys.WindowWidth]
  const activityBarWidth = points[LayoutKeys.ActivityBarWidth]
  const sideBarMinWidth = points[LayoutKeys.SideBarMinWidth]
  const newSideBarWidth = windowWidth - activityBarWidth - x
  const newPoints = new Uint16Array(points)
  if (newSideBarWidth <= sideBarMinWidth / 2) {
    newPoints[LayoutKeys.SideBarVisible] = 0
    newPoints[LayoutKeys.MainWidth] = windowWidth - activityBarWidth
  } else if (newSideBarWidth <= sideBarMinWidth) {
    newPoints[LayoutKeys.SideBarWidth] = sideBarMinWidth
    newPoints[LayoutKeys.MainWidth] = windowWidth - activityBarWidth - sideBarMinWidth
    newPoints[LayoutKeys.SideBarLeft] = windowWidth - activityBarWidth - sideBarMinWidth
    newPoints[LayoutKeys.SideBarVisible] = 1
  } else {
    newPoints[LayoutKeys.SideBarVisible] = 1
    newPoints[LayoutKeys.MainWidth] = x
    newPoints[LayoutKeys.SideBarLeft] = x
    newPoints[LayoutKeys.SideBarWidth] = newSideBarWidth
  }
  return newPoints
}

const getNewStatePointerMovePanel = (points, x, y) => {
  const windowHeight = points[LayoutKeys.WindowHeight]
  const statusBarHeight = points[LayoutKeys.StatusBarHeight]
  const titleBarHeight = points[LayoutKeys.TitleBarHeight]
  const activityBarHeight = points[LayoutKeys.ActivityBarHeight]
  const panelMinHeight = points[LayoutKeys.PanelMinHeight]
  const newPanelHeight = windowHeight - statusBarHeight - y
  const newPoints = new Uint16Array(points)
  if (newPanelHeight < panelMinHeight / 2) {
    newPoints[LayoutKeys.PanelVisible] = 0
    newPoints[LayoutKeys.MainHeight] = windowHeight - statusBarHeight - titleBarHeight
  } else if (newPanelHeight <= panelMinHeight) {
    newPoints[LayoutKeys.PanelVisible] = 1
    newPoints[LayoutKeys.PanelHeight] = panelMinHeight
    newPoints[LayoutKeys.MainHeight] = windowHeight - activityBarHeight - panelMinHeight
  } else {
    newPoints[LayoutKeys.PanelVisible] = 1
    newPoints[LayoutKeys.MainHeight] = y - titleBarHeight
    newPoints[LayoutKeys.panelTop] = y
    newPoints[LayoutKeys.PanelHeight] = windowHeight - statusBarHeight - y
  }
  return newPoints
}

const getNewStatePointerMovePreview = (points, x, y) => {
  const windowHeight = points[LayoutKeys.WindowHeight]
  const windowWidth = points[LayoutKeys.WindowWidth]
  const newPoints = new Uint16Array(points)
  newPoints[LayoutKeys.PreviewLeft] = x
  newPoints[LayoutKeys.PreviewTop] = y
  newPoints[LayoutKeys.PreviewWidth] = windowWidth - x
  newPoints[LayoutKeys.PreviewHeight] = windowHeight - y
  return newPoints
}

const getNewStatePointerMove = (sashId, points, x, y) => {
  switch (sashId) {
    case SashType.SideBar:
      return getNewStatePointerMoveSideBar(points, x, y)
    case SashType.Panel:
      return getNewStatePointerMovePanel(points, x, y)
    case SashType.Preview:
      return getNewStatePointerMovePreview(points, x, y)
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

const getResizeCommands = async (oldPoints, newPoints) => {
  const modules = [
    LayoutModules.Main,
    LayoutModules.ActivityBar,
    LayoutModules.SideBar,
    LayoutModules.TitleBar,
    LayoutModules.StatusBar,
    LayoutModules.Panel,
    LayoutModules.Preview,
  ]
  const commands = []
  for (const module of modules) {
    const { kTop, kLeft, kWidth, kHeight, moduleId } = module
    const instance = ViewletStates.getInstance(moduleId)
    if (!instance) {
      continue
    }
    const instanceUid = instance.state.uid
    if (!isEqual(oldPoints, newPoints, kTop, kLeft, kWidth, kHeight)) {
      const newTop = newPoints[kTop]
      const newLeft = newPoints[kLeft]
      const newWidth = newPoints[kWidth]
      const newHeight = newPoints[kHeight]
      Assert.number(newTop)
      Assert.number(newLeft)
      Assert.number(newWidth)
      Assert.number(newHeight)
      const resizeCommands = await Viewlet.resize(instanceUid, {
        x: newLeft,
        y: newTop,
        width: newWidth,
        height: newHeight,
      })
      commands.push(...resizeCommands)
      commands.push(['Viewlet.setBounds', instanceUid, newLeft, newTop, newWidth, newHeight])
    }
  }
  return commands
}

const getFocusChangeCommands = (isFocused) => {
  const modules = [
    LayoutModules.Main,
    LayoutModules.ActivityBar,
    LayoutModules.SideBar,
    LayoutModules.TitleBar,
    LayoutModules.StatusBar,
    LayoutModules.Panel,
  ]
  const commands = []
  for (const module of modules) {
    const { moduleId } = module
    const focusChangeCommands = Viewlet.handleFocusChange(moduleId, isFocused)
    commands.push(...focusChangeCommands)
  }
  return commands
}

const showAsync = async (uid, points, module) => {
  try {
    Assert.number(uid)
    const { moduleId, kTop, kLeft, kWidth, kHeight } = module
    const viewletUid = Id.create()
    const commands = await ViewletManager.load(
      {
        getModule: ViewletModule.load,
        id: moduleId,
        // @ts-ignore
        uid: viewletUid,
        type: 0,
        // @ts-ignore
        uri: '',
        show: false,
        focus: false,
        x: points[kLeft],
        y: points[kTop],
        width: points[kWidth],
        height: points[kHeight],
      },
      false,
      true,
    )
    if (commands) {
      commands.push(['Viewlet.append', uid, viewletUid])
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

const showPlaceholder = (uid, points, module) => {
  Assert.number(uid)
  const { moduleId, kTop, kLeft, kWidth, kHeight } = module
  return [
    'Viewlet.createPlaceholder',
    /* id */ moduleId,
    /* parentId */ uid,
    /* top */ points[kTop],
    /* left */ points[kLeft],
    /* width */ points[kWidth],
    /* height */ points[kHeight],
  ]
}

export const handleSashPointerMove = async (state, x, y) => {
  const { points, sashId } = state
  const newPoints = getNewStatePointerMove(sashId, points, x, y)
  getPoints(newPoints, newPoints)
  // TODO resize commands, resize viewlets recursively
  const allCommands = await getResizeCommands(points, newPoints)
  const newState = {
    ...state,
    points: newPoints,
  }
  const uid = state.uid
  const modules = [LayoutModules.Panel, LayoutModules.SideBar]
  for (const module of modules) {
    const { kVisible, moduleId } = module
    if (points[kVisible] !== newPoints[kVisible]) {
      if (newPoints[kVisible]) {
        showAsync(uid, newPoints, module) // TODO avoid side effect
        const commands = showPlaceholder(uid, newPoints, module)
        allCommands.push(commands)
      } else {
        await SaveState.saveViewletState(moduleId)
        const commands = Viewlet.disposeFunctional(moduleId)
        allCommands.push(...commands)
      }
    }
  }
  return {
    newState,
    commands: allCommands,
  }
}

export const handleResize = async (state, windowWidth, windowHeight) => {
  const { points } = state
  const newPoints = new Uint16Array(points)
  newPoints[LayoutKeys.WindowWidth] = windowWidth
  newPoints[LayoutKeys.WindowHeight] = windowHeight
  getPoints(newPoints, newPoints)
  // TODO duplicate code with handleSashPointerMove
  const commands = await getResizeCommands(points, newPoints)
  return {
    newState: {
      ...state,
      points: newPoints,
    },
    commands,
  }
}

const handleFocusChange = (state, isFocused) => {
  const commands = getFocusChangeCommands(isFocused)
  return {
    newState: {
      ...state,
      focused: isFocused,
    },
    commands,
  }
}

export const handleFocus = (state) => {
  return handleFocusChange(state, true)
}

export const showE2eTests = async (state) => {
  await Command.execute('SideBar.show', 'E2eTests')
  return state
}

export const handleBlur = (state) => {
  return handleFocusChange(state, false)
}

const handleSashDoubleClickPanel = async (state) => {
  const { points } = state
  if (points[LayoutKeys.PanelVisible]) {
    const newPoints = new Uint16Array(points)
    newPoints[LayoutKeys.PanelHeight] = 200
    getPoints(newPoints, newPoints)
    const commands = await getResizeCommands(points, newPoints)
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
const handleSashDoubleClickSideBar = async (state) => {
  const { points } = state
  if (points[LayoutKeys.SideBarVisible]) {
    const newPoints = new Uint16Array(points)
    newPoints[LayoutKeys.SideBarWidth] = 240
    getPoints(newPoints, newPoints)
    const commands = await getResizeCommands(points, newPoints)
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

export const moveSideBar = async (state, position) => {
  const { points } = state
  const newPoints = new Uint16Array(points)
  getPoints(newPoints, newPoints, position)
  // TODO update preferences
  const resizeCommands = await getResizeCommands(points, newPoints)
  return {
    newState: {
      ...state,
      points: newPoints,
      sideBarLocation: position,
    },
    commands: resizeCommands,
  }
}

export const moveSideBarLeft = (state) => {
  return moveSideBar(state, SideBarLocationType.Left)
}

export const moveSideBarRight = (state) => {
  return moveSideBar(state, SideBarLocationType.Right)
}

export const toggleSideBarPosition = (state) => {
  const { sideBarLocation } = state
  if (sideBarLocation === SideBarLocationType.Left) {
    return moveSideBarRight(state)
  }
  return moveSideBarLeft(state)
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
  return points[LayoutKeys.SideBarVisible]
}

export const getInitialPlaceholderCommands = (state) => {
  const { points } = state
  const commands = []
  const uid = state.uid
  const modules = [
    LayoutModules.TitleBar,
    LayoutModules.Main,
    LayoutModules.SideBar,
    LayoutModules.ActivityBar,
    LayoutModules.Panel,
    LayoutModules.StatusBar,
  ]
  for (const module of modules) {
    const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId } = module
    if (points[kVisible]) {
      commands.push(['Viewlet.createPlaceholder', moduleId, uid, points[kTop], points[kLeft], points[kWidth], points[kHeight]])
    }
  }
  return commands
}
