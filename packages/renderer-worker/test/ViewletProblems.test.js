import * as ViewletProblems from '../src/parts/ViewletProblems/ViewletProblems.js'

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletProblems, oldState, newState)
}

test('name', () => {
  expect(ViewletProblems.name).toBe('Problems')
})

test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletProblems.create()
  expect(await ViewletProblems.loadContent(state)).toEqual({
    disposed: false,
    problems: [],
    focusedIndex: -2,
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
