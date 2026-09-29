import * as Command from '../Command/Command.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'

export const openFolder = async () => {
  const uri = await ElectronDialog.showOpenDialog(
    /* title */ 'Open Folder',
    /* properties */ ['openDirectory', 'dontAddToRecent', 'showHiddenFiles'],
  )
  if (!uri) {
    return
  }
  await Command.execute(/* Workspace.setUri */ 'Workspace.setUri', /* uri */ uri)
}
