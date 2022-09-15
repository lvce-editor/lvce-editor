/**
 * @jest-environment jsdom
 */
import * as ViewletKeyBindings from '../src/parts/ViewletKeyBindings/ViewletKeyBindings.js'

test('name', () => {
  expect(ViewletKeyBindings.name).toBe('KeyBindings')
})

test('create', () => {
  expect(ViewletKeyBindings.create()).toBeDefined()
})

test('setKeyBindings', () => {
  const state = ViewletKeyBindings.create()
  ViewletKeyBindings.setKeyBindings(state, [
    {
      rawKey: 'Enter',
      isCtrl: false,
      isShift: false,
      key: 'Enter',
      command: 'EditorCompletion.selectCurrent',
      when: 'focus.editorCompletions',
    },
  ])
  const { $KeyBindingsTableBody } = state
  expect($KeyBindingsTableBody.innerHTML).toBe(
    '<tr><td>EditorCompletion.selectCurrent</td><td class="KeyBinding"><kbd>Enter</kbd></td><td>focus.editorCompletions</td></tr>'
  )
})

test.skip('setKeyBindings - error - keyBindings is not of type array', () => {
  const state = ViewletKeyBindings.create()
  expect(() => ViewletKeyBindings.setKeyBindings(state, 'abc')).toThrowError(
    new TypeError('abc')
  )
})
