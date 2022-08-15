import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
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

jest.unstable_mockModule(
  '../src/parts/FindInWorkspace/FindInWorkspace.js',
  () => {
    return {
      findInWorkspace: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
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
const FindInWorkspace = await import(
  '../src/parts/FindInWorkspace/FindInWorkspace.js'
)
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
  FindInWorkspace.findInWorkspace.mockImplementation(() => {
    return {
      results: [],
    }
  })
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    value: 'test search',
    items: [],
  })
})

test('handleInput - error', async () => {
  // @ts-ignore
  FindInWorkspace.findInWorkspace.mockImplementation(() => {
    throw new Error('could not load search results')
  })
  const state = ViewletSearch.create()
  await expect(
    ViewletSearch.handleInput(state, 'test search')
  ).rejects.toThrowError(new Error('could not load search results'))
})

test('handleClick', async () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        name: './test.txt',
        path: '/test/test.txt',
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
