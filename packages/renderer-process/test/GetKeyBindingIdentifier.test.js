import * as GetKeyBindingIdenfitier from '../src/parts/GetKeyBindingIdentifier/GetKeyBindingIdentifier.js'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import { beforeEach, test, expect } from '@jest/globals'

test('KeyA', () => {
  const event = {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    key: 'a',
  }
  expect(GetKeyBindingIdenfitier.getKeyBindingIdentifier(event)).toBe(KeyCode.KeyA)
})

test('KeyB', () => {
  const event = {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    key: 'b',
  }
  expect(GetKeyBindingIdenfitier.getKeyBindingIdentifier(event)).toBe(KeyCode.KeyB)
})
