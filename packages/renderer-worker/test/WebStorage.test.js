import { jest } from '@jest/globals'
import * as WebStorageType from '../src/parts/WebStorageType/WebStorageType.js'

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

const WebStorage = await import('../src/parts/WebStorage/WebStorage.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('getJson - localStorage - number', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '42'
  })
  expect(await WebStorage.getJson(WebStorageType.LocalStorage, 'item-1')).toBe(
    42
  )
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'WebStorage.getItem',
    1,
    'item-1'
  )
})

test('getJson - localStorage - object', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '{}'
  })
  expect(
    await WebStorage.getJson(WebStorageType.LocalStorage, 'item-1')
  ).toEqual({})
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'WebStorage.getItem',
    1,
    'item-1'
  )
})

test('getJson - localStorage - invalid json', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '{'
  })
  expect(
    await WebStorage.getJson(WebStorageType.LocalStorage, 'item-1')
  ).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'WebStorage.getItem',
    1,
    'item-1'
  )
})

test('setJson - localStorage', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await WebStorage.setJson(WebStorageType.LocalStorage, 'item-1', 43)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'WebStorage.setItem',
    1,
    'item-1',
    `43
`
  )
})

test('clear - localStorage', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await WebStorage.clear(WebStorageType.LocalStorage)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('WebStorage.clear', 1)
})
