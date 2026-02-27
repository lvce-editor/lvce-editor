import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import type { LayoutState } from './LayoutState.ts'
import * as ViewletLayoutRenderDom from './ViewletLayoutRenderDom.ts'

// @ts-ignore
const kWindowWidth = 0
// @ts-ignore
const kWindowHeight = 1

// @ts-ignore
const kMainVisible = 2
// @ts-ignore
const kMainTop = 3
// @ts-ignore
const kMainLeft = 4
// @ts-ignore
const kMainWidth = 5
// @ts-ignore
const kMainHeight = 6

// @ts-ignore
const kActivityBarVisible = 7
// @ts-ignore
const kActivityBarTop = 8
// @ts-ignore
const kActivityBarLeft = 9
// @ts-ignore
const kActivityBarWidth = 10
// @ts-ignore
const kActivityBarHeight = 11

// @ts-ignore
const kSideBarVisible = 12
// @ts-ignore
const kSideBarWidth = 15
// @ts-ignore
const kSideBarMinWidth = 17
// @ts-ignore
const kSideBarMaxWidth = 18

// @ts-ignore
const kPanelVisible = 19
// const kPanelLeft = 21
// @ts-ignore
const kPanelHeight = 23
// @ts-ignore
const kPanelMinHeight = 24
// @ts-ignore
const kPanelMaxHeight = 25

// @ts-ignore
const kStatusBarVisible = 26
// @ts-ignore
const kStatusBarTop = 27
// @ts-ignore
const kStatusBarLeft = 28
// @ts-ignore
const kStatusBarWidth = 29
// @ts-ignore
const kStatusBarHeight = 30

// @ts-ignore
const kTitleBarVisible = 31
// @ts-ignore
const kTitleBarTop = 32
// @ts-ignore
const kTitleBarLeft = 33
// @ts-ignore
const kTitleBarWidth = 34
// @ts-ignore
const kTitleBarHeight = 35

// @ts-ignore
const kPreviewVisible = 36
// @ts-ignore
const kPreviewTop = 37
// @ts-ignore
const kPreviewLeft = 38
// @ts-ignore
const kPreviewWidth = 39
// @ts-ignore
const kPreviewHeight = 40

// @ts-ignore
const kTotal = 46

export const hasFunctionalRender = true
export const hasFunctionalRootRender = true
export const hasFunctionalEvents = true

const renderDom = {
  isEqual(oldState: LayoutState, newState: LayoutState) {
    return (
      oldState.mainVisible === newState.mainVisible &&
      oldState.mainId === newState.mainId &&
      oldState.titleBarVisible === newState.titleBarVisible &&
      oldState.titleBarId === newState.titleBarId &&
      oldState.activityBarVisible === newState.activityBarVisible &&
      oldState.activityBarId === newState.activityBarId &&
      oldState.panelVisible === newState.panelVisible &&
      oldState.panelId === newState.panelId &&
      oldState.sideBarLocation === newState.sideBarLocation &&
      oldState.sideBarVisible === newState.sideBarVisible &&
      oldState.sideBarId === newState.sideBarId &&
      oldState.secondarySideBarVisible === newState.secondarySideBarVisible &&
      oldState.secondarySideBarId === newState.secondarySideBarId &&
      oldState.statusBarVisible === newState.statusBarVisible &&
      oldState.statusBarId === newState.statusBarId &&
      oldState.previewVisible === newState.previewVisible &&
      oldState.previewId === newState.previewId
    )
  },
  apply(oldState: LayoutState, newState: LayoutState) {
    const commands = ViewletLayoutRenderDom.renderDom(oldState, newState)
    return commands
  },
  multiple: true,
}

const getCss = (newState: LayoutState) => {
  const sideBarWidth = newState.sideBarWidth
  const activityBarWidth = newState.activityBarWidth
  const panelHeight = newState.panelHeight
  const titleBarHeight = newState.titleBarHeight
  const previewWidth = newState.previewWidth
  const sashSideBarLeft = newState.sideBarLeft
  const sashSecondarySideBarLeft = newState.secondarySideBarLeft
  const roundedSideBarWidth = Math.round(sideBarWidth)
  const roundedSashSideBarLeft = Math.round(sashSideBarLeft)
  const roundedSashSecondarySideBarLeft = Math.round(sashSecondarySideBarLeft)
  return `:root {
  --ActivityBarWidth: ${activityBarWidth}px;
  --PanelHeight: ${panelHeight}px;
  --SideBarWidth: ${roundedSideBarWidth}px;
  --TitleBarHeight: ${titleBarHeight}px;
  --PreviewWidth: ${previewWidth}px;
  --SashSideBarLeft: ${roundedSashSideBarLeft}px;
  --SashSecondarySideBarLeft: ${roundedSashSecondarySideBarLeft}px;
}`
}

const renderCss = {
  isEqual() {
    return false
  },
  apply(oldState: LayoutState, newState: LayoutState) {
    // @ts-ignore
    const css = getCss(newState)
    return [['Viewlet.setCss', newState.uid, css]]
  },
  multiple: true,
}

export const renderEventListeners = () => {
  return [
    {
      name: DomEventListenersFunctions.HandleSashSideBarPointerDown,
      params: ['handleSashSideBarPointerDown'],
      trackPointerEvents: [DomEventListenersFunctions.HandleSashSideBarPointerMove, DomEventListenersFunctions.HandleSashSideBarPointerUp],
    },
    {
      name: DomEventListenersFunctions.HandleSashSecondarySideBarPointerDown,
      params: ['handleSashSecondarySideBarPointerDown'],
      trackPointerEvents: [DomEventListenersFunctions.HandleSashSideBarPointerMove, DomEventListenersFunctions.HandleSashSideBarPointerUp],
    },
    {
      name: DomEventListenersFunctions.HandleSashSideBarPointerMove,
      params: ['handleSashPointerMove', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenersFunctions.HandleSashSideBarPointerUp,
      params: ['handleSashPointerUp'],
    },
    {
      name: DomEventListenersFunctions.HandleSashPanelPointerMove,
      params: ['handleSashPointerMove', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenersFunctions.HandleSashPanelPointerUp,
      params: ['handleSashSideBarPointerUp'],
    },
    {
      name: DomEventListenersFunctions.HandleSashPanelPointerDown,
      params: ['handleSashPanelPointerDown'],
      trackPointerEvents: [DomEventListenersFunctions.HandleSashPanelPointerMove, DomEventListenersFunctions.HandleSashPanelPointerUp],
    },
    {
      name: DomEventListenersFunctions.HandleSashPanelPointerMove,
      params: ['handleSashPointerMove', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenersFunctions.HandleSashPanelPointerUp,
      params: ['handleSashPanelPointerUp'],
    },
    {
      name: DomEventListenersFunctions.HandleSashPreviewPointerDown,
      params: ['handleSashPreviewPointerDown'],
      // trackPointerEvents: [DomEventListenersFunctions.HandleSashPanelPointerMove, DomEventListenersFunctions.HandleSashPanelPointerUp],
    },
  ]
}

const renderWindowListeners = {
  isEqual(oldState: LayoutState) {
    return !oldState.initial
  },
  apply() {
    return [['Viewlet.attachWindowEvents']]
  },
  multiple: true,
}

export const render = [renderDom, renderCss, renderWindowListeners]
