import * as Assert from '../Assert/Assert.ts'
import * as Definition from '../Definition/Definition.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

// @ts-ignore
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

// @ts-ignore
export const handleMouseMoveWithAltKey = async (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  const documentOffset = TextDocument.offsetAt(editor, position.rowIndex, position.columnIndex)
  try {
    const definition = await Definition.getDefinition(editor, documentOffset)
    if (!definition) {
      return editor
    }

    // TODO make sure that editor is not disposed

    const definitionStartPosition = TextDocument.positionAt(editor, definition.startOffset)
    const definitionEndPosition = TextDocument.positionAt(editor, definition.endOffset)
    // @ts-ignore
    const definitionRelativeStartX = definitionStartPosition.columnIndex
    // @ts-ignore
    const definitionRelativeEndX = definitionEndPosition.columnIndex
    // const definitionRelativeY = definitionStartPosition.rowIndex - editor.minLineY

    const lineTokenMap = editor.lineCache[definitionStartPosition.rowIndex + 1]
    console.log({ tokenMap: lineTokenMap })
    console.log({
      lineCache: editor.lineCache,
      rowIndex: definitionStartPosition.rowIndex,
    })
    if (!lineTokenMap) {
      return editor
    }
    const tokenIndex = getTokenIndex(lineTokenMap.tokens, definitionStartPosition.columnIndex)
    if (tokenIndex === -1) {
      return editor
    }
    console.log({ token: tokenIndex })
    // .tokens
    // await RendererProcess.invoke(
    //   /* Viewlet.invoke */ 'Viewlet.send',
    //   /* id */ ViewletModuleId.EditorText,
    //   /* method */ 'highlightAsLink',
    //   /* relativeY */ definitionRelativeY,
    //   /* tokenIndex */ tokenIndex,
    // )
    console.log({ definition })
    return editor
  } catch (error) {
    // @ts-ignore
    if (error && error.message.startsWith('Failed to execute definition provider: No definition provider found')) {
      return editor
    }
    throw error
  }
}
