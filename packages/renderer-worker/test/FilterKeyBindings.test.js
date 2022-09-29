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
    },
  ])
})
