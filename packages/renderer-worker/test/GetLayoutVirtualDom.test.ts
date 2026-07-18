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

  expect(sashes).toHaveLength(4)
  expect(sashes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashSideBar',
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
