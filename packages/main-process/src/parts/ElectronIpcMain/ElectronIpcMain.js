import { ipcMain } from 'electron'

export const on = (event, listener) => {
  ipcMain.on(event, listener)
}
