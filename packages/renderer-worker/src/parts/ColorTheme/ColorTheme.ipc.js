import * as Command from '../Command/Command.js'
import * as ColorTheme from './ColorTheme.js'

export const __initialize__ = () => {
  Command.register('ColorTheme.hydrate', ColorTheme.hydrate)
  Command.register('ColorTheme.setColorTheme', ColorTheme.setColorTheme)
}
