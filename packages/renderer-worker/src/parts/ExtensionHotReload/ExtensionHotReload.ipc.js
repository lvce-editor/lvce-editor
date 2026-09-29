import * as ExtensionHotReload from './ExtensionHotReload.js'

export const name = 'ExtensionHotReload'

export const Commands = {
  dispose: ExtensionHotReload.dispose,
  watch: ExtensionHotReload.watch,
}
