import * as Command from '../Command/Command.js'
import * as ExtensionHostCore from './ExtensionHostCore.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ExtensionHost.startWebExtensionHost', ExtensionHostCore.startWebExtensionHost)
  Command.register('ExtensionHost.loadWebExtension', ExtensionHostCore.loadWebExtension)
}
