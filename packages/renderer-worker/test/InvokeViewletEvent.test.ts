import { beforeEach, expect, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import { invokeViewletEvent } from '../src/parts/InvokeViewletEvent/InvokeViewletEvent.js'

const instance = { state: { uid: 7 } }

beforeEach(() => {
  ViewletStates.state.instances = { SourceControl: instance }
})

test('applies a workspace event to its current viewlet', async () => {
  const next = { uid: 7, workspace: 'remote-ssh://host/next' }
  await expect(invokeViewletEvent('SourceControl', instance, async () => next)).resolves.toBe(next)
})

test('discards an event result when its viewlet was replaced', async () => {
  const pending = Promise.withResolvers<object>()
  const result = invokeViewletEvent('SourceControl', instance, () => pending.promise)
  ViewletStates.state.instances.SourceControl = { state: { uid: 8 } }
  pending.resolve({ uid: 7 })
  await expect(result).resolves.toBeUndefined()
})

test('does not abort workspace switching when a disposed viewlet rejects pending work', async () => {
  const pending = Promise.withResolvers<object>()
  const result = invokeViewletEvent('SourceControl', instance, () => pending.promise)
  delete ViewletStates.state.instances.SourceControl
  pending.reject(new Error('Source control state has been disposed'))
  await expect(result).resolves.toBeUndefined()
})

test('preserves failures from the current viewlet', async () => {
  await expect(
    invokeViewletEvent('SourceControl', instance, async () => {
      throw new Error('load failed')
    }),
  ).rejects.toThrow('load failed')
  await expect(invokeViewletEvent('SourceControl', instance, async () => undefined)).rejects.toThrow('newState must be defined')
})
