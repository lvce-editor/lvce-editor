/**
 * @jest-environment jsdom
 */
import { TextEncoder } from 'node:util'
import { jest } from '@jest/globals'

beforeAll(() => {
  // https://github.com/jsdom/jsdom/issues/2524#issuecomment-736672511
  globalThis.TextEncoder = TextEncoder
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

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ViewletTerminal = await import('../src/parts/ViewletTerminal/ViewletTerminal.js')

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

test('handleData', () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletTerminal.create(1)
  ViewletTerminal.handleData(state, {
    data: [1, 2, 3, 4, 5],
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'write', new Uint8Array([1, 2, 3, 4, 5]))
})

test('write', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  const state = ViewletTerminal.create(1)
  await ViewletTerminal.write(state, 'abc')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Terminal.write', 1, 'abc')
})

test('clear', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletTerminal.create(1)
  await ViewletTerminal.clear(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Terminal.write', new TextEncoder().encode('TODO clear terminal'))
})

test('resize', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  const state = ViewletTerminal.create(1)
  await ViewletTerminal.resize(state, 10, 10)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Terminal.resize', 0, 7, 1)
})

test('dispose', async () => {
  const state = ViewletTerminal.create(1)
  expect(await ViewletTerminal.dispose(state)).toMatchObject({
    disposed: true,
  })
})
