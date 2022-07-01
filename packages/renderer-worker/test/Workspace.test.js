import { jest } from '@jest/globals'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostRename.js',
  () => {
    return {
      executePrepareRenameProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
      executeRenameProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const Workspace = await import('../src/parts/Workspace/Workspace.js')

test('hydrate', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
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
  await Workspace.hydrate()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Workspace.resolveRoot')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'Window.setTitle',
    '/tmp/some-folder'
  )
})

test('hydrate - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
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
  await expect(Workspace.hydrate()).rejects.toThrowError(
    new Error('x is not a function')
  )
})

test.skip('setPath', async () => {
  const listener = jest.fn()
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
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
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    'Window.setTitle',
    '/test',
  ])
})

test.skip('pathBaseName - linux', () => {
  Workspace.state.pathSeparator = '/'
  expect(Workspace.pathBaseName('/test/file.txt')).toBe('file.txt')
})

test.skip('pathBaseName - windows', () => {
  Workspace.state.pathSeparator = '\\'
  expect(Workspace.pathBaseName('\\test\\file.txt')).toBe('file.txt')
})
