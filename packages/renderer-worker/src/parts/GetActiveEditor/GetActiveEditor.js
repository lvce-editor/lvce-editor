import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getActiveEditor = () => {
  return ViewletStates.getState(ViewletModuleId.EditorText)
}

export const getActiveEditorId = () => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return -1
  }
  return instance.state.id
}
