import { beforeEach, expect, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  ViewletStates.reset()
})

const createInstance = (uid, moduleId) => {
  return {
    factory: {},
    moduleId,
    renderedState: {
      uid,
    },
    state: {
      uid,
    },
  }
}

test('getInstance should prefer the focused instance for a module id', () => {
  ViewletStates.set('chat-1', createInstance(1, 'ChatDebug'))
  ViewletStates.set('chat-2', createInstance(2, 'ChatDebug'))
  ViewletStates.setFocusedInstanceByType(2, 'ChatDebug')

  const result = ViewletStates.getInstance('ChatDebug')

  expect(result?.renderedState.uid).toBe(2)
})

test('getInstance should fall back to the first matching instance when focused uid is stale', () => {
  ViewletStates.set('chat-1', createInstance(1, 'ChatDebug'))
  ViewletStates.set('chat-2', createInstance(2, 'ChatDebug'))
  ViewletStates.setFocusedInstanceByType(99, 'ChatDebug')

  const result = ViewletStates.getInstance('ChatDebug')

  expect(result?.renderedState.uid).toBe(1)
})

test('remove should clear focused instance tracking for the removed module instance', () => {
  ViewletStates.set('chat-1', createInstance(1, 'ChatDebug'))
  ViewletStates.setFocusedInstanceByType(1, 'ChatDebug')

  ViewletStates.remove('chat-1')

  expect(ViewletStates.getFocusedInstanceByType('ChatDebug')).toBeUndefined()
})
