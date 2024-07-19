// TODO what happens if editorError is outside of viewport (should not happen)

import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const EditorError = await import('../src/parts/EditorError/EditorError.js')

test('show', async () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorError.show(editor, 'No Definition found', /* rowIndex */ 2, /* columnIndex */ 2)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('EditorError.show', 'No Definition found', 16, 60)
})
