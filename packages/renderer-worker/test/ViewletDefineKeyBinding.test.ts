import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeWidgetWithValue: jest.fn(),
  }
})

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletDefineKeyBinding = await import('../src/parts/ViewletDefineKeyBinding/ViewletDefineKeyBinding.js')

test('create - stores the parent keybindings view uid', () => {
  expect(ViewletDefineKeyBinding.create(42, '', 0, 0, 100, 100, [7])).toMatchObject({
    id: 42,
    parentUid: 7,
  })
})

test('handleKeyDown - Enter submits the recorded keybinding', () => {
  const state = {
    uid: 42,
    value: 'Ctrl+Alt+9',
  }

  ViewletDefineKeyBinding.handleKeyDown(state, 'Enter', false, false, false, false)

  expect(Viewlet.disposeWidgetWithValue).toHaveBeenCalledWith(42, 'Ctrl+Alt+9')
})
