import * as EditorCommandHandleKeyDown from '../src/parts/EditorCommand/EditorCommandHandleKeyDown.js'

test('handleKeyDown - ignore key - Control', () => {
  const state = {}
  expect(EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'Control')).toBe(
    state
  )
})

test('handleKeyDown - ignore key - Alt', () => {
  const state = {}
  expect(EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'Alt')).toBe(
    state
  )
})

test('handleKeyDown - ignore key - Shift', () => {
  const state = {}
  expect(EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'Shift')).toBe(
    state
  )
})

test('handleKeyDown - ignore key - CapsLock', () => {
  const state = {}
  expect(
    EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'CapsLock')
  ).toBe(state)
})

test('handleKeyDown - ignore key - PageUp', () => {
  const state = {}
  expect(EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'PageUp')).toBe(
    state
  )
})

test('handleKeyDown - ignore key - PageDown', () => {
  const state = {}
  expect(
    EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'PageDown')
  ).toBe(state)
})

test('handleKeyDown - ignore key - Insert', () => {
  const state = {}
  expect(EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'Insert')).toBe(
    state
  )
})

test('handleKeyDown - ignore key - ContextMenu', () => {
  const state = {}
  expect(
    EditorCommandHandleKeyDown.editorHandleKeyDown(state, 'ContextMenu')
  ).toBe(state)
})
