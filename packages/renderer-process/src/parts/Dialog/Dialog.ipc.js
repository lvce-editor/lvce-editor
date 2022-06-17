import * as Command from '../Command/Command.js'
import * as Dialog from './Dialog.js'

export const __initialize__ = () => {
  Command.register(7833, Dialog.prompt)
  Command.register(7834, Dialog.alert)
  Command.register(7835, Dialog.showErrorDialogWithOptions)
  Command.register(7836, Dialog.close)
}
