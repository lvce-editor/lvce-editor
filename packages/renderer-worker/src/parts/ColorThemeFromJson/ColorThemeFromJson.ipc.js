import * as Command from '../Command/Command.js'
import * as ColorThemeFromJson from './ColorThemeFromJson.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ColorThemeFromJson.createColorThemeFromJson', ColorThemeFromJson.createColorThemeFromJson)
}
