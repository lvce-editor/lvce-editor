// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.ts'
// @ts-ignore
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

// @ts-ignore
export const openFind = async (state) => {
  await Viewlet.openWidget(ViewletModuleId.FindWidget)
  return state
}