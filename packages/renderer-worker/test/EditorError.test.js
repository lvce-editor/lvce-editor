// TODO what happens if editorError is outside of viewport (should not happen)

import { jest } from '@jest/globals'
import * as EditorError from '../src/parts/EditorError/EditorError.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('show', () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  RendererProcess.state.send = jest.fn()
  EditorError.show(editor, 'No Definition found', {
    rowIndex: 2,
    columnIndex: 2,
  })
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3700,
    'No Definition found',
    16,
    60,
  ])
})
