import { jest } from '@jest/globals'

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

const LocalStorage = await import('../src/parts/LocalStorage/LocalStorage.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('getJson - number', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '42'
  })
  expect(await LocalStorage.getJson('item-1')).toBe(42)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8987, 'item-1')
})

test('getJson - object', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '{}'
  })
  expect(await LocalStorage.getJson('item-1')).toEqual({})
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8987, 'item-1')
})

test('getJson - invalid json', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '{'
  })
  expect(await LocalStorage.getJson('item-1')).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8987, 'item-1')
})

test('setJson', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await LocalStorage.setJson('item-1', 43)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    8988,
    'item-1',
    `43
`
  )
})

test('clear', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await LocalStorage.clear()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8986)
})
