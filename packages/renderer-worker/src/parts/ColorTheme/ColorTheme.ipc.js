import * as ColorTheme from './ColorTheme.js'
import * as GetColorThemeNames from '../GetColorThemeNames/GetColorThemeNames.js'

export const name = 'ColorTheme'

export const Commands = {
  hydrate: ColorTheme.hydrate,
  reload: ColorTheme.reload,
  setColorTheme: ColorTheme.setColorTheme,
  getColorThemeNames: GetColorThemeNames.getColorThemeNames,
}
