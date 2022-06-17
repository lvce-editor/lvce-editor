import * as Command from '../Command/Command.js'
import * as ColorThemeFromJson from './ColorThemeFromJson.js'

export const __initialize__ = () => {
  Command.register(232, ColorThemeFromJson.createColorThemeFromJson)
}
