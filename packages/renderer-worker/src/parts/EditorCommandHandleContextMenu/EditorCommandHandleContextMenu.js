import * as Command from '../Command/Command.js'

export const editorHandleContextMenu = async (editor, x, y) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'editor'
  )
  return editor
}
