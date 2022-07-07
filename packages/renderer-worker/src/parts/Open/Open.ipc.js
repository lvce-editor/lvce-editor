import * as Command from '../Command/Command.js'
import * as Open from './Open.js'

export const __initialize__ = () => {
  Command.register('Open.openNativeFolder', Open.openNativeFolder)
  Command.register('Open.openUrl', Open.openUrl)
}
