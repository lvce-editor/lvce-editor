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
      key: 'Enter',
      command: 'EditorCompletion.selectCurrent',
      when: 'focus.editorCompletions',
    },
  ])
  const { $Viewlet } = state
  expect($Viewlet.textContent).toBe(`[
  {
    \"key\": \"Enter\",
    \"command\": \"EditorCompletion.selectCurrent\",
    \"when\": \"focus.editorCompletions\"
  }
]
`)
})

test.skip('setKeyBindings - error - keyBindings is not of type array', () => {
  const state = ViewletKeyBindings.create()
  expect(() => ViewletKeyBindings.setKeyBindings(state, 'abc')).toThrowError(
    new TypeError('abc')
  )
})
