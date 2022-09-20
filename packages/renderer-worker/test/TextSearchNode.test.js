import { jest } from '@jest/globals'

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
        [
          './index.txt',
          {
            absoluteOffset: 208,
            preview: '    <title>Document</title>\n',
          },
        ],
      ],
    }
  })
  expect(await TextSearchNode.textSearch('', '/test', 'abc')).toEqual([
    [
      './index.txt',
      {
        absoluteOffset: 208,
        preview: '    <title>Document</title>\n',
      },
    ],
  ])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'Search.search',
    '/test',
    'abc'
  )
})
