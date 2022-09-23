import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const openFind = async (state) => {
  await Viewlet.openWidget(ViewletModuleId.EditorFindWidget)
  return state
}
