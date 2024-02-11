import * as Command from '../Command/Command.js'

export const show = async (picks) => {
  // TODO show custom quickpick
  await Command.execute(`QuickPick.showCustom`, picks)
  return undefined
}
