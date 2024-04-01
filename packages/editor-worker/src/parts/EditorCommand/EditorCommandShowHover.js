// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.js'
// @ts-ignore
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const showHover = async (state) => {
  await Viewlet.openWidget(ViewletModuleId.EditorHover)
  return state
}
