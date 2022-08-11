import * as Callback from '../Callback/Callback.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const state = {
  send(message) {
    ParentIpc.electronSend(message)
  },
  async invoke(method, ...params) {
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
  return state.invoke(method, ...params)
}

export const toggleDevtools = async () => {
  await invoke(/* Window.toggleDevtools */ 'Window.toggleDevtools')
}

export const windowMinimize = async () => {
  await invoke(/* Window.minimize */ 'Window.minimize')
}

export const windowMaximize = async () => {
  await invoke(/* Window.maximize */ 'Window.maximize')
}

export const windowUnmaximize = async () => {
  await invoke(/* Window.unmaximize */ 'Window.unmaximize')
}

export const windowClose = async () => {
  await invoke(/* Window.close */ 'Window.close')
}

export const windowReload = async () => {
  await invoke(/* Window.reload */ 'Window.reload')
}

// TODO move these into separate files like done extension host

export const windowOpenNew = async () => {
  await invoke(/* AppWindow.openNew */ 'AppWindow.openNew')
}

export const about = async () => {
  await invoke(/* About.open */ 'About.open')
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

export const crashMainProcess = async () => {
  await invoke(/* Developer.crashMainProcess */ 'Developer.crashMainProcess')
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
