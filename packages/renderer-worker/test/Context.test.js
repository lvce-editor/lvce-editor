import * as Context from '../src/parts/Context/Context.js'

beforeEach(() => {
  Context.reset()
})

test('get', () => {
  Context.set('a', 1)
  expect(Context.get('a')).toBe(1)
})

test('getAll', () => {
  Context.set('a', 1)
  expect(Context.getAll()).toEqual({ a: 1 })
})

test('remove', () => {
  Context.set('a', 1)
  Context.remove('a')
  expect(Context.get('a')).toBeUndefined()
})

test('reset', () => {
  Context.set('a', 1)
  Context.reset()
  expect(Context.getAll()).toEqual({})
})
