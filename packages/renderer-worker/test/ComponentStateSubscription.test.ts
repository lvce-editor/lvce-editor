import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  executeViewletCommand: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(),
}))

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const { subscribe, unsubscribe } = await import('../src/parts/ComponentStateSubscription/ComponentStateSubscription.ts')

const addComponent = (uid, moduleId = 'Explorer') => {
  const state = { uid }
  const instance = { factory: {}, moduleId, renderedState: state, state }
  ViewletStates.set(uid, instance)
  return instance
}

const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

beforeEach(() => {
  ViewletStates.reset()
  jest.resetAllMocks()
  addComponent(1, 'ComponentState')
})

afterEach(() => {
  unsubscribe(1)
  unsubscribe(2)
})

test('refreshes the initial snapshot after the view is mounted', async () => {
  addComponent(3)
  await subscribe(1)

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(1, 'refresh')
})

test('automatically refreshes after additions and removals, but not renders', async () => {
  await subscribe(1)
  jest.mocked(Viewlet.executeViewletCommand).mockClear()
  addComponent(3)
  await flush()
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)

  ViewletStates.setRenderedState(3, { uid: 3 })
  await flush()
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)

  ViewletStates.remove(3)
  await flush()
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(2)
})

test('coalesces bursts and catches changes that arrive during refresh', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  jest.mocked(Viewlet.executeViewletCommand).mockImplementationOnce(() => promise)
  const initialRefresh = subscribe(1)
  addComponent(3)
  addComponent(4)
  await flush()
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)

  addComponent(5)
  ViewletStates.remove(3)
  resolve()
  await initialRefresh
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(2)
})

test('does not register duplicate subscriptions', async () => {
  await subscribe(1)
  await subscribe(1)
  addComponent(3)
  await flush()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(2)
})

test('unsubscribing removes the listener and cancels a queued refresh', async () => {
  const initialRefresh = subscribe(1)
  unsubscribe(1)
  unsubscribe(1)
  addComponent(3)
  await initialRefresh

  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
})

test('removing the view stops pending follow-up refreshes', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  jest.mocked(Viewlet.executeViewletCommand).mockImplementationOnce(() => promise)
  const initialRefresh = subscribe(1)
  await flush()
  addComponent(3)
  ViewletStates.remove(1)
  addComponent(4)
  resolve()
  await initialRefresh

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)
})

test('reopening the view installs a fresh subscription', async () => {
  await subscribe(1)
  ViewletStates.remove(1)
  addComponent(1, 'ComponentState')
  await subscribe(1)
  addComponent(3)
  await flush()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(3)
})

test('disposing one inspector keeps the other inspector subscribed', async () => {
  addComponent(2, 'ComponentState')
  await subscribe(1)
  await subscribe(2)
  unsubscribe(1)
  jest.mocked(Viewlet.executeViewletCommand).mockClear()
  addComponent(3)
  await flush()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(2, 'refresh')
})

test('does not subscribe an already disposed view', async () => {
  ViewletStates.remove(1)
  await subscribe(1)
  addComponent(3)
  await flush()

  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
})

test('reports refresh errors and can refresh again on the next change', async () => {
  const error = new Error('refresh failed')
  jest.mocked(Viewlet.executeViewletCommand).mockRejectedValueOnce(error)
  await subscribe(1)
  addComponent(3)
  await flush()

  expect(Logger.error).toHaveBeenCalledWith(error)
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(2)
})
