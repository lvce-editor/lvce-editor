import * as Clamp from '../Clamp/Clamp.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as SashType from '../SashType/SashType.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const kMainVisible = 'mainVisible'
const kMainTop = 'mainTop'
const kMainLeft = 'mainLeft'
const kMainWidth = 'mainWidth'
const kMainHeight = 'mainHeight'

const kActivityBarVisible = 'activityBarVisible'
const kActivityBarTop = 'activityBarTop'
const kActivityBarLeft = 'activityBarLeft'
const kActivityBarWidth = 'activityBarWidth'
const kActivityBarHeight = 'activityBarHeight'

const kSideBarVisible = 'sideBarVisible'
const kSideBarTop = 'sideBarTop'
const kSideBarLeft = 'sideBarLeft'
const kSideBarWidth = 'sideBarWidth'
const kSideBarHeight = 'sideBarHeight'
const kSideBarMinWidth = 'sideBarMinWidth'
const kSideBarMaxWidth = 'sideBarMaxWidth'

const kPanelVisible = 'panelVisible'
const kpanelTop = 'panelTop'
const kPanelLeft = 'panelLeft'
const kPanelWidth = 'panelWidth'
const kPanelHeight = 'panelHeight'
const kPanelMinHeight = 'panelMinHeight'
const kPanelMaxHeight = 'panelMaxHeight'

const kStatusBarVisible = 'statusBarVisible'
const kStatusBarTop = 'statusBarTop'
const kStatusBarLeft = 'statusBarLeft'
const kStatusBarWidth = 'statusBarWidth'
const kStatusBarHeight = 'statusBarHeight'

const kTitleBarVisible = 'titleBarVisible'
const kTitleBarTop = 'titleBarTop'
const kTitleBarLeft = 'titleBarLeft'
const kTitleBarWidth = 'titleBarWidth'
const kTitleBarHeight = 'titleBarHeight'

const kWindowWidth = 'windowWidth'
const kWindowHeight = 'windowHeight'

export const name = 'Layout'

export const getPoints = (state) => {
  const {
    [kActivityBarVisible]: activityBarVisible,
    [kPanelVisible]: panelVisible,
    [kSideBarVisible]: sideBarVisible,
    [kStatusBarVisible]: statusBarVisible,
    [kTitleBarVisible]: titleBarVisible,
    [kWindowWidth]: windowWidth,
    [kWindowHeight]: windowHeight,
    [kSideBarMinWidth]: sideBarMinWidth,
    [kSideBarMaxWidth]: sideBarMaxWidth,
    [kPanelMinHeight]: panelMinHeight,
    [kPanelMaxHeight]: panelMaxHeight,
    [kTitleBarHeight]: titleBarHeight,
    [kPanelHeight]: panelHeight,
    [kSideBarWidth]: sideBarWidth,
  } = state

  console.log({ state })
  const newActivityBarWidth = 48 // TODO put magic numbers somewhere
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
  const newStatusBarHeight = 20

  const p1 = /* Top */ 0
  let p2 = /* End of Title Bar */ 0
  let p3 = /* End of Main */ 0
  let p4 = /* End of Panel */ 0
  const p5 = /* End of StatusBar */ windowHeight

  const p6 = /* Left */ 0
  let p7 = /* End of Main */ windowWidth - newActivityBarWidth
  let p8 = /* End of SideBar */ windowWidth
  const p9 = /* End of ActivityBar */ windowWidth
  if (titleBarVisible) {
    p2 = titleBarHeight
  }
  if (statusBarVisible) {
    p4 = windowHeight - newStatusBarHeight
  }
  p3 = panelVisible ? p4 - newPanelHeight : p4
  if (activityBarVisible) {
    p8 = windowWidth - newActivityBarWidth
  }
  if (sideBarVisible) {
    p7 = p8 - newSideBarWidth
  }
  console.log({ p1, p2, p3, p4, p5, p6, p7, p8 })
  return {
    [kActivityBarLeft]: p8,
    [kActivityBarTop]: p2,
    [kActivityBarWidth]: 48,
    [kActivityBarHeight]: p4 - p2,
    [kActivityBarVisible]: activityBarVisible,
    [kMainLeft]: p6,
    [kMainTop]: p2,
    [kMainWidth]: p7 - p6,
    [kMainHeight]: p3 - p2,
    [kMainVisible]: true,
    [kPanelLeft]: p6,
    [kpanelTop]: p3,
    [kPanelWidth]: p8 - p6,
    [kPanelHeight]: p4 - p3,
    [kPanelVisible]: panelVisible,
    [kSideBarLeft]: p7,
    [kSideBarTop]: p2,
    [kSideBarWidth]: p8 - p7,
    [kSideBarHeight]: p3 - p2,
    [kSideBarVisible]: sideBarVisible,
    [kStatusBarLeft]: p1,
    [kStatusBarTop]: p4,
    [kStatusBarWidth]: windowWidth,
    [kStatusBarHeight]: 20,
    [kStatusBarVisible]: statusBarVisible,
    [kTitleBarLeft]: p6,
    [kTitleBarTop]: p1,
    [kTitleBarWidth]: windowWidth,
    [kTitleBarHeight]: titleBarHeight,
    [kTitleBarVisible]: true,
    [kWindowWidth]: windowWidth,
    [kWindowHeight]: windowHeight,
  }
}

export const create = () => {
  return {
    [kActivityBarLeft]: 0,
    [kActivityBarTop]: 0,
    [kActivityBarWidth]: 0,
    [kActivityBarHeight]: 0,
    [kActivityBarVisible]: false,
    [kMainLeft]: 0,
    [kMainTop]: 0,
    [kMainWidth]: 0,
    [kMainHeight]: 0,
    [kMainVisible]: false,
    [kPanelLeft]: 0,
    [kpanelTop]: 0,
    [kPanelWidth]: 0,
    [kPanelHeight]: 0,
    [kPanelVisible]: false,
    [kSideBarLeft]: 0,
    [kSideBarTop]: 0,
    [kSideBarWidth]: 0,
    [kSideBarHeight]: 0,
    [kSideBarVisible]: false,
    [kStatusBarLeft]: 0,
    [kStatusBarTop]: 0,
    [kStatusBarWidth]: 0,
    [kStatusBarHeight]: 0,
    [kStatusBarVisible]: false,
    [kTitleBarLeft]: 0,
    [kTitleBarTop]: 0,
    [kTitleBarWidth]: 0,
    [kTitleBarHeight]: 0,
    [kTitleBarVisible]: false,
    [kWindowWidth]: 0,
    [kWindowHeight]: 0,
    sashId: SashType.None,
  }
}

export const loadContent = (state, savedState) => {
  const { Layout } = savedState
  const { bounds } = Layout
  const { windowWidth, windowHeight } = bounds
  console.log({ savedState })
  // TODO get side bar min width from preferences
  const newState = getPoints({
    ...state,
    [kActivityBarVisible]: true,
    [kActivityBarWidth]: 48,
    [kMainVisible]: true,
    [kPanelHeight]: 160,
    [kPanelMaxHeight]: 600,
    [kPanelMinHeight]: 150,
    [kSideBarMaxWidth]: Number.POSITIVE_INFINITY,
    [kSideBarMinWidth]: 170,
    [kSideBarVisible]: true,
    [kSideBarWidth]: 240,
    [kWindowHeight]: windowHeight,
    [kWindowWidth]: windowWidth,
    [kTitleBarHeight]: 20,
    [kTitleBarVisible]: true,
    [kStatusBarVisible]: true,
  })
  console.log({ newState })
  return newState
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
  const newPoints = getPoints({
    ...state,
    [key]: true,
  })
  // TODO
  // - load that component
  // - if component is hidden now, return
  // - if component is still visible, render new component
  return newPoints
}

const hide = (state, key) => {
  return getPoints({
    ...state,
    [key]: false,
  })
}

const toggle = (state, key) => {
  const newPoints = getPoints({
    ...state,
    [key]: !state[key],
  })
  return newPoints
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
  const visible = state[kVisible]
  const top = state[kTop]
  const left = state[kLeft]
  const width = state[kWidth]
  const height = state[kHeight]
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
    console.log({ commands })
    await RendererProcess.invoke('Viewlet.executeCommands', commands)
  }
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
