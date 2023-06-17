import * as Languages from '../Languages/Languages.js'

export const getLineComment = async (editor) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (!languageConfiguration || !languageConfiguration.comments || !languageConfiguration.comments.lineComment) {
    return undefined
  }
  return languageConfiguration.comments.lineComment
}
