import * as Command from '../Command/Command.js'
import * as Dialog from './Dialog.js'

export const __initialize__ = () => {
  Command.register(1492, Dialog.openFolder)
  Command.register(1493, Dialog.showAbout)
  Command.register(1494, Dialog.showMessage)
  Command.register(1495, Dialog.close)
  Command.register(1496, Dialog.handleClick)
}
