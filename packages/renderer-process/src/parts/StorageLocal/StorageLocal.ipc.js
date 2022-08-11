import * as Command from '../Command/Command.js'
import * as StorageLocal from './StorageLocal.js'

export const __initialize__ = () => {
  Command.register('StorageLocal.clear', StorageLocal.clear)
  Command.register('StorageLocal.getItem', StorageLocal.getItem)
  Command.register('StorageLocal.setItem', StorageLocal.setItem)
}
