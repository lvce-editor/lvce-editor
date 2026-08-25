import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as PreviewOrientation from '../PreviewOrientation/PreviewOrientation.js'
import type { LayoutState } from '../ViewletLayout/LayoutState.ts'

const getMainContentsVirtualDom = (state: LayoutState) => {
  const { mainVisible, mainId, panelSashVisible, panelVisible, panelId } = state
  const children: any[] = []

  if (mainVisible && mainId !== -1) {
    children.push({
      type: VirtualDomElements.Reference,
      uid: mainId,
    })
  }

  if (panelSashVisible) {
    children.push(getSashPanelDom())
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
  return [
    {
      type: VirtualDomElements.Button,
      className: 'Viewlet Sash SashVertical SashSideBar',
      tabIndex: -1,
      role: 'none',
      onDblClick: DomEventListenerFunctions.HandleSashDoubleClick,
      onPointerDown: DomEventListenerFunctions.HandleSashSideBarPointerDown,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
  ]
}

const getSashSecondarySideBarDom = () => {
  return [
    {
      type: VirtualDomElements.Button,
      className: 'Viewlet Sash SashVertical SashSecondarySideBar',
      tabIndex: -1,
      role: 'none',
      onPointerDown: DomEventListenerFunctions.HandleSashSecondarySideBarPointerDown,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
  ]
}

const getSashPreviewDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: 'Viewlet Sash SashVertical SashPreview',
    tabIndex: -1,
    role: 'none',
    onPointerDown: DomEventListenerFunctions.HandleSashPreviewPointerDown,
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
  }
}

const getSashSecondaryPreviewDom = (horizontal = false) => {
  return {
    type: VirtualDomElements.Div,
    className: `Viewlet Sash ${horizontal ? 'SashHorizontal' : 'SashVertical'} SashSecondaryPreview`,
    tabIndex: -1,
    role: 'none',
    onPointerDown: DomEventListenerFunctions.HandleSashSecondaryPreviewPointerDown,
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
  }
}

const getSashPanelDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: 'Viewlet Sash SashHorizontal SashPanel',
    tabIndex: -1,
    role: 'none',
    onPointerDown: DomEventListenerFunctions.HandleSashPanelPointerDown,
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
  }
}

const getActivityBarDom = (activityBarId: number) => {
  if (activityBarId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet ActivityBar',
      childCount: 0,
    }
  }
  return {
    type: VirtualDomElements.Reference,
    uid: activityBarId,
  }
}

const getSideBarDom = (sideBarId: number) => {
  if (sideBarId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet SideBar',
      childCount: 0,
    }
  }
  return {
    type: VirtualDomElements.Reference,
    uid: sideBarId,
  }
}

const getSecondarySideBarDom = (secondarySideBarId: number) => {
  if (secondarySideBarId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet SecondarySideBar',
      childCount: 0,
    }
  }
  return {
    type: VirtualDomElements.Reference,
    uid: secondarySideBarId,
  }
}

const getMainDom = (mainId: number) => {
  if (mainId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet Main',
      childCount: 0,
    }
  } else {
    return {
      type: VirtualDomElements.Reference,
      uid: mainId,
    }
  }
}

const getPreviewDom = (previewId: number) => {
  if (previewId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet Preview',
      childCount: 0,
    }
  }
  return {
    type: VirtualDomElements.Reference,
    uid: previewId,
  }
}

const getSecondaryPreviewDom = (secondaryPreviewId: number) => {
  if (secondaryPreviewId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet SecondaryPreview',
      childCount: 0,
    }
  }
  return {
    type: VirtualDomElements.Reference,
    uid: secondaryPreviewId,
  }
}

const getPreviewActionsDom = (previewActionsUid: number) => {
  return {
    type: VirtualDomElements.Reference,
    uid: previewActionsUid,
  }
}

const getPreviewCloseButtonDom = () => {
  return [
    {
      ariaLabel: 'Close Preview',
      childCount: 1,
      className: 'IconButton PreviewCloseButton',
      onClick: DomEventListenerFunctions.HandleClickClose,
      title: 'Close Preview',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      type: VirtualDomElements.Div,
    },
  ]
}

const getSecondaryPreviewCloseButtonDom = () => {
  return [
    {
      ariaLabel: 'Close Secondary Preview',
      childCount: 1,
      className: 'IconButton SecondaryPreviewCloseButton',
      onClick: DomEventListenerFunctions.HandleClickCloseSecondaryPreview,
      title: 'Close Secondary Preview',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      type: VirtualDomElements.Div,
    },
  ]
}

const getPreviewAreaDom = (previewId: number, previewActionsUid: number | undefined, secondary: boolean) => {
  const actionsDom = typeof previewActionsUid === 'number' && previewActionsUid !== -1 ? [getPreviewActionsDom(previewActionsUid)] : []
  const previewDom = secondary ? getSecondaryPreviewDom(previewId) : getPreviewDom(previewId)
  const closeButtonDom = secondary ? getSecondaryPreviewCloseButtonDom() : getPreviewCloseButtonDom()
  return [
    {
      childCount: 2 + actionsDom.length,
      className: secondary ? 'PreviewArea SecondaryPreviewArea' : 'PreviewArea',
      type: VirtualDomElements.Div,
    },
    previewDom,
    ...actionsDom,
    ...closeButtonDom,
  ]
}

const getVerticalPreviewAreasDom = (state: LayoutState) => {
  const secondaryPreviewSashDom = state.secondaryPreviewSashVisible ? [getSashSecondaryPreviewDom(true)] : []
  return [
    {
      childCount: 2 + secondaryPreviewSashDom.length,
      className: 'PreviewAreas PreviewAreasVertical',
      type: VirtualDomElements.Div,
    },
    ...getPreviewAreaDom(state.previewId, state.previewActionsUid, false),
    ...secondaryPreviewSashDom,
    ...getPreviewAreaDom(state.secondaryPreviewId, state.secondaryPreviewActionsUid, true),
  ]
}

const getContentAreaVirtualDomLeft = (state: LayoutState) => {
  const {
    activityBarVisible,
    activityBarId,
    sideBarVisible,
    sideBarId,
    sideBarSashVisible,
    mainVisible,
    mainId,
    secondarySideBarVisible,
    secondarySideBarId,
  } = state
  const children: any[] = []

  let delta = 0
  // Add components based on sidebar location
  if (activityBarVisible && activityBarId !== -1) {
    children.push(getActivityBarDom(activityBarId))
  }
  if (sideBarVisible) {
    children.push(getSideBarDom(sideBarId))
  }
  if (sideBarSashVisible) {
    children.push(...getSashSideBarDom())
    delta--
  }
  if (mainVisible) {
    children.push(getMainDom(mainId))
  }

  if (secondarySideBarVisible) {
    children.push(...getSashSecondarySideBarDom())
    delta--
  }

  if (secondarySideBarVisible) {
    children.push(getSecondarySideBarDom(secondarySideBarId))
  }

  return [
    {
      type: VirtualDomElements.Div,
      className: 'ContentArea',
      childCount: children.length + delta,
    },
    ...children,
  ]
}

const getContentAreaVirtualDomRight = (state: LayoutState) => {
  const {
    secondarySideBarVisible,
    secondarySideBarId,
    mainVisible,
    mainId,
    sideBarSashVisible,
    sideBarVisible,
    sideBarId,
    activityBarVisible,
    activityBarId,
  } = state
  const children: any[] = []
  let delta = 0
  if (secondarySideBarVisible) {
    children.push(getSecondarySideBarDom(secondarySideBarId))
    children.push(...getSashSecondarySideBarDom())
    delta--
  }
  if (mainVisible) {
    children.push(getMainDom(mainId))
  }
  if (sideBarSashVisible) {
    children.push(...getSashSideBarDom())
    delta--
  }
  if (sideBarVisible) {
    children.push(getSideBarDom(sideBarId))
  }
  if (activityBarVisible) {
    children.push(getActivityBarDom(activityBarId))
  }
  return [
    {
      type: VirtualDomElements.Div,
      className: 'ContentArea',
      childCount: children.length + delta,
    },
    ...children,
  ]
}

const getTitleBarDom = (titleBarId: number) => {
  if (titleBarId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBar',
      childCount: 0,
    }
  } else {
    return {
      type: VirtualDomElements.Reference,
      uid: titleBarId,
    }
  }
}

const getStatusBarDom = (statusBarId: number) => {
  if (statusBarId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet StatusBar',
      childCount: 0,
    }
  } else {
    return {
      type: VirtualDomElements.Reference,
      uid: statusBarId,
    }
  }
}
const getPanelDom = (panelId: number) => {
  if (panelId === -1) {
    return {
      type: VirtualDomElements.Div,
      className: 'Viewlet StatusBar',
      childCount: 0,
    }
  } else {
    return {
      type: VirtualDomElements.Reference,
      uid: panelId,
    }
  }
}

const getContentAreaVirtualDom = (state: LayoutState) => {
  const { sideBarLocation } = state
  if (sideBarLocation === SideBarLocationType.Left) {
    return getContentAreaVirtualDomLeft(state)
  }
  return getContentAreaVirtualDomRight(state)
}

const getWorkbenchMainDom = (state: LayoutState) => {
  const { panelVisible, panelId, statusBarVisible, statusBarId } = state
  const children: any[] = [...getContentAreaVirtualDom(state)]
  let childCount = 1

  if (panelVisible) {
    childCount++
    children.push(getPanelDom(panelId))
  }

  if (statusBarVisible) {
    childCount++
    children.push(getStatusBarDom(statusBarId))
  }

  return [
    {
      childCount,
      className: 'WorkbenchMain',
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}

const getWorkbenchBodyDom = (state: LayoutState) => {
  const {
    previewActionsUid,
    previewId,
    previewSashVisible,
    previewVisible,
    secondaryPreviewActionsUid,
    secondaryPreviewId,
    secondaryPreviewSashVisible,
    secondaryPreviewVisible,
  } = state
  const children: any[] = [...getWorkbenchMainDom(state)]
  let childCount = 1
  const previewsAreVertical = state.previewOrientation === PreviewOrientation.Vertical && state.previewVisible && state.secondaryPreviewVisible

  if (previewsAreVertical) {
    if (previewSashVisible) {
      childCount++
      children.push(getSashPreviewDom())
    }
    childCount++
    children.push(...getVerticalPreviewAreasDom(state))
    return [
      {
        childCount,
        className: 'WorkbenchBody',
        type: VirtualDomElements.Div,
      },
      ...children,
    ]
  }

  if (previewSashVisible) {
    childCount++
    children.push(getSashPreviewDom())
  }

  if (previewVisible) {
    childCount++
    children.push(...getPreviewAreaDom(previewId, previewActionsUid, false))
  }

  if (secondaryPreviewSashVisible) {
    childCount++
    children.push(getSashSecondaryPreviewDom())
  }

  if (secondaryPreviewVisible) {
    childCount++
    children.push(...getPreviewAreaDom(secondaryPreviewId, secondaryPreviewActionsUid, true))
  }

  return [
    {
      childCount,
      className: 'WorkbenchBody',
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}

export const getLayoutVirtualDom = (state: LayoutState) => {
  const { titleBarVisible, titleBarId, panelSashVisible, panelVisible, widgetReferences = [], mountedViewletsBySource = {} } = state
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
    dom.push(getTitleBarDom(titleBarId))
  }

  workbenchChildCount++
  dom.push(...getWorkbenchBodyDom(state))

  if (panelVisible && panelSashVisible) {
    workbenchChildCount++
    dom.push(getSashPanelDom())
  }

  const mountedSources = Object.values(mountedViewletsBySource)
  const mountedViewlets = new Set(mountedSources.flat())
  const showAllWidgets = mountedSources.length === 0
  for (const widget of widgetReferences) {
    if (showAllWidgets || mountedViewlets.has(widget.parentUid)) {
      workbenchChildCount++
      dom.push({
        type: VirtualDomElements.Reference,
        uid: widget.uid,
      })
    }
  }

  // Update workbench childCount
  dom[0].childCount = workbenchChildCount

  return dom
}

export const getMainContentsLayoutVirtualDom = getMainContentsVirtualDom
