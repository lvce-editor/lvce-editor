import { expect, test } from '@jest/globals'
import * as FilterKeyBindings from '../src/parts/FilterKeyBindings/FilterKeyBindings.js'

test('getFilteredKeyBindings', () => {
  const keyBindings = [
    {
      command: 'EditorCompletion.focusNext',
      key: 'ArrowDown',
    },
    {
      command: 'EditorCompletion.focusPrevious',
      key: 'ArrowUp',
    },
  ]
  const value = 'focusNext'
  expect(FilterKeyBindings.getFilteredKeyBindings(keyBindings, value)).toEqual([
    {
      command: 'EditorCompletion.focusNext',
      key: 'ArrowDown',
      keyMatches: [],
      commandMatches: [21, 17, 26],
    },
  ])
})

test('getFilteredKeyBindings - fuzzy search', () => {
  const keyBindings = [
    {
      command: 'EditorCompletion.focusNext',
      key: 'ArrowDown',
    },
    {
      command: 'EditorCompletion.focusPrevious',
      key: 'ArrowUp',
    },
  ]
  const value = 'fpr'
  expect(FilterKeyBindings.getFilteredKeyBindings(keyBindings, value)).toEqual([
    {
      command: 'EditorCompletion.focusPrevious',
      key: 'ArrowUp',
      commandMatches: [26, 17, 18, 22, 24],
      keyMatches: [],
    },
  ])
})
