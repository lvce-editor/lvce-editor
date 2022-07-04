import * as ViewletCounter from '../src/parts/Viewlet/ViewletCounter.js'

test('name', () => {
  expect(ViewletCounter.name).toBe('Counter')
})

test('create', () => {
  expect(ViewletCounter.create()).toBeDefined()
})

test('dispose', () => {
  const state = ViewletCounter.create()
  expect(ViewletCounter.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('increment', () => {
  const state = ViewletCounter.create()
  expect(ViewletCounter.increment(state)).toMatchObject({
    count: 1,
  })
})

test('decrement', () => {
  const state = ViewletCounter.create()
  expect(ViewletCounter.decrement(state)).toMatchObject({
    count: -1,
  })
})

test('render', () => {
  const oldState = ViewletCounter.create()
  const newState = {
    ...oldState,
    count: 1,
  }
  expect(ViewletCounter.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Counter', 'setCount', 1],
  ])
})
