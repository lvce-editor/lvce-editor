import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHost/ExtensionHostTypeDefinition.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Assert from '../Assert/Assert.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'
// TODO duplicate code with editorCommandGoToDefinition
// TODO race condition, check that editor hasn't been closed in the meantime

// TODO in case of error should show message "Definition Error: Cannot ready Property x of undefined"

// TODO show some kind of message maybe ("No Definition found")

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
const getTypeDefinition = async (editor, rowIndex, columnIndex) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const definition =
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      editor,
      offset
    )
  return definition
}

// TODO there are still race conditions in this function:
// - when open is called twice, previous dom nodes can either be reused or the previous dom nodes must be disposed

const getTypeDefinitionErrorMessage = (error) => {
  return `${error}`
}

export const editorGoToTypeDefinition = async (editor, explicit = true) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  try {
    Assert.object(editor)
    Assert.number(rowIndex)
    Assert.number(columnIndex)
    Assert.boolean(explicit)
    const typeDefinition = await getTypeDefinition(
      editor,
      rowIndex,
      columnIndex
    )
    // TODO if editor is already disposed at this point, do nothing
    if (!typeDefinition) {
      // TODO show popup that no definition was found
      // TODO if there was an error, show popup that go to definition resulted in an error
      return EditorShowMessage.editorShowMessage(
        editor,
        rowIndex,
        columnIndex,
        'No type definition found',
        /* isError */ false
      )
    }

    if (
      typeof typeDefinition.uri !== 'string' ||
      typeof typeDefinition.startOffset !== 'number' ||
      typeof typeDefinition.endOffset !== 'number'
    ) {
      console.warn('invalid type definition result', typeDefinition)
      return editor
    }

    if (typeDefinition.uri === editor.uri) {
      // TODO set cursor to the definition position
      const position = TextDocument.positionAt(
        editor,
        typeDefinition.startOffset
      )
      const selectionEdits = [
        {
          start: position,
          end: position,
        },
      ]
      return Editor.scheduleSelections(editor, selectionEdits)
    }
    // TODO if definition.file is not of type string, show a popup that definition.file must be of type string
    // TODO open file and scroll to that position and set cursor to that position

    await Command.execute(
      /* Main.openUri */ 'Main.openUri',
      /* uri */ typeDefinition.file
    )
    return editor
  } catch (error) {
    // TODO if editor is already disposed at this point, do nothing
    if (
      error &&
      // @ts-ignore
      error.message &&
      // @ts-ignore
      error.message.startsWith(
        'Failed to execute type definition provider: No type definition provider found'
      )
    ) {
      const displayErrorMessage = getTypeDefinitionErrorMessage(error)
      await EditorShowMessage.editorShowMessage(
        /* editor */ editor,
        /* rowIndex */ rowIndex,
        /* columnIndex */ columnIndex,
        /* message */ displayErrorMessage,
        /* isError */ false
      )
      return editor
    }

    console.error(error)

    const displayErrorMessage = getTypeDefinitionErrorMessage(error)
    // TODO avoid side effect here, try to find a way to make error handling more declarative
    await EditorShowMessage.editorShowMessage(
      /* editor */ editor,
      /* rowIndex */ rowIndex,
      /* columnIndex */ columnIndex,
      /* message */ displayErrorMessage,
      /* isError */ true
    )
    return editor
  }
}
