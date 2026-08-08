import * as BrowserWindowV8CacheOptions from '../BrowserWindowV8CacheOptions/BrowserWindowV8CacheOptions.ts'
import * as GetIcon from '../GetIcon/GetIcon.ts'

/**
 *
 * @returns {any}
 */
export const getBrowserWindowOptions = ({
  alwaysOnTop,
  background,
  frame,
  height,
  preloadUrl,
  titleBarOverlay,
  titleBarStyle,
  transparent,
  width,
  x,
  y,
}: any): any => {
  const icon = GetIcon.getIcon()
  return {
    alwaysOnTop,
    autoHideMenuBar: true,
    backgroundColor: background,
    frame,
    height,
    icon,
    show: false,
    titleBarOverlay,
    titleBarStyle,
    transparent,
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
