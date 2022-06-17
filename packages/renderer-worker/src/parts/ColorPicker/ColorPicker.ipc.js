import * as Command from '../Command/Command.js'
import * as ColorPicker from './ColorPicker.js'

export const __initialize__ = () => {
  Command.register(1400, ColorPicker.open)
  Command.register(1401, ColorPicker.close)

}
