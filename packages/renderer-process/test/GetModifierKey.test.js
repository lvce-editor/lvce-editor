import { expect, test } from '@jest/globals'
import * as GetModifierKey from '../src/parts/GetModifierKey/GetModifierKey.ts'
import * as ModifierKey from '../src/parts/ModifierKey/ModifierKey.ts'

test('getModifierKey - alt', () => {
  expect(GetModifierKey.getModifierKey({ altKey: true })).toBe(ModifierKey.Alt)
})

test('getModifierKey - ctrl', () => {
  expect(GetModifierKey.getModifierKey({ ctrlKey: true })).toBe(ModifierKey.Ctrl)
})

test('getModifierKey - none', () => {
  expect(GetModifierKey.getModifierKey({})).toBe(ModifierKey.None)
})
