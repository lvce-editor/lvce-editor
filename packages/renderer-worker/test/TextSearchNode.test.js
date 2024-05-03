import { beforeEach, expect, jest, test } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SearchProcess/SearchProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearchNode = await import('../src/parts/TextSearch/TextSearchNode.js')

const SearchProcess = await import('../src/parts/SearchProcess/SearchProcess.js')

test('textSearch - error', async () => {
  // @ts-ignore
  SearchProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(TextSearchNode.textSearch('', '/test', 'abc')).rejects.toThrow(new TypeError('x is not a function'))
})

test('textSearch', async () => {
  // @ts-ignore
  SearchProcess.invoke.mockImplementation(() => {
    return {
      results: [
        {
          type: TextSearchResultType.File,
          text: './index.txt',
          start: 0,
          end: 0,
          lineNumber: 0,
        },
        {
          type: TextSearchResultType.Match,
          text: '    <title>Document</title>\n',
          start: 0,
          end: 0,
          lineNumber: 0,
        },
      ],
    }
  })
  expect(await TextSearchNode.textSearch('', '/test', 'abc', {})).toEqual([
    {
      type: TextSearchResultType.File,
      text: './index.txt',
      start: 0,
      end: 0,
      lineNumber: 0,
    },
    {
      type: TextSearchResultType.Match,
      text: '    <title>Document</title>\n',
      start: 0,
      end: 0,
      lineNumber: 0,
    },
  ])
  expect(SearchProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SearchProcess.invoke).toHaveBeenCalledWith('TextSearch.search', {
    ripGrepArgs: [
      '--hidden',
      '--no-require-git',
      '--smart-case',
      '--stats',
      '--json',
      '--threads',
      'undefined',
      '--ignore-case',
      '--fixed-strings',
      '--',
      'abc',
      '.',
    ],
    searchDir: '/test',
  })
})
