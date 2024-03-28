import * as Command from '../Command/Command.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'

export const openFolder = async () => {
  const folders = await ElectronDialog.showOpenDialog(
    /* title */ 'Open Folder',
    /* properties */ ['openDirectory', 'dontAddToRecent', 'showHiddenFiles'],
  )
  if (!folders || folders.length === 0) {
    return
  }
  const path = folders[0]
  await Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ path)
}
