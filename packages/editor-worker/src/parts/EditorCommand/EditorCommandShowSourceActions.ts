// @ts-ignore
import * as Viewlet from '../Viewlet/Viewlet.ts'
// @ts-ignore
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const showSourceActions = async (editor) => {
  // TODO
  // 1. hide hover, completions, color picker
  // 2. query source actions from extension host
  // 3. show source actions menu
  await Viewlet.openWidget(ViewletModuleId.EditorSourceActions)

  return editor
}
