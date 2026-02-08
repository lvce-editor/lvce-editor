import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import type { LayoutState } from '../ViewletLayout/LayoutState.ts'

const getMainContentsVirtualDom = (state: LayoutState) => {
  const { mainVisible, mainId, panelSashVisible, panelSashId, panelVisible, panelId } = state
  const children: any[] = []

  if (mainVisible && mainId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: mainId,
    })
  }

  if (panelSashVisible && panelSashId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: panelSashId,
    })
  }

  if (panelVisible && panelId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: panelId,
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

// @ts-ignore
const getSashPanelDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: 'Viewlet Sash SashHorizontal',
    onPointerDown: DomEventListenerFunctions.HandleSashPanelPointerDown,
  }
}

const getContentAreaVirtualDomLeft = (state: LayoutState) => {
  const { activityBarVisible, activityBarId, sideBarVisible, sideBarId, sideBarSashVisible, mainVisible, mainId, previewSashVisible, previewVisible, previewId } = state
  const children: any[] = []

  // Add components based on sidebar location
  if (activityBarVisible && activityBarId !== -1) {
    if (activityBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet ActivityBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: activityBarId,
      })
    }
  }
  if (sideBarVisible) {
    if (sideBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet SideBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: sideBarId,
      })
    }
  }
  if (sideBarSashVisible) {
    children.push(getSashSideBarDom())
  }
  if (mainVisible && mainId !== -1) {
    if (mainId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet SideBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: mainId,
      })
    }
  }

  // Preview sash (vertical)
  if (previewSashVisible) {
    children.push({
      type: VirtualDomElements.Div,
      className: 'Viewlet Sash SashVertical',
      onPointerDown: DomEventListenerFunctions.HandleSashSideBarPointerDown,
    })
  }

  // Preview panel
  if (previewVisible && previewId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: previewId,
    })
  } else if (previewVisible) {
    children.push({
      type: VirtualDomElements.Div,
      className: 'Viewlet Preview',
      childCount: 0,
    })
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
  const { mainVisible, mainId, sideBarSashVisible, sideBarVisible, sideBarId, activityBarVisible, activityBarId, previewSashVisible, previewVisible, previewId } = state
  const children: any[] = []

  // Right sidebar location
  if (mainVisible) {
    if (mainId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet Main',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: mainId,
      })
    }
  } else {
    children.push({
      type: VirtualDomElements.Div,
      className: 'Viewlet Main',
      childCount: 0,
    })
  }

  // Preview sash (vertical)
  if (previewSashVisible) {
    children.push({
      type: VirtualDomElements.Div,
      className: 'Viewlet Sash SashVertical',
      onPointerDown: DomEventListenerFunctions.HandleSashSideBarPointerDown,
    })
  }

  // Preview panel
  if (previewVisible && previewId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: previewId,
    })
  } else if (previewVisible) {
    children.push({
      type: VirtualDomElements.Div,
      className: 'Viewlet Preview',
      childCount: 0,
    })
  }

  if (sideBarSashVisible) {
    children.push(getSashSideBarDom())
  }
  if (sideBarVisible) {
    if (sideBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet SideBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: sideBarId,
      })
    }
  }
  if (activityBarVisible) {
    if (activityBarId === -1) {
      children.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet ActivityBar',
        childCount: 0,
      })
    } else {
      children.push({
        type: VirtualDomElements.Reference,
        uid: activityBarId,
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
  const { sideBarLocation } = state
  if (sideBarLocation === SideBarLocationType.Left) {
    return getContentAreaVirtualDomLeft(state)
  }
  return getContentAreaVirtualDomRight(state)
}

export const getLayoutVirtualDom = (state: LayoutState) => {
  const { titleBarVisible, titleBarId, statusBarVisible, statusBarId } = state
  const dom: any[] = []
  let workbenchChildCount = 0

  dom.push({
    type: VirtualDomElements.Div,
    id: 'Workbench',
    className: 'Viewlet Layout Workbench new',
    role: 'application',
    childCount: 0,
  })

  if (titleBarVisible) {
    workbenchChildCount++
    if (titleBarId === -1) {
      dom.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet TitleBar',
        childCount: 0,
      })
    } else {
      dom.push({
        type: VirtualDomElements.Reference,
        uid: titleBarId,
      })
    }
  }

  workbenchChildCount++
  dom.push(...getContentAreaVirtualDom(state))

  // Add StatusBar if visible
  if (statusBarVisible) {
    workbenchChildCount++
    if (statusBarId === -1) {
      dom.push({
        type: VirtualDomElements.Div,
        className: 'Viewlet StatusBar',
        childCount: 0,
      })
    } else {
      dom.push({
        type: VirtualDomElements.Reference,
        uid: statusBarId,
      })
    }
  }

  // Update workbench childCount
  dom[0].childCount = workbenchChildCount

  return dom
}

export const getMainContentsLayoutVirtualDom = getMainContentsVirtualDom
