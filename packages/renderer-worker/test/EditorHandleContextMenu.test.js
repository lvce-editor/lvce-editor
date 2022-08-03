import { jest } from '@jest/globals'
import * as EditorHandleContextMenu from '../src/parts/EditorCommandHandleContextMenu/EditorCommandHandleContextMenu.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test.skip('editorHandleContextMenu', async () => {
  RendererProcess.state.send = jest.fn()
  const editor = {
    lines: ['abcde', 'abcde'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
  }
  await EditorHandleContextMenu.editorHandleContextMenu(editor, 20, 20)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    661,
    20,
    20,
    [
      {
        label: 'copy',
        id: -1,
        flags: /* none */ 0,
      },
      {
        label: 'cut',
        id: -1,
        flags: /* none */ 0,
      },
      {
        label: 'paste',
        id: -1,
        flags: /* none */ 0,
      },
    ],
  ])
})
