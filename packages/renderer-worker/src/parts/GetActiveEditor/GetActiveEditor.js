import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getActiveEditor = () => {
  return ViewletStates.getState(ViewletModuleId.EditorText)
}

export const getActiveEditorId = () => {
  const editor = getActiveEditor()
  return editor.id
}
