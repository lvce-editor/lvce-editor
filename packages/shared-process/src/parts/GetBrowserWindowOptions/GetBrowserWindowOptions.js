import * as GetIcon from '../GetIcon/GetIcon.js'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.js'

/**
 *
 * @returns {any}
 */
export const getBrowserWindowOptions = ({ x, y, width, height, titleBarStyle, titleBarOverlay, frame, background }) => {
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
      preload: PreloadUrl.preloadUrl,
      additionalArguments: ['--lvce-window-kind'],
    },
    backgroundColor: background,
    show: false,
    icon,
  }
}
