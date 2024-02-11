import * as Command from '../Command/Command.js'

export const show = (picks) => {
  return Command.execute(`QuickPick.showCustom`, picks)
}
