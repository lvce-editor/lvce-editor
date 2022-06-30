import * as Command from '../Command/Command.js'
import * as EditorError from './EditorError.js'

export const __initialize__ = () => {
  Command.register('EditorError.create', EditorError.create)
}
