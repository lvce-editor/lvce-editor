import { beforeEach, expect, jest, test } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostTextSearch.js', () => {
  return {
    executeTextSearchProvider: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/SearchProcess/SearchProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearch = await import('../src/parts/TextSearch/TextSearch.js')
const ExtensionHostTextSearch = await import('../src/parts/ExtensionHost/ExtensionHostTextSearch.js')
const SearchProcess = await import('../src/parts/SearchProcess/SearchProcess.js')

test('textSearch - extension search - error', async () => {
  // @ts-ignore
  ExtensionHostTextSearch.executeTextSearchProvider.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(TextSearch.textSearch('xyz://', 'abc')).rejects.toThrow(new TypeError('x is not a function'))
})

test('textSearch - extension search', async () => {
  // @ts-ignore
  ExtensionHostTextSearch.executeTextSearchProvider.mockImplementation(() => {
    return [
      [
        './index.txt',
        {
          absoluteOffset: 208,
          preview: '    <title>Document</title>\n',
        },
      ],
    ]
  })
  expect(await TextSearch.textSearch('xyz://', 'abc')).toEqual([
    [
      './index.txt',
      {
        absoluteOffset: 208,
        preview: '    <title>Document</title>\n',
      },
    ],
  ])
  expect(ExtensionHostTextSearch.executeTextSearchProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostTextSearch.executeTextSearchProvider).toHaveBeenCalledWith('xyz', 'abc')
})

test('textSearch - file - error', async () => {
  // @ts-ignore
  SearchProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(TextSearch.textSearch('/test', 'abc')).rejects.toThrow(new TypeError('x is not a function'))
})

test('textSearch - file', async () => {
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
  expect(await TextSearch.textSearch('/test', 'abc', {})).toEqual([
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
