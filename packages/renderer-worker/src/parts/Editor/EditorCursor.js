import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const applyEdits = (editor, cursor) => {
  // TODO multiple cursors
  console.assert(cursor)
  editor.cursor = cursor
  GlobalEventBus.emitEvent('editor.cursorChange', editor, cursor)
}
