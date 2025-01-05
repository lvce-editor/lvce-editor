import * as Assert from '../Assert/Assert.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import { VError } from '../VError/VError.js'
import * as ExtensionHostLanguagesNode from './ExtensionHostLanguagesNode.js'
import * as ExtensionHostLanguagesWeb from './ExtensionHostLanguagesWeb.js'

export const getLanguages = async () => {
  try {
    return ExtensionHostWorker.invoke('Languages.getLanguages')
  } catch (error) {
    throw new VError(error, 'Failed to load languages')
  }
}

export const getLanguageConfiguration = async (languageId) => {
  Assert.string(languageId)
  switch (Platform.platform) {
    case PlatformType.Web:
      return ExtensionHostLanguagesWeb.getLanguageConfiguration(languageId)
    default:
      return ExtensionHostLanguagesNode.getLanguageConfiguration(languageId)
  }
}
