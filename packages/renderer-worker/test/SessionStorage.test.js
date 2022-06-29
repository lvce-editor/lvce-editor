import { jest } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.js'

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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SessionStorage = await import(
  '../src/parts/SessionStorage/SessionStorage.js'
)

test('getJson - number', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '42'
  })
  expect(await SessionStorage.getJson('item-1')).toBe(42)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8977, 'item-1')
})

test('getJson - object', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '{}'
  })

  expect(await SessionStorage.getJson('item-1')).toEqual({})
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8977, 'item-1')
})

test('getJson - invalid json', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '{'
  })
  expect(await SessionStorage.getJson('item-1')).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8977, 'item-1')
})

test('setJson', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return undefined
  })
  await SessionStorage.setJson('item-1', 43)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    8978,
    'item-1',
    `43
`
  )
})

test('clear', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return undefined
  })
  await SessionStorage.clear()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8976)
})
