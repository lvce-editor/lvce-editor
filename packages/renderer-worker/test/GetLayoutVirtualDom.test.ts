import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'
import { getLayoutVirtualDom } from '../src/parts/GetLayoutVirtualDom/GetLayoutVirtualDom.ts'

test('getLayoutVirtualDom renders sashes with tabIndex -1', () => {
  const state = {
    activityBarVisible: false,
    mainVisible: true,
    mainId: 1,
    panelSashVisible: true,
    panelVisible: true,
    panelId: 2,
    previewSashVisible: true,
    previewActionsUid: 6,
    previewVisible: true,
    previewId: 3,
    secondarySideBarVisible: true,
    secondarySideBarId: 4,
    sideBarLocation: SideBarLocationType.Left,
    sideBarSashVisible: true,
    sideBarVisible: true,
    sideBarId: 5,
    statusBarVisible: false,
    statusBarId: -1,
    titleBarVisible: false,
    titleBarId: -1,
  }

  // @ts-ignore
  const dom = getLayoutVirtualDom(state)
  const sashes = dom.filter((node) => node.className?.includes('Sash'))
  const previewCloseButton = dom.find((node) => node.className?.includes('PreviewCloseButton'))
  const previewActions = dom.find((node) => node.uid === 6)

  expect(sashes).toHaveLength(4)
  expect(sashes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashSideBar',
        onDblClick: DomEventListenerFunctions.HandleSashDoubleClick,
        tabIndex: -1,
        onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      }),
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashSecondarySideBar',
        tabIndex: -1,
        onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      }),
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashPreview',
        tabIndex: -1,
        onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      }),
      expect.objectContaining({
        className: 'Viewlet Sash SashHorizontal SashPanel',
        tabIndex: -1,
        onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      }),
    ]),
  )
  expect(previewCloseButton).toEqual(
    expect.objectContaining({
      ariaLabel: 'Close Preview',
      onClick: DomEventListenerFunctions.HandleClickClose,
      title: 'Close Preview',
    }),
  )
  expect(previewActions).toEqual({
    type: 100,
    uid: 6,
  })
})

test('getLayoutVirtualDom does not render the preview close button when preview is hidden', () => {
  const state = {
    activityBarVisible: false,
    mainVisible: true,
    mainId: 1,
    panelSashVisible: false,
    panelVisible: false,
    panelId: -1,
    previewSashVisible: false,
    previewVisible: false,
    previewId: -1,
    secondarySideBarVisible: false,
    secondarySideBarId: -1,
    sideBarLocation: SideBarLocationType.Left,
    sideBarSashVisible: false,
    sideBarVisible: false,
    sideBarId: -1,
    statusBarVisible: false,
    statusBarId: -1,
    titleBarVisible: false,
    titleBarId: -1,
  }

  // @ts-ignore
  const dom = getLayoutVirtualDom(state)

  expect(dom.some((node) => node.className?.includes('PreviewCloseButton'))).toBe(false)
})

test.each([
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
])('getLayoutVirtualDom wraps preview content with the side bar on the %s', (_name, sideBarLocation) => {
  const state = {
    activityBarVisible: false,
    mainVisible: true,
    mainId: 1,
    panelSashVisible: false,
    panelVisible: false,
    panelId: -1,
    previewActionsUid: 3,
    previewSashVisible: false,
    previewVisible: true,
    previewId: 2,
    secondarySideBarVisible: false,
    secondarySideBarId: -1,
    sideBarLocation,
    sideBarSashVisible: false,
    sideBarVisible: false,
    sideBarId: -1,
    statusBarVisible: false,
    statusBarId: -1,
    titleBarVisible: false,
    titleBarId: -1,
  }

  // @ts-ignore
  const dom = getLayoutVirtualDom(state)
  const previewAreaIndex = dom.findIndex((node) => node.className === 'PreviewArea')

  expect(dom.slice(previewAreaIndex, previewAreaIndex + 5)).toEqual([
    {
      childCount: 3,
      className: 'PreviewArea',
      type: 4,
    },
    { type: 100, uid: 2 },
    { type: 100, uid: 3 },
    expect.objectContaining({
      ariaLabel: 'Close Preview',
      childCount: 1,
      className: 'IconButton PreviewCloseButton',
    }),
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      type: 4,
    },
  ])
})

test('getLayoutVirtualDom renders an independently closable secondary preview', () => {
  const state = {
    activityBarVisible: false,
    mainVisible: true,
    mainId: 1,
    panelSashVisible: false,
    panelVisible: false,
    panelId: -1,
    previewSashVisible: false,
    previewVisible: false,
    previewId: -1,
    secondaryPreviewActionsUid: 7,
    secondaryPreviewSashVisible: true,
    secondaryPreviewVisible: true,
    secondaryPreviewId: 6,
    secondarySideBarVisible: false,
    secondarySideBarId: -1,
    sideBarLocation: SideBarLocationType.Left,
    sideBarSashVisible: false,
    sideBarVisible: false,
    sideBarId: -1,
    statusBarVisible: false,
    statusBarId: -1,
    titleBarVisible: false,
    titleBarId: -1,
  }

  // @ts-ignore
  const dom = getLayoutVirtualDom(state)

  expect(dom).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashSecondaryPreview',
        onPointerDown: DomEventListenerFunctions.HandleSashSecondaryPreviewPointerDown,
      }),
      expect.objectContaining({
        ariaLabel: 'Close Secondary Preview',
        className: 'IconButton SecondaryPreviewCloseButton',
        onClick: DomEventListenerFunctions.HandleClickCloseSecondaryPreview,
      }),
      { type: 100, uid: 6 },
      { type: 100, uid: 7 },
    ]),
  )
})

test('getLayoutVirtualDom renders visible widgets as the final Workbench children', () => {
  const state = {
    activityBarVisible: false,
    mainVisible: true,
    mainId: 1,
    mountedViewletsBySource: { 50: [10] },
    panelSashVisible: false,
    panelVisible: false,
    panelId: -1,
    previewSashVisible: false,
    previewVisible: false,
    previewId: -1,
    secondarySideBarVisible: false,
    secondarySideBarId: -1,
    sideBarLocation: SideBarLocationType.Left,
    sideBarSashVisible: false,
    sideBarVisible: false,
    sideBarId: -1,
    statusBarVisible: false,
    statusBarId: -1,
    titleBarVisible: false,
    titleBarId: -1,
    widgetReferences: [
      { parentUid: 10, uid: 20 },
      { parentUid: 11, uid: 21 },
    ],
  }

  // @ts-ignore
  const dom = getLayoutVirtualDom(state)

  expect(dom.at(-1)).toEqual({ type: 100, uid: 20 })
  expect(dom.some((node) => node.uid === 21)).toBe(false)
  expect(dom[0].childCount).toBe(2)
})

test('getLayoutVirtualDom keeps widgets visible before mounted viewlets are first published', () => {
  const state = {
    activityBarVisible: false,
    mainVisible: true,
    mainId: 1,
    panelSashVisible: false,
    panelVisible: false,
    panelId: -1,
    previewSashVisible: false,
    previewVisible: false,
    previewId: -1,
    secondarySideBarVisible: false,
    secondarySideBarId: -1,
    sideBarLocation: SideBarLocationType.Left,
    sideBarSashVisible: false,
    sideBarVisible: false,
    sideBarId: -1,
    statusBarVisible: false,
    statusBarId: -1,
    titleBarVisible: false,
    titleBarId: -1,
    widgetReferences: [{ parentUid: 10, uid: 20 }],
  }

  // @ts-ignore
  const dom = getLayoutVirtualDom(state)

  expect(dom.at(-1)).toEqual({ type: 100, uid: 20 })
})
