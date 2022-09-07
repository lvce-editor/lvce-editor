import * as Command from '../Command/Command.js'
import * as WebStorage from './WebStorage.js'
import * as CommandId from '../CommandId/CommandId.js'

export const __initialize__ = () => {
  Command.register(CommandId.WEB_STORAGE_CLEAR, WebStorage.clear)
  Command.register(CommandId.WEB_STORAGE_GET_ITEM, WebStorage.getItem)
  Command.register(CommandId.WEB_STORAGE_SET_ITEM, WebStorage.setItem)
}
