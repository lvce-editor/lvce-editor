import * as Command from '../Command/Command.js'
import * as Window from './Window.js'
import * as CommandId from '../CommandId/CommandId.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register(CommandId.WINDOW_RELOAD, Window.reload)
  Command.register(CommandId.WINDOW_MINIMIZE, Window.minimize)
  Command.register(CommandId.WINDOW_MAXIMIZE, Window.maximize)
  Command.register(CommandId.WINDOW_UNMAXIMIZE, Window.unmaximize)
  Command.register(CommandId.WINDOW_CLOSE, Window.close)
  Command.register(CommandId.WINDOW_SET_TITLE, Window.setTitle)
  Command.register(CommandId.WINDOW_ON_VISIBILITY_CHANGE, Window.onVisibilityChange)
}
