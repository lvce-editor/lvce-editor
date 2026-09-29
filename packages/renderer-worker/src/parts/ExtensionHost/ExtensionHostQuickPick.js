import * as Command from '../Command/Command.js'
import * as Promises from '../Promises/Promises.js'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'

export const show = async (picks) => {
  const { resolve, promise } = Promises.withResolvers()
  await Command.execute('QuickPick.showCustom', picks, resolve)
  return promise
}

export const showQuickPick = (options, applicationId) => {
  return QuickPickWorker.invoke('QuickPick.showQuickPick', applicationId === undefined ? options : { ...options, applicationId })
}

export const showQuickInput = async (options = {}, applicationId) => {
  const result = await QuickPickWorker.invoke('QuickPick.showQuickInput', {
    ...(applicationId !== undefined && { applicationId }),
    initialValue: options.value,
    placeholder: options.placeholder,
  })
  if (!result || result.canceled) {
    return undefined
  }
  return result.inputValue
}
