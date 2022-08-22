import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getLanguagesFromExtensionHost = async () => {
  // TODO handle error
  const languages = await SharedProcess.invoke(
    /* ExtensionHost.getLanguages */ 'ExtensionHost.getLanguages'
  )
  return languages
}

const getLanguagesFromStaticFolder = async () => {
  const assetDir = Platform.getAssetDir()
  const url = `${assetDir}/config/languages.json`
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

export const getLanguages = () => {
  if (Platform.platform === 'web') {
    return getLanguagesFromStaticFolder()
  }
  return getLanguagesFromExtensionHost()
}

export const getLanguageConfiguration = async (languageId) => {
  if (Platform.platform === 'web') {
    console.warn('get language configuration not yet supported on web')
    return
  }
  const languageConfiguration = await SharedProcess.invoke(
    /* ExtensionHost.getLanguageConfiguration */ 'ExtensionHost.getLanguageConfiguration',
    /* languageId */ languageId
  )
  return languageConfiguration
}
