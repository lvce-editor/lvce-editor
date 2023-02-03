import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js', () => {
  return {
    clearEditor: jest.fn(),
  }
})

const EditorSelectionAutoMoveState = await import('../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js')
const EditorCommandHandlePointerCaptureLost = await import('../src/parts/EditorCommand/EditorCommandHandlePointerCaptureLost.js')

test('handlePointerCaptureLost', () => {
  const editor = {}
  expect(EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)).toBe(editor)
  expect(EditorSelectionAutoMoveState.clearEditor).toHaveBeenCalledTimes(1)
})
