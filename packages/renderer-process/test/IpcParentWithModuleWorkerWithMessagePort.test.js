/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

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
    // @ts-ignore
    IpcParentWithModuleWorkerWithMessagePort.create({
      url: 'https://example.com/not-found.js',
      name: 'Extension Host Worker',
    }),
  ).rejects.toThrow(new Error('Failed to start extension host worker: Not found (404)'))
})
