import * as GetModifierKey from '../src/parts/GetModifierKey/GetModifierKey.js'
import * as ModifierKey from '../src/parts/ModifierKey/ModifierKey.js'

test('getModifierKey - alt', () => {
  expect(GetModifierKey.getModifierKey({ altKey: true })).toBe(ModifierKey.Alt)
})

test('getModifierKey - ctrl', () => {
  expect(GetModifierKey.getModifierKey({ ctrlKey: true })).toBe(ModifierKey.Ctrl)
})

test('getModifierKey - none', () => {
  expect(GetModifierKey.getModifierKey({})).toBe(ModifierKey.None)
})
