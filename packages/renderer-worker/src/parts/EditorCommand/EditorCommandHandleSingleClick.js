import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.js'
import * as ModifierKey from '../ModifierKey/ModifierKey.js'
import * as EditorGoToDefinition from './EditorCommandGoToDefinition.js'
import * as EditorPosition from './EditorCommandPosition.js'

const getPossibleLinkDecoration = (editor, position) => {
  const { decorations, lines } = editor
  let rowIndex = 0
  let offset = 0
  let lineIndex = 0
  for (let i = 0; i < decorations.length; i += 4) {
    const decorationOffset = decorations[i]
    if (decorationOffset >= offset && rowIndex === position.rowIndex) {
      return {
        url: 'https://example.com',
      }
    }
    while (offset < decorationOffset && lineIndex < lines.length) {
      lineIndex++
      const line = lines[i]
      offset += line.length
    }
  }
  return undefined
}

const handleSingleClickWithAlt = async (editor, position) => {
  const linkDecoration = getPossibleLinkDecoration(editor, position)
  console.log({ linkDecoration })
  if (linkDecoration) {
    await Command.execute('Open.openUrl', linkDecoration.url)
    return editor
  }
  console.log({ position })
  console.log('single click with alt')
  // TODO rectangular selection with alt click,
  // but also go to definition with alt click
  const newEditor = await EditorGoToDefinition.goToDefinition(editor, position, /* explicit */ false)
  return newEditor
}

const handleSingleClickWithCtrl = async (editor, position) => {
  const selections = editor.selections
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (
      selectionStartRow === position.rowIndex &&
      selectionStartColumn === position.columnIndex &&
      selectionEndRow === position.rowIndex &&
      selectionEndColumn === position.columnIndex
    ) {
      // selection exists -> remove
      const newSelections = new Uint32Array(selections.length - 4)
      newSelections.set(selections.subarray(0, i), 0)
      newSelections.set(selections.subarray(i + 4), i)
      return Editor.scheduleSelections(editor, newSelections)
    }
  }
  // TODO selection does not exist -> add
  // TODO insert in order
  const newSelections = new Uint32Array(selections.length + 4)
  newSelections.set(selections, 0)
  const insertIndex = selections.length
  newSelections[insertIndex] = position.rowIndex
  newSelections[insertIndex + 1] = position.columnIndex
  newSelections[insertIndex + 2] = position.rowIndex
  newSelections[insertIndex + 3] = position.columnIndex
  return Editor.scheduleSelections(editor, newSelections)
}

const handleSingleClickDefault = (editor, position) => {
  EditorMoveSelectionAnchorState.setPosition(position)
  return {
    ...editor,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    focused: true,
  }
}

const getFn = (modifier) => {
  switch (modifier) {
    case ModifierKey.Alt:
      return handleSingleClickWithAlt
    case ModifierKey.Ctrl:
      return handleSingleClickWithCtrl
    default:
      return handleSingleClickDefault
  }
}

export const handleSingleClick = (editor, modifier, x, y) => {
  Assert.object(editor)
  Assert.string(modifier)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  const fn = getFn(modifier)
  return fn(editor, position)
}
