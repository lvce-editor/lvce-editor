import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const show = async (picks) => {
  // TODO show custom quickpick
  await Command.execute(`Viewlet.openWidget`, ViewletModuleId.QuickPick, 'file')
  // const result = await Command.execute(`QuickPick.show`, picks)
  return undefined
}
