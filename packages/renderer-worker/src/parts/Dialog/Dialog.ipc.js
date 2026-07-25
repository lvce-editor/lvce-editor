import * as OpenFolder from '../OpenFolder/OpenFolder.js'
import * as Dialog from './Dialog.js'

export const name = 'Dialog'

export const Commands = {
  handleClick: Dialog.handleClick,
  openFile: Dialog.openFile,
  openFolder: OpenFolder.openFolder,
  show: Dialog.show,
  showMessage: Dialog.showMessage,
  showWarning: Dialog.showWarning,
}
