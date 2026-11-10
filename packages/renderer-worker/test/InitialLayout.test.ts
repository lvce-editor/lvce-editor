import { afterEach, expect, test } from '@jest/globals'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'
import * as Layout from '../src/parts/ViewletLayout/ViewletLayout.ts'

afterEach(() => RuntimeConfig.initialize())

test('embedded layout hides unused views before calculating the first render', () => {
  RuntimeConfig.initialize({
    initialLayout: {
      activityBarVisible: false,
      panelVisible: false,
      secondarySideBarVisible: false,
      sideBarVisible: false,
      statusBarVisible: false,
      titleBarVisible: false,
    },
  })
  const state = Layout.loadContent(Layout.create(1), {
    Layout: { bounds: { windowHeight: 600, windowWidth: 800 } },
    panelVisible: true,
    restore: true,
    sideBarVisible: true,
  })
  const { mainHeight, mainLeft, mainTop, mainWidth } = state
  expect(mainLeft).toBe(0)
  expect(mainTop).toBe(0)
  expect(mainWidth).toBe(800)
  expect(mainHeight).toBe(600)
  for (const key of Object.keys(RuntimeConfig.runtimeConfig.initialLayout!)) {
    expect(state[key]).toBe(false)
  }
})

test('normal startup retains visible activity and status bars', () => {
  const state = Layout.loadContent(Layout.create(1), { Layout: { bounds: { windowHeight: 600, windowWidth: 800 } } })
  const { activityBarVisible, statusBarVisible } = state
  expect(activityBarVisible).toBe(true)
  expect(statusBarVisible).toBe(true)
})
