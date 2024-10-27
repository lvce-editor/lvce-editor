import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
import { setTimeout } from 'node:timers/promises'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
  Workspace.state.workspacePath = ''
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
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
          path: '/tmp/some-folder',
          homeDir: '~',
        }

      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Workspace.hydrate({ href: 'http://localhost:3000' })
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Workspace.resolveRoot')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'WindowTitle.set', '/tmp/some-folder')
})

test.skip('hydrate - path changed in the meantime', async () => {
  // @ts-ignore
  let _resolve = (value) => {}
  // @ts-ignore
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...parameters) => {
    switch (method) {
      case 'Workspace.resolveRoot':
        await new Promise((resolve) => {
          _resolve = resolve
        })
        return {
          path: '/tmp/some-folder',
          homeDir: '~',
        }
      case 'FileSystem.getPathSeparator':
        return '/'
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
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(2)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Workspace.resolveRoot')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
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
      case 909090:
        // @ts-ignore
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  GlobalEventBus.addListener('workspace.change', listener)
  await Workspace.setPath('/test')
  expect(listener).toBeCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('/test')
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([909090, expect.any(Number), 'WindowTitle.set', '/test'])
})

test.skip('pathBaseName - linux', () => {
  Workspace.state.pathSeparator = '/'
  expect(Workspace.pathBaseName('/test/file.txt')).toBe('file.txt')
})

test.skip('pathBaseName - windows', () => {
  Workspace.state.pathSeparator = '\\'
  expect(Workspace.pathBaseName('\\test\\file.txt')).toBe('file.txt')
})
