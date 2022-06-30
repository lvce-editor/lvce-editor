import * as Command from '../Command/Command.js'
import * as Dialog from './Dialog.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Dialog.prompt', Dialog.prompt)
  Command.register('Dialog.alert', Dialog.alert)
  Command.register('Dialog.showErrorDialogWithOptions', Dialog.showErrorDialogWithOptions)
  Command.register('Dialog.close', Dialog.close)
}
