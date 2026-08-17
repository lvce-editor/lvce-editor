import { expect, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.js'
import * as ViewletLayoutKeyBindings from '../src/parts/ViewletLayout/ViewletLayoutKeyBindings.js'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.js'

test('getKeyBindings - rename widget', () => {
  const keyBindings = ViewletLayoutKeyBindings.getKeyBindings()

  expect(keyBindings).toEqual(
    expect.arrayContaining([
      {
        command: 'EditorRename.accept',
        key: KeyCode.Enter,
        when: WhenExpression.FocusEditorRename,
      },
      {
        command: 'EditorRename.close',
        key: KeyCode.Escape,
        when: WhenExpression.FocusEditorRename,
      },
    ]),
  )
})

test('getKeyBindings - toggle terminal panel', () => {
  const keyBindings = ViewletLayoutKeyBindings.getKeyBindings()

  expect(keyBindings).toEqual(
    expect.arrayContaining([
      {
        args: ['Terminals'],
        command: 'Layout.togglePanel',
        key: KeyModifier.CtrlCmd | KeyCode.Backquote,
      },
    ]),
  )
})
