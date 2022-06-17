import { jest } from '@jest/globals'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'

beforeEach(() => {
  GlobalEventBus.state.listenerMap = Object.create(null)
})

test('emitEvent - no listener', () => {
  GlobalEventBus.emitEvent('test.event', { x: 42 })
})

// TODO add more async tests and async error handling tests

test('emitEvent - single listener', async () => {
  const listener = jest.fn()
  GlobalEventBus.addListener('test.event', listener)
  await GlobalEventBus.emitEvent('test.event', { x: 42 })
  expect(listener).toHaveBeenCalledTimes(1)
  expect(listener).toHaveBeenCalledWith({ x: 42 })
})

test('emitEvent - multiple listeners', async () => {
  const listener1 = jest.fn()
  const listener2 = jest.fn()
  GlobalEventBus.addListener('test.event', listener1)
  GlobalEventBus.addListener('test.event', listener2)
  await GlobalEventBus.emitEvent('test.event', { x: 42 })
  expect(listener1).toHaveBeenCalledTimes(1)
  expect(listener1).toHaveBeenCalledWith({ x: 42 })
  expect(listener2).toHaveBeenCalledTimes(1)
  expect(listener2).toHaveBeenCalledWith({ x: 42 })
})

test('emitEvent - listener throws error', async () => {
  const listener = jest.fn(() => {
    throw new Error('x is not a function')
  })
  GlobalEventBus.addListener('test.event', listener)
  await expect(
    GlobalEventBus.emitEvent('test.event', { x: 42 })
  ).rejects.toThrowError(new Error('x is not a function'))
})

test('removeListener', async () => {
  const listener = jest.fn()
  GlobalEventBus.addListener('test.event', listener)
  GlobalEventBus.removeListener('test.event', listener)
  await GlobalEventBus.emitEvent('test.event', { x: 42 })
  expect(listener).not.toHaveBeenCalled()
  expect(GlobalEventBus.state).toEqual({
    listenerMap: {},
  })
})
