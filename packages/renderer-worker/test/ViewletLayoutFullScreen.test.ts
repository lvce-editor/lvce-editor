import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => ({
  saveViewletState: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  disposeFunctional: jest.fn(() => []),
  resize: jest.fn(async () => []),
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

test('leaving fullscreen recreates the title bar after restoring the full-width browser layout', async () => {
  const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  let state = {
    ...ViewletLayout.create(1),
    titleBarHeight: 35,
    titleBarId: 77,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  }
  for (let iteration = 0; iteration < 3; iteration++) {
    const previousId = state.titleBarId
    const expanded = {
      ...state,
      browserFullWidth: {
        browserUid: 88,
        layout: { titleBarVisible: true, titleBarHeight: 35, mainVisible: true, panelHeight: 200, panelHeightBeforeMaximize: 200 },
        browserWasVisible: true,
        browserBounds: { x: 600, y: 35, width: 600, height: 765 },
        ideFocusUid: 1,
        addressFocused: false,
        hiddenBrowserUids: [],
      },
    }
    const entered = await ViewletLayout.handleFullScreenChange(expanded, true)
    expect(Viewlet.disposeFunctional).toHaveBeenLastCalledWith('TitleBar')
    expect(entered.newState.titleBarVisible).toBe(false)
    jest.mocked(ViewletManager.load).mockClear()
    const exited = await ViewletLayout.handleFullScreenChange(entered.newState, false)
    expect(ViewletManager.load).toHaveBeenCalledTimes(1)
    expect(exited.newState.titleBarId).not.toBe(previousId)
    expect(ViewletManager.load).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'TitleBar', uid: exited.newState.titleBarId }),
      false,
      true,
      undefined,
    )
    expect(exited.newState).toMatchObject({ titleBarVisible: true, fullScreen: false, browserFullWidth: undefined })
    state = exited.newState
  }
})
