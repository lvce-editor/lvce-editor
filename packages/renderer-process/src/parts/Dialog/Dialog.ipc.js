import * as Command from '../Command/Command.js'
import * as Dialog from './Dialog.js'
import * as CommandId from '../CommandId/CommandId.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register(CommandId.DIALOG_PROMPT, Dialog.prompt)
  Command.register(CommandId.DIALOG_ALERT, Dialog.alert)
  Command.register(CommandId.DIALOG_SHOW_ERROR_DIALOG_WITH_OPTIONS, Dialog.showErrorDialogWithOptions)
  Command.register(CommandId.DIALOG_CLOSE, Dialog.close)
}
