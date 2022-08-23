import * as Command from '../Command/Command.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronWindowAbout from '../ElectronWindowAbout/ElectronWindowAbout.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const state = {
  dialog: undefined,
}

const openFolderWeb = () => {
  console.warn('open folder - not implemented')
}

const openFolderRemote = async () => {
  const path = await RendererProcess.invoke(
    /* Dialog.prompt */ 'Dialog.prompt',
    /* message */ 'Choose path:'
  )
  await Command.execute(
    /* Workspace.setPath */ 'Workspace.setPath',
    /* path */ path
  )
}

const openFolderElectron = async () => {
  const folders = await ElectronDialog.showOpenDialog(
    /* title */ 'Open Folder',
    /* properties */ ['openDirectory', 'dontAddToRecent', 'showHiddenFiles']
  )
  if (!folders || folders.length === 0) {
    return
  }
  const path = folders[0]
  await Command.execute(
    /* Workspace.setPath */ 'Workspace.setPath',
    /* path */ path
  )
}

export const openFolder = () => {
  switch (Platform.platform) {
    case 'web':
      return openFolderWeb()
    case 'remote':
      return openFolderRemote()
    case 'electron':
      return openFolderElectron()
    default:
      return
  }
}

const openFileWeb = () => {
  console.warn('open file - not implemented')
}

const openFileRemote = () => {
  console.warn('open file - not implemented')
}

const openFileElectron = async () => {
  const [file] = await ElectronDialog.showOpenDialog('Open File', [
    'openFile',
    'dontAddToRecent',
    'showHiddenFiles',
  ])
  await Command.execute('Main.openUri', file)
}

export const openFile = () => {
  switch (Platform.platform) {
    case 'web':
      return openFileWeb()
    case 'remote':
      return openFileRemote()
    case 'electron':
      return openFileElectron()
    default:
      return
  }
}

const showAboutWeb = () => {
  console.warn('show about - not implemented')
}

const showAboutRemote = () => {
  console.warn('show about - not implemented')
}

const showAboutElectron = async () => {
  await ElectronWindowAbout.open()
}

export const showAbout = async () => {
  switch (Platform.platform) {
    case 'web':
      return showAboutWeb()
    case 'remote':
      return showAboutRemote()
    case 'electron':
      return showAboutElectron()
    default:
      return
  }
}

export const showMessage = async (message, options) => {
  if (state.dialog) {
    console.info('cannot show multiple dialogs at the same time', message)
    return
  }
  // TODO implement actual dialog component for web
  // RendererProcess.invoke(/* Dialog.alert */ 7834, /* message */ message)
  // TODO on electron use native dialog
  if (!options) {
    options = ['Show Command Output', 'Cancel', 'Open Git Log']
  }
  // @ts-ignore
  state.dialog = {
    message,
    options,
  }

  if (Platform.platform === 'electron') {
    const index = await ElectronDialog.showMessageBox(
      /* message */ message.message,
      /* buttons */ options
    )

    if (index === -1) {
      // TODO can this even happen?
      return
    }
    await handleClick(index)
  } else {
    await RendererProcess.invoke(
      /* Dialog.showErrorDialogWithOptions */ 'Dialog.showErrorDialogWithOptions',
      /* message */ message,
      /* options */ options
    )
  }
}

export const close = async () => {
  // TODO support closing of electron dialogs
  if (!state.dialog) {
    console.info('no dialog to close')
    return
  }
  state.dialog = undefined
  await RendererProcess.invoke(/* Dialog.close */ 7836)
}

export const handleClick = async (index) => {
  const dialog = state.dialog
  const option = dialog.options[index]
  // TODO handle case when index is out of bounds
  switch (option) {
    case 'Show Command Output':
      await close()
      const uri = `data://${dialog.message.stderr}`
      await Command.execute(/* Main.openUri */ 'Main.openUri', uri)
      // TODO show stderr in editor
      // TODO close dialog
      break
    default:
      break
  }
}
