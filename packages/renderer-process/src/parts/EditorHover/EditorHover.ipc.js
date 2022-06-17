import * as Command from '../Command/Command.js'
import * as EditorHover from './EditorHover.js'

export const __initialize__ = () => {
  Command.register(6216, EditorHover.create)
}
