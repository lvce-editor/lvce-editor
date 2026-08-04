import { expect, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.js'
import * as ViewletMainKeyBindings from '../src/parts/ViewletMain/ViewletMainKeyBindings.js'

test('getKeyBindings - restore closed tab', () => {
  const keyBindings = ViewletMainKeyBindings.getKeyBindings()

  expect(keyBindings).toContainEqual({
    command: 'Main.restoreClosedTab',
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyT,
  })
})
