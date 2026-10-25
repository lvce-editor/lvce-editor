import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
// @ts-ignore
import { setTimeout } from 'node:timers/promises'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.state.instances = Object.create(null)
  Workspace.state.isTest = false
  Workspace.state.workspacePath = ''
  Workspace.state.workspaceUri = ''
  Workspace.state.pathSeparator = ''
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  canBeRestored: jest.fn(() => true),
  exists: jest.fn(async () => true),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/StatusBarWorker/StatusBarWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostCommands.js', () => ({ executeCommand: jest.fn() }))
const ExtensionHostCommands = await import('../src/parts/ExtensionHost/ExtensionHostCommands.js')
const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const StatusBarWorker = await import('../src/parts/StatusBarWorker/StatusBarWorker.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')
const Command = await import('../src/parts/Command/Command.js')

beforeAll(() => {
  Command.setLoad((moduleId) => {
    switch (moduleId) {
      case ModuleId.Ajax:
        return import('../src/parts/Ajax/Ajax.ipc.js')
      case ModuleId.SessionStorage:
        return import('../src/parts/SessionStorage/SessionStorage.ipc.js')
      default:
        throw new Error(`module not found ${moduleId}`)
    }
  })
})

test('hydrate', async () => {
  // @ts-ignore
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Workspace.resolveRoot':
        return {
          homeDir: '~',
          path: '/tmp/some-folder',
          pathSeparator: '\\',
          source: 'shared-process',
          uri: 'file:///tmp/some-folder',
        }

      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Workspace.hydrate({ href: 'http://localhost:3000', workspaceUri: 'remote-ssh://user@example.com/home' })
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Workspace.resolveRoot', 'http://localhost:3000', 'remote-ssh://user@example.com/home')
  expect(Workspace.state.pathSeparator).toBe('/')
  const windowTitleCalls = jest.mocked(RendererProcess.invoke).mock.calls.filter(([method]) => method === 'WindowTitle.set')
  expect(windowTitleCalls).toEqual([['WindowTitle.set', 'some-folder']])
})

test('hydrate - path changed in the meantime', async () => {
  let _resolve: () => void = () => {}
  // @ts-ignore
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'Workspace.resolveRoot':
        await new Promise<void>((resolve) => {
          _resolve = resolve
        })
        return {
          homeDir: '~',
          path: '/tmp/some-folder',
          pathSeparator: '/',
          source: 'shared-process',
          uri: 'file:///tmp/some-folder',
        }
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const promise1 = Workspace.hydrate({ href: 'http://localhost:3000' })
  const promise2 = Workspace.setPath('/test')
  await promise2
  await setTimeout(0)
  _resolve()
  await promise1
  expect(Workspace.state.workspacePath).toBe('/test')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Workspace.resolveRoot', 'http://localhost:3000', '')
  const windowTitleCalls = jest.mocked(RendererProcess.invoke).mock.calls.filter(([method]) => method === 'WindowTitle.set')
  expect(windowTitleCalls).toEqual([['WindowTitle.set', 'test']])
})

test('hydrate - error', async () => {
  // @ts-ignore
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Workspace.resolveRoot':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // TODO should handle error gracefully
  await expect(Workspace.hydrate({ href: 'http://localhost:3000' })).rejects.toThrow(new Error('x is not a function'))
})

test.skip('setPath', async () => {
  const listener = jest.fn()
  RendererProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 909_090:
        // @ts-ignore
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67_330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  GlobalEventBus.addListener('workspace.change', listener)
  await Workspace.setPath('/test')
  // @ts-ignore
  expect(listener).toHaveBeenCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('/test')
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([909_090, expect.any(Number), 'WindowTitle.set', '/test'])
})

test.skip('pathBaseName - linux', () => {
  Workspace.state.pathSeparator = '/'
  expect(Workspace.pathBaseName('/test/file.txt')).toBe('file.txt')
})

test.skip('pathBaseName - windows', () => {
  Workspace.state.pathSeparator = '\\'
  expect(Workspace.pathBaseName('\\test\\file.txt')).toBe('file.txt')
})

test('close closes editors before clearing the workspace', async () => {
  const closeAllEditors = jest.fn(async () => undefined)
  const hasDirtyTabs = jest.fn(async () => false)
  Command.register('Main.closeAllEditorsAndSave', closeAllEditors)
  Command.register('Main.hasDirtyTabs', hasDirtyTabs)
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)
  Workspace.state.workspacePath = '/test'

  await Workspace.close()

  expect(closeAllEditors).toHaveBeenCalledTimes(1)
  expect(hasDirtyTabs).toHaveBeenCalledTimes(1)
  expect(StatusBarWorker.invoke).toHaveBeenCalledTimes(1)
  expect(StatusBarWorker.invoke).toHaveBeenCalledWith('StatusBar.handleEditorStatusChanged', undefined)
  expect(Workspace.state.workspacePath).toBe('')
})

test('close keeps the workspace open when closing a dirty editor is canceled', async () => {
  const closeAllEditors = jest.fn(async () => undefined)
  const hasDirtyTabs = jest.fn(async () => true)
  Command.register('Main.closeAllEditorsAndSave', closeAllEditors)
  Command.register('Main.hasDirtyTabs', hasDirtyTabs)
  Workspace.state.workspacePath = '/test'
  Workspace.state.workspaceUri = 'file:///test'

  await Workspace.close()

  expect(closeAllEditors).toHaveBeenCalledTimes(1)
  expect(hasDirtyTabs).toHaveBeenCalledTimes(1)
  expect(Workspace.state.workspacePath).toBe('/test')
  expect(Workspace.state.workspaceUri).toBe('file:///test')
  expect(StatusBarWorker.invoke).not.toHaveBeenCalled()
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

for (const method of ['setPath', 'setUri'] as const) {
  test(`${method} keeps the workspace and runtime when unsaved changes are canceled`, async () => {
    ViewletStates.set('Main', { factory: {}, renderedState: { uid: 2 }, state: { uid: 2 } })
    Workspace.state.workspacePath = '/old'
    Workspace.state.workspaceUri = 'file:///old'
    const closeAllEditors = jest.fn(async () => undefined)
    Command.register('Main.closeAllEditorsAndSave', closeAllEditors)
    Command.register(
      'Main.hasDirtyTabs',
      jest.fn(async () => true),
    )
    const beforeChange = jest.fn(async () => {})
    GlobalEventBus.addListener('workspace.beforeChange', beforeChange)
    try {
      await Workspace[method](method === 'setUri' ? 'file:///new' : '/new')
      expect(closeAllEditors).toHaveBeenCalledTimes(1)
      expect(beforeChange).not.toHaveBeenCalled()
      expect(RendererProcess.invoke).not.toHaveBeenCalled()
      expect(Workspace.state.workspacePath).toBe('/old')
      expect(Workspace.state.workspaceUri).toBe('file:///old')
    } finally {
      GlobalEventBus.removeListener('workspace.beforeChange', beforeChange)
    }
  })

  test(`${method} resolves unsaved changes before disposing the workspace runtime`, async () => {
    ViewletStates.set('Main', { factory: {}, renderedState: { uid: 2 }, state: { uid: 2 } })
    Workspace.state.workspacePath = '/old'
    Workspace.state.workspaceUri = 'file:///old'
    jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)
    const hasDirtyTabs = jest.fn(async () => false).mockResolvedValueOnce(true)
    const closeAllEditors = jest.fn(async () => undefined)
    Command.register('Main.closeAllEditorsAndSave', closeAllEditors)
    Command.register('Main.hasDirtyTabs', hasDirtyTabs)
    const beforeChange = jest.fn(async () => {
      expect(closeAllEditors).toHaveBeenCalledTimes(1)
      expect(hasDirtyTabs).toHaveBeenCalledTimes(2)
    })
    GlobalEventBus.addListener('workspace.beforeChange', beforeChange)
    try {
      await Workspace[method](method === 'setUri' ? 'file:///new' : '/new')
      expect(beforeChange).toHaveBeenCalledTimes(1)
      expect(Workspace.state.workspacePath).toBe('/new')
      expect(Workspace.state.workspaceUri).toBe('file:///new')
    } finally {
      GlobalEventBus.removeListener('workspace.beforeChange', beforeChange)
    }
  })
}

test('opening a recent remote-server folder prepares its transport before changing the workspace', async () => {
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)
  WorkspaceConnection.reset()
  const uri = 'remote-server://remote.example/home/test/project'
  jest.mocked(ExtensionHostCommands.executeCommand).mockResolvedValue({
    command: 'remote-server.getWebSocketUrl',
    disposeCommand: 'remote-server.releaseWorkspace',
    workspacePath: '/home/test/project',
  })
  expect(await Workspace.setUri(uri)).toBe(true)
  expect(ExtensionHostCommands.executeCommand).toHaveBeenCalledWith('remote-server.prepareWorkspace', uri)
  expect(Workspace.getWorkspaceUri()).toBe(uri)
  expect(Workspace.getPath()).toBe('/home/test/project')
  expect(WorkspaceConnection.getCommand()).toBe('remote-server.getWebSocketUrl')
  WorkspaceConnection.reset()
})

test('canceling remote preparation keeps the existing folder', async () => {
  Workspace.state.workspacePath = '/old'
  Workspace.state.workspaceUri = 'file:///old'
  jest.mocked(ExtensionHostCommands.executeCommand).mockResolvedValue(undefined)
  expect(await Workspace.setUri('remote-server://remote.example/home/test/project')).toBe(false)
  expect(Workspace.getWorkspaceUri()).toBe('file:///old')
})

test('hydrating a remote workspace restores connection metadata without prompting for pairing', async () => {
  const uri = 'remote-server://remote.example/home/test/project'
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)
  WorkspaceConnection.reset()
  jest.mocked(SharedProcess.invoke).mockResolvedValue({ homeDir: '', path: uri, uri, pathSeparator: '/', source: 'shared-process-cli-arg' })
  jest.mocked(ExtensionHostCommands.executeCommand).mockResolvedValue({
    command: 'remote-server.getWebSocketUrl',
    disposeCommand: 'remote-server.releaseWorkspace',
    workspacePath: '/home/test/project',
  })
  await Workspace.hydrate({ href: 'https://example.com/lvce-editor/', workspaceUri: uri })
  expect(ExtensionHostCommands.executeCommand).toHaveBeenCalledWith('remote-server.prepareWorkspace', uri, false)
  expect(Workspace.getPath()).toBe('/home/test/project')
  expect(WorkspaceConnection.getCommand()).toBe('remote-server.getWebSocketUrl')
  WorkspaceConnection.reset()
})

test('a late remote-session restore cannot replace a newer workspace', async () => {
  const uri = 'remote-server://remote.example/home/test/project'
  const { promise, resolve } = Promise.withResolvers<unknown>()
  const { promise: started, resolve: markStarted } = Promise.withResolvers<void>()
  WorkspaceConnection.reset()
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)
  jest.mocked(SharedProcess.invoke).mockResolvedValue({ homeDir: '', path: uri, uri, pathSeparator: '/', source: 'shared-process-cli-arg' })
  jest.mocked(ExtensionHostCommands.executeCommand).mockImplementation(async () => {
    markStarted()
    return promise
  })
  const restoring = Workspace.hydrate({ href: 'https://example.com/lvce-editor/', workspaceUri: uri })
  await started
  await Workspace.setUri('file:///newer')
  resolve({ command: 'remote-server.getWebSocketUrl', disposeCommand: 'remote-server.releaseWorkspace', workspacePath: '/home/test/project' })
  await restoring
  expect(Workspace.getWorkspaceUri()).toBe('file:///newer')
  expect(Workspace.getPath()).toBe('/newer')
  expect(WorkspaceConnection.getCommand()).toBe('')
})

test('Open Recent keeps views and terminals when the remote folder is already active', async () => {
  const uri = 'remote-server://remote.example/home/test/project'
  const connection = {
    command: 'remote-server.getWebSocketUrl',
    disposeCommand: 'remote-server.releaseWorkspace',
    workspacePath: '/home/test/project',
  }
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)
  WorkspaceConnection.reset()
  await Workspace.setUri(uri, '/', connection)
  jest.mocked(RendererProcess.invoke).mockClear()
  jest.mocked(ExtensionHostCommands.executeCommand).mockResolvedValue(connection)
  const changed = jest.fn(async () => {})
  GlobalEventBus.addListener('workspace.change', changed)
  try {
    expect(await Workspace.setUri(uri)).toBe(true)
    expect(changed).not.toHaveBeenCalled()
    expect(RendererProcess.invoke).not.toHaveBeenCalled()
  } finally {
    GlobalEventBus.removeListener('workspace.change', changed)
    WorkspaceConnection.reset()
  }
})
