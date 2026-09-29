import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const Context = await import('../src/parts/Context/Context.js')
const ExtensionViewContext = await import('../src/parts/ExtensionViewContext/ExtensionViewContext.js')
const Focus = await import('../src/parts/Focus/Focus.js')
const FocusState = await import('../src/parts/FocusState/FocusState.js')
const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const WhenExpression = await import('../src/parts/WhenExpression/WhenExpression.js')

test('setFocus preserves extension view context keybindings', () => {
  const keyBindings = [
    {
      command: 'ExtensionHost.executeCommand',
      key: 3,
      when: 'chat2.composerFocus',
    },
  ]
  KeyBindingsState.setKeyBindings('extensions', keyBindings)
  ExtensionViewContext.handleViewContextChange(1, 'chat2.views.chat', {
    'chat2.composerFocus': true,
  })

  Focus.setFocus(WhenExpression.FocusExplorer)

  expect(Context.get('chat2.composerFocus')).toBe(true)
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('KeyBindings.setIdentifiers', new Uint32Array([3]))

  ExtensionViewContext.handleViewContextChange(1, 'chat2.views.chat', {
    'chat2.composerFocus': false,
  })

  expect(Context.get('chat2.composerFocus')).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('KeyBindings.setIdentifiers', new Uint32Array())
})

test('clearFocus removes the current focus keyboard context', () => {
  KeyBindingsState.setKeyBindings('activity-bar-test', [
    {
      command: 'ActivityBar.selectCurrent',
      key: 9,
      when: WhenExpression.FocusActivityBar,
    },
  ])
  Focus.setFocus(WhenExpression.FocusActivityBar)

  Focus.clearFocus(WhenExpression.FocusActivityBar)

  expect(FocusState.get()).toBe(WhenExpression.Empty)
  expect(Context.get(WhenExpression.FocusActivityBar)).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('KeyBindings.setIdentifiers', new Uint32Array())
})

test('clearFocus preserves a newer focus keyboard context', () => {
  Focus.setFocus(WhenExpression.FocusActivityBar)
  Focus.setFocus(WhenExpression.FocusExplorer)

  Focus.clearFocus(WhenExpression.FocusActivityBar)

  expect(FocusState.get()).toBe(WhenExpression.FocusExplorer)
  expect(Context.get(WhenExpression.FocusExplorer)).toBe(true)
})
