import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'

beforeEach(() => {
  Callback.state.id = 0
})

test.skip('register / resolve', () => {
  const resolve = jest.fn()
  const reject = jest.fn()
  const id = Callback.register(resolve, reject)
  Callback.resolve(id)
  expect(resolve).toHaveBeenCalledTimes(1)
  Callback.resolve(id)
  expect(resolve).toHaveBeenCalledTimes(2)
  Callback.unregister(id)
})

test.skip('register / resolve - nonexisting id', () => {
  console.warn = jest.fn()
  Callback.resolve(-1)
  expect(console.warn).toHaveBeenCalledWith('callback -1 may already be disposed')
})

test.skip('register / reject', () => {
  const resolve = jest.fn()
  const reject = jest.fn()
  const id = Callback.register(resolve, reject)
  Callback.reject(id)
  expect(reject).toHaveBeenCalledTimes(1)
  Callback.unregister(id)
})

test.skip('register / reject - nonexisting id', () => {
  console.warn = jest.fn()
  Callback.reject(-1)
  expect(console.warn).toHaveBeenCalledWith('callback (rejected) -1 may already be disposed')
})
