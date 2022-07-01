import * as Command from '../Command/Command.js'
import * as ColorPicker from './ColorPicker.js'

export const __initialize__ = () => {
  Command.register('ColorPicker.open', ColorPicker.open)
  Command.register('ColorPicker.close', ColorPicker.close)
}
