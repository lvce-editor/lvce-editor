/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.js', () => {
  return {
    create: jest.fn(() => {
      return {}
    }),
  }
})

jest.unstable_mockModule('https://example.com/worker.js', () => {}, {
  virtual: true,
})

jest.unstable_mockModule('https://example.com/not-found.js', () => {}, {
  virtual: true,
})

const IpcParentWithMessagePort = await import('../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.js')
const IpcParentWithModuleWorkerWithMessagePort = await import(
  '../src/parts/IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.js'
)

test('create - error - not supported in firefox', async () => {
  // @ts-ignore
  globalThis.Worker = class extends EventTarget {
    constructor() {
      super()

      setTimeout(() => {
        const errorEvent = new ErrorEvent('error', {
          message: 'SyntaxError: import declarations may only appear at top level of a module',
        })
        this.dispatchEvent(errorEvent)
      }, 0)
    }
  }
  // @ts-ignore
  globalThis.MessagePort = class {}
  // @ts-ignore
  IpcParentWithMessagePort.create.mockImplementation(() => {
    return new MessagePort()
  })
  expect(
    await IpcParentWithModuleWorkerWithMessagePort.create({
      url: 'https://example.com/worker.js',
      name: 'Extension Host Worker',
    })
  ).toEqual(new MessagePort())
  expect(IpcParentWithMessagePort.create).toHaveBeenCalledTimes(1)
  expect(IpcParentWithMessagePort.create).toHaveBeenCalledWith({
    url: 'https://example.com/worker.js',
  })
})

test('create - error - not found', async () => {
  // @ts-ignore
  globalThis.Worker = class extends EventTarget {
    constructor() {
      super()

      setTimeout(() => {
        const errorEvent = new Event('error', {})
        this.dispatchEvent(errorEvent)
      }, 0)
    }
  }
  // @ts-ignore
  globalThis.fetch = () => {
    return {
      status: 404,
    }
  }
  // @ts-ignore
  IpcParentWithMessagePort.create.mockImplementation(() => {
    return {}
  })
  await expect(
    IpcParentWithModuleWorkerWithMessagePort.create({
      url: 'https://example.com/not-found.js',
      name: 'Extension Host Worker',
    })
  ).rejects.toThrowError(new Error('Failed to start extension host worker: Not found (404)'))
})
