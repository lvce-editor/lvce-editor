import * as Command from '../Command/Command.js'
import * as StorageBrowser from './StorageBrowser.js'

export const __initialize__ = () => {
  Command.register('StorageBrowser.clear', StorageBrowser.clear)
  Command.register('StorageBrowser.getItem', StorageBrowser.getItem)
  Command.register('StorageBrowser.setItem', StorageBrowser.setItem)
}
