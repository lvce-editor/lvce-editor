import * as Command from '../Command/Command.js'
import * as Promises from '../Promises/Promises.js'

export const show = async (picks) => {
  const { resolve, promise } = Promises.withResolvers()
  await Command.execute('QuickPick.showCustom', picks, resolve)
  return promise
}
