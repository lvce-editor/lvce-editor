import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostDefinition from '../ExtensionHost/ExtensionHostDefinition.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'
// TODO race condition, check that editor hasn't been closed in the meantime

// TODO in case of error should show message "Definition Error: Cannot ready Property x of undefined"

// TODO show some kind of message maybe ("No Definition found")

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
const getDefinition = async (editor, position) => {
  const offset = TextDocument.offsetAt(editor, position)
  const definition = await ExtensionHostDefinition.executeDefinitionProvider(
    editor,
    offset
  )
  return definition
}

// TODO there are still race conditions in this function:
// - when open is called twice, previous dom nodes can either be reused or the previous dom nodes must be disposed

const getDefinitionErrorMessage = (error) => {
  if (
    error &&
    error.message &&
    error.message.startsWith('Failed to execute definition provider: ')
  ) {
    return error.message.replace('Failed to execute definition provider: ', '')
  }
  return `${error}`
}

export const editorGoToDefinition = async (
  editor,
  position = editor.cursor,
  explicit = true
) => {
  try {
    const definition = await getDefinition(editor, position)
    // TODO if editor is already disposed at this point, do nothing
    if (!definition) {
      // TODO show popup that no definition was found
      // TODO if there was an error, show popup that go to definition resulted in an error
      return EditorShowMessage.editorShowMessage(
        editor,
        position,
        'No definition found'
      )
    }
    if (
      typeof definition.uri !== 'string' ||
      typeof definition.startOffset !== 'number' ||
      typeof definition.endOffset !== 'number'
    ) {
      console.warn('invalid definition result', definition)
      return editor
    }

    if (definition.uri === editor.uri) {
      // TODO set cursor to the definition position
      const position = TextDocument.positionAt(editor, definition.startOffset)
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
      /* uri */ definition.file
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
        'Failed to execute definition provider: No definition provider found'
      )
    ) {
      const displayErrorMessage = getDefinitionErrorMessage(error)
      await EditorShowMessage.editorShowMessage(
        /* editor */ editor,
        /* position */ position,
        /* message */ displayErrorMessage
      )
      return editor
    }

    console.error(error)

    const displayErrorMessage = getDefinitionErrorMessage(error)
    await EditorShowMessage.editorShowMessage(
      /* editor */ editor,
      /* position */ position,
      /* message */ displayErrorMessage
    )
    return editor
  }
}
