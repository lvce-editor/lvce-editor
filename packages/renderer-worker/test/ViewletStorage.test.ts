import { beforeEach, expect, jest, test } from '@jest/globals'
import * as WebStorageType from '../src/parts/WebStorageType/WebStorageType.js'

let isEmpty = false

jest.unstable_mockModule('../src/parts/WebStorage/WebStorage.js', () => ({
  getAll: jest.fn(async (storageType) => {
    if (isEmpty) return {}
    if (storageType === WebStorageType.LocalStorage) return { localKey: 'localValue' }
    return { sessionKey: 'sessionValue' }
  }),
}))

const WebStorage = await import('../src/parts/WebStorage/WebStorage.js')
const ViewletStorage = await import('../src/parts/ViewletStorage/ViewletStorage.js')
const ViewletStorageRender = await import('../src/parts/ViewletStorage/ViewletStorageRender.js')

beforeEach(() => {
  jest.clearAllMocks()
  isEmpty = false
})

test('loadContent reads local and session storage', async () => {
  const state = ViewletStorage.create(1, '')
  const loadedState = await ViewletStorage.loadContent(state)

  expect(loadedState.localStorage).toEqual({ localKey: 'localValue' })
  expect(loadedState.sessionStorage).toEqual({ sessionKey: 'sessionValue' })
  expect(WebStorage.getAll).toHaveBeenNthCalledWith(1, WebStorageType.LocalStorage)
  expect(WebStorage.getAll).toHaveBeenNthCalledWith(2, WebStorageType.SessionStorage)
  const [command, dom] = ViewletStorageRender.render[0].apply(state, loadedState)
  expect(command).toBe('Viewlet.setDom2')
  expect(dom.map((node) => node.text).filter(Boolean)).toEqual(['Local Storage', 'Key', 'Value', 'localKey', 'localValue'])
})

test('loadContent renders an empty storage table', async () => {
  isEmpty = true
  const state = ViewletStorage.create(2, '')
  const loadedState = await ViewletStorage.loadContent(state)

  expect(loadedState.localStorage).toEqual({})
  const [, dom] = ViewletStorageRender.render[0].apply(state, loadedState)
  expect(dom.map((node) => node.text).filter(Boolean)).toEqual(['Local Storage', 'Key', 'Value'])
  expect(dom.find((node) => node.className === 'StorageTable')).toBeDefined()
})
