import * as Hover from '../Hover/Hover.js'
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
  }
}

// TODO request hover information from extensions

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

export const loadContent = async (state) => {
  const editor = getEditor()
  const hover = await Hover.getHover(editor)
  console.log({ hover })
  return state
}
