import * as OpenFolder from '../OpenFolder/OpenFolder.js'
import * as Dialog from './Dialog.js'

export const name = 'Dialog'

export const Commands = {
  close: Dialog.close,
  handleClick: Dialog.handleClick,
  openFile: Dialog.openFile,
  openFolder: OpenFolder.openFolder,
  showMessage: Dialog.showMessage,
}
