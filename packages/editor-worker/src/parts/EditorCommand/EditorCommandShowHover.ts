// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.ts'
// @ts-ignore
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const showHover = async (state) => {
  await Viewlet.openWidget(ViewletModuleId.EditorHover)
  return state
}
