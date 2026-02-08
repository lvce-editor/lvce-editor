import * as Clamp from '../Clamp/Clamp.js'
import * as GetDefaultTitleBarHeight from '../GetDefaultTitleBarHeight/GetDefaultTitleBarHeight.js'
import * as LayoutKeys from '../LayoutKeys/LayoutKeys.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import { LayoutState } from './LayoutState.ts'

export const getPoints = (source: LayoutState, sideBarLocation = SideBarLocationType.Right): LayoutState => {
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
  const panelMaxHeight = source[LayoutKeys.PanelMaxHeight]
  const titleBarHeight = source[LayoutKeys.TitleBarHeight]
  const sideBarWidth = source[LayoutKeys.SideBarWidth]
  const panelHeight = source[LayoutKeys.PanelHeight]
  const statusBarHeight = source[LayoutKeys.StatusBarHeight]

  const newSideBarWidth = Clamp.clamp(sideBarWidth, sideBarMinWidth, sideBarMaxWidth)
  const newPanelHeight = Clamp.clamp(panelHeight, panelMinHeight, panelMaxHeight) // TODO check that it is in bounds of window

  if (sideBarLocation === SideBarLocationType.Right) {
    const p1 = /* Top */ 0
    let p2 = /* End of Title Bar */ 0
    let p3 = /* End of Main */ 0
    let p4 = /* End of Panel */ 0
    // @ts-ignore
    const p5 = /* End of StatusBar */ windowHeight

    const p6 = /* Left */ 0
    let p8 = /* End of SideBar */ windowWidth
    // @ts-ignore
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

    // When preview is visible, constrain elements to left 50% of window
    const availableWidth = previewVisible ? windowWidth / 2 : windowWidth

    if (activityBarVisible) {
      p8 = availableWidth - 48 // Activity bar at right edge of left section
    } else {
      p8 = availableWidth
    }

    const destinationActivityBarLeft = p8
    const destinationActivityBarTop = p2
    const destinationActivityBarWidth = 48
    const destinationActivityBarHeight = p4 - p2
    const destinationActivityBarVisible = activityBarVisible

    // Calculate sidebar width for left section
    const adjustedSideBarWidth = previewVisible ? Math.min(newSideBarWidth, (availableWidth - 48) * 0.3) : newSideBarWidth
    let p7 = p8 - adjustedSideBarWidth
    if (sideBarVisible && p7 < 0) {
      p7 = 0
    }

    const destinationMainLeft = p6
    const destinationMainTop = p2
    const destinationMainWidth = p7 - p6
    const destinationMainHeight = p3 - p2
    const destinationMainVisible = 1

    const destinationPanelLeft = p6
    const destinationpanelTop = p3
    const destinationPanelWidth = previewVisible ? availableWidth : windowWidth
    const destinationPanelHeight = p4 - p3
    const destinationPanelVisible = panelVisible

    const destinationSideBarLeft = p7
    const destinationSideBarTop = p2
    const destinationSideBarWidth = adjustedSideBarWidth
    const destinationSideBarHeight = p3 - p2
    const destinationSideBarVisible = sideBarVisible

    const destinationStatusBarLeft = p1
    const destinationStatusBarTop = p4
    const destinationStatusBarWidth = windowWidth
    const destinationStatusBarHeight = 20
    const destinationStatusBarVisible = statusBarVisible

    const destinationTitleBarLeft = p6
    const destinationTitleBarTop = p1
    const destinationTitleBarWidth = windowWidth
    let destinationTitleBarHeight = 0
    if (!source.titleBarVisible) {
      destinationTitleBarHeight = 0
    } else {
      destinationTitleBarHeight = GetDefaultTitleBarHeight.getDefaultTitleBarHeight()
    }
    const destinationTitleBarVisible = titleBarVisible

    const destinationPreviewLeft = previewVisible ? availableWidth : 0
    const destinationPreviewTop = p2
    const destinationPreviewWidth = previewVisible ? windowWidth - availableWidth : 0
    const destinationPreviewHeight = p3 - p2
    const destinationPreviewVisible = previewVisible
    return {
      ...source,
      activityBarTop: destinationActivityBarTop,
      activityBarLeft: destinationActivityBarLeft,
      activityBarWidth: destinationActivityBarWidth,
      activityBarHeight: destinationActivityBarHeight,
    }
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

    // When preview is visible, constrain elements to left 50% of window
    const availableWidth = previewVisible ? windowWidth / 2 : windowWidth

    if (activityBarVisible) {
      p7 = 48
    }
    if (sideBarVisible) {
      p8 = p7 + Math.min(newSideBarWidth, availableWidth - 48)
    } else {
      p8 = p7
    }
    const destinationActivityBarLeft = p6
    const destinationActivityBarTop = p2
    const destinationActivityBarWidth = 48
    const destinationActivityBarHeight = p4 - p2
    const destinationActivityBarVisible = activityBarVisible

    // For when preview is visible, constrain main area to left 50% of window
    let mainWidth = availableWidth - p8

    const destinationMainLeft = p8
    const destinationMainTop = p2
    const destinationMainWidth = mainWidth
    const destinationMainHeight = p3 - p2
    const destinationMainVisible = 1

    const destinationPanelLeft = p6
    const destinationpanelTop = p3
    const destinationPanelWidth = availableWidth
    const destinationPanelHeight = p4 - p3
    const destinationPanelVisible = panelVisible

    const destinationSideBarLeft = p7
    const destinationSideBarTop = p2
    const destinationSideBarWidth = p8 - p7
    const destinationSideBarHeight = p3 - p2
    const destinationSideBarVisible = sideBarVisible

    const destinationStatusBarLeft = p1
    const destinationStatusBarTop = p4
    const destinationStatusBarWidth = windowWidth
    const destinationStatusBarHeight = 20
    const destinationStatusBarVisible = statusBarVisible

    const destinationTitleBarLeft = p6
    const destinationTitleBarTop = p1
    const destinationTitleBarWidth = windowWidth
    const destinationTitleBarHeight = titleBarHeight
    const destinationTitleBarVisible = titleBarVisible

    const destinationPreviewLeft = previewVisible ? availableWidth : 0
    const destinationPreviewTop = p2
    const destinationPreviewWidth = previewVisible ? windowWidth - availableWidth : 0
    const destinationPreviewHeight = p3 - p2
    const destinationPreviewVisible = previewVisible
  }
}
