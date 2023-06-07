import * as Languages from '../Languages/Languages.js'

export const getBlockComment = async (editor) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (!languageConfiguration || !languageConfiguration.comments || !languageConfiguration.comments.blockComment) {
    return undefined
  }
  return languageConfiguration.comments.blockComment
}
