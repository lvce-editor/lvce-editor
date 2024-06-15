import * as Languages from '../Languages/Languages.ts'

export const getLineComment = async (editor: any) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (!languageConfiguration || !languageConfiguration.comments || !languageConfiguration.comments.lineComment) {
    return undefined
  }
  return languageConfiguration.comments.lineComment
}
