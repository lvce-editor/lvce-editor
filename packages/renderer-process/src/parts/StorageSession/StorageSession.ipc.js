import * as Command from '../Command/Command.js'
import * as StorageSession from './StorageSession.js'

export const __initialize__ = () => {
  Command.register('StorageSession.clear', StorageSession.clear)
  Command.register('StorageSession.getItem', StorageSession.getItem)
  Command.register('StorageSession.setItem', StorageSession.setItem)
}
