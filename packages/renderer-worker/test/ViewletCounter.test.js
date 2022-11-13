import * as ViewletCounter from '../src/parts/ViewletCounter/ViewletCounter.js'
import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletCounter, oldState, newState)
}

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
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Counter', 'setCount', 1],
  ])
})
