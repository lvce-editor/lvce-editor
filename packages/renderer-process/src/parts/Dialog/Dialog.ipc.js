import * as Command from '../Command/Command.js'
import * as Dialog from './Dialog.js'

export const name = 'Dialog'

// prettier-ignore
export const Commands =  {
  alert: Dialog.alert,
  close: Dialog.close,
  prompt: Dialog.prompt,
  showErrorDialogWithOptions: Dialog.showErrorDialogWithOptions,
}
