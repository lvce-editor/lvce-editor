import * as Command from '../Command/Command.js'

export const editorHandleContextMenu = async (editor, x, y) => {
  await Command.execute(
    /* ContextMenu.show */ 951,
    /* x */ x,
    /* y */ y,
    /* id */ 'editor'
  )
}
