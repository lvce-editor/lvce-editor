import * as Command from '../Command/Command.js'
import * as EditorRename from './EditorRename.js'

export const __initialize__ = () => {
  Command.register(4512, EditorRename.create)
  Command.register(4513, EditorRename.finish)
  Command.register(4514, EditorRename.dispose)
}
