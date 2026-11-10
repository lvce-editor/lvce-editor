import { expect, test } from '@jest/globals'
import * as Layout from '../src/parts/ViewletLayout/ViewletLayout.ts'

test('detached editor layout uses all content bounds without restoring sidebars or panels', () => {
  const state = Layout.loadContent(Layout.create(1), {
    Layout: { bounds: { windowWidth: 800, windowHeight: 600 } },
    detachedEditor: true,
    restore: false,
    sideBarVisible: true,
    secondarySideBarVisible: true,
    panelVisible: true,
    previewVisible: true,
  })
  expect(state.mainVisible).toBe(true)
  expect(state.mainLeft).toBe(0)
  expect(state.mainWidth).toBe(800)
  expect(state.mainHeight).toBe(600 - state.titleBarHeight)
  expect(state.restore).toBe(false)
  for (const key of [
    'activityBarVisible',
    'sideBarVisible',
    'secondarySideBarVisible',
    'panelVisible',
    'previewVisible',
    'secondaryPreviewVisible',
    'statusBarVisible',
    'activityBarSashVisible',
    'sideBarSashVisible',
    'panelSashVisible',
  ]) {
    expect(state[key]).toBe(false)
  }
})
