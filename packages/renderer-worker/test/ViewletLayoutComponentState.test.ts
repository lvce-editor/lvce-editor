import { expect, test } from '@jest/globals'
import * as ComponentState from '../src/parts/ViewletLayout/ViewletLayoutComponentState.js'

test.each([null, [], 'invalid', 42])('rejects non-object state %p', (state) => {
  expect(() => ComponentState.setComponentState({ uid: 1 }, state)).toThrow('Layout state must be an object')
})

test('rejects changing the component uid', () => {
  expect(() => ComponentState.setComponentState({ uid: 1 }, { uid: 2 })).toThrow('Layout state uid must remain 1')
})
