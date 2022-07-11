import * as Command from '../Command/Command.js'
import * as ExtensionMeta from './ExtensionMeta.js'

export const __initialize__ = () => {
  Command.register('ExtensionMeta.addExtension', ExtensionMeta.addExtension)
}
