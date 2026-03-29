import { expect, test } from '@jest/globals'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'
import { getLayoutVirtualDom, getMainContentsLayoutVirtualDom } from '../src/parts/GetLayoutVirtualDom/GetLayoutVirtualDom.ts'

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

  const dom = getLayoutVirtualDom(state)
  const mainContentsDom = getMainContentsLayoutVirtualDom(state)
  const sashes = [...dom, ...mainContentsDom].filter((node) => node.className?.includes('Sash'))

  expect(sashes).toHaveLength(4)
  expect(sashes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashSideBar',
        tabIndex: -1,
      }),
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical SashSecondarySideBar',
        tabIndex: -1,
      }),
      expect.objectContaining({
        className: 'Viewlet Sash SashVertical',
        tabIndex: -1,
      }),
      expect.objectContaining({
        className: 'Viewlet Sash SashHorizontal',
        tabIndex: -1,
      }),
    ]),
  )
})
