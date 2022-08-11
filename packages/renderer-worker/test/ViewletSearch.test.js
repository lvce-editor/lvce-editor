import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.js'

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

// TODO tests are interfering with each other
test.skip('handleInput - empty results', async () => {
  jest.unstable_mockModule(
    '../src/parts/FindInWorkspace/FindInWorkspace.js',
    () => {
      return {
        findInWorkspace() {
          return []
        },
      }
    }
  )
  const state = ViewletSearch.create()
  RendererProcess.state.send = jest.fn()
  await ViewletSearch.handleInput(state, 'test search')
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.send',
    'Search',
    'setResults',
    [],
  ])
})

// TODO tests are interfering with each other
test.skip('handleInput - error', async () => {
  jest.unstable_mockModule(
    '../src/parts/FindInWorkspace/FindInWorkspace.js',
    () => {
      return {
        findInWorkspace() {
          throw new Error('could not load search results')
        },
      }
    }
  )
  const state = ViewletSearch.create()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  RendererProcess.state.send = jest.fn()
  await ViewletSearch.handleInput(state, 'test search')
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.send',
    'Search',
    'setError',
    'Error: could not load search results',
  ])
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
