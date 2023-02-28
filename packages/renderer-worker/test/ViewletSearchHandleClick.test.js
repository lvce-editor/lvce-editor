import { jest } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

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
const Command = await import('../src/parts/Command/Command.js')
const ViewletSearchHandleClick = await import('../src/parts/ViewletSearch/ViewletSearchHandleClick.js')

test('handleClick', async () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: './test.txt',
        title: '/test/test.txt',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  expect(await ViewletSearchHandleClick.handleClick(state, 0)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/test/test.txt')
})
