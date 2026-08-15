import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => ({
  saveViewletState: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  disposeFunctional: jest.fn(() => []),
}))

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  load: jest.fn(async () => []),
}))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('create initializes full screen state', () => {
  const state = ViewletLayout.create(1)

  expect(state.fullScreen).toBe(false)
  expect(state.titleBarVisibleBeforeFullScreen).toBe(false)
})

test('entering full screen hides a visible custom title bar', async () => {
  const state = {
    ...ViewletLayout.create(1),
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.handleFullScreenChange(state, true)

  expect(result.newState).toMatchObject({
    fullScreen: true,
    titleBarVisible: false,
    titleBarVisibleBeforeFullScreen: true,
  })
})

test('leaving full screen keeps a manually hidden title bar hidden', async () => {
  const state = {
    ...ViewletLayout.create(1),
    fullScreen: true,
    titleBarVisible: false,
    titleBarVisibleBeforeFullScreen: false,
  }

  const result = await ViewletLayout.handleFullScreenChange(state, false)

  expect(result.newState).toMatchObject({
    fullScreen: false,
    titleBarVisible: false,
    titleBarVisibleBeforeFullScreen: false,
  })
})

test('leaving full screen restores a title bar hidden by full screen', async () => {
  const state = {
    ...ViewletLayout.create(1),
    fullScreen: true,
    titleBarHeight: 35,
    titleBarVisible: false,
    titleBarVisibleBeforeFullScreen: true,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.handleFullScreenChange(state, false)

  expect(result.newState).toMatchObject({
    fullScreen: false,
    titleBarVisible: true,
    titleBarVisibleBeforeFullScreen: false,
  })
})

test('duplicate full screen events preserve the title bar snapshot', async () => {
  const state = {
    ...ViewletLayout.create(1),
    fullScreen: true,
    titleBarVisible: false,
    titleBarVisibleBeforeFullScreen: true,
  }

  const result = await ViewletLayout.handleFullScreenChange(state, true)

  expect(result.newState).toBe(state)
})

test('showing or toggling the title bar is ignored in full screen', async () => {
  const state = {
    ...ViewletLayout.create(1),
    fullScreen: true,
    titleBarVisible: false,
    titleBarVisibleBeforeFullScreen: true,
  }

  expect(await ViewletLayout.showTitleBar(state)).toEqual({ newState: state, commands: [] })
  expect(await ViewletLayout.toggleTitleBar(state)).toEqual({ newState: state, commands: [] })
})
