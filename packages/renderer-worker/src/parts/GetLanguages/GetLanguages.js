import * as GetExtensions from '../GetExtensions/GetExtensions.js'
import * as GetLanguagesFromExtension from '../GetLanguagesFromExtension/GetLanguagesFromExtension.js'

export const getLanguages = async () => {
  const extensions = await GetExtensions.getExtensions()
  const languages = extensions.flatMap(GetLanguagesFromExtension.getLanguagesFromExtension)
  return languages
}
