import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()
const rendererProcessInvoke = jest.fn()
const viewletDisposeFunctional = jest.fn((uid) => [['Viewlet.dispose', uid]])
const viewletExecuteViewletCommand = jest.fn()
const viewletResize = jest.fn(async (uid, dimensions) => [['Viewlet.setBounds', uid, dimensions]])
const viewletStatesGetInstance = jest.fn()
const viewletStatesRemove = jest.fn()
let nextId = 42
let terminalTabsPreference: boolean | undefined
const terminalSpawnOptions = {
  args: ['-i'],
  command: 'bash',
}

beforeEach(() => {
  jest.clearAllMocks()
  nextId = 42
  terminalTabsPreference = undefined
  viewletStatesGetInstance.mockReturnValue(undefined)
  terminalSpawnOptions.args = ['-i']
  terminalSpawnOptions.command = 'bash'
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

jest.unstable_mockModule('../src/parts/GetTerminalSpawnOptions/GetTerminalSpawnOptions.js', () => {
  return {
    getTerminalSpawnOptions() {
      return terminalSpawnOptions
    },
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get(key) {
      if (key === 'terminal.tabs.enabled') {
        return terminalTabsPreference
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
    executeViewletCommand: viewletExecuteViewletCommand,
    resize: viewletResize,
  }
})

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => {
  return {
    getInstance: viewletStatesGetInstance,
    remove: viewletStatesRemove,
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
    tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [41], uid: 41 }],
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
      width: 800,
      x: 10,
      y: 20,
    },
    'file:///workspace/folder',
    [terminalSpawnOptions],
  )
  expect(newState).toMatchObject({
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [42],
    selectedIndex: 0,
    tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [42], uid: 42 }],
    terminalTabsEnabled: true,
  })
})

test('loadContent preserves an explicit disabled terminal tabs preference', async () => {
  terminalTabsPreference = false
  const state = ViewletTerminals.create(1, 'file:///workspace/folder', 10, 20, 800, 400)

  const newState = await ViewletTerminals.loadContent(state)

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    expect.objectContaining({ width: 800 }),
    'file:///workspace/folder',
    [terminalSpawnOptions],
  )
  expect(newState.terminalTabsEnabled).toBe(false)
})

test('loadContent reuses running terminals when the panel is reopened', async () => {
  const existingState = {
    ...createLoadedState(),
    height: 200,
    uid: 7,
    width: 600,
    x: 1,
    y: 2,
  }
  viewletStatesGetInstance.mockReturnValue({ state: existingState })
  const state = ViewletTerminals.create(9, 'file:///workspace/folder', 10, 20, 800, 400)

  const newState = await ViewletTerminals.loadContent(state)

  expect(commandExecute).not.toHaveBeenCalled()
  expect(viewletResize).toHaveBeenCalledWith(41, {
    height: 400,
    width: 800,
    x: 10,
    y: 20,
  })
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.setBounds', 41, { height: 400, width: 800, x: 10, y: 20 }],
  ])
  expect(viewletStatesRemove).toHaveBeenCalledWith(7)
  expect(newState).toMatchObject({
    childUid: 41,
    childUids: [41],
    selectedIndex: 0,
    tabs: existingState.tabs,
    uid: 9,
  })
})

test('loadContent creates a terminal after the previous terminal was killed', async () => {
  const existingState = {
    ...createLoadedState(),
    activeTerminalUids: [],
    childUid: -1,
    childUids: [],
    selectedIndex: -1,
    tabs: [],
    uid: 7,
  }
  viewletStatesGetInstance.mockReturnValue({ state: existingState })
  const state = ViewletTerminals.create(9, 'file:///workspace/folder', 10, 20, 800, 400)

  const newState = await ViewletTerminals.loadContent(state)

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    expect.anything(),
    'file:///workspace/folder',
    [terminalSpawnOptions],
  )
  expect(viewletStatesRemove).toHaveBeenCalledWith(7)
  expect(newState.childUid).toBe(42)
})

test('loadContent derives the terminal label and icon from the shell executable', async () => {
  terminalSpawnOptions.command = '/usr/bin/zsh'
  const state = ViewletTerminals.create(1, '', 10, 20, 800, 400)

  const newState = await ViewletTerminals.loadContent(state)

  expect(newState.tabs).toEqual([{ icon: 'terminal-bash', label: 'zsh', terminalUids: [42], uid: 42 }])
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
    [terminalSpawnOptions],
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

  expect(commandExecute).toHaveBeenCalledWith('Layout.createViewlet', ViewletModuleId.Terminal2, 42, 0, expect.anything(), '', [terminalSpawnOptions])
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
      name: 'handleClickTab',
      params: ['handleClickTab', 'event.currentTarget.dataset.index'],
    },
    {
      name: 'handleClickTerminalTabAction',
      params: ['handleClickTerminalTabAction', 'event.currentTarget.dataset.index', 'event.currentTarget.dataset.command'],
      stopPropagation: true,
    },
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

  expect(commandExecute).toHaveBeenCalledWith('Layout.createViewlet', ViewletModuleId.Terminal2, 42, 0, expect.anything(), '', [terminalSpawnOptions])
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
      width: 400,
      x: 410,
      y: 20,
    },
    '',
    [terminalSpawnOptions],
  )
  expect(viewletResize).toHaveBeenCalledWith(41, {
    height: 400,
    width: 400,
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
    tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [40, 41], uid: 40 }],
  }

  const newState = await ViewletTerminals.splitTerminal(state)

  expect(newState.childUids).toEqual([40, 41, 42])
  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    expect.objectContaining({ x: 10 + (800 / 3) * 2 }),
    '',
    [terminalSpawnOptions],
  )
})

test('handleMouseDown selects and focuses the terminal the user pressed', () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [41, 42],
    tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [41, 42], uid: 41 }],
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

test('sendText writes text to the active terminal', async () => {
  const state = createLoadedState()

  await expect(ViewletTerminals.sendText(state, 'echo hello world\r')).resolves.toBe(state)

  expect(viewletExecuteViewletCommand).toHaveBeenCalledWith(41, 'handleInput', 'echo hello world\r')
})

test('sendText rejects when there is no active terminal', async () => {
  const state = ViewletTerminals.create(1, '', 10, 20, 800, 400)

  await expect(ViewletTerminals.sendText(state, 'echo hello world\r')).rejects.toThrow('No active terminal')
  expect(viewletExecuteViewletCommand).not.toHaveBeenCalled()
})

test('killTerminal disposes the active split and expands the remaining split', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [42],
    childUid: 42,
    childUids: [41, 42],
    tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [41, 42], uid: 41 }],
  }

  const newState = await ViewletTerminals.killTerminal(state)

  expect(viewletDisposeFunctional).toHaveBeenCalledWith(42)
  expect(viewletResize).toHaveBeenCalledWith(41, {
    height: 400,
    width: 800,
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
      { icon: 'terminal-bash', label: 'bash', terminalUids: [41], uid: 41 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [42], uid: 42 },
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
      { icon: 'terminal-bash', label: 'bash', terminalUids: [41], uid: 41 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [42, 43], uid: 42 },
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

test('handleClickTab selects a terminal from its DOM dataset index', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [41, 42],
    tabs: [
      { icon: 'terminal-bash', label: 'bash', terminalUids: [41], uid: 41 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [42], uid: 42 },
    ],
  }

  const newState = await ViewletTerminals.handleClickTab(state, '1')

  expect(newState).toMatchObject({
    childUid: 42,
    childUids: [42],
    selectedIndex: 1,
  })
})

test('handleClickTerminalTabAction disposes the clicked terminal tab and focuses the previous tab', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [41, 42, 43],
    childUid: 41,
    childUids: [41],
    selectedIndex: 0,
    tabs: [
      { icon: 'terminal-bash', label: 'bash', terminalUids: [41], uid: 41 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [42], uid: 42 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [43], uid: 43 },
    ],
  }

  const newState = await ViewletTerminals.handleClickTerminalTabAction(state, '2', 'killTerminalTab')

  expect(viewletDisposeFunctional).toHaveBeenCalledWith(43)
  expect(viewletResize).toHaveBeenCalledWith(42, {
    height: 400,
    width: 710,
    x: 10,
    y: 20,
  })
  expect(newState).toMatchObject({
    activeTerminalUids: [41, 42],
    childUid: 42,
    childUids: [42],
    selectedIndex: 1,
  })
})

test('killTerminalTab expands the remaining terminal when the sidebar becomes hidden', async () => {
  const state = {
    ...createLoadedState(),
    activeTerminalUids: [41, 42],
    childUid: 42,
    childUids: [42],
    selectedIndex: 1,
    tabs: [
      { icon: 'terminal-bash', label: 'bash', terminalUids: [41], uid: 41 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [42], uid: 42 },
    ],
  }

  const newState = await ViewletTerminals.killTerminalTab(state, 1)

  expect(viewletDisposeFunctional).toHaveBeenCalledWith(42)
  expect(viewletResize).toHaveBeenCalledWith(41, {
    height: 400,
    width: 800,
    x: 10,
    y: 20,
  })
  expect(newState).toMatchObject({
    activeTerminalUids: [41],
    childUid: 41,
    childUids: [41],
    selectedIndex: 0,
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
