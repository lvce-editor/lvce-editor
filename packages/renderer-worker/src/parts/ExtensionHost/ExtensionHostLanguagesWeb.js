import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as Logger from '../Logger/Logger.js'

export const getLanguages = async () => {
  const url = `${AssetDir.assetDir}/config/languages.json`
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

export const getLanguageConfiguration = async (languageId) => {
  Logger.warn('get language configuration not yet supported on web')
}
