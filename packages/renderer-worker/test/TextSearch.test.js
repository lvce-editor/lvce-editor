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

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearch = await import('../src/parts/TextSearch/TextSearch.js')
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
  await expect(TextSearch.textSearch('xyz', 'abc')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
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
  expect(await TextSearch.textSearch('xyz', 'abc')).toEqual([
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

test('textSearch - file - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    TextSearch.textSearch('file:///test', 'abc')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('textSearch - file', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
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
  expect(await TextSearch.textSearch('file:///test', 'abc')).toEqual([
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
    'file:///test',
    'abc'
  )
})
