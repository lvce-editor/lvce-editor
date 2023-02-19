import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/TextSearch/TextSearch.js', () => {
  return {
    textSearch: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    logError: jest.fn(() => {}),
  }
})

const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.js')
const ViewletSearchSelectIndex = await import('../src/parts/ViewletSearch/ViewletSearchSelectIndex.js')

test('selectIndex - negative index', async () => {
  const state = {
    ...ViewletSearch.create(),
  }
  expect(await ViewletSearchSelectIndex.selectIndex(state, -1)).toMatchObject({
    listFocused: true,
    listFocusedIndex: -1,
  })
})
