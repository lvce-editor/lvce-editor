import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn<any>()
const executeViewletCommand = jest.fn()
const getViewletState = jest.fn((_key: string) => ({ previewId: 71 }))
const focusSetFocus = jest.fn()
const rendererProcessInvoke = jest.fn()
const terminalWorkerInvoke = jest.fn()

beforeEach(() => {
  executeViewletCommand.mockClear()
  getViewletState.mockClear()
  focusSetFocus.mockClear()
  commandExecute.mockClear()
  rendererProcessInvoke.mockClear()
  terminalWorkerInvoke.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: commandExecute,
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getState: getViewletState }))

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => {
  return {
    setFocus: focusSetFocus,
  }
})

jest.unstable_mockModule('../src/parts/GetTerminalSpawnOptions/GetTerminalSpawnOptions.js', () => {
  return {
    getTerminalSpawnOptions() {
      return {
        command: 'bash',
        args: ['-i'],
      }
    },
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get(key) {
      if (key === 'terminal.backend') {
        return 'mock'
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

jest.unstable_mockModule('../src/parts/TerminalWorker/TerminalWorker.js', () => {
  return {
    invoke: terminalWorkerInvoke,
  }
})

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => {
  return {
    state: {
      workspacePath: '/workspace',
    },
  }
})

const ViewletTerminal2 = await import('../src/parts/ViewletTerminal2/ViewletTerminal2.ts')
const ViewletTerminal2Commands = await import('../src/parts/ViewletTerminal2/ViewletTerminal2Commands.ts')

test('create initializes xterm dimensions', () => {
  expect(ViewletTerminal2.create(1)).toMatchObject({
    columns: 80,
    disposed: false,
    rows: 24,
    uid: 1,
    xtermMounted: false,
  })
})

test('loadContent mounts xterm before starting the terminal transport', async () => {
  const state = ViewletTerminal2.create(2)
  const newState = await ViewletTerminal2.loadContent(state, undefined, undefined)

  expect(terminalWorkerInvoke).not.toHaveBeenCalled()
  expect(newState).toMatchObject({
    args: ['-i'],
    command: 'bash',
    xtermMounted: true,
  })
})

test('loadContent uses spawn options supplied by the terminal tabs parent', async () => {
  const state = ViewletTerminal2.create(9)
  const spawnOptions = {
    args: ['-l'],
    command: 'zsh',
  }

  const newState = await ViewletTerminal2.loadContent(state, undefined, spawnOptions)

  expect(terminalWorkerInvoke).not.toHaveBeenCalled()
  expect(newState).toMatchObject(spawnOptions)
})

test('loadContentLater starts the terminal transport in the requested cwd', async () => {
  const state = {
    ...ViewletTerminal2.create(2, 'file:///workspace/folder'),
    args: ['-i'],
    command: 'bash',
  }
  await ViewletTerminal2.loadContentLater(state)

  expect(terminalWorkerInvoke).toHaveBeenCalledWith('Terminal.create', 2, 'file:///workspace/folder', 'bash', ['-i'], {
    backend: 'mock',
  })
})

test('loadContentLater falls back to the workspace cwd', async () => {
  const state = {
    ...ViewletTerminal2.create(3),
    args: ['-l'],
    command: 'zsh',
  }
  await ViewletTerminal2.loadContentLater(state)

  expect(terminalWorkerInvoke).toHaveBeenCalledWith('Terminal.create', 3, '/workspace', 'zsh', ['-l'], {
    backend: 'mock',
  })
})

test('commands expose deferred terminal startup', () => {
  expect(ViewletTerminal2Commands.Commands.loadContentLater).toBe(ViewletTerminal2.loadContentLater)
})

test('handleInput forwards xterm input to the terminal worker', async () => {
  const state = ViewletTerminal2.create(3)
  await expect(ViewletTerminal2.handleInput(state, 'echo hello\r')).resolves.toBe(state)
  expect(terminalWorkerInvoke).toHaveBeenCalledWith('Terminal.write', 3, 'echo hello\r')
})

test('handleData forwards pty output to renderer-process xterm', async () => {
  const state = ViewletTerminal2.create(4)
  const data = new Uint8Array([97, 98, 99])
  await expect(ViewletTerminal2.handleData(state, data)).resolves.toBe(state)
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.send', 4, 'write', data)
})

test('handleExit removes the exited terminal from its parent', async () => {
  const state = ViewletTerminal2.create(10)

  await expect(ViewletTerminal2.handleExit(state)).resolves.toBe(state)

  expect(commandExecute).toHaveBeenCalledWith('Terminals.handleTerminalExit', 10)
})

test('resizeEffect forwards xterm dimensions to the terminal worker', async () => {
  const state = {
    ...ViewletTerminal2.create(5),
    columns: 120,
    rows: 40,
  }
  await ViewletTerminal2.resizeEffect(state)
  expect(terminalWorkerInvoke).toHaveBeenCalledWith('Terminal.resize', 5, 120, 40)
})

test('clear resets the xterm display', async () => {
  const state = ViewletTerminal2.create(6)
  await expect(ViewletTerminal2.clear(state)).resolves.toBe(state)
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.send', 6, 'write', new TextEncoder().encode('\u001Bc'))
})

test('handleMouseDown focuses the terminal context', () => {
  const state = ViewletTerminal2.create(7)
  expect(ViewletTerminal2.handleMouseDown(state)).toBe(state)
  expect(focusSetFocus).toHaveBeenCalledTimes(1)
})

test('dispose closes the terminal transport', async () => {
  const state = ViewletTerminal2.create(8)
  await expect(ViewletTerminal2.dispose(state)).resolves.toMatchObject({
    disposed: true,
  })
  expect(terminalWorkerInvoke).toHaveBeenCalledWith('Terminal.dispose', 8)
})

test.each(['http://localhost:3333/', 'https://example.com/path?query=value#section'])(
  'handleLink opens a foreground tab in the preview browser: %s',
  async (uri) => {
    const state = ViewletTerminal2.create(1)

    expect(await ViewletTerminal2.handleLink(state, uri)).toBe(state)

    expect(commandExecute).toHaveBeenCalledWith('Layout.showPreview', 'simple-browser://')
    expect(getViewletState).toHaveBeenCalledWith('Layout')
    expect(executeViewletCommand).toHaveBeenCalledWith(71, 'openTab', uri, 'foreground-tab')
  },
)

test('handleLink waits for the preview to finish opening before creating a tab', async () => {
  let finishOpening: () => void = () => {}
  commandExecute.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finishOpening = resolve
      }),
  )
  const promise = ViewletTerminal2.handleLink(ViewletTerminal2.create(1), 'http://localhost:3333/')
  expect(executeViewletCommand).not.toHaveBeenCalled()
  expect(getViewletState).not.toHaveBeenCalled()

  finishOpening()
  await promise

  expect(executeViewletCommand).toHaveBeenCalledWith(71, 'openTab', 'http://localhost:3333/', 'foreground-tab')
})

test.each(['javascript:alert(1)', 'file:///tmp/test.html', 'invalid', 'https://'])(
  'handleLink ignores unsupported or invalid links: %s',
  async (uri) => {
    const state = ViewletTerminal2.create(1)
    expect(await ViewletTerminal2.handleLink(state, uri)).toBe(state)
    expect(commandExecute).not.toHaveBeenCalled()
    expect(executeViewletCommand).not.toHaveBeenCalled()
  },
)

test('registers the terminal link handler', () => {
  expect(ViewletTerminal2Commands.Commands.handleLink).toBe(ViewletTerminal2.handleLink)
})

test('uses the host launch directory supplied by the container terminal resolver', async () => {
  const state = ViewletTerminal2.create(42, 'devcontainers:///abc123/src')
  const options = { command: '/usr/bin/node', args: ['devcontainer.js', 'exec', 'sh'], cwd: '/host/project' }
  const loaded = await ViewletTerminal2.loadContent(state, undefined, options)
  await ViewletTerminal2.loadContentLater(loaded)
  expect(terminalWorkerInvoke).toHaveBeenCalledWith('Terminal.create', 42, '/host/project', options.command, options.args, { backend: 'mock' })
})
