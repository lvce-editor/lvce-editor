import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts', () => {
  return {
    clearEditor: jest.fn(),
  }
})

const EditorSelectionAutoMoveState = await import('../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts')
const EditorCommandHandlePointerCaptureLost = await import('../src/parts/EditorCommand/EditorCommandHandlePointerCaptureLost.ts')

test('handlePointerCaptureLost', () => {
  const editor = {}
  expect(EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)).toBe(editor)
  expect(EditorSelectionAutoMoveState.clearEditor).toHaveBeenCalledTimes(1)
})
