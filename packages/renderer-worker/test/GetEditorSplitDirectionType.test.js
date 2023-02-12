import * as GetEditorSplitDirectionType from '../src/parts/GetEditorSplitDirectionType/GetEditorSplitDirectionType.js'
import * as EditorSplitDirectionType from '../src/parts/EditorSplitDirectionType/EditorSplitDirectionType.js'

test('getEditorSplitDirectionType - at top left', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 0
  const eventY = 0
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Left)
})

test('getEditorSplitDirectionType - at top middle', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 50
  const eventY = 0
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Up)
})

test('getEditorSplitDirectionType - at top right', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 100
  const eventY = 0
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Right)
})

test('getEditorSplitDirectionType - at middle left', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 0
  const eventY = 50
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Left)
})

test('getEditorSplitDirectionType - at middle middle', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 50
  const eventY = 50
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.None)
})

test('getEditorSplitDirectionType - at middle right', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 100
  const eventY = 50
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Right)
})

test('getEditorSplitDirectionType - at bottom left', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 0
  const eventY = 100
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Left)
})

test('getEditorSplitDirectionType - at bottom middle', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 50
  const eventY = 100
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Down)
})

test('getEditorSplitDirectionType - at bottom right', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const eventX = 100
  const eventY = 100
  expect(GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y, width, height, eventX, eventY)).toBe(EditorSplitDirectionType.Right)
})
