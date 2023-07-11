/**
 *
 * @param {Electron.WebContents} webContents
 */
export const disposeWebContents = (webContents) => {
  if (webContents.close) {
    // electron v22
    webContents.close()
    // @ts-ignore
  } else if (webContents.destroy) {
    // older versions of electron
    // @ts-ignore
    webContents.destroy()
  }
}
