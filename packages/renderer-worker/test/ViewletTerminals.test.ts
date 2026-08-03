import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()
const rendererProcessInvoke = jest.fn()
const viewletDisposeFunctional = jest.fn((uid) => [['Viewlet.dispose', uid]])
const viewletResize = jest.fn(async (uid, dimensions) => [['Viewlet.setBounds', uid, dimensions]])
let nextId = 42

beforeEach(() => {
  jest.clearAllMocks()
  nextId = 42
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: commandExecute,
  }
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create() {
      return nextId++
    },
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get(key) {
      if (key === 'terminal.tabs.enabled') {
        return true
      }
      return undefined
    },
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: rendererProcessInvoke,
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeFunctional: viewletDisposeFunctional,
    resize: viewletResize,
  }
})

const ViewletModuleId = await import('../src/parts/ViewletModuleId/ViewletModuleId.js')
const ViewletTerminals = await import('../src/parts/ViewletTerminals/ViewletTerminals.js')
const ViewletTerminalsRender = await import('../src/parts/ViewletTerminals/ViewletTerminalsRender.js')
const ViewletTerminalsRenderActions = await import('../src/parts/ViewletTerminals/ViewletTerminalsRenderActions.js')

const createLoadedState = () => {
  return {
    ...ViewletTerminals.create(1, '', 10, 20, 800, 400),
    activeTerminalUids: [41],
    childUid: 41,
    childUids: [41],
    selectedIndex: 0,
    tabs: [{ icon: 'Terminal', label: 'tab 1', terminalUids: [41], uid: 41 }],
    terminalTabsEnabled: true,
  }
}

test('loadContent creates the xterm terminal view with the requested cwd', async () => {
  const state = ViewletTerminals.create(1, 'file:///workspace/folder', 10, 20, 800, 400)
  const newState = await ViewletTerminals.loadContent(state)

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    {
      height: 400,
      width: 710,
      x: 10,
      y: 20,
    },
    'file:///workspace/folder',
  )
  expect(newState).toMatchObject({
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [42],
    selectedIndex: 0,
    terminalTabsEnabled: true,
  })
})

test('addTerminal opens a new terminal tab without disposing the current terminal', async () => {
  const state = createLoadedState()

  const newState = await ViewletTerminals.addTerminal(state, 'file:///workspace/folder')

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    {
      height: 400,
      width: 710,
      x: 10,
      y: 20,
    },
    'file:///workspace/folder',
  )
  expect(viewletDisposeFunctional).not.toHaveBeenCalled()
  expect(newState).toMatchObject({
    activeTerminalUids: [41, 42],
    childUid: 42,
    childUids: [42],
    focusVersion: 1,
    selectedIndex: 1,
  })
})

test('handleClickAction routes the panel add action', async () => {
  const state = createLoadedState()

  const newState = await ViewletTerminals.handleClickAction(state, 0, 'addTerminal')

  expect(commandExecute).toHaveBeenCalledWith('Layout.createViewlet', ViewletModuleId.Terminal2, 42, 0, expect.anything(), '')
  expect(newState.childUid).toBe(42)
})

test('renderActions wires terminal toolbar buttons to handleClickAction', () => {
  const state = createLoadedState()

  const dom = ViewletTerminalsRenderActions.renderActions.apply(state, state)

  expect(dom).toContainEqual(expect.objectContaining({ 'data-command': 'splitTerminal', onClick: 'handleClickAction' }))
})

test('renderEventListeners routes terminal toolbar clicks and stops panel event delegation', () => {
  expect(ViewletTerminalsRender.renderEventListeners()).toEqual([
    {
      name: 'handleClickAction',
      params: ['handleClickAction', 'event.target.dataset.command'],
      stopPropagation: true,
    },
  ])
})

test('handleClickAction routes a functional action-root split event', async () => {
  const state = createLoadedState()

  const newState = await ViewletTerminals.handleClickAction(state, 'splitTerminal')

  expect(commandExecute).toHaveBeenCalledWith('Layout.createViewlet', ViewletModuleId.Terminal2, 42, 0, expect.anything(), '')
  expect(newState.childUids).toEqual([41, 42])
})

test('splitTerminal opens a new terminal to the right of the active terminal', async () => {
  const state = createLoadedState()

  const newState = await ViewletTerminals.splitTerminal(state)

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    {
      height: 400,
      width: 355,
      x: 365,
      y: 20,
    },
    '',
  )
  expect(viewletResize).toHaveBeenCalledWith(41, {
    height: 400,
    width: 355,
    x: 10,
    y: 20,
  })
  expect(newState).toMatchObject({
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [41, 42],
    focusVersion: 1,
    tabs: [{ terminalUids: [41, 42] }],
  })
})

test('splitTerminal inserts the new terminal directly after the active split', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [41],
    childUid: 41,
    childUids: [40, 41],
    tabs: [{ icon: 'Terminal', label: 'tab 1', terminalUids: [40, 41], uid: 40 }],
  }

  const newState = await ViewletTerminals.splitTerminal(state)

  expect(newState.childUids).toEqual([40, 41, 42])
  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    expect.objectContaining({ x: 10 + (710 / 3) * 2 }),
    '',
  )
})

test('handleMouseDown selects and focuses the terminal the user pressed', () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [41, 42],
    tabs: [{ icon: 'Terminal', label: 'tab 1', terminalUids: [41, 42], uid: 41 }],
  }

  const newState = ViewletTerminals.handleMouseDown(state, 41)

  expect(newState).toMatchObject({
    activeTerminalUids: [41],
    childUid: 41,
    focusVersion: 1,
  })
  expect(ViewletTerminalsRender.renderFocus.apply(state, newState)).toEqual([['Viewlet.focus', 41]])
})

test('handleMouseDown focuses an already active terminal', () => {
  const state = createLoadedState()

  const newState = ViewletTerminals.handleMouseDown(state, 41)

  expect(newState).toMatchObject({
    activeTerminalUids: [41],
    childUid: 41,
    focusVersion: 1,
  })
  expect(ViewletTerminalsRender.renderFocus.apply(state, newState)).toEqual([['Viewlet.focus', 41]])
})

test('killTerminal disposes the active split and expands the remaining split', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [41, 42],
    tabs: [{ icon: 'Terminal', label: 'tab 1', terminalUids: [41, 42], uid: 41 }],
  }

  const newState = await ViewletTerminals.killTerminal(state)

  expect(viewletDisposeFunctional).toHaveBeenCalledWith(42)
  expect(viewletResize).toHaveBeenCalledWith(41, {
    height: 400,
    width: 710,
    x: 10,
    y: 20,
  })
  expect(newState).toMatchObject({
    activeTerminalUids: [41],
    childUid: 41,
    childUids: [41],
    focusVersion: 1,
    tabs: [{ terminalUids: [41] }],
  })
})

test('killTerminal removes an empty tab and selects the next terminal tab', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [41, 42],
    childUid: 41,
    childUids: [41],
    tabs: [
      { icon: 'Terminal', label: 'tab 1', terminalUids: [41], uid: 41 },
      { icon: 'Terminal', label: 'tab 2', terminalUids: [42], uid: 42 },
    ],
  }

  const newState = await ViewletTerminals.killTerminal(state)

  expect(viewletDisposeFunctional).toHaveBeenCalledWith(41)
  expect(newState).toMatchObject({
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [42],
    selectedIndex: 0,
  })
})

test('focusIndex selects an existing terminal group without recreating or disposing it', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [41, 43],
    childUid: 41,
    childUids: [41],
    tabs: [
      { icon: 'Terminal', label: 'tab 1', terminalUids: [41], uid: 41 },
      { icon: 'Terminal', label: 'tab 2', terminalUids: [42, 43], uid: 42 },
    ],
  }

  const newState = await ViewletTerminals.focusIndex(state, 1)

  expect(commandExecute).not.toHaveBeenCalled()
  expect(viewletDisposeFunctional).not.toHaveBeenCalled()
  expect(newState).toMatchObject({
    childUid: 43,
    childUids: [42, 43],
    focusVersion: 1,
    selectedIndex: 1,
  })
})

test('getOwnedViewletIds includes every terminal instance for parent disposal', () => {
  const state = {
    ...createLoadedState(),
    tabs: [
      { terminalUids: [41, 42], uid: 41 },
      { terminalUids: [43], uid: 43 },
    ],
  }

  expect(ViewletTerminals.getOwnedViewletIds(state)).toEqual([41, 42, 43])
})

test('focus eventually focuses the active xterm child', () => {
  const state = createLoadedState()

  const newState = ViewletTerminals.focus(state)

  expect(newState.focusVersion).toBe(1)
  expect(ViewletTerminalsRender.renderFocus.isEqual(state, newState)).toBe(false)
  expect(ViewletTerminalsRender.renderFocus.apply(state, newState)).toEqual([['Viewlet.focus', 41]])
})

test('focus does nothing when there are no terminal instances', () => {
  const state = ViewletTerminals.create(1, '', 10, 20, 800, 400)

  expect(ViewletTerminals.focus(state)).toBe(state)
})
