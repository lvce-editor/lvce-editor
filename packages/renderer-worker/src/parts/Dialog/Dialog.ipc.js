import * as Command from '../Command/Command.js'
import * as Dialog from './Dialog.js'

export const __initialize__ = () => {
  Command.register('Dialog.openFolder', Dialog.openFolder)
  Command.register('Dialog.showAbout', Dialog.showAbout)
  Command.register('Dialog.showMessage', Dialog.showMessage)
  Command.register('Dialog.close', Dialog.close)
  Command.register('Dialog.handleClick', Dialog.handleClick)
}
