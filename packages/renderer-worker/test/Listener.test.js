import { jest } from '@jest/globals'
import * as Listener from '../src/parts/Listener/Listener.js'

afterEach(() => {
  for (const id in Listener.state) {
    delete Listener.state[id]
  }
})

test('register', () => {
  const fn = () => {}
  const id = Listener.register(fn)
  expect(Listener.state).toEqual({
    [id]: fn,
  })
})

test('execute', () => {
  const fn = jest.fn()
  const id = Listener.register(fn)
  Listener.execute(id, 'abc')
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith('abc')
})

test('unregister', () => {
  const fn = () => {}
  const id = Listener.register(fn)
  Listener.unregister(id)
  expect(Listener.state).toEqual({})
})
