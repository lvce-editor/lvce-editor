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

const StorageBrowser = await import('../src/parts/WebStorage/WebStorage.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('getJson - localStorage - number', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '42'
  })
  expect(
    await StorageBrowser.getJson(
      StorageBrowser.StorageType.LocalStorage,
      'item-1'
    )
  ).toBe(42)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'StorageBrowser.getItem',
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
    await StorageBrowser.getJson(
      StorageBrowser.StorageType.LocalStorage,

      'item-1'
    )
  ).toEqual({})
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'StorageBrowser.getItem',
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
    await StorageBrowser.getJson(
      StorageBrowser.StorageType.LocalStorage,
      'item-1'
    )
  ).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'StorageBrowser.getItem',
    1,
    'item-1'
  )
})

test('setJson - localStorage', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await StorageBrowser.setJson(
    StorageBrowser.StorageType.LocalStorage,
    'item-1',
    43
  )
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'StorageBrowser.setItem',
    1,
    'item-1',
    `43
`
  )
})

test('clear - localStorage', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await StorageBrowser.clear(StorageBrowser.StorageType.LocalStorage)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('StorageBrowser.clear', 1)
})
