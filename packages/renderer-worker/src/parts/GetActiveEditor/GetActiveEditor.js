import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getActiveEditor = () => {
  return ViewletStates.getState(ViewletModuleId.EditorText)
}
