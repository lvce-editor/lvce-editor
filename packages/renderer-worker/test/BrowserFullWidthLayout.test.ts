import { expect, test } from '@jest/globals'
import * as Layout from '../src/parts/ViewletLayout/ViewletLayout.ts'
import * as LayoutPoints from '../src/parts/ViewletLayout/LayoutPoints.ts'
import { getLayoutVirtualDom } from '../src/parts/GetLayoutVirtualDom/GetLayoutVirtualDom.ts'

const createState = () =>
  LayoutPoints.getPoints({
    ...Layout.create(1),
    windowWidth: 1200,
    windowHeight: 800,
    titleBarVisible: true,
    titleBarId: 2,
    titleBarHeight: 35,
    mainVisible: true,
    previewVisible: true,
    previewId: 3,
    previewWidth: 420,
    panelVisible: true,
    panelHeight: 180,
    statusBarVisible: true,
  })

test('full width mounts only title bar and existing browser reference', () => {
  const state = createState()
  const fullWidth = LayoutPoints.getPoints({
    ...state,
    browserFullWidth: {
      browserUid: 3,
      layout: { previewWidth: 420, panelVisible: true, mainVisible: true, previewVisible: true, statusBarVisible: true },
      browserBounds: { x: 780, y: 35, width: 420, height: 765 },
      ideFocusUid: 10,
      addressFocused: false,
      hiddenBrowserUids: [],
    },
  })
  expect(fullWidth).toEqual(expect.objectContaining({ mainVisible: false, previewVisible: false, panelVisible: false, statusBarVisible: false }))
  const dom = getLayoutVirtualDom(fullWidth)
  expect(dom).toHaveLength(3)
  expect(dom[0].className).toContain('BrowserFullWidth')
  expect(dom.slice(1).map((node) => node.uid)).toEqual([2, 3])
  expect(Layout.saveState(fullWidth)).toEqual(Layout.saveState(state))
})

test('normal layout does not acquire a full width browser reference', () => {
  const state = createState()
  expect(getLayoutVirtualDom(state)[0].className).not.toContain('BrowserFullWidth')
})
