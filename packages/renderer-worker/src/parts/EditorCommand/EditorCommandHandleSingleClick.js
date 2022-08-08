import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as EditorCursorSet from './EditorCommandCursorSet.js'
import * as EditorPosition from './EditorCommandPosition.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorGoToDefinition from './EditorCommandGoToDefinition.js'
import * as Focus from '../Focus/Focus.js'

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
  // TODO avoid side effects here
  await RendererProcess.invoke('Viewlet.invoke', 'EditorText', 'focus')
  Focus.setFocus('EditorText')
  return EditorCursorSet.editorCursorSet(
    editor,
    position.rowIndex,
    position.columnIndex
  )
}
