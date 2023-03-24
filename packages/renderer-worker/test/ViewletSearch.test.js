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

const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.ipc.js')
const TextSearch = await import('../src/parts/TextSearch/TextSearch.js')
const Command = await import('../src/parts/Command/Command.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

test('create', () => {
  const state = ViewletSearch.create()
  expect(state).toBeDefined()
})

test.skip('dispose', () => {
  const state = ViewletSearch.create()
  // TODO should test that remaining searches are canceled
  ViewletSearch.dispose(state)
  expect(state).toEqual({
    results: [],
    searchId: -1,
    state: 'default',
    stats: {},
    value: '',
  })
})

test('loadContent - restore value', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return []
  })
  expect(
    await ViewletSearch.loadContent(state, {
      value: 'test search',
    })
  ).toMatchObject({
    value: 'test search',
  })
})

test('setValue - error - results is not of type array', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return {
      type: TextSearchResultType.File,
      text: './file-1.txt',
      start: 0,
      end: 0,
      lineNumber: 0,
    }
  })
  expect(await ViewletSearch.handleInput(state, 'abc')).toMatchObject({
    message: 'Error: results must be of type array',
  })
  expect(ErrorHandling.logError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.logError).toHaveBeenCalledWith(new Error(`results must be of type array`))
})

test('setValue - one match in one file', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ]
  })
  expect(await ViewletSearch.handleInput(state, 'abc')).toMatchObject({
    value: 'abc',
    items: [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ],
    message: 'Found 1 result in 1 file',
  })
})

test('setValue - two matches in one file', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ]
  })
  expect(await ViewletSearch.handleInput(state, 'abc')).toMatchObject({
    value: 'abc',
    items: [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ],
    message: 'Found 2 results in 1 file',
  })
})

test('setValue - two matches in two files', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.File,
        text: './file-2.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ]
  })
  expect(await ViewletSearch.handleInput(state, 'abc')).toMatchObject({
    value: 'abc',
    items: [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.File,
        text: './file-2.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ],
    message: 'Found 2 results in 2 files',
  })
})

test('handleInput - empty results', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return []
  })
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    value: 'test search',
  })
})

test('handleInput - empty value', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return []
  })
  expect(await ViewletSearch.handleInput(state, '')).toMatchObject({
    value: '',
    items: [],
  })
  expect(TextSearch.textSearch).not.toHaveBeenCalled()
})

test('handleInput - error', async () => {
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    throw new Error('could not load search results')
  })
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: './file-1.txt',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
      {
        type: TextSearchResultType.Match,
        text: 'abc',
        start: 0,
        end: 0,
        lineNumber: 0,
      },
    ],
  }
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    message: `Error: could not load search results`,
    items: [],
  })
})

test('resize', () => {
  const state = ViewletSearch.create()
  const newState = ViewletSearch.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    height: 200,
    x: 200,
    searchId: -1,
    searchResults: [],
    stats: {},
    y: 200,
    value: '',
    width: 200,
    fileCount: 0,
  })
})
