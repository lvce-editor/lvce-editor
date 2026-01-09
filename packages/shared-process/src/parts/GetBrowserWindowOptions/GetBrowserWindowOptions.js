import * as BrowserWindowV8CacheOptions from '../BrowserWindowV8CacheOptions/BrowserWindowV8CacheOptions.js'
import * as GetIcon from '../GetIcon/GetIcon.js'

/**
 *
 * @returns {any}
 */
export const getBrowserWindowOptions = ({ x, y, width, height, titleBarStyle, titleBarOverlay, frame, background, preloadUrl }) => {
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
      v8CacheOptions: BrowserWindowV8CacheOptions.browserWindowV8CacheOptions,
      preload: preloadUrl,
      additionalArguments: [],
    },
    backgroundColor: background,
    show: false,
    icon,
  }
}
