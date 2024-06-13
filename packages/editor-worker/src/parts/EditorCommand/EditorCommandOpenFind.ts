// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.js'
// @ts-ignore
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const openFind = async (state) => {
  await Viewlet.openWidget(ViewletModuleId.FindWidget)
  return state
}
