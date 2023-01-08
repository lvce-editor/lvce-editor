import { jest } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearchNode = await import('../src/parts/TextSearch/TextSearchNode.js')

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

test('textSearch - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    TextSearchNode.textSearch('', '/test', 'abc')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('textSearch', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
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
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'TextSearch.search',
    '/test',
    'abc',
    {}
  )
})
