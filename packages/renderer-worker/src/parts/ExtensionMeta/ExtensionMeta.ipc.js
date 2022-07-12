import * as Command from '../Command/Command.js'
import * as ExtensionMeta from './ExtensionMeta.js'

// prettier-ignore
export const __initialize__ = () => {
  // Command.register('ExtensionMeta.addExtension', ExtensionMeta.addExtension)
  Command.register('ExtensionMeta.addWebExtension', ExtensionMeta.addWebExtension)
}
