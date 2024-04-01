/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.ts', () => {
  return {
    create: jest.fn(() => {
      return {}
    }),
  }
})

jest.unstable_mockModule('https://example.com/worker.ts', () => {}, {
  virtual: true,
})

jest.unstable_mockModule('https://example.com/not-found.ts', () => {}, {
  virtual: true,
})

const IpcParentWithMessagePort = await import('../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.ts')
const IpcParentWithModuleWorkerWithMessagePort = await import(
  '../src/parts/IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.ts'
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
      url: 'https://example.com/not-found.ts',
      name: 'Extension Host Worker',
    }),
  ).rejects.toThrow(new Error('Failed to start extension host worker: Not found (404)'))
})
