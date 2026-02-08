import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
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

const getSashSideBarDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: 'Viewlet Sash SashVertical',
    onPointerDown: DomEventListenerFunctions.HandleSashSideBarPointerDown,
  }
}
const getSashPanelDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: 'Viewlet Sash SashHorizontal',
    onPointerDown: DomEventListenerFunctions.HandleSashPanelPointerDown,
  }
}

const getContentAreaVirtualDomLeft = (state: LayoutState) => {
  const children: any[] = []

  // Add components based on sidebar location
  if (state.activityBarVisible && state.activityBarId !== -1) {
    if (state.activityBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet ActivityBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.activityBarId,
      })
    }
  }
  if (state.sideBarVisible) {
    if (state.sideBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet SideBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.sideBarId,
      })
    }
  }
  if (state.sideBarSashVisible) {
    children.push(getSashSideBarDom())
  }
  if (state.mainVisible && state.mainId !== -1) {
    if (state.mainId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet Main',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.mainId,
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

const getContentAreaVirtualDomRight = (state: LayoutState) => {
  const children: any[] = []

  // Right sidebar location
  if (state.mainVisible) {
    if (state.mainId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet Main',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.mainId,
      })
    }
  } else {
    children.push({
      type: VirtualDomElements.Div,
      className: 'Viewlet Main',
      childCount: 0,
    })
  }
  if (state.sideBarSashVisible) {
    children.push(getSashSideBarDom())
  }
  if (state.sideBarVisible) {
    if (state.sideBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet SideBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: state.sideBarId,
      })
    }
  }
  if (state.activityBarVisible) {
    if (state.activityBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet ActivityBar',
        childCount: 0,
      })
    } else {
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

const getContentAreaVirtualDom = (state: LayoutState) => {
  if (state.sideBarLocation === SideBarLocationType.Left) {
    return getContentAreaVirtualDomLeft(state)
  }
  return getContentAreaVirtualDomRight(state)
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

  if (state.titleBarVisible) {
    workbenchChildCount++
    if (state.titleBarId === -1) {
      dom.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet TitleBar',
        childCount: 0,
      })
    } else {
      dom.push({
        type: VirtualDomElements.Reference,
        uid: state.titleBarId,
      })
    }
  }

  workbenchChildCount++
  dom.push(...getContentAreaVirtualDom(state))

  // Add StatusBar if visible
  if (state.statusBarVisible) {
    workbenchChildCount++
    if (state.statusBarId === -1) {
      dom.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet StatusBar',
        childCount: 0,
      })
    } else {
      dom.push({
        type: VirtualDomElements.Reference,
        uid: state.statusBarId,
      })
    }
  }

  // Update workbench childCount
  dom[0].childCount = workbenchChildCount

  return dom
}

export const getMainContentsLayoutVirtualDom = getMainContentsVirtualDom
