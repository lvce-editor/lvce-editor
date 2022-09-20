import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostTextSearch.js',
  () => {
    return {
      executeTextSearchProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const TextSearchExtension = await import(
  '../src/parts/TextSearch/TextSearchExtension.js'
)
const ExtensionHostTextSearch = await import(
  '../src/parts/ExtensionHost/ExtensionHostTextSearch.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

test('textSearch - extension search - error', async () => {
  // @ts-ignore
  ExtensionHostTextSearch.executeTextSearchProvider.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    TextSearchExtension.textSearch('xyz', 'xyz://', 'abc')
  ).rejects.toThrowError(new TypeError('x is not a function'))
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
  expect(await TextSearchExtension.textSearch('xyz', 'xyz://', 'abc')).toEqual([
    [
      './index.txt',
      {
        absoluteOffset: 208,
        preview: '    <title>Document</title>\n',
      },
    ],
  ])
  expect(
    ExtensionHostTextSearch.executeTextSearchProvider
  ).toHaveBeenCalledTimes(1)
  expect(
    ExtensionHostTextSearch.executeTextSearchProvider
  ).toHaveBeenCalledWith('xyz', 'abc')
})
