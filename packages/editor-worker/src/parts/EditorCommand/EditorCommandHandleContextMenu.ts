import * as Command from '../Command/Command.ts'
// @ts-ignore
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenu = async (editor, button, x, y) => {
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Editor)
  return editor
}
