import * as ViewletStates from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getActiveEditor = () => {
  return ViewletStates.getState(ViewletModuleId.EditorText)
}
