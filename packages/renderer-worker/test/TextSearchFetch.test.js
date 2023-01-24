import { jest } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearchFetch = await import('../src/parts/TextSearch/TextSearchFetch.js')
const Command = await import('../src/parts/Command/Command.js')

test('textSearch', async () => {
  // @ts-ignore
  Command.execute.mockImplementation((command, ...args) => {
    switch (command) {
      case 'Ajax.getJson':
        return ['/test/file-1.txt', '/test/file-2.txt']
      case 'Ajax.getText':
        if (args[0] === '/test/file-1.txt') {
          return ' test'
        }
        return ''
      default:
        break
    }
  })
  expect(await TextSearchFetch.textSearch('fetch', 'fetch:///test', 'test')).toEqual([
    {
      type: TextSearchResultType.File,
      text: 'file-1.txt',
      start: 0,
      end: 0,
      lineNumber: 0,
    },
    {
      type: TextSearchResultType.Match,
      text: ' test',
      start: 1,
      end: 5,
      lineNumber: 0,
    },
  ])
})
