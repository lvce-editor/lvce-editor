/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import { TextEncoder } from 'node:util'

beforeAll(() => {
  // https://github.com/jsdom/jsdom/issues/2524#issuecomment-736672511
  globalThis.TextEncoder = TextEncoder
})

beforeEach(() => {
  jest.resetAllMocks()
})

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

const ViewletTerminal = await import('../src/parts/Viewlet/ViewletTerminal.js')

test('name', () => {
  expect(ViewletTerminal.name).toBe('Terminal')
})

test('create', () => {
  const state = ViewletTerminal.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTerminal.create()
  expect(await ViewletTerminal.loadContent(state)).toMatchObject({
    disposed: false,
  })
})

test('handleData', () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletTerminal.create()
  ViewletTerminal.handleData(state, {
    data: [1, 2, 3, 4, 5],
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    9922,
    new Uint8Array([1, 2, 3, 4, 5])
  )
})

test('write', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  const state = ViewletTerminal.create()
  await ViewletTerminal.write(state, 'abc')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Terminal.write', 0, 'abc')
})

test('clear', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletTerminal.create()
  await ViewletTerminal.clear(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    9922,
    new TextEncoder().encode('TODO clear terminal')
  )
})

test('resize', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  const state = ViewletTerminal.create()
  await ViewletTerminal.resize(state, 10, 10)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Terminal.resize', 0, 7, 1)
})

test('dispose', () => {
  const state = ViewletTerminal.create()
  expect(ViewletTerminal.dispose(state)).toMatchObject({
    disposed: true,
  })
})
