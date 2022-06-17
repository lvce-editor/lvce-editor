import * as Command from '../Command/Command.js'
import * as ColorTheme from './ColorTheme.js'

export const __initialize__ = () => {
  Command.register(5610, ColorTheme.hydrate)
  Command.register(5611, ColorTheme.setColorTheme)
}
