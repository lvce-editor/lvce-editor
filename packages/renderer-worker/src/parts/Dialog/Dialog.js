import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const state = {
  dialog: undefined,
}

export const openFolder = async () => {
  if (Platform.getPlatform() === 'web') {
    console.warn('open folder - not implemented')
    return
  }
  if (Platform.getPlatform() === 'remote') {
    const path = await RendererProcess.invoke(
      /* Dialog.prompt */ 7833,
      /* message */ 'Choose path:'
    )
    await Command.execute(
      /* Workspace.setPath */ 'Workspace.setPath',
      /* path */ path
    )
    return
  }
  const folders = await SharedProcess.invoke(
    /* Electron.showOpenDialog */ 'Electron.showOpenDialog'
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

export const showAbout = async () => {
  if (Platform.getPlatform() === 'web' || Platform.getPlatform() === 'remote') {
    console.warn('show about - not implemented')
    return
  }
  await SharedProcess.invoke(/* Electron.about */ 'Electron.about')
}

export const showMessage = async (message, options) => {
  if (state.dialog) {
    console.info('cannot show multiple dialogs at the same time')
    return
  }
  // TODO implement actual dialog component for web
  // RendererProcess.invoke(/* Dialog.alert */ 7834, /* message */ message)
  // TODO on electron use native dialog
  if (!options) {
    options = ['Show Command Output', 'Cancel', 'Open Git Log']
  }
  console.log({ message })
  state.dialog = {
    message,
    options,
  }

  if (Platform.getPlatform() === 'electron') {
    const index = await SharedProcess.invoke(
      /* Electron.showMessageBox */ 'Electron.showMessageBox',
      /* message */ message.message,
      /* buttons */ options
    )

    if (index === -1) {
      // TODO can this even happen?
      return
    }
    await handleClick(index)
    // console.log({ result: index })
    // state.dialog = undefined
  } else {
    await RendererProcess.invoke(
      /* Dialog.showErrorDialogWithOptions */ 7835,
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
  console.log({ option })
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
