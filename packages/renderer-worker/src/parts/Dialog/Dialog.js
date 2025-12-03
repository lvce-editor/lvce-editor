// @ts-ignore
import * as Command from '../Command/Command.js'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as OpenUri from '../OpenUri/OpenUri.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const state = {
  dialog: undefined,
}

const openFileWeb = () => {
  Logger.warn('open file - not implemented')
}

const openFileRemote = () => {
  Logger.warn('open file - not implemented')
}

const openFileElectron = async () => {
  const [file] = await ElectronDialog.showOpenDialog('Open File', ['openFile', 'dontAddToRecent', 'showHiddenFiles'])
  await OpenUri.openUri(file)
}

export const openFile = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
      return openFileWeb()
    case PlatformType.Remote:
      return openFileRemote()
    case PlatformType.Electron:
      return openFileElectron()
    default:
  }
}

export const handleClick = async (index) => {
  // @ts-ignore
  const { options } = state.dialog
  const option = options[index]
  // TODO handle case when index is out of bounds
  switch (option) {
    case 'Show Command Output':
      const uri = 'data://'
      await OpenUri.openUri(uri)
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
  options ||= ['Show Command Output', 'Cancel', 'Open Git Log']
  // @ts-ignore
  state.dialog = {
    message,
    options,
  }

  if (Platform.getPlatform() === PlatformType.Electron) {
    // @ts-ignore
    const index = await ElectronDialog.showMessageBox(/* message */ message.message, /* buttons */ options, ElectronMessageBoxType.Error)

    if (index === -1) {
      // TODO can this even happen?
      return
    }
    await handleClick(index)
  } else {
    await Viewlet.openWidget(ViewletModuleId.Dialog, message, options)
  }
}
