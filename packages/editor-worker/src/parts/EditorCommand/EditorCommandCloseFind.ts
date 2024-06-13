// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.ts'
// @ts-ignore
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const closeFind = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.FindWidget)
  return state
}
