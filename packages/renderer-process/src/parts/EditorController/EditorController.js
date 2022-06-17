import * as EditorHelper from '../Editor/EditorHelper.js'
import * as Editor from '../Editor/Editor.js'
import * as ActiveViewlet from '../Viewlet/ActiveViewlet.js'

export const wrapEditorCommand = (fn) => {
  const wrappedCommand = (id, ...args) => {
    const state = ActiveViewlet.getState('EditorText')
    console.assert(state)
    fn(state, ...args)
  }
  return wrappedCommand
}

export const create = (id) => {
  const editor = Editor.create()
  EditorHelper.setState(id, editor)
  return editor.$Editor
}
