import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as Hover from '../Hover/Hover.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    id,
    x: 0,
    y: 0,
    width: 250,
    height: 150,
    maxHeight: 150,
    sanitzedHtml: '',
    documentation: '',
    lineInfos: [],
  }
}

// TODO request hover information from extensions

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

const getHoverPosition = (position, selections) => {
  if (position) {
    return position
  }
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  return {
    rowIndex,
    columnIndex,
  }
}

export const loadContent = async (state, savedState, position) => {
  const editor = getEditor()
  const { selections, height, lines } = editor
  const { rowIndex, columnIndex } = getHoverPosition(position, selections)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await Hover.getHover(editor, offset)
  if (!hover) {
    return state
  }
  const { displayString, documentation } = hover
  // TODO
  const languageId = 'typescript'
  const lineInfos = await TokenizeCodeBlock.tokenizeCodeBlock(displayString, languageId)
  const wordPart = EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  const wordStart = columnIndex - wordPart.length
  const x = EditorPosition.x(editor, rowIndex, wordStart)
  const y = height - EditorPosition.y(editor, rowIndex) + editor.y + 40
  return {
    ...state,
    lineInfos,
    documentation,
    x,
    y,
  }
}
