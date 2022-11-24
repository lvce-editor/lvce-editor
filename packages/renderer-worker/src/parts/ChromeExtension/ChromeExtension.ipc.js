import * as ChromeExtension from './ChromeExtension.js'

export const name = 'ChromeExtension'

export const Commands = {
  install: ChromeExtension.install,
  uninstall: ChromeExtension.uninstall,
}
