import * as Hover from '../Hover/Hover.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
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
    displayString: '',
    documentation: '',
  }
}

// TODO request hover information from extensions

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

export const loadContent = async (state) => {
  const editor = getEditor()
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await Hover.getHover(editor, offset)
  if (!hover) {
    return state
  }
  const { displayString, documentation } = hover
  return {
    ...state,
    displayString,
    documentation,
  }
}
