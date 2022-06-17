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
  send(/* Window.toggleDevtools */ 6523)
}

export const windowMinimize = () => {
  send(/* Window.minimize */ 6521)
}

export const windowMaximize = () => {
  send(/* Window.maximize */ 6522)
}

export const windowUnmaximize = () => {
  send(/* Window.unmaximize */ 6524)
}

export const windowClose = () => {
  send(/* Window.close */ 6525)
}

export const windowReload = () => {
  send(/* Window.reload */ 6526)
}

// TODO move these into separate files like done extension host

export const windowOpenNew = () => {
  send(/* AppWindow.openNew */ 8527)
}

export const about = () => {
  send(/* About.open */ 20001)
}

export const showOpenDialog = async () => {
  const result = await invoke(/* Dialog.showOpenDialog */ 20100)
  return result
}

export const showMessageBox = async (message, buttons) => {
  const result = await invoke(
    /* Dialog.showMessageBox */ 20101,
    message,
    buttons
  )
  return result
}

export const crashMainProcess = () => {
  send(/* Developer.crashMainProcess */ 7723)
}

export const getPerformanceEntries = async () => {
  const result = await invoke(/* Developer.getPerformanceEntries */ 7722)
  return result
}

export const beep = async () => {
  // TODO when is remote should send to renderer worker
  await invoke(/* Beep.beep */ 50000)
}

export const exit = async () => {
  await invoke(/* App.exit */ 2211)
}

export const openProcessExplorer = async () => {
  await invoke(/* ProcessExplorer.openProcessExplorer */ 8822)
}
