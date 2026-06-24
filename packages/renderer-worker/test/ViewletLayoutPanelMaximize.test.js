import { beforeEach, expect, jest, test } from '@jest/globals'

const panelWorkerInvocations = []
let panelWorkerDiffResult = []
let panelWorkerRenderCommands = []

jest.unstable_mockModule('../src/parts/PanelWorker/PanelWorker.js', () => {
  return {
    invoke: async (method, ...args) => {
      panelWorkerInvocations.push([method, ...args])
      switch (method) {
        case 'Panel.handlePanelLayoutChanged':
          return undefined
        case 'Panel.diff2':
          return panelWorkerDiffResult
        case 'Panel.render2':
          return panelWorkerRenderCommands
        default:
          throw new Error(`unexpected panel worker method ${method}`)
      }
    },
    restart: async () => {},
  }
})

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  ViewletStates.reset()
  panelWorkerInvocations.length = 0
  panelWorkerDiffResult = []
  panelWorkerRenderCommands = []
})

const createPanelInstance = (uid = 77) => {
  const instance = {
    factory: {
      resize: async (state, dimensions) => {
        return {
          newState: {
            ...state,
            ...dimensions,
          },
          commands: [],
        }
      },
    },
    moduleId: 'Panel',
    renderedState: {
      uid,
    },
    state: {
      uid,
    },
  }
  ViewletStates.set('Panel', instance)
  ViewletStates.set(uid, instance)
}

const createActivityBarInstance = (uid = 88) => {
  const instance = {
    factory: {
      resize: async (state, dimensions) => {
        return {
          newState: {
            ...state,
            ...dimensions,
          },
          commands: [['Viewlet.setBounds', uid, dimensions.x, dimensions.y, dimensions.width, dimensions.height]],
        }
      },
    },
    moduleId: 'ActivityBar',
    renderedState: {
      uid,
    },
    state: {
      uid,
    },
  }
  ViewletStates.set('ActivityBar', instance)
  ViewletStates.set(uid, instance)
}

test('create initializes panelMaximized to false', () => {
  const state = ViewletLayout.create(1)

  expect(state.panelMaximized).toBe(false)
})

test('create initializes explicitBounds to false', () => {
  const state = ViewletLayout.create(1)

  expect(state.explicitBounds).toBe(false)
})

test('setExplicitBounds enables explicit bounds and resizes layout', async () => {
  createActivityBarInstance()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 88,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainVisible: true,
    panelMaxHeight: 600,
    panelMinHeight: 150,
    sideBarMaxWidth: 9999999,
    sideBarMinWidth: 170,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.setExplicitBounds(state, 480, 320)

  expect(result.newState).toMatchObject({
    explicitBounds: true,
    windowWidth: 480,
    windowHeight: 320,
    mainLeft: 0,
    mainTop: 35,
    mainWidth: 300,
    mainHeight: 265,
  })
  expect(result.commands).toEqual([['Viewlet.setBounds', 88, 432, 35, 48, 265]])
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

test('maximizePanel notifies panel worker when panel instance exists', async () => {
  createPanelInstance()
  panelWorkerDiffResult = [11]
  panelWorkerRenderCommands = [['Viewlet.setPatches', 77, []]]
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

  expect(result.commands).toEqual([['Viewlet.setPatches', 77, []]])
  expect(panelWorkerInvocations).toEqual([
    ['Panel.handlePanelLayoutChanged', 77, { maximized: true }],
    ['Panel.diff2', 77],
    ['Panel.render2', 77, [11]],
  ])
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
  createPanelInstance()
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
  expect(panelWorkerInvocations).toEqual([])
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

test('unmaximizePanel notifies panel worker when panel instance exists', async () => {
  createPanelInstance()
  panelWorkerDiffResult = [11]
  panelWorkerRenderCommands = [['Viewlet.setPatches', 77, []]]
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

  expect(result.commands).toEqual([['Viewlet.setPatches', 77, []]])
  expect(panelWorkerInvocations).toEqual([
    ['Panel.handlePanelLayoutChanged', 77, { maximized: false }],
    ['Panel.diff2', 77],
    ['Panel.render2', 77, [11]],
  ])
})

test('unmaximizePanel is a no-op when not maximized', async () => {
  createPanelInstance()
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
  expect(panelWorkerInvocations).toEqual([])
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
