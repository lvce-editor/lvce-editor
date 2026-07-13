import * as Command from '../Command/Command.js'
import * as Promises from '../Promises/Promises.js'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'

export const show = async (picks) => {
  const { resolve, promise } = Promises.withResolvers()
  await Command.execute('QuickPick.showCustom', picks, resolve)
  return promise
}

export const showQuickPick = (options) => {
  return QuickPickWorker.invoke('QuickPick.showQuickPick', options)
}
