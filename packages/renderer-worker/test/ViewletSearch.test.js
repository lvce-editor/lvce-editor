import { jest } from '@jest/globals'
import * as SearchResultType from '../src/parts/SearchResultType/SearchResultType.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

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

const ViewletSearch = await import(
  '../src/parts/ViewletSearch/ViewletSearch.js'
)
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const TextSearch = await import('../src/parts/TextSearch/TextSearch.js')
const Command = await import('../src/parts/Command/Command.js')

test('name', () => {
  expect(ViewletSearch.name).toBe('Search')
})

test('create', () => {
  const state = ViewletSearch.create()
  expect(state).toBeDefined()
})

test.skip('refresh', () => {
  const state = ViewletSearch.create()
  RendererProcess.state.send = jest.fn()
  ViewletSearch.refresh(state)
  // expect(RendererProcess.state.send).toHaveBeenCalledWith([3022, 0, []])
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

test('handleInput - empty results', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return {
      results: [],
    }
  })
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    value: 'test search',
  })
})

test('handleInput - error', async () => {
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    throw new Error('could not load search results')
  })
  const state = ViewletSearch.create()
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    message: 'Error: could not load search results',
  })
})

test('handleClick', async () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: SearchResultType.File,
        text: './test.txt',
        title: '/test/test.txt',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  expect(await ViewletSearch.handleClick(state, 0)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/test/test.txt')
})

test('resize', () => {
  const state = ViewletSearch.create()
  const newState = ViewletSearch.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toEqual({
    disposed: false,
    height: 200,
    left: 200,
    searchId: -1,
    searchResults: [],
    stats: {},
    top: 200,
    value: '',
    width: 200,
    fileCount: 0,
  })
})

test('handleContextMenuMouseAt', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), top: 0, left: 0 }
  expect(await ViewletSearch.handleContextMenuMouseAt(state, 10, 10)).toBe(
    state
  )
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ContextMenu.show',
    10,
    10,
    'search'
  )
})

test('handleContextMenuKeyBoard', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), top: 0, left: 0 }
  expect(await ViewletSearch.handleContextMenuKeyboard(state)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ContextMenu.show',
    0,
    0,
    'search'
  )
})
