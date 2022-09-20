import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { VError } from '../VError/VError.js'
import * as ExtensionHostLanguagesNode from './ExtensionHostLanguagesNode.js'
import * as ExtensionHostLanguagesWeb from './ExtensionHostLanguagesWeb.js'

export const getLanguages = async () => {
  try {
    switch (Platform.platform) {
      case PlatformType.Web:
        return await ExtensionHostLanguagesWeb.getLanguages()
      default:
        return await ExtensionHostLanguagesNode.getLanguages()
    }
  } catch (error) {
    throw new VError(error, `Failed to load languages`)
  }
}

export const getLanguageConfiguration = async (languageId) => {
  try {
    switch (Platform.platform) {
      case PlatformType.Web:
        return await ExtensionHostLanguagesWeb.getLanguageConfiguration(
          languageId
        )
      default:
        return await ExtensionHostLanguagesNode.getLanguageConfiguration(
          languageId
        )
    }
  } catch (error) {
    throw new VError(error, `Failed to load language configuration`)
  }
}
