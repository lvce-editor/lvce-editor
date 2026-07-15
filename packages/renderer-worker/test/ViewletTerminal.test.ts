/**
 * @jest-environment jsdom
 */
import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
// @ts-ignore
import { TextEncoder } from 'node:util'

beforeAll(() => {
  // https://github.com/jsdom/jsdom/issues/2524#issuecomment-736672511
  // @ts-ignore
  globalThis.TextEncoder = TextEncoder

  // @ts-ignore
  globalThis.OffscreenCanvas = class {}
})

beforeEach(() => {
  jest.resetAllMocks()
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
jest.unstable_mockModule('../src/parts/OffscreenCanvas/OffscreenCanvas.js', () => {
  return {
    create() {
      return {}
    },
  }
})
jest.unstable_mockModule('../src/parts/TerminalWorker/TerminalWorker.js', () => {
  return {
    create() {},
    getOrCreate() {},
    invokeAndTransfer() {},
    invoke() {},
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ViewletTerminal = await import('../src/parts/ViewletTerminal/ViewletTerminal.ts')

test('create', () => {
  const state = ViewletTerminal.create(1)
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTerminal.create(1)
  expect(await ViewletTerminal.loadContent(state)).toMatchObject({
    disposed: false,
  })
})

test.skip('handleData', () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletTerminal.create(1)
  ViewletTerminal.handleData(state, {
    data: [1, 2, 3, 4, 5],
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'write', new Uint8Array([1, 2, 3, 4, 5]))
})

test.skip('clear', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletTerminal.create(1)
  await ViewletTerminal.clear(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Terminal.write', new TextEncoder().encode('TODO clear terminal'))
})

test.skip('resize', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  const state = { ...ViewletTerminal.create(1), width: 10, height: 10 }
  await ViewletTerminal.resizeEffect(state)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Terminal.resize', 1, 7, 1)
})

test.skip('dispose', async () => {
  const state = ViewletTerminal.create(1)
  expect(await ViewletTerminal.dispose(state)).toMatchObject({
    disposed: true,
  })
})
