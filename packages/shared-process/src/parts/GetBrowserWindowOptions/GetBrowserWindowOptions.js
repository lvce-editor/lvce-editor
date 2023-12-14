import * as GetIcon from '../GetIcon/GetIcon.js'
import * as GetPreloadUrl from '../GetPreloadUrl/GetPreloadUrl.js'

/**
 *
 * @returns {any}
 */
export const getBrowserWindowOptions = ({ x, y, width, height, titleBarStyle, titleBarOverlay, frame, session, background }) => {
  const icon = GetIcon.getIcon()
  return {
    x,
    y,
    width,
    height,
    autoHideMenuBar: true,
    titleBarStyle,
    titleBarOverlay,
    frame,
    webPreferences: {
      enableWebSQL: false,
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      v8CacheOptions: 'bypassHeatCheck', // TODO this is what vscode uses, but it doesn't work properly in electron https://github.com/electron/electron/issues/27075
      preload: GetPreloadUrl.getPreloadUrl(),
      session,
      additionalArguments: ['--lvce-window-kind'],
    },
    backgroundColor: background,
    show: false,
    icon,
  }
}
