import * as BrowserWindowV8CacheOptions from '../BrowserWindowV8CacheOptions/BrowserWindowV8CacheOptions.ts'
import * as GetIcon from '../GetIcon/GetIcon.ts'

/**
 *
 * @returns {any}
 */
export const getBrowserWindowOptions = ({ background, frame, height, preloadUrl, titleBarOverlay, titleBarStyle, width, x, y }: any): any => {
  const icon = GetIcon.getIcon()
  return {
    autoHideMenuBar: true,
    backgroundColor: background,
    frame,
    height,
    icon,
    show: false,
    titleBarOverlay,
    titleBarStyle,
    webPreferences: {
      additionalArguments: [],
      contextIsolation: true,
      enableWebSQL: false,
      preload: preloadUrl,
      sandbox: true,
      spellcheck: false,
      v8CacheOptions: BrowserWindowV8CacheOptions.browserWindowV8CacheOptions,
    },
    width,
    x,
    y,
  }
}
