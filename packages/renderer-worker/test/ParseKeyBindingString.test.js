import { expect, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.js'
import * as ParseKeyBindingString from '../src/parts/ParseKeyBindingString/ParseKeyBindingString.js'

test('parseKeyBindingString parses modifiers and named keys', () => {
  expect(ParseKeyBindingString.parseKeyBindingString('Ctrl+Enter')).toBe(KeyModifier.CtrlCmd | KeyCode.Enter)
  expect(ParseKeyBindingString.parseKeyBindingString('Alt+Left')).toBe(KeyModifier.Alt | KeyCode.LeftArrow)
  expect(ParseKeyBindingString.parseKeyBindingString('CtrlCmd+Shift+R')).toBe(
    KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyR,
  )
})

test('parseKeyBindingString returns unknown for invalid keys', () => {
  expect(ParseKeyBindingString.parseKeyBindingString('Ctrl+Nope')).toBe(KeyCode.Unknown)
})
