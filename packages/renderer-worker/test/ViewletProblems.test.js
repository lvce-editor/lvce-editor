import * as ViewletProblems from '../src/parts/Viewlet/ViewletProblems.js'

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
  expect(ViewletProblems.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Problems', 'setProblems', []],
  ])
})

test('setFocusedIndex', () => {
  const state = ViewletProblems.create()
  expect(ViewletProblems.focusIndex(state, -1)).toMatchObject({
    focusedIndex: -1,
  })
})
