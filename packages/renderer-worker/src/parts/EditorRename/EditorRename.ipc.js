import * as Command from '../Command/Command.js'
import * as EditorRename from './EditorRename.js'

export const __initialize__ = () => {
  Command.register('EditorRename.open', EditorRename.open)
  Command.register('EditorRename.finish', EditorRename.finish)
  Command.register('EditorRename.abort', EditorRename.abort)
}
