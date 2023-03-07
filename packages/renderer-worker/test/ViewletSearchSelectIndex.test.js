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

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => {
  return {
    getAbsolutePath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.js')
const ViewletSearchSelectIndex = await import('../src/parts/ViewletSearch/ViewletSearchSelectIndex.js')
const Command = await import('../src/parts/Command/Command.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

test('selectIndex - negative index', async () => {
  const state = {
    ...ViewletSearch.create(),
  }
  expect(await ViewletSearchSelectIndex.selectIndex(state, -1)).toMatchObject({
    listFocused: true,
    listFocusedIndex: -1,
  })
})

test('selectIndex - match', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  Workspace.getAbsolutePath.mockImplementation((path) => {
    if (path.startsWith('./')) {
      return '/test' + path.slice(1)
    }
    return `/test` + path
  })
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        start: 0,
        end: 0,
        lineNumber: 0,
        text: './languages/index.js',
      },
      {
        type: TextSearchResultType.Match,
        start: 6,
        end: 7,
        lineNumber: 1,
        text: 'const add = (a, b) => {\n',
      },
    ],
    listFocusedIndex: 1,
  }
  expect(await ViewletSearchSelectIndex.selectIndex(state, 1)).toMatchObject({
    listFocused: false,
    listFocusedIndex: 1,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/test/languages/index.js', true, { selections: new Uint32Array([1, 0, 1, 0]) })
})
