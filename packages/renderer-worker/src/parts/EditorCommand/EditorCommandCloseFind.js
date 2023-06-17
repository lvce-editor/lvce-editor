import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const closeFind = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.FindWidget)
  return state
}
