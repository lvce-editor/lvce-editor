import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Clamp from '../Clamp/Clamp.js'

export const name = 'Layout'

export const create = () => {
  return {}
}

const getDefaultTitleBarHeight = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return 28
    default:
      return 20
  }
}

export const getPoints = (state) => {
  const {
    activityBarVisible,
    panelVisible,
    sideBarVisible,
    statusBarVisible,
    titleBarVisible,
    windowWidth,
    windowHeight,
    sideBarMinWidth,
    sideBarMaxWidth,
    panelMinHeight,
    panelMaxHeight,
    titleBarHeight,
    panelHeight,
    sideBarWidth,
  } = state

  const newActivityBarWidth = 48 // TODO put magic numbers somewhere
  const newSideBarWidth = Clamp.clamp(
    sideBarMinWidth,
    sideBarMaxWidth,
    sideBarWidth
  )

  const newPanelHeight = Clamp.clamp(
    panelMinHeight,
    panelMaxHeight,
    panelHeight
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

const show = (state, key) => {
  return {
    ...state,
    [key]: true,
  }
}

export const showSideBar = () => {}
