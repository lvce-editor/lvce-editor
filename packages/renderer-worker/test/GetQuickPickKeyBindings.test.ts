import { expect, test } from '@jest/globals'
import * as GetQuickPickKeyBindings from '../src/parts/GetQuickPickKeyBindings/GetQuickPickKeyBindings.ts'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.js'

test('returns quick pick keybindings using the numeric focus context', () => {
  const keyBindings = [
    {
      command: 'QuickPick.close',
      key: KeyCode.Escape,
      when: WhenExpression.FocusQuickPickInput,
    },
    {
      command: 'Main.closeAllEditors',
      key: KeyCode.Escape,
      when: WhenExpression.FocusEditor,
    },
  ]

  expect(GetQuickPickKeyBindings.getQuickPickKeyBindings(keyBindings)).toEqual([keyBindings[0]])
})
