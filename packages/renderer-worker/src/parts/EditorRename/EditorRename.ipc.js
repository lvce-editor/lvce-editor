import * as Command from '../Command/Command.js'
import * as EditorRename from './EditorRename.js'

export const __initialize__ = () => {
  Command.register(3300, EditorRename.open)
  Command.register(3301, EditorRename.finish)
  Command.register(3302, EditorRename.abort)
}
