import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import type { LayoutState } from '../ViewletLayout/LayoutState.ts'

const getMainContentsVirtualDom = (state: LayoutState) => {
  const children: any[] = []

  if (state.mainVisible && state.mainId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: state.mainId,
    })
  }

  if (state.panelSashVisible && state.panelSashId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: state.panelSashId,
    })
  }

  if (state.panelVisible && state.panelId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: state.panelId,
    })
  }

  return [
    {
      type: VirtualDomElements.Div,
      className: 'MainContents',
      childCount: children.length,
    },
    ...children,
  ]
}

const getContentAreaVirtualDom = (state: LayoutState) => {
  const children: any[] = []

  // Add components based on sidebar location
  if (state.sideBarLocation === SideBarLocationType.Left) {
    if (state.activityBarVisible && state.activityBarId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.activityBarId,
      })
    }
    if (state.sideBarVisible && state.sideBarId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.sideBarId,
      })
    }
    if (state.sideBarSashVisible && state.sideBarSashId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.sideBarSashId,
      })
    }
    if (state.mainContentsVisible && state.mainContentsId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.mainContentsId,
      })
    }
  } else {
    // Right sidebar location
    if (state.mainContentsVisible && state.mainContentsId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.mainContentsId,
      })
    }
    if (state.sideBarSashVisible && state.sideBarSashId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.sideBarSashId,
      })
    }
    if (state.sideBarVisible && state.sideBarId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.sideBarId,
      })
    }
    if (state.activityBarVisible && state.activityBarId !== -1) {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.activityBarId,
      })
    }
  }

  return [
    {
      type: VirtualDomElements.Div,
      className: 'ContentArea',
      childCount: children.length,
    },
    ...children,
  ]
}

export const getLayoutVirtualDom = (state: LayoutState) => {
  const dom: any[] = []
  let workbenchChildCount = 0

  dom.push({
    type: VirtualDomElements.Div,
    id: 'Workbench',
    className: 'Viewlet Layout Workbench new',
    role: 'application',
    childCount: 0,
  })

  // Add TitleBar if visible
  if (state.titleBarVisible && state.titleBarId !== -1) {
    workbenchChildCount++
    dom.push({
      type: VirtualDomElements.Reference,
      uid: state.titleBarId,
    })
  }

  // Add ContentArea if visible
  // if (state.contentAreaVisible && state.contentAreaId !== -1) {
  workbenchChildCount++
  dom.push(...getContentAreaVirtualDom(state))
  // }

  // Add StatusBar if visible
  if (state.statusBarVisible && state.statusBarId !== -1) {
    workbenchChildCount++
    dom.push({
      type: VirtualDomElements.Reference,
      uid: state.statusBarId,
    })
  }

  // Update workbench childCount
  dom[0].childCount = workbenchChildCount

  return dom
}

export const getMainContentsLayoutVirtualDom = getMainContentsVirtualDom
