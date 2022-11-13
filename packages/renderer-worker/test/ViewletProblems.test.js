import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Diagnostics/Diagnostics.js', () => {
  return {
    getDiagnostics: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletProblems = await import(
  '../src/parts/ViewletProblems/ViewletProblems.js'
)

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)
const Diagnostics = await import('../src/parts/Diagnostics/Diagnostics.js')

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletProblems, oldState, newState)
}


test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('loadContent - no problems found', async () => {
  // @ts-ignore
  Diagnostics.getDiagnostics.mockImplementation(() => {
    return []
  })
  const state = ViewletProblems.create()
  expect(await ViewletProblems.loadContent(state)).toMatchObject({
    disposed: false,
    problems: [],
    focusedIndex: -2,
    message: 'No problems have been detected in the workspace.',
  })
})

test('dispose', () => {
  const state = ViewletProblems.create()
  expect(ViewletProblems.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('render', () => {
  const oldState = ViewletProblems.create()
  const newState = {
    ...oldState,
    problems: [],
  }
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Problems', 'setProblems', []],
  ])
})

test('setFocusedIndex', () => {
  const state = ViewletProblems.create()
  expect(ViewletProblems.focusIndex(state, -1)).toMatchObject({
    focusedIndex: -1,
  })
})
