import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as EditorCursorSet from '../EditorCommandCursorSet/EditorCommandCursorSet.js'
import * as EditorPosition from '../EditorCommandPosition/EditorCommandPosition.js'
import * as EditorMoveSelection from '../EditorCommandMoveSelection/EditorCommandMoveSelection.js'
import * as EditorGoToDefinition from '../EditorCommandGoToDefinition/EditorCommandGoToDefinition.js'

export const editorHandleSingleClick = async (
  editor,
  modifier,
  x,
  y,
  offset
) => {
  Assert.object(editor)
  Assert.string(modifier)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const position = EditorPosition.at(editor, x, y, offset)
  if (modifier === 'alt') {
    // TODO rectangular selection with alt click,
    // but also go to definition with alt click
    console.log('alt key pressed')
    const newEditor = await EditorGoToDefinition.editorGoToDefinition(
      editor,
      position,
      /* explicit */ false
    )
    if (editor !== newEditor) {
      return newEditor
    }
  }
  console.log({ position })
  EditorMoveSelection.state.position = position
  // TODO also focus editor input
  await RendererProcess.invoke('Viewlet.invoke', 'EditorText', 'focus')
  return EditorCursorSet.editorCursorSet(
    editor,
    position.rowIndex,
    position.columnIndex
  )
}
