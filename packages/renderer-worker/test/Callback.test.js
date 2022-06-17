import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'

beforeEach(() => {
  Callback.state.id = 0
  Callback.state.callbacks = Object.create(null)
})

test.skip('register', () => {
  const resolve = jest.fn()
  const reject = jest.fn()
  const id = Callback.register(resolve, reject)
  Callback.resolve(id)
  expect(resolve).toHaveBeenCalledTimes(1)
  Callback.resolve(id)
  expect(resolve).toHaveBeenCalledTimes(2)
  Callback.unregister(id)
  expect(Callback.isAllEmpty()).toBe(true)
})

test('resolve', () => {
  const resolve = jest.fn()
  const reject = jest.fn()
  const id = Callback.register(resolve, reject)
  expect(Callback.state.callbacks).toEqual({
    1: {
      resolve,
      reject,
    },
  })
  Callback.resolve(id)
  expect(Callback.state.callbacks).toEqual({})
})

// test.skip('Callback - registerOnce', () => {
//   const callback = jest.fn()
//   console.warn = jest.fn()
//   const id = Callback.registerOnce(callback)
//   Callback.execute(id)
//   expect(callback).toHaveBeenCalledTimes(1)
//   expect(Callback.isAllEmpty()).toBe(true)
//   Callback.execute(id)
//   expect(console.warn).toHaveBeenCalledWith(
//     'callback 1 may already be disposed'
//   )
//   expect(callback).toHaveBeenCalledTimes(1)
// })
