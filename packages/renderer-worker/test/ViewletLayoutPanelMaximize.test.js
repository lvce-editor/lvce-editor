import { expect, test } from '@jest/globals'

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('create initializes panelMaximized to false', () => {
  const state = ViewletLayout.create(1)

  expect(state.panelMaximized).toBe(false)
})

test('create initializes panelHeightBeforeMaximize to 0', () => {
  const state = ViewletLayout.create(1)

  expect(state.panelHeightBeforeMaximize).toBe(0)
})

test('maximizePanel enlarges panel and sets panelMaximized to true', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: true,
    panelHeight: 200,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.maximizePanel(state)

  expect(result.newState.panelMaximized).toBe(true)
  expect(result.newState.panelHeightBeforeMaximize).toBe(200)
  // Maximized height = min(windowHeight - titleBar - statusBar - mainMin, panelMaxHeight)
  // = min(800 - 0 - 20 - 100, 600) = 600
  expect(result.newState.panelHeight).toBe(600)
})

test('maximizePanel clamps height to panelMaxHeight', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: true,
    panelHeight: 200,
    panelMaxHeight: 400,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.maximizePanel(state)

  expect(result.newState.panelMaximized).toBe(true)
  // Computed max would be 680, but panelMaxHeight is 400, so clamped to 400
  expect(result.newState.panelHeight).toBe(400)
})

test('maximizePanel is a no-op when already maximized', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: true,
    panelHeight: 500,
    panelMaximized: true,
    panelHeightBeforeMaximize: 200,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.maximizePanel(state)

  expect(result).toEqual({
    newState: state,
    commands: [],
  })
})

test('maximizePanel auto-shows the panel if hidden', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: false,
    panelHeight: 200,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.maximizePanel(state)

  expect(result.newState.panelMaximized).toBe(true)
  expect(result.newState.panelVisible).toBe(true)
})

test('unmaximizePanel restores saved height and clears maximized flag', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: true,
    panelHeight: 680,
    panelMaximized: true,
    panelHeightBeforeMaximize: 200,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.unmaximizePanel(state)

  expect(result.newState.panelMaximized).toBe(false)
  expect(result.newState.panelHeight).toBe(200)
})

test('unmaximizePanel is a no-op when not maximized', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: true,
    panelHeight: 200,
    panelMaximized: false,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.unmaximizePanel(state)

  expect(result).toEqual({
    newState: state,
    commands: [],
  })
})

test('unmaximizePanel is a no-op when panel is hidden', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: false,
    panelHeight: 200,
    panelMaximized: true,
    panelHeightBeforeMaximize: 200,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.unmaximizePanel(state)

  expect(result).toEqual({
    newState: state,
    commands: [],
  })
})

test('maximizePanel then unmaximizePanel round-trips to original height', async () => {
  const state = {
    ...ViewletLayout.create(1),
    panelVisible: true,
    panelHeight: 200,
    panelMaxHeight: 600,
    titleBarHeight: 0,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const maximized = await ViewletLayout.maximizePanel(state)
  const unmaximized = await ViewletLayout.unmaximizePanel(maximized.newState)

  expect(unmaximized.newState.panelMaximized).toBe(false)
  expect(unmaximized.newState.panelHeight).toBe(200)
})
