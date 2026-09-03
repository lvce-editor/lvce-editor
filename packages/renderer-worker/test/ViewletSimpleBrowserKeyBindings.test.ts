import { expect, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.js'
import * as ViewletSimpleBrowserKeyBindings from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserKeyBindings.js'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.js'

const expectedTabKeyBindings = [
  {
    key: KeyModifier.CtrlCmd | KeyCode.KeyW,
    command: 'SimpleBrowser.closeCurrentTab',
  },
  {
    key: KeyModifier.CtrlCmd | KeyCode.KeyT,
    command: 'SimpleBrowser.createNewTab',
  },
  {
    key: KeyModifier.CtrlCmd | KeyCode.KeyH,
    command: 'SimpleBrowser.openHistory',
  },
  {
    key: KeyModifier.CtrlCmd | KeyCode.Tab,
    command: 'SimpleBrowser.focusNextTab',
  },
  {
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab,
    command: 'SimpleBrowser.focusPreviousTab',
  },
]

test('registers browser tab shortcuts for the URL input and browser chrome', () => {
  const keyBindings = ViewletSimpleBrowserKeyBindings.getKeyBindings()

  for (const when of [WhenExpression.FocusSimpleBrowserInput, WhenExpression.FocusSimpleBrowser]) {
    for (const keyBinding of expectedTabKeyBindings) {
      expect(keyBindings).toContainEqual({ ...keyBinding, when })
    }
  }
})

test('submits the URL input on Enter', () => {
  const keyBindings = ViewletSimpleBrowserKeyBindings.getKeyBindings()

  expect(keyBindings).toContainEqual({
    key: KeyCode.Enter,
    command: 'SimpleBrowser.go',
    when: WhenExpression.FocusSimpleBrowserInput,
  })
})
