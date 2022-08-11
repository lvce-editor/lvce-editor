import * as Callback from '../Callback/Callback.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const state = {
  send(message) {
    ParentIpc.electronSend(message)
  },
}

const send = (method, ...params) => {
  state.send({
    jsonrpc: '2.0',
    method,
    params,
  })
}

const invoke = async (method, ...params) => {
  return new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    state.send({
      jsonrpc: '2.0',
      method,
      params,
      id: callbackId,
    })
  })
}

export const toggleDevtools = () => {
  send(/* Window.toggleDevtools */ 'Window.toggleDevtools')
}

export const windowMinimize = () => {
  send(/* Window.minimize */ 'Window.minimize')
}

export const windowMaximize = () => {
  send(/* Window.maximize */ 'Window.maximize')
}

export const windowUnmaximize = () => {
  send(/* Window.unmaximize */ 'Window.unmaximize')
}

export const windowClose = () => {
  send(/* Window.close */ 'Window.close')
}

export const windowReload = () => {
  send(/* Window.reload */ 'Window.reload')
}

// TODO move these into separate files like done extension host

export const windowOpenNew = () => {
  send(/* AppWindow.openNew */ 'AppWindow.openNew')
}

export const about = () => {
  send(/* About.open */ 'Dialog.showAbout')
}

export const showOpenDialog = async () => {
  const result = await invoke(
    /* Dialog.showOpenDialog */ 'Dialog.showOpenDialog'
  )
  return result
}

export const showMessageBox = async (message, buttons) => {
  const result = await invoke(
    /* Dialog.showMessageBox */ 'Dialog.showMessageBox',
    message,
    buttons
  )
  return result
}

export const crashMainProcess = () => {
  send(/* Developer.crashMainProcess */ 'Developer.crashMainProcess')
}

export const getPerformanceEntries = async () => {
  const result = await invoke(
    /* Developer.getPerformanceEntries */ 'Developer.getPerformanceEntries'
  )
  return result
}

export const beep = async () => {
  // TODO when is remote should send to renderer worker
  await invoke(/* Beep.beep */ 'Beep.beep')
}

export const exit = async () => {
  await invoke(/* App.exit */ 'App.exit')
}

export const openProcessExplorer = async () => {
  await invoke(
    /* ProcessExplorer.openProcessExplorer */ 'ProcessExplorer.openProcessExplorer'
  )
}
