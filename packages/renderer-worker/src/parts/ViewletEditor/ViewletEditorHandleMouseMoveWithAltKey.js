import * as EditorPosition from './ViewletEditorPosition.js/index.js'
import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostDefinition from '../ExtensionHost/ExtensionHostDefinition.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const getTokenIndex = (tokens, offset) => {
  let currentOffset = 0
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    currentOffset += token.length
    if (currentOffset >= offset) {
      return i
    }
  }
  return -1
}

export const editorHandleMouseMoveWithAltKey = async (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const position = EditorPosition.at(editor, x, y, offset)
  const documentOffset = TextDocument.offsetAt(
    editor,
    position.rowIndex,
    position.columnIndex
  )
  try {
    const definition = await ExtensionHostDefinition.executeDefinitionProvider(
      editor,
      documentOffset
    )
    if (!definition) {
      return editor
    }

    // TODO make sure that editor is not disposed

    const definitionStartPosition = TextDocument.positionAt(
      editor,
      definition.startOffset
    )
    const definitionEndPosition = TextDocument.positionAt(
      editor,
      definition.endOffset
    )
    const definitionRelativeStartX = definitionStartPosition.columnIndex
    const definitionRelativeEndX = definitionEndPosition.columnIndex
    const definitionRelativeY =
      definitionStartPosition.rowIndex - editor.minLineY

    const lineTokenMap = editor.lineCache[definitionStartPosition.rowIndex + 1]
    console.log({ tokenMap: lineTokenMap })
    console.log({
      lineCache: editor.lineCache,
      rowIndex: definitionStartPosition.rowIndex,
    })
    if (!lineTokenMap) {
      return editor
    }
    const tokenIndex = getTokenIndex(
      lineTokenMap.tokens,
      definitionStartPosition.columnIndex
    )
    if (tokenIndex === -1) {
      return editor
    }
    console.log({ token: tokenIndex })
    // .tokens
    // console.log({ editor })
    await RendererProcess.invoke(
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorText',
      /* method */ 'highlightAsLink',
      /* relativeY */ definitionRelativeY,
      /* tokenIndex */ tokenIndex
    )
    console.log({ definition })
    return editor
  } catch (error) {
    if (
      error &&
      error.message.startsWith(
        'Failed to execute definition provider: No definition provider found'
      )
    ) {
      return editor
    }
    throw error
  }
}
