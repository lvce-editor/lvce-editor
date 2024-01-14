import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getActiveEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}
