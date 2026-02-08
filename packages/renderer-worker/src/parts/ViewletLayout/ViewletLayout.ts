import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as Assert from '../Assert/Assert.ts'
import { assetDir } from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as Commit from '../Commit/Commit.js'
import * as GetDefaultTitleBarHeight from '../GetDefaultTitleBarHeight/GetDefaultTitleBarHeight.js'
import * as Id from '../Id/Id.js'
import * as LayoutKeys from '../LayoutKeys/LayoutKeys.js'
import * as LayoutModules from '../LayoutModules/LayoutModules.js'
import * as MenuEntriesState from '../MenuEntriesState/MenuEntriesState.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { reorderCommands } from '../ReorderCommands/ReorderCommands.js'
import * as SashType from '../SashType/SashType.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import { VError } from '../VError/VError.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { getPoints } from './LayoutPoints.ts'
import type { LayoutState, LayoutStateResult } from './LayoutState.ts'

export const create = (id: number): LayoutState => {
  Assert.number(id)
  return {
    sideBarLocation: SideBarLocationType.Right,
    uid: id,
    activityBarId: -1,
    activityBarSashId: -1,
    sideBarSashId: -1,
    sideBarId: -1,
    panelSashId: -1,
    panelId: -1,
    mainId: -1,
    contentAreaId: -1,
    statusBarId: -1,
    titleBarId: -1,
    workbenchId: -1,
    previewId: -1,
    previewSashId: -1,
    activityBarVisible: false,
    activityBarSashVisible: false,
    contentAreaVisible: true,
    mainVisible: false,
    panelSashVisible: false,
    panelVisible: false,
    previewSashVisible: false,
    previewVisible: false,
    sideBarSashVisible: false,
    sideBarVisible: false,
    statusBarVisible: false,
    titleBarVisible: false,
    workbenchVisible: false,
    activityBarHeight: 0,
    activityBarLeft: 0,
    activityBarTop: 0,
    activityBarWidth: 0,
    mainHeight: 0,
    mainLeft: 0,
    mainTop: 0,
    mainWidth: 0,
    panelHeight: 0,
    panelLeft: 0,
    panelTop: 0,
    panelWidth: 0,
    previewHeight: 0,
    previewLeft: 0,
    previewTop: 0,
    previewWidth: 0,
    sideBarHeight: 0,
    sideBarLeft: 0,
    sideBarTop: 0,
    sideBarWidth: 0,
    statusBarHeight: 0,
    statusBarLeft: 0,
    statusBarTop: 0,
    windowWidth: 0,
    windowHeight: 0,
    statusBarWidth: 0,
    titleBarHeight: 0,
    titleBarLeft: 0,
    titleBarTop: 0,
    titleBarWidth: 0,
    sideBarView: '',
    updateState: 'none',
    updateProgress: 0,
    commit: Commit.commit,
    platform: Platform.platform,
    assetDir,
    commands: [],
    sashId: SashType.None,
    previewUri: '',
    panelView: ViewletModuleId.Problems,
  }
}

export const saveState = (state: LayoutState) => {
  const { points, sideBarView, sideBarLocation, previewUri, previewVisible } = state
  const pointsArray = [...points]
  return {
    points: pointsArray,
    sideBarView,
    sideBarLocation,
    previewUri,
    previewVisible,
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

const isNativeTitleBarStyle = (platform) => {
  return platform === PlatformType.Electron && Preferences.get('window.titleBarStyle') === 'native'
}

const getSavedSideBarView = (savedState) => {
  if (savedState && savedState.sideBarView && typeof savedState.sideBarView === 'string') {
    return savedState.sideBarView
  }
  return ViewletModuleId.Explorer
}

export const loadContent = (state, savedState) => {
  const { Layout } = savedState
  const { bounds } = Layout
  const { windowWidth, windowHeight } = bounds
  const sideBarLocation = getSideBarLocationType()
  const newPoints = getSavedPoints(savedState)
  const savedView = getSavedSideBarView(savedState)
  const previewUri = savedState?.previewUri || ''
  const previewVisible = savedState?.previewVisible || false
  // TODO
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
  newPoints[LayoutKeys.PreviewVisible] = previewVisible ? 1 : 0
  newPoints[LayoutKeys.PreviewHeight] ||= 350
  newPoints[LayoutKeys.PreviewMinHeight] = Math.max(200, windowHeight / 2)
  newPoints[LayoutKeys.PreviewMaxHeight] = 1200
  newPoints[LayoutKeys.PreviewWidth] ||= 600
  newPoints[LayoutKeys.PreviewMinWidth] = 100
  newPoints[LayoutKeys.PreviewMaxWidth] = Math.max(1800, windowWidth / 2)
  if (isNativeTitleBarStyle(state.platform)) {
    newPoints[LayoutKeys.TitleBarHeight] = 0
    newPoints[LayoutKeys.TitleBarVisible] = 1
    newPoints[LayoutKeys.TitleBarNative] = 1
  } else {
    newPoints[LayoutKeys.TitleBarHeight] = GetDefaultTitleBarHeight.getDefaultTitleBarHeight()
    newPoints[LayoutKeys.TitleBarVisible] = 1
    newPoints[LayoutKeys.TitleBarNative] = 0
  }
  newPoints[LayoutKeys.WindowHeight] = windowHeight
  newPoints[LayoutKeys.WindowWidth] = windowWidth
  // TODO get side bar min width from preferences
  const newState = getPoints(newPoints, newPoints, sideBarLocation)
  return {
    ...state,
    activityBarSashVisible: true,
    mainContentsVisible: true,
    panelSashVisible: true,
    points: newPoints,
    previewSashVisible: true,
    previewUri,
    previewVisible,
    sideBarLocation,
    sideBarSashVisible: true,
    sideBarView: savedView,
    statusBarVisible: true,
    titleBarVisible: true,
    workbenchVisible: true,
  }
}

const show = async (state: LayoutState, module, currentViewletId) => {
  const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId, kId } = module
  const intermediateState: LayoutState = {
    ...state,
    [kVisible]: true,
  }
  const x = state[kLeft]
  const y = state[kTop]
  const width = state[kWidth]
  const height = state[kHeight]
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
  const isPreview = moduleId === ViewletModuleId.Preview
  return {
    newState: {
      ...state,
      [kId]: childUid,
      points: newPoints,
      ...(isPreview && { previewVisible: true, previewSashVisible: true }),
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

  // TODO send change event to activity bar worker
  // but in a functional way so that there is only
  // one rendering event

  const isPreview = moduleId === ViewletModuleId.Preview
  return {
    newState: {
      ...state,
      points: newPoints,
      ...(isPreview && { previewVisible: false, previewSashVisible: false }),
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

export const showSideBar = async (state: LayoutState) => {
  const { sideBarView } = state
  const { newState, commands } = await show(state, LayoutModules.SideBar, undefined)
  const { activityBarId } = newState
  await ActivityBarWorker.invoke('ActivityBar.handleSideBarViewletChange', activityBarId, sideBarView)
  const diffResult = await ActivityBarWorker.invoke('ActivityBar.diff2', activityBarId)
  const activityBarCommands = await ActivityBarWorker.invoke('ActivityBar.render2', activityBarId, diffResult)
  return {
    newState: {
      ...newState,
      sideBarVisible: true,
    },
    commands: [...commands, ...activityBarCommands],
  }
}

export const hideSideBar = async (state: LayoutState) => {
  const { newState, commands } = await hide(state, LayoutModules.SideBar)
  const { activityBarId } = newState
  // TODO instead of this, call handleSidebarViewChange. activity bar then can get active view if needed
  await ActivityBarWorker.invoke('ActivityBar.handleSideBarHidden', activityBarId)
  const diffResult = await ActivityBarWorker.invoke('ActivityBar.diff2', activityBarId)
  const activityBarCommands = await ActivityBarWorker.invoke('ActivityBar.render2', activityBarId, diffResult)
  return {
    newState: {
      ...newState,
      sideBarVisible: false,
    },
    commands: [...commands, ...activityBarCommands],
  }
}

export const toggleSideBar = (state: LayoutState) => {
  // @ts-ignore
  return toggle(state, LayoutModules.SideBar)
}

export const showPanel = (state: LayoutState) => {
  // @ts-ignore
  return show(state, LayoutModules.Panel)
}

export const hidePanel = (state: LayoutState) => {
  return hide(state, LayoutModules.Panel)
}

export const togglePanel = (state, moduleId = ViewletModuleId.None) => {
  return toggle(state, LayoutModules.Panel, moduleId)
}

export const showActivityBar = (state: LayoutState) => {
  // @ts-ignore
  return show(state, LayoutModules.ActivityBar)
}

export const hideActivityBar = (state: LayoutState) => {
  return hide(state, LayoutModules.ActivityBar)
}

export const toggleActivityBar = (state: LayoutState) => {
  // @ts-ignore
  return toggle(state, LayoutModules.ActivityBar)
}

export const showStatusBar = (state: LayoutState) => {
  // @ts-ignore
  return show(state, LayoutModules.StatusBar)
}

export const hideStatusBar = (state: LayoutState) => {
  return hide(state, LayoutModules.StatusBar)
}

export const toggleStatusBar = (state: LayoutState) => {
  // @ts-ignore
  return toggle(state, LayoutModules.StatusBar)
}

export const showPreview = async (state: LayoutState, uri: string) => {
  const { points } = state
  const previewIsVisible = points[LayoutKeys.PreviewVisible] === 1

  if (previewIsVisible) {
    await Command.execute('Preview.setUri', uri)
    return {
      newState: {
        ...state,
        previewUri: uri,
      },
      commands: [],
    }
  }
  ViewletStates.setState(state.uid, {
    ...state,
    previewUri: uri,
  })
  // @ts-ignore
  const result = await show(state, LayoutModules.Preview)
  return {
    ...result,
    newState: {
      ...result.newState,
      previewUri: uri,
    },
  }
}

export const hidePreview = (state: LayoutState) => {
  return hide(state, LayoutModules.Preview)
}

export const togglePreview = (state: LayoutState, uri: string) => {
  // @ts-ignore
  state.previewUri = uri
  // @ts-ignore
  return toggle(state, LayoutModules.Preview)
}

export const showTitleBar = (state: LayoutState) => {
  // @ts-ignore
  return show(state, LayoutModules.TitleBar)
}

export const hideTitleBar = (state: LayoutState) => {
  return hide(state, LayoutModules.TitleBar)
}

export const toggleTitleBar = (state: LayoutState) => {
  // @ts-ignore
  return toggle(state, LayoutModules.TitleBar)
}

export const createViewlet = async (state: LayoutState, viewletModuleId: string, editorUid: number, tabId: number, bounds: any, uri: string) => {
  const commands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id: viewletModuleId,
      type: 0,
      // @ts-ignore
      uri: uri,
      uid: editorUid,
      show: false,
      focus: false,
      setBounds: false,
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      parentUid: -1,
      append: false,
      args: [],
    },
    false,
    true,
  )
  // @ts-ignore
  return {
    newState: state,
    commands: commands,
  }
}
export const attachViewlet = async (state: LayoutState, parentUid: number, uid: number) => {
  const commands = ['Viewlet.append', parentUid, uid]
  return {
    newState: state,
    commands: commands,
  }
}

export const showMain = (state: LayoutState) => {
  // @ts-ignore
  return show(state, LayoutModules.Main)
}

export const hideMain = (state: LayoutState) => {
  return hide(state, LayoutModules.Main)
}

export const toggleMain = (state: LayoutState) => {
  // @ts-ignore
  return toggle(state, LayoutModules.Main)
}

const getReferenceNodes = (sideBarLocation) => {
  if (sideBarLocation === SideBarLocationType.Left) {
    return [
      ViewletModuleId.TitleBar,
      ViewletModuleId.ActivityBar,
      'SashActivityBar',
      'SashSideBar',
      ViewletModuleId.SideBar,
      ViewletModuleId.Main,
      ViewletModuleId.Preview,
      'SashPanel',
      ViewletModuleId.Panel,
      ViewletModuleId.StatusBar,
    ]
  }
  return [
    ViewletModuleId.TitleBar,
    ViewletModuleId.Main,
    'SashSideBar',
    ViewletModuleId.SideBar,
    'SashActivityBar',
    ViewletModuleId.ActivityBar,
    ViewletModuleId.Preview,
    'SashPanel',
    ViewletModuleId.Panel,
    ViewletModuleId.StatusBar,
  ]
}

const loadIfVisible = async (
  state: LayoutState,
  module: any,
): Promise<{
  newState: LayoutState
  commands: any[]
}> => {
  try {
    const { points } = state
    const { kVisible, kTop, kLeft, kWidth, kHeight, moduleId, kId, kReady } = module
    const visible = points[kVisible]
    const x = points[kLeft]
    const y = points[kTop]
    const width = points[kWidth]
    const height = points[kHeight]
    let commands = []
    let childUid = -1
    if (visible) {
      childUid = Id.create()
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
          // render: false,
        },
        false,
        true,
      )
      if (commands) {
        // const referenceNodes = getReferenceNodes(sideBarLocation)
        // @ts-ignore
        // commands.push(['Viewlet.append', parentUid, childUid, referenceNodes])
      }
    }
    const orderedCommands = reorderCommands(commands)
    const latestState = ViewletStates.getState(ViewletModuleId.Layout)
    return {
      newState: {
        ...latestState,
        [kReady]: true,
        workbenchVisible: true,
        contentAreaVisible: true,
        mainContentsVisible: true,
        mainVisible: true,
        [kId]: childUid,
      },
      commands: orderedCommands,
    }
  } catch (error) {
    throw new VError(error, `Failed to load ${module.moduleId}`)
  }
}

export const loadMainIfVisible = (state: LayoutState) => {
  return loadIfVisible(state, LayoutModules.Main)
}

export const loadSideBarIfVisible = async (state: LayoutState) => {
  const updated = await loadIfVisible(state, LayoutModules.SideBar)
  return {
    ...updated,
  }
}

export const loadPanelIfVisible = (state: LayoutState) => {
  return loadIfVisible(state, LayoutModules.Panel)
}

export const loadActivityBarIfVisible = async (state: LayoutState) => {
  const updated = await loadIfVisible(state, LayoutModules.ActivityBar)
  return {
    ...updated,
  }
}

export const loadStatusBarIfVisible = (state: LayoutState) => {
  return loadIfVisible(state, LayoutModules.StatusBar)
}

export const loadTitleBarIfVisible = async (state: LayoutState) => {
  const updated = await loadIfVisible(state, LayoutModules.TitleBar)
  return {
    ...updated,
    titleBarVisible: true,
  }
}

export const loadPreviewIfVisible = (state: LayoutState) => {
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

export const handleSashSideBarPointerDown = (state) => {
  return handleSashPointerDown(state, SashType.SideBar)
}

export const handleSashPanelPointerDown = (state) => {
  return handleSashPointerDown(state, SashType.Panel)
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

const getNewStatePointerMoveSideBar = (state: LayoutState, x: number, y: number): LayoutState => {
  const windowWidth = state[LayoutKeys.WindowWidth]
  const activityBarWidth = state[LayoutKeys.ActivityBarWidth]
  const sideBarMinWidth = state[LayoutKeys.SideBarMinWidth]
  const newSideBarWidth = windowWidth - activityBarWidth - x
  if (newSideBarWidth <= sideBarMinWidth / 2) {
    return {
      ...state,
      sideBarVisible: false,
      mainWidth: windowWidth - activityBarWidth,
    }
  } else if (newSideBarWidth <= sideBarMinWidth) {
    return {
      ...state,
      sideBarWidth: sideBarMinWidth,
      mainWidth: windowWidth - activityBarWidth - sideBarMinWidth,
      sideBarLeft: windowWidth - activityBarWidth - sideBarMinWidth,
      sideBarVisible: true,
    }
  } else {
    return {
      ...state,
      sideBarVisible: true,
      mainWidth: x,
      sideBarLeft: x,
      sideBarWidth: newSideBarWidth,
    }
  }
}

const getNewStatePointerMoveActivityBar = (points, x, y) => {
  const windowWidth = points[LayoutKeys.WindowWidth]
  const previewMinWidth = 200 // TODO: make configurable
  const mainMinWidth = 100 // TODO: make configurable
  const newPreviewWidth = windowWidth - x
  const newPoints = new Uint16Array(points)

  if (newPreviewWidth < previewMinWidth / 2) {
    // Hide preview when dragging too far left
    newPoints[LayoutKeys.PreviewVisible] = 0
    newPoints[LayoutKeys.PreviewWidth] = 0
    newPoints[LayoutKeys.PreviewLeft] = windowWidth
    newPoints[LayoutKeys.MainWidth] = windowWidth - 48
  } else if (newPreviewWidth < previewMinWidth) {
    // Snap to minimum preview width
    newPoints[LayoutKeys.PreviewVisible] = 1
    newPoints[LayoutKeys.PreviewWidth] = previewMinWidth
    newPoints[LayoutKeys.PreviewLeft] = x
    newPoints[LayoutKeys.MainWidth] = x - 48
  } else {
    newPoints[LayoutKeys.PreviewVisible] = 1
    newPoints[LayoutKeys.PreviewLeft] = x
    newPoints[LayoutKeys.PreviewWidth] = newPreviewWidth
    newPoints[LayoutKeys.MainWidth] = Math.max(mainMinWidth, x - 48)
  }

  return newPoints
}

const getNewStatePointerMovePanel = (state: LayoutState, x: number, y: number): LayoutState => {
  const windowHeight = state[LayoutKeys.WindowHeight]
  const statusBarHeight = state[LayoutKeys.StatusBarHeight]
  const titleBarHeight = state[LayoutKeys.TitleBarHeight]
  const activityBarHeight = state[LayoutKeys.ActivityBarHeight]
  const panelMinHeight = state[LayoutKeys.PanelMinHeight]
  const newPanelHeight = windowHeight - statusBarHeight - y
  if (newPanelHeight < panelMinHeight / 2) {
    return {
      ...state,
      panelVisible: false,
      mainHeight: windowHeight - statusBarHeight - titleBarHeight,
    }
  } else if (newPanelHeight <= panelMinHeight) {
    return {
      ...state,
      panelVisible: true,
      panelHeight: panelMinHeight,
      mainHeight: windowHeight - activityBarHeight - panelMinHeight,
    }
  } else {
    return {
      ...state,
      panelVisible: true,
      mainHeight: y - titleBarHeight,
      panelTop: y,
      panelHeight: windowHeight - statusBarHeight - y,
    }
  }
}

const getNewStatePointerMovePreview = (state: LayoutState, x: number, y: number): LayoutState => {
  const windowHeight = state[LayoutKeys.WindowHeight]
  const windowWidth = state[LayoutKeys.WindowWidth]
  const newPoints = new Uint16Array(state)
  newPoints[LayoutKeys.PreviewLeft] = x
  newPoints[LayoutKeys.PreviewTop] = y
  newPoints[LayoutKeys.PreviewWidth] = windowWidth - x
  newPoints[LayoutKeys.PreviewHeight] = windowHeight - y
  return newPoints
}

const getNewStatePointerMove = (sashId: string, state: LayoutState, x: number, y: number): LayoutState => {
  switch (sashId) {
    case SashType.SideBar:
      return getNewStatePointerMoveSideBar(state, x, y)
    case SashType.Panel:
      return getNewStatePointerMovePanel(state, x, y)
    case SashType.Preview:
      return getNewStatePointerMovePreview(state, x, y)
    case SashType.ActivityBar:
      return getNewStatePointerMoveActivityBar(state, x, y)
    default:
      throw new Error(`unsupported sash type ${sashId}`)
  }
}

const isEqual = (oldState: LayoutState, newState: LayoutState, kTop: string, kLeft: string, kWidth: string, kHeight: string) => {
  return (
    oldState[kTop] === newState[kTop] &&
    oldState[kLeft] === newState[kLeft] &&
    oldState[kWidth] === newState[kWidth] &&
    oldState[kHeight] === newState[kHeight]
  )
}

const getResizeCommands = async (oldState: LayoutState, newState: LayoutState) => {
  const modules = [
    LayoutModules.Main,
    LayoutModules.ActivityBar,
    LayoutModules.SideBar,
    LayoutModules.TitleBar,
    LayoutModules.StatusBar,
    LayoutModules.Panel,
    LayoutModules.Preview,
  ]
  const individualCommands = await Promise.all(
    modules.map(async (module) => {
      const { kTop, kLeft, kWidth, kHeight, moduleId } = module
      const instance = ViewletStates.getInstance(moduleId)
      if (!instance) {
        return []
      }
      const instanceUid = instance.state.uid
      if (isEqual(oldState, newState, kTop, kLeft, kWidth, kHeight)) {
        return []
      }
      const newTop = newState[kTop]
      const newLeft = newState[kLeft]
      const newWidth = newState[kWidth]
      const newHeight = newState[kHeight]
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
      return [...resizeCommands, ['Viewlet.setBounds', instanceUid, newLeft, newTop, newWidth, newHeight]]
    }),
  )
  const commands = individualCommands.flat(1)
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
    // @ts-ignore
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

export const handleSashPointerMove = async (state: LayoutState, x: number, y: number) => {
  const { sashId } = state
  let newState = getNewStatePointerMove(sashId, state, x, y)
  // TODO resize commands, resize viewlets recursively
  const allCommands = await getResizeCommands(state, newState)
  const uid = state.uid
  const modules = [LayoutModules.Panel, LayoutModules.SideBar, LayoutModules.Preview]
  for (const module of modules) {
    const { kVisible, moduleId } = module
    if (state[kVisible] !== newState[kVisible]) {
      if (newState[kVisible]) {
        showAsync(uid, newState, module) // TODO avoid side effect
        const commands = showPlaceholder(uid, newState, module)
        // @ts-ignore
        allCommands.push(commands)
        if (moduleId === ViewletModuleId.Preview) {
          newState = {
            ...newState,
            previewVisible: true,
            previewSashVisible: true,
          }
        }
      } else {
        await SaveState.saveViewletState(moduleId)
        const commands = Viewlet.disposeFunctional(moduleId)
        // @ts-ignore
        allCommands.push(...commands)
        if (moduleId === ViewletModuleId.Preview) {
          newState = {
            ...newState,
            previewVisible: false,
            previewSashVisible: false,
          }
        }
      }
    }
  }
  return {
    newState,
    commands: allCommands,
  }
}

export const handleResize = async (state: LayoutState, windowWidth: number, windowHeight: number) => {
  const newState = getPoints({
    ...state,
    windowWidth,
    windowHeight,
  })
  // TODO duplicate code with handleSashPointerMove
  const commands = await getResizeCommands(state, newState)
  return {
    newState,
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

export const handleFocus = (state: LayoutState) => {
  return handleFocusChange(state, true)
}

export const showE2eTests = async (state: LayoutState) => {
  await Command.execute('SideBar.show', 'E2eTests')
  return state
}

export const handleBlur = (state: LayoutState) => {
  return handleFocusChange(state, false)
}

const handleSashDoubleClickPanel = async (state: LayoutState) => {
  if (state.panelVisible) {
    const newState = getPoints({
      ...state,
      panelVisible: true,
      panelHeight: 200,
    })
    const commands = await getResizeCommands(state, newState)
    return {
      newState,
      commands,
    }
  }
  return {
    newState: state,
    commands: [],
  }
}

// TODO return commands and newState
const handleSashDoubleClickSideBar = async (state: LayoutState) => {
  if (state.sideBarVisible) {
    const newState = getPoints({
      ...state,
      sideBarWidth: 240,
    })
    const commands = await getResizeCommands(state, newState)
    return {
      newState,
      commands,
    }
  }
  return {
    newState: state,
    commands: [],
  }
}

const handleSashDoubleClickActivityBar = async (state: LayoutState) => {
  if (state.previewVisible[LayoutKeys.PreviewVisible]) {
    const newState = getPoints({ ...state, previewWidth: 600 })
    const commands = await getResizeCommands(state, newState)
    return {
      newState,
      commands,
    }
  }
  return {
    newState: state,
    commands: [],
  }
}

export const moveSideBar = async (state: LayoutState, position: any) => {
  // update layout state synchronously to avoid races when moveSideBar
  // is called multiple times — update the viewlet state first
  const immediateState: LayoutState = {
    ...getPoints(state, position),
    sideBarLocation: position,
  }
  await Viewlet.setState(state.uid, immediateState)

  // persist side bar location preference so it persists across reloads
  const location = position === SideBarLocationType.Left ? 'left' : 'right'
  // use Preferences.update to ensure a global "preferences.changed" event is emitted
  await Preferences.update({ 'workbench.sideBarLocation': location })

  // notify all viewlets about the preference change using callGlobalEvent
  const prefEventResult = await callGlobalEvent(immediateState, 'handlePreferencesChanged')
  const prefCommands = prefEventResult.commands || []

  const resizeCommands = await getResizeCommands(state, immediateState)

  const allCommands = [...resizeCommands, ...prefCommands]

  return {
    newState: {
      ...prefEventResult.newState,
      sideBarLocation: position,
    },
    commands: allCommands,
  }
}

export const moveSideBarLeft = (state: LayoutState) => {
  return moveSideBar(state, SideBarLocationType.Left)
}

export const moveSideBarRight = (state: LayoutState) => {
  return moveSideBar(state, SideBarLocationType.Right)
}

export const toggleSideBarPosition = (state: LayoutState) => {
  const { sideBarLocation } = state
  if (sideBarLocation === SideBarLocationType.Left) {
    return moveSideBarRight(state)
  }
  return moveSideBarLeft(state)
}

export const handleSashDoubleClick = (state: LayoutState, sashId: string) => {
  switch (sashId) {
    case SashType.Panel:
      return handleSashDoubleClickPanel(state)
    case SashType.SideBar:
      return handleSashDoubleClickSideBar(state)
    case SashType.ActivityBar:
      return handleSashDoubleClickActivityBar(state)
    default:
      throw new Error(`unsupported sash type ${sashId}`)
  }
}

export const isSideBarVisible = (state: LayoutState) => {
  const { sideBarVisible } = state
  return sideBarVisible
}

export const getAllQuickPickMenuEntries = () => {
  return MenuEntriesState.getAll()
}

const callGlobalEvent = async (state: LayoutState, eventName, ...args): Promise<LayoutStateResult> => {
  const instances = ViewletStates.getAllInstances()
  const allCommands = []
  // @ts-ignore
  for (const [key, value] of Object.entries(instances)) {
    // @ts-ignore
    if (value.factory.Commands && value.factory.Commands[eventName]) {
      // @ts-ignore
      const oldState = value.state
      // @ts-ignore
      const newState = await value.factory.Commands[eventName](oldState, ...args)
      if (oldState !== newState) {
        // @ts-ignore
        const commands = ViewletManager.render(value.factory, value.renderedState, newState)
        // @ts-ignore
        allCommands.push(...commands)
      }
    }
  }
  return {
    newState: {
      ...state,
    },
    commands: allCommands,
  }
}

export const getCommit = (state: LayoutState) => {
  return state.commit
}

export const getPlatform = (state: LayoutState) => {
  return state.platform
}

export const getAssetDir = (state: LayoutState) => {
  return state.assetDir
}

export const setUpdateState = async (state, updateState) => {
  if (state.updateState === updateState.state && state.updateProgress === updateState.progress) {
    return {
      newState: state,
      commands: [],
    }
  }
  return callGlobalEvent(state, 'handleUpdateStateChange', updateState)
}

export const handleWorkspaceRefresh = async (state: LayoutState) => {
  return callGlobalEvent(state, 'handleWorkspaceRefresh')
}

export const handleBadgeCountChange = async (state, changes) => {
  return callGlobalEvent(state, 'handleBadgeCountChange', changes)
}

export const handleExtensionsChanged = async (state: LayoutState) => {
  return callGlobalEvent(state, 'handleExtensionsChanged')
}

export const getActiveSideBarView = (state: LayoutState) => {
  return state.sideBarView
}
export const getSideBarPosition = (state: LayoutState) => {
  return state.sideBarLocation
}

export const openSideBarView = async (state: LayoutState, moduleId, focus = false, args): Promise<LayoutStateResult> => {
  const { newState, commands } = await callGlobalEvent(state, 'handleSideBarViewletChange', moduleId)
  return {
    newState: { ...newState, sideBarView: moduleId },
    commands,
  }
}
export const openPanelView = async (state: LayoutState, moduleId, focus = false, args): Promise<LayoutStateResult> => {
  const { newState, commands } = await callGlobalEvent(state, 'handlePanelViewletChange', moduleId)
  return {
    newState: { ...newState, sideBarView: moduleId },
    commands,
  }
}

export const getBadgeCounts = (state: LayoutState) => {
  const states = ViewletStates.getAllInstances()
  const badgeCounts = Object.create(null)
  for (const value of Object.values(states)) {
    // @ts-ignore
    badgeCounts[value.moduleId] = value.state.badgeCount || 0
  }
  return badgeCounts
}

export const getModuleId = (state: LayoutState, uri: string) => {
  return ViewletMap.getModuleId(uri)
}
