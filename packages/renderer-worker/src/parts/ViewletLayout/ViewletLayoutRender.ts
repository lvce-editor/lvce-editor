import * as SashDirectionType from '../SashDirectionType/SashDirectionType.js'
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
const kSideBarTop = 13
const kSideBarLeft = 14
// @ts-ignore
const kSideBarWidth = 15
const kSideBarHeight = 16
// @ts-ignore
const kSideBarMinWidth = 17
// @ts-ignore
const kSideBarMaxWidth = 18

// @ts-ignore
const kPanelVisible = 19
const kpanelTop = 20
// const kPanelLeft = 21
const kPanelWidth = 22
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

const kSashId = 'sashId'

export const hasFunctionalRender = true

const renderSashes = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const { points } = newState
    const mainLeft = points[kMainLeft]
    // const mainWidth = points[kMainWidth]
    const sideBarLeft = points[kSideBarLeft]
    const sideBarTop = points[kSideBarTop]
    const sideBarHeight = points[kSideBarHeight]
    // const activityBarLeft = points[kActivityBarLeft]
    // const activityBarTop = points[kActivityBarTop]
    // const activityBarHeight = points[kActivityBarHeight]
    const panelTop = points[kpanelTop]
    const panelWidth = points[kPanelWidth]
    const sideBarActive = newState[kSashId] === 'SideBar'
    const panelActive = newState[kSashId] === 'Panel'
    // const activityBarActive = newState[kSashId] === 'ActivityBar'
    return [
      'setSashes',
      // {
      //   id: 'SashActivityBar',
      //   x: activityBarLeft,
      //   y: activityBarTop,
      //   width: 4,
      //   height: activityBarHeight,
      //   direction: SashDirectionType.Horizontal,
      //   active: activityBarActive,
      // },
      {
        id: 'SashSideBar',
        x: sideBarLeft,
        y: sideBarTop,
        width: 4,
        height: sideBarHeight,
        direction: SashDirectionType.Horizontal,
        active: sideBarActive,
      },
      {
        id: 'SashPanel',
        x: mainLeft,
        y: panelTop,
        width: panelWidth,
        height: 4,
        direction: SashDirectionType.Vertical,
        active: panelActive,
      },
    ]
  },
}

const renderDom = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    // @ts-ignore
    const commands = ViewletLayoutRenderDom.renderDom(oldState, newState)
    return []
  },
  multiple: true,
}

export const render = [renderDom, renderSashes]
