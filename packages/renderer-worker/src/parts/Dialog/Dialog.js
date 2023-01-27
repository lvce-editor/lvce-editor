import * as Command from '../Command/Command.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as IsAbortError from '../IsAbortError/IsAbortError.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const state = {
  dialog: undefined,
}

const openFolderWeb = async () => {
  try {
    const result = await Command.execute('FilePicker.showDirectoryPicker', {
      startIn: 'pictures',
      mode: 'readwrite',
    })
    await Command.execute('PersistentFileHandle.addHandle', result.name, result)
    await Command.execute('Workspace.setPath', `html://${result.name}`)
  } catch (error) {
    if (IsAbortError.isAbortError(error)) {
      return
    }
    throw new VError(error, `Failed to open folder`)
  }
}

const openFolderRemote = async () => {
  const path = await RendererProcess.invoke(/* Dialog.prompt */ 'Dialog.prompt', /* message */ 'Choose path:')
  if (!path) {
    return
  }
  await Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ path)
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
  await Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ path)
}

export const openFolder = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return openFolderWeb()
    case PlatformType.Remote:
      return openFolderRemote()
    case PlatformType.Electron:
      return openFolderElectron()
    default:
      return
  }
}

const openFileWeb = () => {
  Logger.warn('open file - not implemented')
}

const openFileRemote = () => {
  Logger.warn('open file - not implemented')
}

const openFileElectron = async () => {
  const [file] = await ElectronDialog.showOpenDialog('Open File', ['openFile', 'dontAddToRecent', 'showHiddenFiles'])
  await Command.execute('Main.openUri', file)
}

export const openFile = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return openFileWeb()
    case PlatformType.Remote:
      return openFileRemote()
    case PlatformType.Electron:
      return openFileElectron()
    default:
      return
  }
}

export const handleClick = async (index) => {
  const { options } = state.dialog
  const option = options[index]
  // TODO handle case when index is out of bounds
  switch (option) {
    case 'Show Command Output':
      const uri = `data://`
      await Command.execute(/* Main.openUri */ 'Main.openUri', uri)
      // TODO show stderr in editor
      // TODO close dialog
      break
    default:
      break
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
    const index = await ElectronDialog.showMessageBox(/* message */ message.message, /* buttons */ options)

    if (index === -1) {
      // TODO can this even happen?
      return
    }
    await handleClick(index)
  } else {
    await Viewlet.openWidget(ViewletModuleId.Dialog, message, options)
  }
}
