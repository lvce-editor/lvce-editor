import * as Command from '../Command/Command.js'
import * as EditorError from './EditorError.js'

export const __initialize__ = () => {
  Command.register(3900, EditorError.show)
}
