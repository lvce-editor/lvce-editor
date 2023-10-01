import * as GetColorThemeJsonRemote from '../GetColorThemeJsonRemote/GetColorThemeJsonRemote.js'
import * as GetColorThemeJsonWeb from '../GetColorThemeJsonWeb/GetColorThemeJsonWeb.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getColorThemeJson = (colorThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    return GetColorThemeJsonWeb.getColorThemeJson(colorThemeId)
  }
  return GetColorThemeJsonRemote.getColorThemeJson(colorThemeId)
}
